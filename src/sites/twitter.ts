import { URLOptimizerProcessorHandler, urlOptimizer } from "../optimizer";
import { filterQueryString, removeAllQueryParams } from "../util";

const processTwitterLink: URLOptimizerProcessorHandler = async (url, options, env) => {
    let parsedUrl = new URL(url);
    parsedUrl.search = filterQueryString(parsedUrl.searchParams, removeAllQueryParams).toString();
    if (options.optimizePreview) {
        parsedUrl.host = "fxtwitter.com";
    }
    return parsedUrl.toString();
}

urlOptimizer.register([{
    host: ["x.com", "twitter.com"],
    optmize: processTwitterLink
}]);