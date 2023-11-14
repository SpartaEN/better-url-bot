import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe("URL-Meituan", () => {
    let worker: UnstableDevWorker;

    beforeAll(async () => {
        worker = await unstable_dev("src/index.ts", {
            experimental: { disableExperimentalWarning: true },
        });
    });

    afterAll(async () => {
        await worker.stop();
    });

    it("meituan link", async () => {
        let url = encodeURIComponent("https://www.meituan.com/deal/852819487.html?campaignDiffCode=1&shareCampaignId=112134&utm_term=AiphoneBgroupC12.11.202DqqEpromotionGDAFAAGAASAFS&utm_source=appshare&utm_medium=iOSweb&utm_fromapp=qq&utm_sharesource=promotion&lch=appshare_aabbcc");
        let resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("https://www.meituan.com/deal/852819487.html");
        }
    });

    it("meituan dpurl short link", async () => {
        let url = encodeURIComponent("http://dpurl.cn/Xy6IOU4");
        let resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("https://s3plus.meituan.net/v1/mss_e63d09aec75b41879dcb3069234793ac/file/%E5%89%8D%E7%AB%AF%E7%AF%87.pdf");
        }
    });
});
