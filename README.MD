# better-url-bot

[![Deploy](https://github.com/SpartaEN/better-url-bot/actions/workflows/deploy.yml/badge.svg)](https://github.com/SpartaEN/better-url-bot/actions/workflows/deploy.yml)

A bot that will take a URL and return a better URL.

## Usage

Feel free to try out [@LFixBot](https://t.me/LFixBot) on Telegram.


We also have a [web API](https://url.api.evo.moe/) for you to try out.

```bash
curl "https://url.api.evo.moe/?url=https://x.com/virtual_kaf?s=20&format=json&preview=true"
```

> **NOTE** that parameter `url` should be url encoded carefully to prevent losing parameters.

| Parameter | Description | Default | Required |
--- | --- | --- | ---
| url | The URL to be fixed | | Yes |
| input | The input format of the URL | plain | No |
| format | The format of the response | plain | No |
| preview | Whether to return a preview of the URL | false | No |
| brute | Treat unknown url as short url and remove all parameters | false | No |
| depth | The depth of the short url to be resolved (max 5) | 1 | No |

### Input format

| Format | Description |
--- | ---
| plain | Plain text |
| base64 | Base64 encoded |

### Output format

| Format | Description |
--- | ---
| plain | Plain text |
| json | JSON |


### Preview

The preview parameter is working for the following sites to fix url preview for following sites in IM such as telegram and discord:

- Twitter

## Deployment

```bash
wrangler kv:namespace create main
wrangler secret put ADMIN_TOKEN # Admin token for bot registration
wrangler secret put TGBOT_TOKEN # Telegram bot token
wrangler secret put WEBHOOKS_SECRET # Must be a random string, used to verify webhooks
wrangler secret put USERID_SALT # Must be a random string, salt to hash user id
wrangler secret put RECURSIVE_DEPTH # Must be a valid number, should be greater than 5
wrangler publish
# set up webhooks
curl your-deployment.worker.dev/bot-reg?token=ADMIN_TOKEN
```

## TODO

- Support for more sites