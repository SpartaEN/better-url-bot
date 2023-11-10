import { URLOptimizerProcessorHandler, urlOptimizer } from "../optimizer";
import { fetchShortLink } from "../util";

const processWeiboShortLink: URLOptimizerProcessorHandler = async (ctx, url) => {
    return ctx.optimizer.optimizeUrl(ctx, await fetchShortLink(url));
}

urlOptimizer.register([{
    host: ["t.cn"],
    optmize: processWeiboShortLink
}]);