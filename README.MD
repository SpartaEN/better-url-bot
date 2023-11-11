# better-url-bot

[![Deploy](https://github.com/SpartaEN/better-url-bot/actions/workflows/deploy.yml/badge.svg)](https://github.com/SpartaEN/better-url-bot/actions/workflows/deploy.yml)

A bot that will take a URL and return a better URL.

## Usage

Feel free to try out [@LFixBot](https://t.me/LFixBot) on Telegram.


We also have a [web API](https://url.proj-o.net/) for you to try out.

```bash
curl "https://url.api.proj-o.net/?url=https://x.com/virtual_kaf?s=20&format=json&preview=true"
```

> **NOTE** that parameter `url` should be url encoded carefully to prevent losing parameters.

| Parameter | Description | Default | Required |
--- | --- | --- | ---
| url | The URL to be fixed | | Yes |
| input | The input format of the URL | plain | No |
| format | The format of the response | plain | No |
| preview | Whether to return a preview of the URL | false | No |

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

```
wrangler kv:namespace create main
wrangler secret put ADMIN_TOKEN
wrangler secret put TGBOT_TOKEN
wrangler secret put WEBHOOKS_SECRET
wrangler secret put USERID_SALT
wrangler publish
# set up webhooks
curl your-deployment.worker.dev/bot-reg?token=ADMIN_TOKEN
```

## TODO

- Support for more sites