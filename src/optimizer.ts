import { Env } from ".";

export type URLOptimizerOptions = {
    optimizePreview?: boolean;
}

export type URLOptimizerContext = {
    count: number;
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
        let parsedUrl = new URL(url);
        let processor = this.processors.get(parsedUrl.host);
        if (processor) {
            return await processor(ctx, url);
        } else {
            return url;
        }
    }
}

export const urlOptimizer = new URLOptimizer();
export const createOptimizerRunningContext = (options: URLOptimizerOptions): URLOptimizerContext => {
    return {
        count: 0,
        optimizer: urlOptimizer,
        options: options,
    }
};