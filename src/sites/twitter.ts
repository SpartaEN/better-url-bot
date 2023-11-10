import { URLOptimizerProcessorHandler, urlOptimizer } from "../optimizer";
import { filterQueryString, removeAllQueryParams, fetchShortLink } from "../util";

const processTwitterLink: URLOptimizerProcessorHandler = async (ctx, url) => {
    let parsedUrl = new URL(url);
    parsedUrl.search = filterQueryString(parsedUrl.searchParams, removeAllQueryParams).toString();
    if (ctx.options.optimizePreview) {
        parsedUrl.host = "fxtwitter.com";
    }
    return parsedUrl.toString();
}

const processTwitterShortLink: URLOptimizerProcessorHandler = async (ctx, url) => {
    return ctx.optimizer.optimizeUrl(ctx, await fetchShortLink(url));
}

urlOptimizer.register([{
    host: ["x.com", "twitter.com"],
    optmize: processTwitterLink
}, {
    host: ["t.co"],
    optmize: processTwitterShortLink
}]);