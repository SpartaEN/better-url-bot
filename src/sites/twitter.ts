import { URLOptimizerProcessorHandler, urlOptimizer } from "../optimizer";
import { filterQueryString, removeAllQueryParams, fetchShortLink } from "../util";

const processTwitterLink: URLOptimizerProcessorHandler = async (url, options, env, ctx) => {
    let parsedUrl = new URL(url);
    parsedUrl.search = filterQueryString(parsedUrl.searchParams, removeAllQueryParams).toString();
    if (options.optimizePreview) {
        parsedUrl.host = "fxtwitter.com";
    }
    return parsedUrl.toString();
}

const processTwitterShortLink: URLOptimizerProcessorHandler = async (url, options, env, ctx) => {
    return ctx.optimizeUrl(await fetchShortLink(url), options, env);
}

urlOptimizer.register([{
    host: ["x.com", "twitter.com"],
    optmize: processTwitterLink
}, {
    host: ["t.co"],
    optmize: processTwitterShortLink
}]);