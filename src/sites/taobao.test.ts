import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe("URL-Taobao", () => {
    let worker: UnstableDevWorker;

    beforeAll(async () => {
        worker = await unstable_dev("src/index.ts", {
            experimental: { disableExperimentalWarning: true },
        });
    });

    afterAll(async () => {
        await worker.stop();
    });

    it("tmall link", async () => {
        let url = encodeURIComponent("https://detail.tmall.com/item.htm?_u=sssss&id=712998640225&spm=114514&sku_properties=134942334:24071849217");
        let resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("https://detail.tmall.com/item.htm?id=712998640225&sku_properties=134942334%3A24071849217");
        }
    });

    it("taobao link", async () => {
        let url = encodeURIComponent("https://item.taobao.com/item.htm?spm=1.helo.114.514.1919810yjsnpi&id=639658819324&scm=114.514.1919.810&pvid=aaaaafanzhengshiuuid-bbbb-cccc-dddd-eeeeffffddddaaaa");
        let resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("https://item.taobao.com/item.htm?id=639658819324");
        }
    });

    // Short link seems to have expiration, need to be tested manually
    it("taobao short link (invalid link)", async () => {
        let url = encodeURIComponent("https://m.tb.cn/h.3EnqiGo?sm=4a698e");
        let resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("http://m.tb.cn/scanError.htm");
        }
    });
});
