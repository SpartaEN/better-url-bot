import { fetchShortLink, removeAllQueryParams } from "./util";

export type URLOptimizerOptions = {
    optimizePreview?: boolean;
    bruteMode?: boolean,
    bruteDepth: number,
}

export type URLOptimizerContext = {
    count: number;
    recursiveDepth: number;
    optimizer: URLOptimizer;
    options: URLOptimizerOptions;
}

export type URLOptimizerProcessorHandler = (ctx: URLOptimizerContext, url: string) => Promise<string>;


export type URLOptimizerProcessor = {
    host: string[];
    optmize: URLOptimizerProcessorHandler;
}

class URLOptimizer {
    processors: Map<string, URLOptimizerProcessorHandler> = new Map();
    constructor() {
    }

    register(processorList: URLOptimizerProcessor[]) {
        for (let processor of processorList) {
            for (let host of processor.host) {
                this.processors.set(host, processor.optmize);
            }
        }
    }

    async optimizeUrl(ctx: URLOptimizerContext, url: string): Promise<string> {
        ctx.count++;
        if (ctx.count > ctx.recursiveDepth) {
            return url;
        }
        let parsedUrl = new URL(url);
        let processor = this.processors.get(parsedUrl.host);
        if (processor) {
            return await processor(ctx, url);
        } else {
            if (ctx.options.bruteMode) {
                if (ctx.count > ctx.options.bruteDepth) {
                    parsedUrl.hash = "";
                    parsedUrl.search = "";
                    return parsedUrl.toString();
                }
                try {
                    let fetchPromise = fetchShortLink(url);
                    // set a 5 seconds timeout to avoid a large 300 seconds timeout
                    let timeoutPromise = new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject(undefined);
                        }, 5 * 1000);
                    });
                    url = await Promise.race([fetchPromise, timeoutPromise]) as string;
                } catch (e) {
                    // not a short link, remove all query params and hash then return
                    parsedUrl.hash = "";
                    parsedUrl.search = "";
                    return parsedUrl.toString();
                }
                return ctx.optimizer.optimizeUrl(ctx, url);
            } else {
                return url;
            }
        }
    }
}

export const urlOptimizer = new URLOptimizer();
export const createOptimizerRunningContext = (options: URLOptimizerOptions, recursiveDepth: number): URLOptimizerContext => {
    return {
        count: 0,
        recursiveDepth: recursiveDepth,
        optimizer: urlOptimizer,
        options: options,
    }
};