import { URLOptimizerProcessorHandler, urlOptimizer } from "../optimizer";
import { filterQueryString, queryParamsWhiteList, fetchShortLink } from "../util";

const processBilibiliLink: URLOptimizerProcessorHandler = async (ctx, url) => {
    let parsedUrl = new URL(url);
    parsedUrl.search = filterQueryString(parsedUrl.searchParams, queryParamsWhiteList(["p", "t"])).toString();
    return parsedUrl.toString();
}

const processB23TvLink: URLOptimizerProcessorHandler = async (ctx, url) => {
    return await processBilibiliLink(ctx, await fetchShortLink(url));
}

urlOptimizer.register([{
    host: ["www.bilibili.com", "bilibili.com"],
    optmize: processBilibiliLink
}, {
    host: ["b23.tv"],
    optmize: processB23TvLink
}]);