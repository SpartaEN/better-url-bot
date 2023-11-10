import { URLOptimizerProcessorHandler, urlOptimizer } from "../optimizer";
import { filterQueryString, removeAllQueryParams } from "../util";

const processCoolAPKLink: URLOptimizerProcessorHandler = async (ctx, url) => {
    let parsedUrl = new URL(url);
    parsedUrl.search = filterQueryString(parsedUrl.searchParams, removeAllQueryParams).toString();
    return parsedUrl.toString();
}

urlOptimizer.register([{
    host: ["www.coolapk.com", "coolapk.com"],
    optmize: processCoolAPKLink
}]);