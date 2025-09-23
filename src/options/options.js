"use strict";
document.title = `:: ${app.name} ::`;
var input_changes = {},
    $ = function (e) {
        return document.getElementById(e);
    };
const _ = function (e) {
    try {
        return chrome.i18n.getMessage(e) || e;
    } catch (t) {
        return e;
    }
};
let insertHTML = function (e, t) {
    var n =
            /^([apbiusq]|d(iv|el)|em|h[1-6]|i(mg|ns)|s((pan|mall)|u[bp])|[bh]r|pre|code|blockquote|[ou]l|li|d[ltd]|t([rhd]|able|head|body|foot)|svg|symbol|line|path)$/i,
        a = /^(data-|stroke-|(class|style|xmlns|viewBox|i?d|fill|line(cap|join)|transform|[xy][12])$)/i,
        o = document.implementation.createHTMLDocument("").body,
        r = function (e) {
            for (var t = e.childElementCount, o = e.children || e.childNodes; t--; ) {
                var l = o[t];
                if (l.nodeType !== Node.TEXT_NODE)
                    if (n.test(l.nodeName)) {
                        for (var i = l.attributes.length; i--; ) a.test(l.attributes[i].name) || l.removeAttribute(l.attributes[i].name);
                        l.childElementCount && r(l);
                    } else l.parentNode.removeChild(l);
            }
        };
    (insertHTML = function (e, t) {
        if (e && "string" == typeof t)
            if (-1 !== t.indexOf("<")) {
                (o.innerHTML = t), r(o);
                for (var n = e.ownerDocument, a = n.createDocumentFragment(); o.firstChild; ) a.appendChild(n.adoptNode(o.firstChild));
                e.appendChild(a);
            } else e.insertAdjacentText("beforeend", t);
    }),
        insertHTML(e, t);
};
var processLNG = function (e) {
        for (var t, n, a, o, r, l, i = e.length; i--; )
            if (!e[i].lng_loaded) {
                for (n = (t = e[i].querySelectorAll("[data-lng]")).length; n--; )
                    if (
                        ((l = _(t[n].dataset.lng)),
                        (o = t[n].dataset.lngattr)
                            ? (/^(title|placeholder)$/.test(o) && (t[n][o] = l), t[n].removeAttribute("data-lngattr"))
                            : insertHTML(t[n], l),
                        t[n].removeAttribute("data-lng"),
                        void 0 !== t[n].dataset.lngargs)
                    ) {
                        for ((a = t[n].dataset.lngargs.split(" ")).idx = a.length; a.idx--; )
                            if (((a[a.idx] = a[a.idx].split(":")), (a[a.idx][0] = "data-" + a[a.idx][0]), (r = t[n].querySelector("[" + a[a.idx][0] + "]"))))
                                for ((o = a[a.idx][1].split(",")).idx = o.length; o.idx--; )
                                    /^(href|style|target)$/i.test(o[o.idx]) && r.setAttribute(o[o.idx], t[n].getAttribute(a[a.idx][0] + "-" + o[o.idx]));
                        t[n].removeAttribute("data-lngargs");
                    }
                e[i].lng_loaded = !0;
            }
    },
    color_trans = function (e, t, n) {
        if ((clearTimeout(e.col_trans_timer), null === t)) return (e.style.color = ""), void delete e.col_trans_timer;
        (e.style.color = t),
            (e.col_trans_timer = setTimeout(function () {
                color_trans(e, null);
            }, n || 2e3));
    },
    ImprtHandler = function (e, t, n) {
        var a,
            o = $("importer");
        processLNG([o]),
            o.data_handler !== t &&
                ((o.data_handler = t),
                (o.lastElementChild.value = ""),
                (o.firstElementChild.textContent = e + " - " + _("IMPR_IMPORT")),
                (n = n || {}),
                ((a = o.querySelectorAll(".op_buttons div > div > input[id]"))[0].parentNode.style.display = n.clear ? "none" : ""),
                (a[1].parentNode.style.display = n.overwrite ? "none" : ""),
                (a[0].checked = a[1].checked = !1));
        var r = $("imprt_file");
        r.onchange ||
            ((a[0].nextInput = a[1]),
            (a[0].onchange = function () {
                (this.nextInput.disabled = this.checked),
                    this.checked && (this.nextInput.checked = !1),
                    (this.nextInput.parentNode.lastElementChild.style.color = this.checked ? "silver" : "");
            }),
            (o.visible = function (e) {
                o.style.display = !0 === e ? "block" : "none";
            }),
            (o.querySelector("b").onclick = o.visible),
            (o.ondata = function (e, t) {
                var n = this.querySelectorAll('input[type="checkbox"]');
                (n = { clear: n[0].checked, overwrite: n[1].checked }), !1 === o.data_handler(e, n) ? color_trans(t, "red") : o.visible(!1);
            }),
            (o.readfile = function (e) {
                if (e.size > 5242880) color_trans(r.parentNode, "red");
                else {
                    var t = new FileReader();
                    (t.onerror = function () {
                        color_trans(r.parentNode, "red");
                    }),
                        (t.onload = function (e) {
                            try {
                                e = JSON.parse(e.target.result);
                            } catch (e) {
                                return void alert(_("INVALIDFORMAT"));
                            }
                            o.ondata(e, r.parentNode);
                        }),
                        t.readAsText(e);
                }
            }),
            (r.onchange = function () {
                o.readfile(this.files[0]);
            }),
            (r.ondragover = function (e) {
                e.preventDefault();
            }),
            (r.ondragenter = function (e) {
                e.preventDefault(), [].slice.call(e.dataTransfer.types, 0).indexOf("Files") > -1 && (this.parentNode.style.boxShadow = "0 2px 4px green");
            }),
            (r.ondragleave = function () {
                this.parentNode.style.boxShadow = "";
            }),
            (r.ondrop = function (e) {
                (this.parentNode.style.boxShadow = ""), e.dataTransfer.files.length && o.readfile(e.dataTransfer.files[0]), e.preventDefault();
            }),
            ($("imprt_text").onclick = function (e) {
                var t = o.lastElementChild;
                if ((e = t.value.trim())) {
                    try {
                        e = JSON.parse(e);
                    } catch (e) {
                        return void color_trans(this, "red");
                    }
                    o.ondata(e, this);
                } else t.focus();
            })),
            o.visible(!0);
    },
    fill_output = function (e) {
        var t = (e = e.target || e).previousElementSibling;
        t.textContent = t.dataset.as_percent ? parseInt(100 * e.value, 10) : e.value;
    },
    color_text_input = function (e) {
        e = "input" === e.type ? this : e;
        var t = /^#([\da-f]{3}){1,2}$/i.test(e.value) ? e.value : "#ffffff";
        e.previousElementSibling.value = 4 === t.length ? "#" + t[1] + t[1] + t[2] + t[2] + t[3] + t[3] : t;
    },
    color_change = function () {
        this.nextElementSibling.value = this.value;
    },
    setDefault = function (e) {
        e &&
            [].forEach.call("string" == typeof e ? document.querySelectorAll(e) : [e], function (e) {
                if ("checkbox" === e.type) e.checked = e.defaultChecked;
                else if (/^SELECT/i.test(e.type)) {
                    for (var t = e.length; t--; )
                        if (e[t].hasAttribute("selected")) {
                            e.selectedIndex = t;
                            break;
                        }
                } else (e.value = e.defaultValue), "range" === e.type && fill_output(e);
            });
    },
    load = function () {
        for (var e, t, n, a, o, r, l = document.querySelectorAll("input[name*=_], select[name*=_], textarea[name*=_]"), i = l.length, s = {}; i--; )
            if (!(n = l[i]).disabled && !n.readOnly) {
                if (!s[(r = n.name.split("_"))[0]])
                    try {
                        s[r[0]] = JSON.parse(cfg[r[0]] || "{}");
                    } catch (e) {
                        s[r[0]] = cfg[r[0]];
                    }
                if ("tls" === r[0] && "sendToHosts" === r[1]) {
                    if (Array.isArray(s.tls[r[1]])) {
                        for (o = [], e = 0; e < s.tls[r[1]].length; ++e) o.push(s.tls[r[1]][e].join("|"));
                        (n.rows = o.length || 1), (n.value = n.defValue = o.join("\n"));
                    }
                } else if ("grants" === r[0]) {
                    if (((o = []), (t = s.grants) && t.length))
                        for (e = 0; e < t.length; ++e) o.push(";" === t[e].op ? ";" + t[e].txt : t[e].op + (t[e].rules || t[e].opts || "") + ":" + t[e].url);
                    n.value = n.defValue = o.join("\n");
                } else
                    "keys" === r[0]
                        ? ((t = r[1].replace("-", "_")), void 0 !== s.keys[t] && (n.value = n.defValue = s.keys[t].toUpperCase()))
                        : s[r[0]] &&
                          void 0 !== s[r[0]][r[1]] &&
                          ((a = n.getAttribute("type") || "text"),
                          n.type !== a && (a = n.type),
                          "checkbox" === a
                              ? (n.checked = n.defChecked = !!s[r[0]][r[1]])
                              : ((n.value = n.defValue = s[r[0]][r[1]]),
                                "range" === a
                                    ? ((t = n.previousElementSibling) && "OUTPUT" === t.nodeName && fill_output(n),
                                      (t = t.previousElementSibling) && "color" === t.getAttribute("type") && (t.style.opacity = n.value),
                                      n.addEventListener("change", fill_output, !1))
                                    : "text" === a &&
                                      n.previousElementSibling &&
                                      "color" === n.previousElementSibling.getAttribute("type") &&
                                      (n.addEventListener("input", color_text_input, !1),
                                      color_text_input(n),
                                      n.previousElementSibling.addEventListener("change", color_change, !1))));
            }
    },
    save = function () {
        var e,
            t,
            n,
            a,
            o,
            r,
            l,
            i,
            s = document.querySelectorAll("input[name*=_], select[name*=_], textarea[name*=_]"),
            c = {},
            d = /[\r\n]+/,
            u = /^(?:(;.+)|([!~]{1,2}):(.+))/;
        for (SieveUI.loaded && (c.sieve = JSON.stringify(SieveUI.prepareRules())), e = 0; e < s.length; ++e)
            if (!(n = s[e]).readOnly)
                if ((c[(i = n.name.split("_"))[0]] || (c[i[0]] = {}), "tls" === i[0] && "sendToHosts" === i[1]))
                    for (l = n.value.trim().split(d), c.tls[i[1]] = [], r = 0; r < l.length; ++r) 2 === (o = l[r].split("|")).length && c.tls[i[1]].push(o);
                else if ("grants" === i[0]) {
                    if (((c.grants = []), "" === n.value)) continue;
                    var f,
                        p = n.value.trim().split(d);
                    if (!p.length) continue;
                    for (r = 0; r < p.length; ++r)
                        (f = u.exec(p[r].trim())) &&
                            (f[1] ? ((f[1] = f[1].trim()), (o = { op: ";", txt: f[1].substr(1) })) : (o = { op: f[2], url: f[3].trim() }), c.grants.push(o));
                    n.value = c.grants
                        .map(function (e) {
                            return ";" === e.op ? ";" + e.txt : e.op + (e.rules || e.opts || "") + ":" + e.url;
                        })
                        .join("\n");
                } else
                    "keys" === i[0]
                        ? ((t = i[1].replace("-", "_")), (c.keys[t] = n.value))
                        : c[i[0]] &&
                          ("checkbox" === (a = n.getAttribute("type"))
                              ? (c[i[0]][i[1]] = n.checked)
                              : "range" === a || "number" === a || n.classList.contains("number")
                              ? ((c[i[0]][i[1]] = n.min ? Math.max(n.min, Math.min(n.max, parseFloat(n.value))) : parseFloat(n.value)),
                                "number" != typeof c[i[0]][i[1]] && (c[i[0]][i[1]] = parseFloat(n.defaultValue)),
                                (n.value = c[i[0]][i[1]]))
                              : (c[i[0]][i[1]] = n.value));
        Port.send({ cmd: "savePrefs", prefs: c });
    },
    download = function (e, t, n) {
        var a = document.createElement("a");
        if (!n && void 0 !== a.download && URL.createObjectURL) {
            var o = URL.createObjectURL(new Blob([e], { type: "text/plain" }));
            (a.href = o),
                (a.download = t || ""),
                a.dispatchEvent(new MouseEvent("click")),
                setTimeout(function () {
                    URL.revokeObjectURL(o);
                }, 1e3);
        } else Port.send({ cmd: "open", url: "data:text/plain;charset=utf-8," + encodeURIComponent(e) });
    },
    prefs = function (e, t, n) {
        var a,
            o = ["hz", "keys", "tls", "grants"];
        if ("object" == typeof e)
            return (
                "{}" !== JSON.stringify(e) &&
                ((t || {}).clear && Port.send({ cmd: "cfg_del", keys: Object.keys(e) }), Port.send({ cmd: "savePrefs", prefs: e }), void location.reload(!0))
            );
        for (e = {}, a = 0; a < 5; ++a) o[a] in cfg && (e[o[a]] = cfg[o[a]]);
        download(JSON.stringify(e, null, n.shiftKey ? 2 : 0), app.name + "-conf.json", n.ctrlKey);
    };
