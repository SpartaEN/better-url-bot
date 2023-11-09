import { URLOptimizerProcessorHandler, urlOptimizer } from "../optimizer";
import { filterQueryString, queryParamsWhiteList } from "../util";

const processYoutubeLink: URLOptimizerProcessorHandler = async (url, options, env) => {
    let parsedUrl = new URL(url);
    parsedUrl.search = filterQueryString(parsedUrl.searchParams, queryParamsWhiteList(["v", "t"])).toString();
    if (options.optimizePreview) {
        parsedUrl.host = "fxtwitter.com";
    }
    return parsedUrl.toString();
}

urlOptimizer.register([{
    host: ["youtube.com", "www.youtube.com", "youtu.be", "music.youtube.com"],
    optmize: processYoutubeLink
}]);