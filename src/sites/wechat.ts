import { URLOptimizerProcessorHandler, urlOptimizer } from "../optimizer";
import { filterQueryString, queryParamsWhiteList } from "../util";

const processWeChatOfficialAccountLink: URLOptimizerProcessorHandler = async (ctx, url) => {
    let parsedUrl = new URL(url);
    if (parsedUrl.pathname === "/s") {
        parsedUrl.search = filterQueryString(parsedUrl.searchParams, queryParamsWhiteList(['__biz', 'mid', 'idx', 'sn'])).toString();
    }
    return parsedUrl.toString();
}

urlOptimizer.register([{
    host: ["mp.weixin.qq.com"],
    optmize: processWeChatOfficialAccountLink
}]);