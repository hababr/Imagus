"use strict";

var cachedSieveRes = [],
    cachedPrefs = {};

var cfg = {
    sessionGet: (keys, callback) => {
        return callback ? chrome.storage.session.get(keys, callback) : chrome.storage.session.get(keys);
    },
    sessionSet: (items) => {
        return chrome.storage.session.set(items);
    },
    sessionRemove: (keys) => {
        return chrome.storage.session.remove(keys);
    },
    async get(keys, callback) {
        const items = await chrome.storage.local.get(keys);
        for (var key in items) {
            try {
                if (!items[key]) throw new Error();
                items[key] = JSON.parse(items[key]);
            } catch (error) {
                delete items[key];
            }
        }
        callback?.(items);
        return items;
    },
    async set(items, callback) {
        for (var key in items) {
            items[key] = JSON.stringify(items[key]);
        }
        await chrome.storage.local.set(items);
        callback?.();
    },
    remove(keys) {
        return chrome.storage.local.remove(keys);
    },
};

function withBaseURI(base, relative, secure) {
    if (relative[0] === '/' && relative[1] === '/') {
        return secure ? base.slice(0, base.indexOf(":") + 1) + relative : relative;
    } else if (/^[\w-]{2,20}:/i.test(relative)) {
        return relative;
    } else {
        const regex = relative[0] === '/' ? /(\/\/[^/]+)\/.*/ : /(\/)[^/]*(?:[?#].*)?$/;
        return base.replace(regex, "$1") + relative;
    }
}

async function updateSieve(local, callback) {
    const { sieve, sieveRepository } = await cfg.get(["sieveRepository", "sieve"]);
    local = local || !sieveRepository;

    const response = await fetch(local ? "/data/sieve.json" : sieveRepository);
    if (!local && !response.status) throw new Error("HTTP " + response.status);

    const repository = await response.json();
    try {
        (function (currentSieve, newSieve) {
            if (currentSieve) {
                let merged = {};
                for (let key in currentSieve) {
                    if (key === "dereferers") break;
                    if (!newSieve[key]) merged[key] = currentSieve[key];
                }
                for (let key in newSieve) {
                    merged[key] = newSieve[key];
                }
                newSieve = merged;
            }
            updatePrefs({ sieve: newSieve }, function () {
                if (typeof callback === "function") callback(newSieve);
            });
            console.info(chrome.runtime.getManifest().name + ": Sieve updated from " + (local ? "local" : "remote") + " repository.");
        })(sieve, repository);
    } catch (error) {
        console.warn(
            chrome.runtime.getManifest().name + ": Sieve failed to update from " + (local ? "local" : "remote") + " repository! | ",
            error.message
        );
        if (!local) {
            cfg.get("sieve", function (data) {
                if (!data.sieve) updateSieve(true);
            });
        }
    }
}

function cacheSieve(newSieve) {
    if (typeof newSieve === "string") newSieve = JSON.parse(newSieve);
    else newSieve = JSON.parse(JSON.stringify(newSieve));
    const cachedSieve = [];
    cachedSieveRes = [];

    for (var ruleName in newSieve) {
        var rule = newSieve[ruleName];
        if ((!rule.link && !rule.img) || (rule.img && !rule.to && !rule.res)) continue;
        try {
            if (rule.off) throw ruleName + " is off";
            if (rule.res)
                if (/^:\n/.test(rule.res)) {
                    cachedSieveRes[cachedSieve.length] = rule.res.slice(2);
                    rule.res = 1;
                } else {
                    if (rule.res.indexOf("\n") > -1) {
                        var lines = rule.res.split(/\n+/);
                        rule.res = RegExp(lines[0]);
                        if (lines[1]) rule.res = [rule.res, RegExp(lines[1])];
                    } else rule.res = RegExp(rule.res);
                    cachedSieveRes[cachedSieve.length] = rule.res;
                    rule.res = true;
                }
        } catch (ex) {
            if (typeof ex === "object") console.error(ruleName, rule, ex);
            else console.info(ex);
            continue;
        }
        if (rule.to && rule.to.indexOf("\n") > 0 && rule.to.indexOf(":\n") !== 0) rule.to = rule.to.split("\n");
        delete rule.note;
        cachedSieve.push(rule);
    }
    cachedPrefs.sieve = cachedSieve;
}

async function updatePrefs(prefs, callback) {
    prefs = prefs || {};

    let defaults = await (await fetch("/data/defaults.json")).json();
    let storedPrefs = await cfg.get(Object.keys(defaults));
    let newPrefs = {};
    let changes = {};

    for (let key in defaults) {
        let isChanged = false;
        if (typeof defaults[key] === "object") {
            newPrefs[key] = prefs[key] || storedPrefs[key] || defaults[key];
            isChanged = true;
            if (!Array.isArray(defaults[key])) {
                for (let subKey in defaults[key]) {
                    if (newPrefs[key][subKey] === undefined ||
                        typeof newPrefs[key][subKey] !== typeof defaults[key][subKey])
                    {
                        newPrefs[key][subKey] =
                            cachedPrefs?.[key]?.[subKey] !== undefined
                            ? cachedPrefs[key][subKey]
                            : defaults[key][subKey];
                    }
                }
            }
        } else {
            let value = prefs[key] || storedPrefs[key] || defaults[key];
            if (typeof value !== typeof defaults[key]) {
                value = defaults[key];
            }
            if (!cachedPrefs || cachedPrefs[key] !== value) {
                isChanged = true;
            }
            newPrefs[key] = value;
        }
        if (isChanged || storedPrefs[key] === undefined) {
            changes[key] = newPrefs[key];
        }
    }

    if (newPrefs.grants?.length > 0) {
        let grants = newPrefs.grants || [];
        let processedGrants = [];
        for (let i = 0; i < grants.length; ++i) {
            if (grants[i].op !== ";") {
                processedGrants.push({
                    op: grants[i].op,
                    url: grants[i].op.length === 2 ? RegExp(grants[i].url, "i") : grants[i].url,
                });
            }
        }
        if (processedGrants.length) {
            newPrefs.grants = processedGrants;
        }
    } else {
        delete newPrefs.grants;
    }

    cachedPrefs = newPrefs;
    if (prefs.sieve) {
        changes.sieve = typeof prefs.sieve === "string" ? JSON.parse(prefs.sieve) : prefs.sieve;
        cacheSieve(changes.sieve);
    }
    await cfg.set(changes);
    if (!prefs.sieve) {
        const data = await cfg.get("sieve");
        if (!data?.sieve) {
            updateSieve(true);
        } else {
            cacheSieve(data.sieve);
        }
    }
    if (typeof callback === "function") {
        callback();
    }
}

function onMessage(message, sender, sendResponse) {
    let msg, context;
    if (sender === null) {
        msg = message;
    } else {
        context = { msg: message, origin: sender.url, postMessage: sendResponse };
        msg = context.msg;
    }
    if (!msg.cmd) return;

    switch (msg.cmd) {
        case "hello": {
            let blocked = false;
            let response = { hz: cachedPrefs.hz, sieve: cachedPrefs.sieve, tls: cachedPrefs.tls, keys: cachedPrefs.keys };
            if (cachedPrefs.grants) {
                for (let i = 0, len = cachedPrefs.grants.length; i < len; ++i) {
                    let grant = cachedPrefs.grants[i];
                    if (grant.url === "*" || (grant.op[1] && grant.url.test(context.origin)) || context.origin.indexOf(grant.url) > -1) {
                        blocked = grant.op[0] === "!";
                    }
                }
            }
            context.postMessage({ cmd: "hello", prefs: blocked ? null : response });
            break;
        }
        case "cfg_get":
            if (!Array.isArray(msg.keys)) {
                msg.keys = [msg.keys];
            }
            cfg.get(msg.keys, function (data) {
                context.postMessage({ cfg: data });
            });
            break;
        case "cfg_del":
            if (!Array.isArray(msg.keys)) {
                msg.keys = [msg.keys];
            }
            cfg.remove(msg.keys);
            break;
        case "getLocaleList":
            fetch("/data/locales.json")
                .then((resp) => resp.text())
                .then(function (resp) {
                    context.postMessage(resp);
                });
            break;
        case "savePrefs":
            updatePrefs(msg.prefs);
            break;
        case "update_sieve":
            updateSieve(false, function (data) {
                context.postMessage({ updated_sieve: data });
            });
            break;
        case "loadScripts":
            registerContentScripts();
            break;
        case "download":
            const opts = { url: msg.url, priorityExt: msg.priorityExt, ext: msg.ext, isPrivate: context.isPrivate };
            if (!opts?.url) break;
            try {
                chrome.downloads.download({ url: opts.url, incognito: opts.isPrivate });
            } catch (r) {
                chrome.downloads.download({ url: opts.url });
            }
            break;
        case "history":
            if (chrome.extension?.inIncognitoContext) break;
            if (msg.manual) {
                chrome.history.getVisits({ url: msg.url }, function (hv) {
                    chrome.history[(hv.length ? "delete" : "add") + "Url"]({ url: msg.url });
                });
            } else {
                chrome.history.addUrl({ url: msg.url });
            }
            break;
        case "open":
            if (!Array.isArray(msg.url)) {
                msg.url = [msg.url];
            }
            msg.url.forEach(function (url) {
                if (url && typeof url === "string") {
                    let tabOptions = { url, active: !msg.nf };
                    if (sender?.tab?.id) {
                        tabOptions.openerTabId = sender.tab.id;
                    }
                    try {
                        chrome.tabs.create(tabOptions);
                    } catch (error) {
                        delete tabOptions.openerTabId;
                        chrome.tabs.create(tabOptions);
                    }
                }
            });
            break;
        case "resolve": {
            const data = {
                cmd: "resolved",
                id: msg.id,
                m: null,
                params: msg.params,
            };
            const rule = cachedPrefs.sieve[data.params.rule.id];

            if (data.params.rule.req_res) {
                data.params.rule.req_res = cachedSieveRes[data.params.rule.id];
            }
            if (data.params.rule.skip_resolve) {
                data.params.url = [""];
                context.postMessage(data);
                return;
            }

            const urlParts = /([^\s]+)(?: +:(.+)?)?/.exec(msg.url);
            msg.url = urlParts[1];
            let postData = urlParts[2] || null;

            if (rule.res === 1) {
                data.m = true;
                data.params._ = "";
                data.params.url = [urlParts[1], postData];
            }

            fetch(msg.url, {
                method: postData ? "POST" : "GET",
                body: postData,
                headers: postData ? { "Content-Type": "application/x-www-form-urlencoded" } : {},
            })
                .then((fetchResp) => {
                    const contentType = fetchResp.headers.get("Content-Type");
                    if (/^(image|video|audio)\//i.test(contentType)) {
                        data.m = msg.url;
                        data.noloop = true;
                        console.warn(chrome.runtime.getManifest().name + ": rule " + data.params.rule.id + " matched against an image file");
                        context.postMessage(data);
                        return null;
                    }
                    return fetchResp.text();
                })
                .then((body) => {
                    // if (body === null) return;
                    let base = body.slice(0, 4096);
                    const baseHrefMatch = /<base\s+href\s*=\s*("[^"]+"|'[^']+')/.exec(base);
                    base = baseHrefMatch
                        ? withBaseURI(msg.url, baseHrefMatch[1].slice(1, -1).replace(/&amp;/g, "&"), true)
                        : msg.url;

                    if (rule.res === 1) {
                        data.params._ = body;
                        data.params.base = base.replace(/(\/)[^\/]*(?:[?#].*)*$/, "$1");
                        context.postMessage(data);
                        return;
                    }

                    let patterns = cachedSieveRes[data.params.rule.id];
                    patterns = Array.isArray(patterns) ? patterns : [patterns];
                    patterns = patterns.map((pattern) => {
                        const source = pattern.source || pattern;
                        if (!source.includes("$")) return pattern;
                        let group = data.params.length;
                        group = Array.from({ length: group }, (_, i) => i).join("|");
                        group = RegExp("([^\\\\]?)\\$(" + group + ")", "g");
                        group = group.test(source)
                            ? source.replace(group, (match, pre, idx) => {
                                  return idx < data.params.length && pre !== "\\"
                                      ? pre + (data.params[idx] ? data.params[idx].replace(/[/\\^$-.+*?|(){}[\]]/g, "\\$&") : "")
                                      : match;
                              })
                            : group;
                        return typeof pattern === "string" ? group : RegExp(group);
                    });

                    let match = patterns[0].exec(body);
                    if (match) {
                        const loopParam = data.params.rule.loop_param;
                        if (rule.dc && (("link" === loopParam && rule.dc !== 2) || ("img" === loopParam && rule.dc > 1))) {
                            match[1] = decodeURIComponent(decodeURIComponent(match[1]));
                        }
                        data.m = withBaseURI(base, match[1].replace(/&amp;/g, "&"));
                        if ((match[2] && (match = match.slice(1))) || (patterns[1] && (match = patterns[1].exec(body)))) {
                            data.m = [data.m, match.filter((val, idx) => idx && val).join(" - ")];
                        }
                    } else {
                        console.info(chrome.runtime.getManifest().name + ": no match for " + data.params.rule.id);
                    }
                    context.postMessage(data);
                });
            break;
        }
    }
    return true;
}

function keepAlive() {
    // keep the service worker alive
    setInterval(chrome.runtime.getPlatformInfo, 25_000);
}

function registerContentScripts() {
    chrome.userScripts.configureWorld({ csp: "script-src 'self' 'unsafe-eval'", messaging: !0 });
    chrome.userScripts.unregister().then(function () {
        chrome.userScripts.register([
            {
                id: "app.js",
                allFrames: !0,
                matches: ["*://*/*"],
                world: "USER_SCRIPT",
                runAt: "document_start",
                js: [{ file: "common/app.js" }],
            },
            {
                id: "content.js",
                allFrames: !0,
                matches: ["*://*/*"],
                runAt: "document_idle",
                world: "USER_SCRIPT",
                js: [{ file: "content/content.js" }],
            },
        ]);
    });
}

updatePrefs(null, registerContentScripts);
chrome.runtime.onStartup.addListener(updatePrefs);
chrome.runtime.onInstalled.addListener(function (e) {
    if (e.reason === "update") {
        registerContentScripts();
    } else if (e.reason === "install") {
        chrome.runtime.openOptionsPage();
    }
});
chrome.runtime.onMessage.addListener(onMessage);
chrome.runtime.onUserScriptMessage.addListener(onMessage);

keepAlive();
