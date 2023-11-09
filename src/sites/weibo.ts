import { URLOptimizerProcessorHandler, urlOptimizer } from "../optimizer";
import { fetchShortLink } from "../util";

const processWeiboShortLink: URLOptimizerProcessorHandler = async (url, options, env, ctx) => {
    return ctx.optimizeUrl(await fetchShortLink(url), options, env);
}

urlOptimizer.register([{
    host: ["t.cn"],
    optmize: processWeiboShortLink
}]);