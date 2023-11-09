export class URLOptimizeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "URLOptimizeError";
    }
}

export class BotAPIError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BotAPIError";
    }
}

export class UserProviderError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserProviderError";
    }
}