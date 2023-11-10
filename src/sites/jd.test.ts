import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe("URL-JD", () => {
    let worker: UnstableDevWorker;

    beforeAll(async () => {
        worker = await unstable_dev("src/index.ts", {
            experimental: { disableExperimentalWarning: true },
        });
    });

    afterAll(async () => {
        await worker.stop();
    });

    it("jd link", async () => {
        let url = encodeURIComponent("https://item.jd.com/12715718.html#crumb-wrap");
        let resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("https://item.jd.com/12715718.html#crumb-wrap");
        }
    });

    it("jd modile link", async () => {
        let url = encodeURIComponent("https://item.m.jd.com/product/100044848692.html?utm_source=iosapp&utm_medium=appshare_share_ni_ma_bi&utm_campaign=114514&utm_term=HAHAL&ad_od=share_nmb&utm_user=haha_fyou&gx=aadsa&gxd=aaabb-ss");
        let resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("https://item.m.jd.com/product/100044848692.html");
        }
    });
});
