import { URLOptimizerProcessorHandler, urlOptimizer } from "../optimizer";
import { fetchShortLink, filterQueryString, removeAllQueryParams } from "../util";

const processMeituanLink: URLOptimizerProcessorHandler = async (ctx, url) => {
    let parsedUrl = new URL(url);
    parsedUrl.search = filterQueryString(parsedUrl.searchParams, removeAllQueryParams).toString();
    return parsedUrl.toString();
}

const processDianPingShortLink: URLOptimizerProcessorHandler = async (ctx, url) => {
    return await fetchShortLink(url);
}

urlOptimizer.register([{
    host: ["www.meituan.com", "meituan.com"],
    optmize: processMeituanLink
}, {
    host: ["dpurl.cn"],
    optmize: processDianPingShortLink
}]);