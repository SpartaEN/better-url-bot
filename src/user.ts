import { Env } from ".";
import { TGBotMessage } from "./tgbot";
import { URLOptimizerOptions } from "./optimizer";
import { UserProviderError } from "./error";
import { sha256sum } from "./util";

const PREFIX_USER = "user:";

export type UserData = {
    options: URLOptimizerOptions;
}

export default class User {
    env: Env;
    userId: number;
    userIdHash: string | null = null;
    data: UserData;
    constructor(env: Env, message: TGBotMessage) {
        this.env = env;
        if (message.message) {
            this.userId = message.message.from.id;
        } else if (message.inline_query) {
            this.userId = message.inline_query.from.id;
        } else if (message.callback_query && message.callback_query.from) {
            this.userId = message.callback_query.from.id;
        } else {
            throw new UserProviderError("Unable to find user id from message.");
        }
        this.data = {
            options: {
                optimizePreview: true,
                bruteMode: false,
                bruteDepth: 1
            }
        };
    }

    async init() {
        this.userIdHash = await sha256sum(this.env.USERID_SALT + this.userId.toString());
        await this.loadUserData();
    }

    async loadUserData() {
        let data = await this.env.MAIN.get(PREFIX_USER + this.userIdHash, "json") as UserData;
        if (data) {
            this.data.options = { ...this.data.options, ...data.options };
        }
    }

    async saveUserData() {
        await this.env.MAIN.put(PREFIX_USER + this.userIdHash, JSON.stringify(this.data));
    }
}