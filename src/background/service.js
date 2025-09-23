"use strict";
var cfg = {
    sessionGet: (e, r) => (r ? chrome.storage.session.get(e, r) : chrome.storage.session.get(e)),
    sessionSet: (e) => chrome.storage.session.set(e),
    sessionRemove: (e) => chrome.storage.session.remove(e),
    get(e, r) {
        chrome.storage.local.get(e, function (e) {
            for (var s in e)
                try {
                    if (!e[s]) throw Error;
                    e[s] = JSON.parse(e[s]);
                } catch (r) {
                    delete e[s];
                }
            r(e);
        });
    },
    set(e, r) {
        for (var s in e) e[s] = JSON.stringify(e[s]);
        chrome.storage.local.set(e, r);
    },
    remove(e) {
        chrome.storage.local.remove(e);
    },
};
const withBaseURI = function (e, r, s) {
        return "/" === r[1] && "/" === r[0]
            ? s
                ? e.slice(0, e.indexOf(":") + 1) + r
                : r
            : /^[\w-]{2,20}:/i.test(r)
            ? r
            : e.replace("/" === r[0] ? /(\/\/[^/]+)\/.*/ : /(\/)[^/]*(?:[?#].*)?$/, "$1") + r;
    },
    updateSieve = function (e, r) {
        cfg.get(["sieveRepository", "sieve"], function ({ sieve: s, sieveRepository: t }) {
            (e = e || !t),
                fetch(e ? "/data/sieve.json" : t)
                    .then(function (r) {
                        if (!e && !r.status) throw new Error("HTTP " + r.status);
                        return r.json();
                    })
                    .then(function (t) {
                        try {
                            !(function (s, t) {
                                if (s) {
                                    var a,
                                        o = {};
                                    for (a in s) {
                                        if ("dereferers" === a) break;
                                        t[a] || (o[a] = s[a]);
                                    }
                                    for (a in t) o[a] = t[a];
                                    t = o;
                                }
                                updatePrefs({ sieve: t }, function () {
                                    "function" == typeof r && r(t);
                                }),
                                    console.info(chrome.runtime.getManifest().name + ": Sieve updated from " + (e ? "local" : "remote") + " repository.");
                            })(s, t);
                        } catch (r) {
                            console.warn(
                                chrome.runtime.getManifest().name + ": Sieve failed to update from " + (e ? "local" : "remote") + " repository! | ",
                                r.message
                            ),
                                e ||
                                    cfg.get("sieve", function (e) {
                                        e.sieve || updateSieve(!0);
                                    });
                        }
                    });
        });
    },
    cacheSieve = function (e) {
        e = "string" == typeof e ? JSON.parse(e) : JSON.parse(JSON.stringify(e));
        var r = [],
            s = [];
        for (var t in e) {
            var a = e[t];
            if ((a.link || a.img) && (!a.img || a.to || a.res)) {
                try {
                    if (a.off) throw t + " is off";
                    if (a.res)
                        if (/^:\n/.test(a.res)) (s[r.length] = a.res.slice(2)), (a.res = 1);
                        else {
                            if (a.res.indexOf("\n") > -1) {
                                var o = a.res.split(/\n+/);
                                (a.res = RegExp(o[0])), o[1] && (a.res = [a.res, RegExp(o[1])]);
                            } else a.res = RegExp(a.res);
                            (s[r.length] = a.res), (a.res = !0);
                        }
                } catch (e) {
                    "object" == typeof e ? console.error(t, a, e) : console.info(e);
                    continue;
                }
                a.to && a.to.indexOf("\n") > 0 && 0 !== a.to.indexOf(":\n") && (a.to = a.to.split("\n")), delete a.note, r.push(a);
            }
        }
        cfg.sessionSet({ cachedSieveRes: s }).then(function () {
            cfg.sessionSet({ cachedSieve: r });
        });
    },
    updatePrefs = function (e, r) {
        var s;
        e || (e = {});
        var t = async function (t) {
            var a,
                o,
                n,
                i = {},
                c = {};
            const { cachedPrefs: l } = await cfg.sessionGet("cachedPrefs");
            for (o in s) {
                if (((a = !1), "object" == typeof s[o])) {
                    if (((i[o] = e[o] || t[o] || s[o]), (a = !0), !Array.isArray(s[o])))
                        for (n in s[o]) (void 0 !== i[o][n] && typeof i[o][n] == typeof s[o][n]) || (i[o][n] = (l && void 0 !== l[o][n] ? l : s)[o][n]);
                } else typeof (n = e[o] || t[o] || s[o]) != typeof s[o] && (n = s[o]), (l && l[o] === n) || (a = !0), (i[o] = n);
                (a || void 0 === t[o]) && (c[o] = i[o]);
            }
            if (i?.grants.length > 0) {
                n = i.grants || [];
                var f = [];
                for (o = 0; o < n.length; ++o) ";" !== n[o].op && f.push({ op: n[o].op, url: 2 === n[o].op.length ? RegExp(n[o].url, "i") : n[o].url });
                f.length && (i.grants = f);
            } else delete i.grants;
            cfg.sessionSet({ cachedPrefs: i }),
                e.sieve && ((c.sieve = "string" == typeof e.sieve ? JSON.parse(e.sieve) : e.sieve), cacheSieve(c.sieve)),
                cfg.set(c, function () {
                    e.sieve ||
                        cfg.get("sieve", function (e) {
                            e.sieve ? cacheSieve(e.sieve) : updateSieve(!0);
                        }),
                        "function" == typeof r && r();
                });
        };
        fetch("/data/defaults.json")
            .then((e) => e.json())
            .then(function (e) {
                (s = e), cfg.get(Object.keys(e), t);
            });
    },
    onMessage = function (e, r, s) {
        var t, a;
        if ((null === r ? (t = e) : ((a = { msg: e, origin: r.url, postMessage: s }), (t = a.msg)), t.cmd)) {
            switch (t.cmd) {
                case "hello":
                    cfg.sessionGet(["cachedPrefs", "cachedSieve"], function ({ cachedPrefs: e, cachedSieve: r }) {
                        var s,
                            t,
                            o,
                            n = !1,
                            i = { hz: e.hz, sieve: r, tls: e.tls, keys: e.keys };
                        if (e.grants)
                            for (s = 0, t = (o = e.grants).length; s < t; ++s)
                                ("*" === o[s].url || (o[s].op[1] && o[s].url.test(a.origin)) || a.origin.indexOf(o[s].url) > -1) && (n = "!" === o[s].op[0]);
                        a.postMessage({ cmd: "hello", prefs: n ? null : i });
                    });
                    break;
                case "cfg_get":
                    Array.isArray(t.keys) || (t.keys = [t.keys]),
                        cfg.get(t.keys, function (e) {
                            a.postMessage({ cfg: e });
                        });
                    break;
                case "cfg_del":
                    Array.isArray(t.keys) || (t.keys = [t.keys]), cfg.remove(t.keys);
                    break;
                case "getLocaleList":
                    fetch("/data/locales.json")
                        .then((e) => e.text())
                        .then(function (e) {
                            a.postMessage(e);
                        });
                    break;
                case "savePrefs":
                    updatePrefs(t.prefs);
                    break;
                case "update_sieve":
                    updateSieve(!1, function (e) {
                        a.postMessage({ updated_sieve: e });
                    });
                    break;
            case "loadScripts":
                registerContentScripts();
                break;

                case "download":
                    const e = { url: t.url, priorityExt: t.priorityExt, ext: t.ext, isPrivate: a.isPrivate };
                    if (!e || !e.url) break;
                    try {
                        chrome.downloads.download({ url: e.url, incognito: e.isPrivate });
                    } catch (r) {
                        chrome.downloads.download({ url: e.url });
                    }
                    break;
                case "history":
                    if (a.isPrivate) break;
                    t.manual
                        ? chrome.history.getVisits({ url: t.url }, function (e) {
                              chrome.history[(e.length ? "delete" : "add") + "Url"]({ url: t.url });
                          })
                        : chrome.history.addUrl({ url: t.url });
                    break;
                case "open":
                    Array.isArray(t.url) || (t.url = [t.url]),
                        t.url.forEach(function (e) {
                            if (e && "string" == typeof e) {
                                var s = { url: e, active: !t.nf };
                                r && r.tab && r.tab.id && (s.openerTabId = r.tab.id);
                                try {
                                    chrome.tabs.create(s);
                                } catch (e) {
                                    delete s.openerTabId, chrome.tabs.create(s);
                                }
                            }
                        });
                    break;
                case "resolve":
                    cfg.sessionGet(["cachedSieve", "cachedSieveRes"], function ({ cachedSieve: e, cachedSieveRes: r }) {
                        var s = { cmd: "resolved", id: t.id, m: null, params: t.params },
                            o = e[s.params.rule.id];
                        if ((s.params.rule.req_res && (s.params.rule.req_res = r[s.params.rule.id]), s.params.rule.skip_resolve))
                            return (s.params.url = [""]), void a.postMessage(s);
                        var n = /([^\s]+)(?: +:(.+)?)?/.exec(t.url);
                        (t.url = n[1]),
                            n[2] || (n[2] = null),
                            1 === o.res && ((s.m = !0), (s.params._ = ""), (s.params.url = [n[1], n[2]])),
                            (n = n[2]),
                            fetch(t.url, { method: n ? "POST" : "GET", body: n, headers: n ? { "Content-Type": "application/x-www-form-urlencoded" } : {} })
                                .then(function (e) {
                                    return /^(image|video|audio)\//i.test(e.headers.get("Content-Type"))
                                        ? ((s.m = t.url),
                                          (s.noloop = !0),
                                          console.warn(chrome.runtime.getManifest().name + ": rule " + s.params.rule.id + " matched against an image file"),
                                          void a.postMessage(s))
                                        : e.text();
                                })
                                .then(function (e) {
                                    var n = e.slice(0, 4096);
                                    if (
                                        ((n = (n = /<base\s+href\s*=\s*("[^"]+"|'[^']+')/.exec(n))
                                            ? withBaseURI(t.url, n[1].slice(1, -1).replace(/&amp;/g, "&"), !0)
                                            : t.url),
                                        1 === o.res)
                                    )
                                        return (s.params._ = e), (s.params.base = n.replace(/(\/)[^\/]*(?:[?#].*)*$/, "$1")), void a.postMessage(s);
                                    var i = r[s.params.rule.id],
                                        c = (i = (Array.isArray(i) ? i : [i]).map(function (e) {
                                            var r = e.source || e;
                                            if (-1 === r.indexOf("$")) return e;
                                            var t = s.params.length;
                                            return (
                                                (t = Array.apply(null, Array(t))
                                                    .map(function (e, r) {
                                                        return r;
                                                    })
                                                    .join("|")),
                                                (t = (t = RegExp("([^\\\\]?)\\$(" + t + ")", "g")).test(r)
                                                    ? r.replace(t, function (e, r, t) {
                                                          return t < s.params.length && "\\" !== r
                                                              ? r + (s.params[t] ? s.params[t].replace(/[/\\^$-.+*?|(){}[\]]/g, "\\$&") : "")
                                                              : e;
                                                      })
                                                    : e),
                                                "string" == typeof e ? t : RegExp(t)
                                            );
                                        }))[0].exec(e);
                                    if (c) {
                                        var l = s.params.rule.loop_param;
                                        o.dc &&
                                            (("link" === l && 2 !== o.dc) || ("img" === l && o.dc > 1)) &&
                                            (c[1] = decodeURIComponent(decodeURIComponent(c[1]))),
                                            (s.m = withBaseURI(n, c[1].replace(/&amp;/g, "&"))),
                                            ((c[2] && (c = c.slice(1))) || (i[1] && (c = i[1].exec(e)))) &&
                                                (s.m = [
                                                    s.m,
                                                    c
                                                        .filter(function (e, r) {
                                                            return !(!r || !e);
                                                        })
                                                        .join(" - "),
                                                ]);
                                    } else console.info(chrome.runtime.getManifest().name + ": no match for " + s.params.rule.id);
                                    a.postMessage(s);
                                });
                    });
            }
            return !0;
        }
    };

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
                js: [{ file: "common/app.js" }]
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
