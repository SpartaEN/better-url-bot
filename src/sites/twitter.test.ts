import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe("URL-Twitter", () => {
    let worker: UnstableDevWorker;

    beforeAll(async () => {
        worker = await unstable_dev("src/index.ts", {
            experimental: { disableExperimentalWarning: true },
        });
    });

    afterAll(async () => {
        await worker.stop();
    });

    it("twitter link", async () => {
        let url = encodeURIComponent("https://x.com/virtual_kaf/status/1722901924146520481?s=20");
        let resp = await worker.fetch(`https://example.com/?url=${url}`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("https://x.com/virtual_kaf/status/1722901924146520481");
        }

        url = encodeURIComponent("https://twitter.com/virtual_kaf/status/1722901924146520481?s=20");
        resp = await worker.fetch(`https://example.com/?url=${url}`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("https://twitter.com/virtual_kaf/status/1722901924146520481");
        }
    });


    it("twitter link (optimized for preview)", async () => {
        let url = encodeURIComponent("https://x.com/virtual_kaf/status/1722901924146520481?s=20");
        let resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("https://fxtwitter.com/virtual_kaf/status/1722901924146520481");
        }

        url = encodeURIComponent("https://twitter.com/virtual_kaf/status/1722901924146520481?s=20");
        resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("https://fxtwitter.com/virtual_kaf/status/1722901924146520481");
        }
    });

    it("twitter short link", async () => {
        let url = encodeURIComponent("https://t.co/utBs7c8VFW");
        let resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("https://bio.to/virtualkaf");
        }
    });
});
