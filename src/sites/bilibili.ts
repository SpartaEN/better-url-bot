import { URLOptimizerProcessorHandler, urlOptimizer } from "../optimizer";
import { filterQueryString, queryParamsWhiteList, fetchShortLink } from "../util";

const processBilibiliLink: URLOptimizerProcessorHandler = async (url, options, env) => {
    let parsedUrl = new URL(url);
    parsedUrl.search = filterQueryString(parsedUrl.searchParams, queryParamsWhiteList(["p", "t"])).toString();
    return parsedUrl.toString();
}

const processB23TvLink: URLOptimizerProcessorHandler = async (url, options, env) => {
    return await processBilibiliLink(await fetchShortLink(url), options, env);
}

urlOptimizer.register([{
    host: ["www.bilibili.com", "bilibili.com"],
    optmize: processBilibiliLink
}, {
    host: ["b23.tv"],
    optmize: processB23TvLink
}]);