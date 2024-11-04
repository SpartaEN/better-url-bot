import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe("URL-WeChat", () => {
    let worker: UnstableDevWorker;

    beforeAll(async () => {
        worker = await unstable_dev("src/index.ts", {
            experimental: { disableExperimentalWarning: true },
        });
    });

    afterAll(async () => {
        await worker.stop();
    });

    it("wechat official account link type 1", async () => {
        let url = encodeURIComponent("https://mp.weixin.qq.com/s/EqQCioe5IzZfQVaHgI3mbg");
        let resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("https://mp.weixin.qq.com/s/EqQCioe5IzZfQVaHgI3mbg");
        }
    });

    it("wechat official account link type 2", async () => {
        let url = encodeURIComponent("https://mp.weixin.qq.com/s?__biz=MzIxNTYzNTkzMA==&mid=2247507290&idx=2&sn=fc6d3c50b58d66df29da45bed5793d40&chksm=zhangxiaolong&mpshare=n&scene=m&srcid=s&sharer_shareinfo=l&sharer_shareinfo_first=cnm");
        let resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
        if (resp) {
            let text = await resp.text();
            expect(text).toBe("https://mp.weixin.qq.com/s?__biz=MzIxNTYzNTkzMA%3D%3D&mid=2247507290&idx=2&sn=fc6d3c50b58d66df29da45bed5793d40");
        }
    });
});
