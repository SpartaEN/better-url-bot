import { fetchShortLink } from "./util";

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

class URLOptimizerTreeNode {
    name: string | undefined
    children: Map<string, URLOptimizerTreeNode>
    optimizer: URLOptimizerProcessorHandler | undefined
    defaultChildrenOptimizer: URLOptimizerProcessorHandler | undefined
    constructor() {
        this.children = new Map();
    }

    get(host: string): URLOptimizerProcessorHandler | undefined {
        if (host.length == 0) {
            return this.optimizer;
        }

        let parts = host.split(".");
        let child = this.children.get(parts[parts.length - 1]);
        parts.pop();


        let optimizer;

        if (child) {
            optimizer = child.get(parts.join('.'));
        }

        // NOTE: example.com and *.example.com will be treated differently
        // *.example.com will apply to all subdomains, such as a.example.com, a.a.example.com
        if (!optimizer) {
            return this.defaultChildrenOptimizer;
        }
        return optimizer;
    }

    set(host: string, optimizer: URLOptimizerProcessorHandler): void {
        if (host.length == 0) {
            this.optimizer = optimizer;
            return;
        }

        let parts = host.split(".");
        let lastPart = parts.pop();

        if (lastPart === "*") {
            this.defaultChildrenOptimizer = optimizer;
            return;
        }

        // Not gonna happen, but typescript
        if (!lastPart) {
            return;
        }

        let child = this.children.get(lastPart);

        if (child) {
            child.set(parts.join("."), optimizer)
        } else {
            child = new URLOptimizerTreeNode();
            child.name = lastPart;
            child.set(parts.join("."), optimizer);
            this.children.set(lastPart, child);
        }
    }
}

export class URLOptimizerTree {
    root: URLOptimizerTreeNode
    constructor() {
        this.root = new URLOptimizerTreeNode();
    }

    get(host: string): URLOptimizerProcessorHandler | undefined {
        return this.root.get(host);
    }

    set(host: string, optimizer: URLOptimizerProcessorHandler): void {
        this.root.set(host, optimizer);
    }
}

class URLOptimizer {
    processors: URLOptimizerTree
    constructor() {
        this.processors = new URLOptimizerTree();
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