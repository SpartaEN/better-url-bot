import { Env } from ".";

export type URLOptimizerOptions = {
    optimizePreview?: boolean;
}

export type URLOptimizerProcessorHandler = (url: string, options: URLOptimizerOptions, env: Env) => Promise<string>;


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

    async optimizeUrl(url: string, options: URLOptimizerOptions, env: Env): Promise<string> {
        let parsedUrl = new URL(url);
        let processor = this.processors.get(parsedUrl.host);
        if (processor) {
            return await processor(url, options, env);
        } else {
            return url;
        }
    }
}

export const urlOptimizer = new URLOptimizer();