(window.onhashchange = function () {
    var e,
        t = [],
        n = $("nav_menu"),
        a = (n && n.active && n.active.hash.slice(1)) || "settings",
        o = location.hash.slice(1) || "settings";
    o.indexOf("/") > -1 && ((t = o.split("/")), (o = t.shift())),
        (e = $(o + "_sec") || $("settings_sec")).lng_loaded ||
            ("sieve" === o
                ? (Port.listen(function (e) {
                      Port.listen(null), (e = e.data || e), (cfg.sieve = e.cfg.sieve), SieveUI.load(), $("sieve_search").focus();
                  }),
                  Port.send({ cmd: "cfg_get", keys: ["sieve"] }))
                : "grants" === o
                ? (e.querySelector(".action_buttons").onclick = function (e) {
                      "≡" === e.target.textContent && ($("grants_help").style.display = "block" === $("grants_help").style.display ? "none" : "block");
                  })
                : "info" === o &&
                  ((e.querySelector(".action_buttons").onclick = function (e) {
                      switch (e.target.textContent) {
                          case "↓":
                              ImprtHandler(_("SC_PREFS"), prefs, { overwrite: 1 });
                              break;
                          case "↑":
                              prefs(0, 0, e);
                      }
                  }),
                  (e.querySelector("h3:not([data-lng])").textContent = " v" + app.version),
                  Port.listen(function (e) {
                      Port.listen(null);
                      var t,
                          n,
                          a = [],
                          o = function (e, t) {
                              (e.name = (e.name || e.fullname || "") + (e.fullname && e.name ? " (" + e.fullname + ")" : "") || e.email || e.web),
                                  t && n.nodes.push(", "),
                                  n.nodes.push(e.email || e.web ? { tag: "a", attrs: { href: e.email ? "mailto:" + e.email : e.web }, text: e.name } : e.name);
                          },
                          r = JSON.parse(e);
                      for (t in r)
                          "_" !== t &&
                              ((n = { tag: "td" }),
                              a.push({
                                  tag: "tr",
                                  nodes: [{ tag: "td", attrs: r[t]["%"] ? { title: r[t]["%"] + "%" } : null, text: t + ", " + r[t].name }, n],
                              }),
                              r[t].translators ? ((n.nodes = []), r[t].translators.forEach(o)) : (n.text = "anonymous"));
                      buildNodes($("locales_table"), a);
                  }),
                  Port.send({ cmd: "getLocaleList" }))),
        a !== o && (a = $(a + "_sec")) && (a.style.display = "none"),
        e && (processLNG([e]), (e.style.display = "block")),
        n.active && n.active.classList.remove("active"),
        (n.active = n.querySelector('a[href="#' + o + '"]')) && n.active.classList.add("active");
}),
    window.addEventListener(
        "load",
        function () {
            var e = $("app_version");
            e.textContent = app.name + " v" + app.version;
            var t = $("nav_menu");
            if (
                (processLNG([t, $("right_panel").firstElementChild]),
                (e = document.querySelectorAll('input[type="color"] + output + input[type="range"], textarea[name="tls_sendToHosts"]')))
            ) {
                var n = function () {
                    this.parentNode.firstElementChild.style.opacity = this.value;
                };
                [].forEach.call(e, function (e) {
                    "TEXTAREA" === e.nodeName
                        ? (e.oninput = function () {
                              this.rows = Math.min((this.value.match(/(?:\n|\r\n?)/g) || []).length + 1, 10);
                          })
                        : (e.onchange = n);
                });
            }
            (t.onclick = function (e) {
                e.target.hash && (e.preventDefault(), (location.hash = e.target.hash));
            }),
                document.forms[0].addEventListener(
                    "keydown",
                    function (e) {
                        if (
                            (e.stopPropagation(),
                            13 === e.which && (e.target.form_saved = !0),
                            !(e.repeat || !e.target.name || 0 !== e.target.name.indexOf("keys_") || e.ctrlKey || e.altKey || e.metaKey || e.which < 47))
                        ) {
                            e.preventDefault(), color_trans(e.target, null);
                            var t = {
                                    96: "0",
                                    97: "1",
                                    98: "2",
                                    99: "3",
                                    100: "4",
                                    101: "5",
                                    102: "6",
                                    103: "7",
                                    104: "8",
                                    105: "9",
                                    106: "*",
                                    107: "+",
                                    109: "-",
                                    110: ".",
                                    111: "/",
                                    173: "-",
                                    186: ";",
                                    187: "=",
                                    188: ",",
                                    189: "-",
                                    190: ".",
                                    191: "/",
                                    192: "`",
                                    219: "[",
                                    220: "\\",
                                    221: "]",
                                    222: "'",
                                    112: "F1",
                                    113: "F2",
                                    114: "F3",
                                    115: "F4",
                                    116: "F5",
                                    117: "F6",
                                    118: "F7",
                                    119: "F8",
                                    120: "F9",
                                    121: "F10",
                                    122: "F11",
                                    123: "F12",
                                },
                                n = t[e.which] || String.fromCharCode(e.which).toUpperCase(),
                                a = "-" === e.target.name[7] ? e.target.name.substr(5, 2) : null;
                            t = document.body.querySelectorAll('input[name^="keys_"]');
                            for (var o = 0; o < t.length; ++o)
                                if (t[o].value.toUpperCase() === n && (!a || "-" !== t[o].name[7] || t[o].name.substr(5, 2) === a))
                                    return e.target !== t[o] && color_trans(e.target, "red"), !1;
                            (e.target.value = n), document.forms[0].onchange(e);
                        }
                    },
                    !1
                ),
                document.forms[0].addEventListener(
                    "contextmenu",
                    function (e) {
                        e.stopPropagation();
                        var t = e.target;
                        t.classList.contains("checkbox") && (t = t.previousElementSibling),
                            t.name &&
                                -1 !== t.name.indexOf("_") &&
                                (e.ctrlKey
                                    ? (e.preventDefault(), setDefault(t), document.forms[0].onchange({ target: t }))
                                    : e.shiftKey &&
                                      t.name.indexOf("_") > -1 &&
                                      (e.preventDefault(),
                                      (e = {}),
                                      ((t = t.name.split("_"))[2] = JSON.parse(cfg[t[0]])),
                                      t[1] ? ((e[t[0]] = {}), (e[t[0]][t[1]] = t[2][t[1]])) : (e[t[0]] = t[2]),
                                      alert(JSON.stringify(e))));
                    },
                    !1
                ),
                (document.forms[0].onchange = function (e) {
                    e.stopPropagation && e.stopPropagation();
                    var t,
                        n = e.target;
                    n.form_saved
                        ? delete n.form_saved
                        : n.parentNode.dataset.form || n.parentNode.parentNode.dataset.form
                        ? (t = "default")
                        : n.name.indexOf("_") > 0 && (t = "def"),
                        t &&
                            (("checkbox" === n.type && n[t + "Checked"] !== n.checked) || ("checkbox" !== n.type && n[t + "Value"] != n.value)
                                ? (input_changes[n.name] = !0)
                                : delete input_changes[n.name],
                            ($("save_button").style.color = Object.keys(input_changes).length ? "#e03c00" : ""));
                });
            var a = $("reset_button");
            (a.reset = function () {
                delete a.pending, (a.style.color = "#000");
            }),
                a.addEventListener(
                    "click",
                    function (e) {
                        if (a.pending)
                            return (
                                e.ctrlKey
                                    ? (e.preventDefault(),
                                      setDefault((e = ["", "input,", "select,", "textarea"]).join((location.hash || "#settings") + "_sec ")),
                                      (e = "lime"))
                                    : (e = "green"),
                                clearTimeout(a.pending),
                                (a.pending = setTimeout(a.reset, 2e3)),
                                (a.style.color = e),
                                (a.nextElementSibling.style.color = "#e03c00"),
                                (input_changes.form_reset = !0),
                                void setTimeout(function () {
                                    [].forEach.call(document.querySelectorAll('output + input[type="range"]') || [], fill_output);
                                }, 15)
                            );
                        (a.style.color = "orange"), (a.pending = setTimeout(a.reset, 2e3)), e.preventDefault();
                    },
                    !1
                ),
                $("save_button").addEventListener(
                    "click",
                    function (e) {
                        e.preventDefault(), save(), color_trans(this, "green");
                    },
                    !1
                ),
                [].forEach.call(document.body.querySelectorAll(".action_buttons") || [], function (e) {
                    e.onmousedown = function (e) {
                        e.preventDefault();
                    };
                }),
                Port.listen(function (e) {
                    if (e && e.cfg) {
                        Port.listen(null), (cfg = e.cfg), load(), window.onhashchange();
                        var t = $("tls_advanced");
                        (t.onchange = function () {
                            document.body.classList[this.checked ? "add" : "remove"]("advanced");
                        }),
                            t.onchange(),
                            (document.body.style.display = "block");
                    }
                }),
                Port.send({ cmd: "cfg_get", keys: ["hz", "keys", "tls", "grants"] });

        $("allow_user_scripts").addEventListener("click", function (event) {
            event.preventDefault();
            chrome.tabs.create({ url: "chrome://extensions/?id=" + chrome.runtime.id + "#:~:text=Allow%20user%20scripts" });
        });

        checkUserScripts();
    },
    !1
);

async function checkUserScripts() {
    try {
        const scripts = await chrome.userScripts.getScripts();
        if (scripts?.length > 0) {
            $("allow_user_scripts_message").innerHTML = `Great! ${app.name} is working now!`;
            $("allow_user_scripts_message").style.backgroundColor = "#dcfad7";
            // $("allow_user_scripts_message").style.display = "none";
            return;
        } else {
            Port.send({ cmd: "loadScripts" });
            $("allow_user_scripts_message").style.display = "block";
        }
    } catch(e) {
        $("allow_user_scripts_message").style.display = "block";
    }

    setTimeout(checkUserScripts, 2000);
}
