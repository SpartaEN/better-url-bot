import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe("URL-Bilibili", () => {
    let worker: UnstableDevWorker;

    beforeAll(async () => {
        worker = await unstable_dev("src/index.ts", {
            experimental: { disableExperimentalWarning: true },
        });
    });

    afterAll(async () => {
        await worker.stop();
    });

    it("bilibili short link", async () => {
        let url = encodeURIComponent("https://b23.tv/Gk6d7wm");
        let resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("https://www.bilibili.com/video/BV1GJ411x7h7?p=1");
        }
    });

    it("bilibili link", async () => {
        let url = encodeURIComponent("https://www.bilibili.com/video/BV1xx411c7mu/?share_source=copy_web&vd_source=xxxx&t=5");
        let resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("https://www.bilibili.com/video/BV1xx411c7mu/?t=5");
        }
    });
});
