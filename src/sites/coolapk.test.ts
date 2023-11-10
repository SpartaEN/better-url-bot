import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe("URL-CoolAPK", () => {
    let worker: UnstableDevWorker;

    beforeAll(async () => {
        worker = await unstable_dev("src/index.ts", {
            experimental: { disableExperimentalWarning: true },
        });
    });

    afterAll(async () => {
        await worker.stop();
    });

    it("cookapk link", async () => {
        let url = encodeURIComponent("https://www.coolapk.com/feed/50811236?shareKey=FYOU~&shareUid=114514&shareFrom=com.coolapk.market_13.3.6");
        let resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("https://www.coolapk.com/feed/50811236");
        }
    });
});
