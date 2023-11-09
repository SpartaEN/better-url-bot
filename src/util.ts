import { Env } from ".";
import { URLOptimizeError } from "./error";
// import puppeteer from "@cloudflare/puppeteer";


export function removeAllQueryParams(key: string) {
    return false;
}

export function queryParamsWhiteList(whitelist: String[]) {
    return (key: string) => {
        return whitelist.includes(key);
    }
}

export function queryParamsBlackList(blacklist: String[]) {
    return (key: string) => {
        return !blacklist.includes(key);
    }
}

export async function fetchShortLink(url: string): Promise<string> {
    return await fetch(url, { redirect: "manual" }).then((response) => {
        const location = response.headers.get("location");
        if (location) {
            return location;
        }
        throw new URLOptimizeError(`unable to fetch url ${url}`);
    });
}

export async function fetchContent(url: string): Promise<string> {
    return await fetch(url).then((response) => {
        return response.text();
    });
}


export function filterQueryString(queryParams: URLSearchParams, filterFunc: (key: string) => boolean) {
    const newQueryParams = new URLSearchParams();
    for (const [key, value] of queryParams) {
        if (filterFunc(key)) {
            newQueryParams.set(key, value);
        }
    }
    return newQueryParams;
}

export async function sha256sum(data: string): Promise<string> {
    const text = new TextEncoder().encode(data);
    const digets = await crypto.subtle.digest(
        {
            name: 'SHA-256',
        },
        text
    );
    return Array.prototype.map.call(new Uint8Array(digets), x => ('00' + x.toString(16)).slice(-2)).join('');
}


// export async function fetchShortLinkBrowser(url: string, env: Env) {
//     const browser = await puppeteer.launch(env.BROWSER);
//     const page = await browser.newPage();
//     await page.goto(url);
//     await page.waitForNavigation({
//         waitUntil: "networkidle0"
//     });
//     const currentUrl = page.url();
//     await browser.close();
//     return currentUrl;
// }