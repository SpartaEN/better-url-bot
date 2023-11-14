import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { URLOptimizerTree, URLOptimizerContext } from "./optimizer";

describe("Optimizer", () => {
    let urlOptimizerTree = new URLOptimizerTree();

    beforeAll(async () => {
        urlOptimizerTree.set("*.a.com", async (ctx, url) => {
            return "*.a.com"
        })
        urlOptimizerTree.set("*.b.a.com", async (ctx, url) => {
            return "*.b.a.com"
        })
        urlOptimizerTree.set("b.a.com", async (ctx, url) => {
            return "b.a.com"
        })
        urlOptimizerTree.set("a.com", async (ctx, url) => {
            return "a.com"
        })
        urlOptimizerTree.set("b.com", async (ctx, url) => {
            return "b.com"
        })
        urlOptimizerTree.set("b.org", async (ctx, url) => {
            return "b.org"
        })
    });

    afterAll(async () => {
    });

    it("test url optimizer tree", async () => {
        let url = undefined;
        let ctx = undefined;
        let optimizer = urlOptimizerTree.get("c.a");
        let result;
        expect(optimizer).toBeUndefined();

        optimizer = urlOptimizerTree.get("a.b.org");
        expect(optimizer).toBeUndefined();

        optimizer = urlOptimizerTree.get("a.b.org.c");
        expect(optimizer).toBeUndefined();

        optimizer = urlOptimizerTree.get("b.org");
        if (optimizer) {
            result = await optimizer(ctx as unknown as URLOptimizerContext, url as unknown as string);
            expect(result).toBe("b.org");
        } else {
            expect("1").toBe("0");
        }

        optimizer = urlOptimizerTree.get("a.com");
        if (optimizer) {
            result = await optimizer(ctx as unknown as URLOptimizerContext, url as unknown as string);
            expect(result).toBe("a.com");
        } else {
            expect("1").toBe("0");
        }

        optimizer = urlOptimizerTree.get("b.com");
        if (optimizer) {
            result = await optimizer(ctx as unknown as URLOptimizerContext, url as unknown as string);
            expect(result).toBe("b.com");
        } else {
            expect("1").toBe("0");
        }


        optimizer = urlOptimizerTree.get("c.a.com");
        if (optimizer) {
            result = await optimizer(ctx as unknown as URLOptimizerContext, url as unknown as string);
            expect(result).toBe("*.a.com");
        } else {
            expect("1").toBe("0");
        }

        optimizer = urlOptimizerTree.get("b.a.com");
        if (optimizer) {
            result = await optimizer(ctx as unknown as URLOptimizerContext, url as unknown as string);
            expect(result).toBe("b.a.com");
        } else {
            expect("1").toBe("0");
        }

        optimizer = urlOptimizerTree.get("c.b.a.com");
        if (optimizer) {
            result = await optimizer(ctx as unknown as URLOptimizerContext, url as unknown as string);
            expect(result).toBe("*.b.a.com");
        } else {
            expect("1").toBe("0");
        }

        optimizer = urlOptimizerTree.get("a.c.b.a.com");
        if (optimizer) {
            result = await optimizer(ctx as unknown as URLOptimizerContext, url as unknown as string);
            expect(result).toBe("*.b.a.com");
        } else {
            expect("1").toBe("0");
        }

        optimizer = urlOptimizerTree.get("c.c.c.c.c.c.a.com");
        if (optimizer) {
            result = await optimizer(ctx as unknown as URLOptimizerContext, url as unknown as string);
            expect(result).toBe("*.a.com");
        } else {
            expect("1").toBe("0");
        }
    });
});
