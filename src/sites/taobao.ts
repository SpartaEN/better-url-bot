import { URLOptimizerProcessorHandler, urlOptimizer } from "../optimizer";
import { filterQueryString, queryParamsWhiteList, fetchContent } from "../util";
import { URLOptimizeError } from "../error";

const processTaobaoLink: URLOptimizerProcessorHandler = async (ctx, url) => {
    let parsedUrl = new URL(url);
    parsedUrl.search = filterQueryString(parsedUrl.searchParams, queryParamsWhiteList(["id", "sku_properties", "skuId"])).toString();
    return parsedUrl.toString();
}

// TODO: Extract short link with cloudflare browser rendering when it is out
const processTaobaoShortLink: URLOptimizerProcessorHandler = async (ctx, url) => {
    let content = await fetchContent(url);
    let match = content.match(/var status = "(.*)";/);
    if (match == null) {
        throw new URLOptimizeError("Failed to extract taobao short link");
    }
    if (match[1] != "true") {
        return "http://m.tb.cn/scanError.htm";
    }
    match = content.match(/var url = '(.*)';/);
    if (match == null) {
        throw new URLOptimizeError("Failed to extract taobao short link");
    }
    return await processTaobaoLink(ctx, match[1]);
}

urlOptimizer.register([{
    host: ["www.taobao.com", "item.taobao.com", "detail.tmall.com", "detail.taobao.com"],
    optmize: processTaobaoLink
}, {
    host: ["m.tb.cn"],
    optmize: processTaobaoShortLink
}]);