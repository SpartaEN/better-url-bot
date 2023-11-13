import { BotAPIError } from "./error";

import User from "./user";

export const Operations = {
    ENABLE_OPTIMIZE_PREVIEW: "enable_optimize_preview",
    DISABLE_OPTIMIZE_PREVIEW: "disable_optimize_preview",
    ENABLE_BRUTE_MODE: "enable_brute_mode",
    DISABLE_BRUTE_MODE: "disable_brute_mode",
}

type APIResponse = {
    ok: boolean;
    result: any;
    description: string;
}

export type TGChatType = "private" | "group" | "supergroup" | "channel";

export type TGFromUser = {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
}

export type TGUser = {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    username: string;
}

export type TGMessage = {
    message_id: number;
    from: TGFromUser;
    chat: {
        id: number;
        title: string;
        type: TGChatType;
        all_members_are_administrators: boolean;
    };
    date: number;
    text?: string;
    entities?: [
        {
            offset: number;
            length: number;
            type: string;
        }
    ],
    new_chat_members?: TGUser[],
    new_chat_member?: TGUser,
    new_chat_participant?: TGUser,
    via_bot?: {
        id: number;
        is_bot: boolean;
        first_name: string;
        username: string;
    },
    new_chat_title?: string;
    reply_markup?: ReplyMarkup;
}

export type TGInlineQuery = {
    id: string;
    from: TGFromUser;
    query: string;
    chat_type: TGChatType;
    offset: string;
}


export type TGBotMessage = {
    update_id: number;
    message?: TGMessage;
    inline_query?: TGInlineQuery,
    callback_query?: {
        id: string;
        from: TGFromUser,
        message: TGMessage;
        chat_instance?: string;
        data?: string;
    }
}

type ReplyMarkup = {
    inline_keyboard?: InlineKeyboardButton[][];
}

type InlineKeyboardButton = {
    text: string;
    url?: string;
    callback_data?: string;
}

export class TelegramBot {
    token: string;
    secret: string;

    constructor(token: string, secret: string) {
        this.token = token;
        this.secret = secret;
    }

    async registerWebhook(url: string): Promise<void> {
        return fetch(`https://api.telegram.org/bot${this.token}/setWebhook?url=${url}&secret_token=${this.secret}`).then(async (res) => {
            const json = await res.json() as APIResponse;
            if (!json.ok) {
                throw new BotAPIError(json.description);
            }
            return;
        });
    }

    verify(request: Request): void {
        let secret_token = request.headers.get("x-telegram-bot-api-secret-token");
        if (secret_token !== this.secret) {
            throw new BotAPIError("Unauthorized");
        }
    }

    async sendMessage(chat_id: number, text: string): Promise<void> {
        await fetch(`https://api.telegram.org/bot${this.token}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(text)}`).then(async (res) => {
            const json = await res.json() as APIResponse;
            if (!json.ok) {
                throw new BotAPIError(json.description);
            }
            return;
        });
    }

    async sendMessageMarkup(chat_id: number, text: string, markup_buttons: ReplyMarkup): Promise<void> {
        await fetch(`https://api.telegram.org/bot${this.token}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(text)}&reply_markup=${encodeURIComponent(JSON.stringify(markup_buttons))}`).then(async (res) => {
            const json = await res.json() as APIResponse;
            if (!json.ok) {
                throw new BotAPIError(json.description);
            }
            return;
        });
    }

    async editMessageMarkup(chat_id: number, message_id: number, text: string, markup_buttons: ReplyMarkup): Promise<void> {
        await fetch(`https://api.telegram.org/bot${this.token}/editMessageText?chat_id=${chat_id}&text=${encodeURIComponent(text)}&message_id=${message_id}&reply_markup=${encodeURIComponent(JSON.stringify(markup_buttons))}`).then(async (res) => {
            const json = await res.json() as APIResponse;
            if (!json.ok) {
                throw new BotAPIError(json.description);
            }
            return;
        });
    }

    async answerInlineQuery(inline_query_id: string, results: any[]): Promise<void> {
        await fetch(`https://api.telegram.org/bot${this.token}/answerInlineQuery?cache_time=0&is_personal=True&inline_query_id=${inline_query_id}&results=${encodeURIComponent(JSON.stringify(results))}`).then(async (res) => {
            const json = await res.json() as APIResponse;
            if (!json.ok) {
                throw new BotAPIError(json.description);
            }
            return;
        });
    }

    async sendStartMessage(chat_id: number): Promise<void> {
        await this.sendMessage(chat_id, "Hello, I'm a URL optimizer bot. Send me a URL or call me via inline mode and I will optimize it for you.");
    }

    async sendAboutMessage(chat_id: number): Promise<void> {
        await this.sendMessage(chat_id, "This bot is created by @Sparta_EN_MVS. Source code: https://github.com/SpartaEN/better-url-bot");
    }

    private getUserSettingsText(user: User): string {
        let options = user.data.options;
        return `Your settings:
Preview optimization🚀:  ${options.optimizePreview ? "✅" : "❌"}
Brute mode🔥:  ${options.bruteMode ? "✅" : "❌"}`
    }

    private getUserSettingsMarkup(user: User): ReplyMarkup {
        let options = user.data.options;
        return {
            inline_keyboard: [
                [
                    {
                        text: options.optimizePreview ? "Disable preview optimization" : "Enable preview optimization",
                        callback_data: options.optimizePreview ? Operations.DISABLE_OPTIMIZE_PREVIEW : Operations.ENABLE_OPTIMIZE_PREVIEW,
                    }
                ],
                [
                    {
                        text: options.bruteMode ? "Disable brute mode" : "Enable brute mode",
                        callback_data: options.bruteMode ? Operations.DISABLE_BRUTE_MODE : Operations.ENABLE_BRUTE_MODE,
                    }
                ]
            ],
        };
    }

    async sendUserSettings(chat_id: number, chat_type: string, user: User): Promise<void> {
        if (chat_type !== "private") {
            await this.sendMessage(chat_id, "You can only change your settings in private chat.");
            return;
        } else {
            await this.sendMessageMarkup(chat_id, this.getUserSettingsText(user), this.getUserSettingsMarkup(user));
        }
    }

    async updateUserSettings(chat_id: number, message_id: number, operation: string, user: User) {
        let options = user.data.options;
        switch (operation) {
            case Operations.ENABLE_OPTIMIZE_PREVIEW:
                options.optimizePreview = true;
                break;
            case Operations.DISABLE_OPTIMIZE_PREVIEW:
                options.optimizePreview = false;
                break;
            case Operations.ENABLE_BRUTE_MODE:
                options.bruteMode = true;
                break;
            case Operations.DISABLE_BRUTE_MODE:
                options.bruteMode = false;
                break;
            default:
                await this.sendMessage(chat_id, "Invalid operation.");
                return;
        }
        await this.editMessageMarkup(chat_id, message_id, this.getUserSettingsText(user), this.getUserSettingsMarkup(user));
        await user.saveUserData();
    }
}