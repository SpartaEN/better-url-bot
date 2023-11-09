import { URLOptimizerProcessorHandler, urlOptimizer } from "../optimizer";
import { filterQueryString, queryParamsWhiteList, removeAllQueryParams } from "../util";

const processJDLink: URLOptimizerProcessorHandler = async (url, options, env) => {
    let parsedUrl = new URL(url);
    parsedUrl.search = filterQueryString(parsedUrl.searchParams, removeAllQueryParams).toString();
    return parsedUrl.toString();
}

urlOptimizer.register([{
    host: ["www.jd.com", "jd.com", "item.jd.com", "item.m.jd.com"],
    optmize: processJDLink
}]);