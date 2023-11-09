# better-url-bot

A bot that will take a URL and return a better URL.

## Usage

Feel free to try out [@LFixBot](https://t.me/LFixBot) on Telegram.

## Deployment

```
wrangler kv:namespace create main
wrangler secret put ADMIN_TOKEN
wrangler secret put TGBOT_TOKEN
wrangler secret put WEBHOOKS_SECRET
wrangler secret put USERID_SALT
wrangler publish
```

## TODO

- Unit tests
- Support for more sites