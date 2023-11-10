import { URLOptimizeError, BotAPIError } from "./error";
import { TelegramBot, TGBotMessage } from "./tgbot";
import { createOptimizerRunningContext, URLOptimizerOptions } from "./optimizer";
import User from "./user";
import './sites';

export interface Env {
	MAIN: KVNamespace;
	USERID_SALT: string;
	ADMIN_TOKEN: string;
	TGBOT_TOKEN: string;
	WEBHOOKS_SECRET: string;
	BROWSER: Fetcher;
}

function extractUrlFromText(text: string): string | null {
	let urlRegex = /(https?:\/\/[^\s]+)/g;
	let url = text.match(urlRegex);
	if (url != null) {
		return url[0];
	} else {
		return null;
	}
}

async function processBotCommand(request: Request, env: Env, ctx: ExecutionContext) {
	const bot = new TelegramBot(env.TGBOT_TOKEN, env.WEBHOOKS_SECRET);
	bot.verify(request);
	let message = await request.json() as TGBotMessage;
	const user = new User(env, message);
	await user.init();
	let optimizerContext = createOptimizerRunningContext(user.data.options);
	if (message.message != null) {
		if (message.message.text != null && message.message.via_bot === undefined) {
			if (message.message.text.startsWith("/start")) {
				await bot.sendStartMessage(message.message.chat.id);
			} else if (message.message.text.startsWith("/about")) {
				await bot.sendAboutMessage(message.message.chat.id);
			} else if (message.message.text.startsWith("/settings")) {
				await bot.sendUserSettings(message.message.chat.id, message.message.chat.type, user);
			} else {
				let url = extractUrlFromText(message.message.text);
				if (url != null) {
					let optimizedUrl = await optimizerContext.optimizer.optimizeUrl(optimizerContext, url);
					await bot.sendMessage(message.message.chat.id, optimizedUrl);
				} else {
					await bot.sendMessage(message.message.chat.id, "Your message does not contain a valid URL.");
				}
			}
		}
	} else if (message.inline_query != null) {
		let url = extractUrlFromText(message.inline_query.query);
		if (url != null) {
			let optimizedUrl = await optimizerContext.optimizer.optimizeUrl(optimizerContext, url);
			await bot.answerInlineQuery(message.inline_query.id, [{
				type: "article",
				id: "1",
				title: `Optimized: ${optimizedUrl}`,
				input_message_content: {
					message_text: optimizedUrl,
				},
			}]);
		} else {
			await bot.answerInlineQuery(message.inline_query.id, []);
		}
	} else if (message.callback_query != null) {
		if (message.callback_query.data != null) {
			await bot.updateUserSettings(message.callback_query.message.chat.id, message.callback_query.message.message_id, message.callback_query.data, user);
		}
	}
}

async function registerBot(request: Request, env: Env, ctx: ExecutionContext) {
	const reqUrl = new URL(request.url);
	const bot = new TelegramBot(env.TGBOT_TOKEN, env.WEBHOOKS_SECRET);
	if (reqUrl.searchParams.get("token") === env.ADMIN_TOKEN) {
		let webHooksUrl = reqUrl.searchParams.get("url");
		if (webHooksUrl == null) {
			webHooksUrl = reqUrl.origin + "/bot";
		}
		await bot.registerWebhook(webHooksUrl);
		return new Response(`url ${webHooksUrl} registered`);
	} else {
		return new Response("Unauthorized", {
			status: 403,
		});
	}
}

async function processUrl(request: Request, env: Env, ctx: ExecutionContext) {
	const reqUrl = new URL(request.url);
	let url = reqUrl.searchParams.get("url");
	let inputFormat = reqUrl.searchParams.get("input");
	let outputFormat = reqUrl.searchParams.get("format");
	let preview = reqUrl.searchParams.get("preview");
	let options: URLOptimizerOptions = {
		optimizePreview: preview === "true",
	};
	let optimizerContext = createOptimizerRunningContext(options);
	if (url != null) {
		if (inputFormat === "base64") {
			url = atob(url);
		}
		if (outputFormat === "json") {
			return new Response(JSON.stringify({
				optimizedUrl: await optimizerContext.optimizer.optimizeUrl(optimizerContext, url),
			}), {
				headers: {
					"Content-Type": "application/json",
				},
			});
		} else {
			return new Response(await optimizerContext.optimizer.optimizeUrl(optimizerContext, url));
		}
	} else {
		throw new URLOptimizeError("missing parameter: url");
	}
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const reqUrl = new URL(request.url);
		try {
			if (reqUrl.pathname == "/bot") {
				await processBotCommand(request, env, ctx);
				return new Response("ok");
			} else if (reqUrl.pathname == "/bot-reg") {
				return await registerBot(request, env, ctx);
			} else {
				return await processUrl(request, env, ctx);
			}
		} catch (e) {
			if (e instanceof URLOptimizeError || e instanceof BotAPIError) {
				return new Response(e.message, {
					status: 400,
				});
			} else {
				throw e;
			}
		}
	},
};
