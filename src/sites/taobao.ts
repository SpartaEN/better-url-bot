import { URLOptimizerProcessorHandler, urlOptimizer } from "../optimizer";
import { filterQueryString, queryParamsWhiteList, fetchContent } from "../util";
import { URLOptimizeError } from "../error";

const processTaobaoLink: URLOptimizerProcessorHandler = async (url, options, env, ctx) => {
    let parsedUrl = new URL(url);
    parsedUrl.search = filterQueryString(parsedUrl.searchParams, queryParamsWhiteList(["id", "sku_properties", "skuId"])).toString();
    return parsedUrl.toString();
}

// TODO: Extract short link with cloudflare browser rendering when it is out
const processTaobaoShortLink: URLOptimizerProcessorHandler = async (url, options, env, ctx) => {
    let content = await fetchContent(url);
    let match = content.match(/var url = '(.*)';/);
    if (match == null) {
        throw new URLOptimizeError("Failed to extract taobao short link");
    }
    return await processTaobaoLink(match[1], options, env, ctx);
}

urlOptimizer.register([{
    host: ["www.taobao.com", "item.taobao.com", "detail.tmall.com", "detail.taobao.com"],
    optmize: processTaobaoLink
}, {
    host: ["m.tb.cn"],
    optmize: processTaobaoShortLink
}]);