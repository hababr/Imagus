"use strict";
{
    const e = window,
        t = document;
    if (t && t instanceof e.HTMLDocument != !1) {
        var imgDoc = t.images && 1 === t.images.length && t.images[0];
        if (!imgDoc || imgDoc.parentNode !== t.body || imgDoc.src !== e.location.href) {
            var mdownstart,
                winW,
                winH,
                topWinW,
                topWinH,
                flip = function (e, t) {
                    e.scale || (e.scale = { h: 1, v: 1 }),
                        (e.scale[t ? "h" : "v"] *= -1),
                        (t = 1 !== e.scale.h || 1 !== e.scale.v ? "scale(" + e.scale.h + "," + e.scale.v + ")" : ""),
                        e.curdeg && (t += " rotate(" + e.curdeg + "deg)"),
                        (e.style.transform = t);
                },
                pdsp = function (e, t, i) {
                    e && e.preventDefault && e.stopPropagation && ((void 0 !== t && !0 !== t) || e.preventDefault(), !1 !== i && e.stopImmediatePropagation());
                },
                imageSendTo = function (e) {
                    if (!(e.url || e.name || e.url) || (e.url && !/^http/.test(e.url))) alert("Invalid URL! (" + e.url.slice(0, e.url.indexOf(":") + 1));
                    else {
                        for (var t = 0, i = [], r = cfg.tls.sendToHosts; t < r.length; ++t)
                            (e.host === t || (void 0 === e.host && "+" === r[t][0][0])) &&
                                i.push(r[t][1].replace("%url", encodeURIComponent(e.url)).replace("%raw_url", e.url));
                        Port.send({ cmd: "open", url: i, nf: !!e.nf });
                    }
                },
                shortcut = {
                    specKeys: {
                        8: "Backspace",
                        9: "Tab",
                        13: "Enter",
                        16: "shift",
                        17: "ctrl",
                        18: "alt",
                        27: "Esc",
                        32: "Space",
                        33: "PgUp",
                        34: "PgDn",
                        35: "End",
                        36: "Home",
                        37: "Left",
                        38: "Up",
                        39: "Right",
                        40: "Down",
                        45: "Ins",
                        46: "Del",
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
                    isModifier: function (e) {
                        return e.which > 15 && e.which < 19;
                    },
                    key: function (e) {
                        return this.specKeys[e.which] || String.fromCharCode(e.which).toUpperCase();
                    },
                },
                checkBG = function (e) {
                    if (e && Array.isArray((e = e.match(/\burl\(([^'"\)][^\)]*|"[^"\\]+(?:\\.[^"\\]*)*|'[^'\\]+(?:\\.[^'\\]*)*)(?=['"]?\))/g)))) {
                        for (var t = e.length; t--; ) e[t] = e[t].slice(/'|"/.test(e[t][4]) ? 5 : 4);
                        return e;
                    }
                    return null;
                },
                checkIMG = function (e) {
                    var i = e.nodeName.toUpperCase();
                    return "IMG" === i || "image" === e.type || "EMBED" === i
                        ? e.src
                        : "CANVAS" === i
                        ? e.toDataURL()
                        : "OBJECT" === i && e.data
                        ? e.data
                        : "AREA" === i
                        ? t.querySelector('img[usemap="#' + e.parentNode.name + '"]').src
                        : "VIDEO" === i
                        ? (((i = t.createElement("canvas")).width = e.clientWidth),
                          (i.height = e.clientHeight),
                          i.getContext("2d").drawImage(e, 0, 0, i.width, i.height),
                          i.toDataURL("image/jpeg"))
                        : e.poster
                        ? e.poster
                        : null;
                },
                rgxHash = /#(?![?!].).*/,
                rgxIsSVG = /\.svgz?$/i,
                viewportDimensions = function (e) {
                    var i = e || t,
                        r = (i = ("BackCompat" === i.compatMode && i.body) || i.documentElement).clientWidth,
                        a = i.clientHeight;
                    if (e) return { width: r, height: a };
                    (r === winW && a === winH) || ((winW = r), (winH = a), (topWinW = r), (topWinH = a));
                },
                releaseFreeze = function (e) {
                    if ("number" != typeof PVI.freeze)
                        if ("mouseup" !== e.type) PVI.keyup_freeze_on && PVI.keyup_freeze();
                        else {
                            if (e.target !== PVI.CNT || PVI.fullZm || 0 !== e.button) return;
                            if (e.ctrlKey || e.shiftKey || e.altKey) return;
                            if (PVI.md_x !== e.clientX || PVI.md_y !== e.clientY) return;
                            PVI.reset(!0);
                        }
                    else PVI.freeze = !cfg.hz.deactivate;
                },
                onMouseDown = function (i) {
                    if (cfg && i.isTrusted) {
                        var r = t.compatMode && "B" === t.compatMode[0] ? t.body : t.documentElement;
                        if (!(i.clientX >= r.clientWidth || i.clientY >= r.clientHeight)) {
                            if (((r = 2 === i.button && PVI.freeze && void 0 !== PVI.SRC && !cfg.hz.deactivate), PVI.fireHide && PVI.state < 3 && !r))
                                return PVI.m_over({ relatedTarget: PVI.TRG }), void ((PVI.freeze && !PVI.lastScrollTRG) || (PVI.freeze = 1));
                            if (0 === i.button) {
                                if (PVI.fullZm) {
                                    if (((mdownstart = !0), i.ctrlKey || 2 !== PVI.fullZm)) return;
                                    return pdsp(i), (PVI.fullZm = 3), void e.addEventListener("mouseup", PVI.fzDragEnd, !0);
                                }
                                return i.target === PVI.CNT
                                    ? ((PVI.md_x = i.clientX), void (PVI.md_y = i.clientY))
                                    : (PVI.fireHide && PVI.m_over({ relatedTarget: PVI.TRG, clientX: i.clientX, clientY: i.clientY }),
                                      void ((PVI.freeze && !PVI.lastScrollTRG) || (PVI.freeze = 1)));
                            }
                            2 === i.button &&
                                ("m2" === cfg.hz.actTrigger
                                    ? (PVI.fireHide && r && (PVI.SRC = { m2: null === PVI.SRC ? PVI.TRG.IMGS_c_resolved : PVI.SRC.m2 || PVI.SRC }),
                                      (PVI.freeze = cfg.hz.deactivate))
                                    : PVI.keyup_freeze_on && (PVI.keyup_freeze(), (PVI.freeze = PVI.freeze ? 1 : 0)),
                                (mdownstart = i.timeStamp),
                                (PVI.md_x = i.clientX),
                                (PVI.md_y = i.clientY),
                                (i.target.href || ((r = i.target.parentNode) && r.href)) && i.preventDefault());
                        }
                    }
                },
                onContextMenu = function (t) {
                    if (!mdownstart || 2 !== t.button || PVI.md_x !== t.clientX || PVI.md_y !== t.clientY)
                        return (
                            mdownstart && (mdownstart = null),
                            void (
                                2 === t.button &&
                                (!PVI.fireHide || PVI.state > 2) &&
                                (Math.abs(PVI.md_x - t.clientX) > 5 || Math.abs(PVI.md_y - t.clientY) > 5) &&
                                "m2" === cfg.hz.actTrigger &&
                                !cfg.hz.deactivate &&
                                pdsp(t)
                            )
                        );
                    var i,
                        r = t.timeStamp - mdownstart >= 300;
                    if (((mdownstart = null), (i = PVI.state > 2 && ((r && 2 === cfg.hz.fzOnPress) || (!r && !PVI.fullZm && 1 === cfg.hz.fzOnPress)))))
                        PVI.key_action({ which: 13, shiftKey: !!PVI.fullZm || t.shiftKey });
                    else if ((i = PVI.state < 3 && PVI.SRC && void 0 !== PVI.SRC.m2)) {
                        if (r) return;
                        PVI.load(PVI.SRC.m2), (PVI.SRC = void 0);
                    } else if (r && PVI.state > 2 && !PVI.fullZm && 1 === cfg.hz.fzOnPress) return;
                    i
                        ? pdsp(t)
                        : t.target === PVI.CNT
                        ? pdsp(t, !1)
                        : t.ctrlKey &&
                          !r &&
                          !t.shiftKey &&
                          !t.altKey &&
                          cfg.tls.opzoom &&
                          PVI.state < 2 &&
                          (i = checkIMG(t.target) || checkBG(e.getComputedStyle(t.target).backgroundImage)) &&
                          ((PVI.TRG = PVI.nodeToReset = t.target),
                          (PVI.fireHide = !0),
                          (PVI.x = t.clientX),
                          (PVI.y = t.clientY),
                          PVI.set(Array.isArray(i) ? i[0] : i),
                          pdsp(t));
                },
                PVI = {
                    TRG: null,
                    DIV: null,
                    IMG: null,
                    CAP: null,
                    HLP: t.createElement("a"),
                    anim: {},
                    stack: {},
                    timers: {},
                    resolving: [],
                    lastTRGStyle: { cursor: null, outline: null },
                    iFrame: !1,
                    state: null,
                    rgxHTTPs: /^https?:\/\/(?:www\.)?/,
                    pageProtocol: e.location.protocol.replace(/^(?!https?:).+/, "http:"),
                    palette: {
                        load: "rgb(255, 255, 255)",
                        R_load: "rgb(255, 204, 204)",
                        res: "rgb(222, 255, 205)",
                        R_res: "rgb(255, 234, 128)",
                        R_js: "rgb(200, 200, 200)",
                        pile_fg: "#000",
                        pile_bg: "rgb(255, 255, 0)",
                    },
                    convertSieveRegexes: function () {
                        var e,
                            t = cfg.sieve;
                        if (Array.isArray(t) && (e = t.length) && "string" == typeof (t[0].link || t[0].img))
                            for (; e--; )
                                t[e].link && (t[e].link = RegExp(t[e].link, t[e].ci && 1 & t[e].ci ? "i" : "")),
                                    t[e].img && (t[e].img = RegExp(t[e].img, t[e].ci && 2 & t[e].ci ? "i" : ""));
                    },
                    create: function () {
                        if (!PVI.DIV) {
                            var i, r, a, n;
                            (PVI.HLP = t.createElement("a")),
                                (PVI.DIV = t.createElement("div")),
                                (PVI.VID = t.createElement("video")),
                                (PVI.IMG = t.createElement("img")),
                                (PVI.LDR = PVI.IMG.cloneNode(!1)),
                                (PVI.CNT = PVI.IMG),
                                (PVI.DIV.IMGS_ =
                                    PVI.DIV.IMGS_c =
                                    PVI.LDR.IMGS_ =
                                    PVI.LDR.IMGS_c =
                                    PVI.VID.IMGS_ =
                                    PVI.VID.IMGS_c =
                                    PVI.IMG.IMGS_ =
                                    PVI.IMG.IMGS_c =
                                        !0),
                                (PVI.DIV.style.cssText =
                                    "margin: 0; padding: 0; " +
                                    (cfg.hz.css || "") +
                                    "; visibility: visible; cursor: default; display: none; z-index: 2147483647; position: fixed !important; box-sizing: content-box !important; left: auto; top: auto; right: auto; bottom: auto; width: auto; height: auto; max-width: none !important; max-height: none !important; "),
                                (PVI.DIV.curdeg = 0),
                                (PVI.LDR.wh = [35, 35]);
                            var l = function () {
                                this.removeEventListener("load", l, !1), (l = null);
                                var e = this.style;
                                this.wh = [
                                    e.width ? parseInt(e.width, 10) : this.naturalWidth || this.wh[0],
                                    e.height ? parseInt(e.height, 10) : this.naturalHeight || this.wh[1],
                                ];
                            };
                            for (a in (PVI.LDR.addEventListener("load", l, !1),
                            (PVI.LDR.alt = ""),
                            (PVI.LDR.draggable = !1),
                            (PVI.LDR.style.cssText =
                                (cfg.hz.LDRcss ||
                                    "padding: 5px; border-radius: 50% !important; box-shadow: 0px 0px 5px 1px #a6a6a6 !important; background-clip: padding-box; width: 38px; height: 38px") +
                                "; position: fixed !important; z-index: 2147483647; display: none; left: auto; top: auto; right: auto; bottom: auto; margin: 0; box-sizing: border-box !important; " +
                                (cfg.hz.LDRanimate ? "transition: background-color .5s, opacity .2s ease, top .15s ease-out, left .15s ease-out" : "")),
                            (PVI.LDR.src =
                                cfg.hz.LDRsrc ||
                                "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOng9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBub25lIj48Zz48cGF0aCBpZD0icCIgZD0iTTMzIDQyYTEgMSAwIDAgMSA1NS0yMCAzNiAzNiAwIDAgMC01NSAyMCIvPjx1c2UgeDpocmVmPSIjcCIgdHJhbnNmb3JtPSJyb3RhdGUoNzIgNTAgNTApIi8+PHVzZSB4OmhyZWY9IiNwIiB0cmFuc2Zvcm09InJvdGF0ZSgxNDQgNTAgNTApIi8+PHVzZSB4OmhyZWY9IiNwIiB0cmFuc2Zvcm09InJvdGF0ZSgyMTYgNTAgNTApIi8+PHVzZSB4OmhyZWY9IiNwIiB0cmFuc2Zvcm09InJvdGF0ZSgyODggNTAgNTApIi8+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIHZhbHVlcz0iMzYwIDUwIDUwOzAgNTAgNTAiIGR1cj0iMS44cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48L2c+PC9zdmc+"),
                            (i =
                                "display: none; visibility: inherit !important; background: none; position: relative; width: 100%; height: 100%; max-width: inherit; max-height: inherit; margin: 0; padding: 0; border: 0; "),
                            (PVI.IMG.alt = ""),
                            (PVI.IMG.style.cssText = i + "; image-orientation: initial !important"),
                            PVI.IMG.addEventListener("error", PVI.content_onerror),
                            PVI.DIV.appendChild(PVI.IMG),
                            (PVI.VID.volume = cfg.hz.mediaVolume / 100),
                            (PVI.VID.autoplay = !0),
                            (PVI.VID.style.cssText = i + "box-shadow: 0 0 0 1px #f16529"),
                            PVI.VID.addEventListener("loadeddata", PVI.content_onready),
                            PVI.VID.addEventListener("error", PVI.content_onerror, !0),
                            PVI.DIV.appendChild(PVI.VID),
                            (cfg.hz.thumbAsBG || cfg.hz.history) &&
                                (PVI.IMG.addEventListener("load", PVI.content_onload), PVI.VID.addEventListener("canplay", PVI.content_onload)),
                            cfg.hz.hideIdleCursor >= 50
                                ? ((PVI.DIV.cursor_hide = function () {
                                      (PVI.CNT.style.cursor = "none"), (PVI.timers.cursor_hide = null);
                                  }),
                                  PVI.DIV.addEventListener("mousemove", function (e) {
                                      e.target !== PVI.CNT || (PVI.CNT === PVI.VID && PVI.VID.clientHeight - 35 < (e.offsetY || e.layerY || 0))
                                          ? clearTimeout(PVI.timers.cursor_hide)
                                          : (PVI.timers.cursor_hide ? clearTimeout(PVI.timers.cursor_hide) : (PVI.CNT.style.cursor = ""),
                                            (PVI.timers.cursor_hide = setTimeout(PVI.DIV.cursor_hide, cfg.hz.hideIdleCursor)));
                                  }),
                                  PVI.DIV.addEventListener(
                                      "mouseout",
                                      function (e) {
                                          e.target === PVI.CNT && (clearTimeout(PVI.timers.cursor_hide), (PVI.CNT.style.cursor = ""));
                                      },
                                      !1
                                  ))
                                : cfg.hz.hideIdleCursor >= 0 && (PVI.IMG.style.cursor = "none"),
                            PVI.DIV.addEventListener(
                                "dragstart",
                                function (e) {
                                    pdsp(e, !1);
                                },
                                !0
                            ),
                            (i = t.documentElement).appendChild(PVI.DIV),
                            i.appendChild(PVI.LDR),
                            (PVI.DBOX = {}),
                            (i = e.getComputedStyle(PVI.DIV)),
                            (r = {
                                mt: "marginTop",
                                mr: "marginRight",
                                mb: "marginBottom",
                                ml: "marginLeft",
                                bt: "borderTopWidth",
                                br: "borderRightWidth",
                                bb: "borderBottomWidth",
                                bl: "borderLeftWidth",
                                pt: "paddingTop",
                                pr: "paddingRight",
                                pb: "paddingBottom",
                                pl: "paddingLeft",
                            })))
                                "m" === a[0] && (PVI.DBOX[a] = parseInt(i[r[a]], 10)),
                                    ("t" !== a[1] && "b" !== a[1]) ||
                                        ((n = a[1] + ("p" === a[0] ? "p" : "bm")), (PVI.DBOX[n] = (PVI.DBOX[n] || 0) + parseInt(i[r[a]], 10))),
                                    (n = ("l" === a[1] || "r" === a[1] ? "w" : "h") + ("m" === a[0] ? "m" : "pb")),
                                    (PVI.DBOX[n] = (PVI.DBOX[n] || 0) + parseInt(i[r[a]], 10));
                            (PVI.anim = {
                                maxDelay: 0,
                                opacityTransition: function () {
                                    PVI.BOX.style.opacity = PVI.BOX.opacity || "1";
                                },
                            }),
                                i[(r = "transition") + "Property"] &&
                                    ((n = /,\s*/),
                                    (n = [i[r + "Property"].split(n), i[r + "Duration"].replace(/initial/g, "0s").split(n)]),
                                    (PVI.anim.css = i[r] || PVI.DIV.style[r]),
                                    ["opacity", "left", "top", "width", "height"].forEach(function (e) {
                                        var t = n[0].indexOf(e),
                                            r = 1e3 * parseFloat(n[1][t]);
                                        r > 0 &&
                                            t > -1 &&
                                            ((PVI.anim[e] = r),
                                            r > PVI.anim.maxDelay && (PVI.anim.maxDelay = r),
                                            "opacity" === e && i.opacity && (PVI.DIV.opacity = "" + Math.max(0.01, i.opacity)));
                                    })),
                                (cfg.hz.capText || cfg.hz.capWH) && PVI.createCAP(),
                                t.querySelector("embed, object") &&
                                    (PVI.DIV.insertBefore(t.createElement("iframe"), PVI.DIV.firstElementChild),
                                    (PVI.DIV.firstChild.style.cssText =
                                        "z-index: -1; width: 100%; height: 100%; position: absolute; left: 0; top: 0; border: 0")),
                                PVI.reset();
                        }
                    },
                    createCAP: function () {
                        if (!PVI.CAP) {
                            (PVI.CAP = t.createElement("div")),
                                buildNodes(PVI.CAP, [
                                    { tag: "b", attrs: { style: "display: none; transition: background-color .1s; border-radius: 3px; padding: 0 2px" } },
                                    " ",
                                    { tag: "b", attrs: { style: "display: " + (cfg.hz.capWH ? "inline-block" : "none") } },
                                    " ",
                                    { tag: "span", attrs: { style: "color: inherit; display: " + (cfg.hz.capText ? "inline-block" : "none") } },
                                ]);
                            var e = PVI.CAP.firstElementChild;
                            do {
                                e.IMGS_ = e.IMGS_c = !0;
                            } while ((e = e.nextElementSibling));
                            (PVI.CAP.IMGS_ = PVI.CAP.IMGS_c = !0),
                                PVI.create(),
                                (e = cfg.hz.capStyle),
                                (PVI.palette.wh_fg = e ? "rgb(100, 0, 0)" : "rgb(204, 238, 255)"),
                                (PVI.palette.wh_fg_hd = e ? "rgb(255, 0, 0)" : "rgb(120, 210, 255)"),
                                (PVI.CAP.style.cssText =
                                    "left:0; right:auto; display:block; cursor:default; position:absolute; width:auto; height:auto; border:0; white-space: " +
                                    (cfg.hz.capWrapByDef ? "pre-line" : "nowrap") +
                                    '; font:13px/1.4em "Trebuchet MS",sans-serif; background:rgba(' +
                                    (e ? "255,255,255,.95" : "0,0,0,.75") +
                                    ") !important; color:#" +
                                    (e ? "000" : "fff") +
                                    " !important; box-shadow: 0 0 1px #" +
                                    (e ? "666" : "ddd") +
                                    " inset; padding:0 4px; border-radius: 3px"),
                                (e = cfg.hz.capPos ? "bottom" : "top"),
                                (PVI.CAP.overhead = Math.max(-18, Math.min(0, PVI.DBOX[e[0] + "p"] - 18))),
                                (PVI.CAP.style[e] = PVI.CAP.overhead + "px"),
                                (PVI.CAP.overhead = Math.max(0, -PVI.CAP.overhead - PVI.DBOX[e[0] + "bm"])),
                                PVI.DIV.appendChild(PVI.CAP);
                        }
                    },
                    prepareCaption: function (e, t) {
                        t && "string" == typeof t
                            ? ((PVI.HLP.innerHTML = t.replace(/<[^>]+>/g, "").replace(/</g, "&lt;")),
                              (e.IMGS_caption = PVI.HLP.textContent.trim().replace(/[\n\r]+/g, " ")),
                              (PVI.HLP.textContent = ""))
                            : (e.IMGS_caption = "");
                    },
                    flash_caption: function () {
                        (PVI.timers.pileflicker = 0), (PVI.timers.pile_flash = setInterval(PVI.flick_caption, 150));
                    },
                    flick_caption: function () {
                        if (PVI.timers.pileflicker++ >= 2 * cfg.hz.capFlashCount)
                            return (PVI.timers.pileflicker = null), void clearInterval(PVI.timers.pile_flash);
                        var e = PVI.CAP.firstChild.style;
                        e.backgroundColor = e.backgroundColor === PVI.palette.pile_bg ? "red" : PVI.palette.pile_bg;
                    },
                    updateCaption: function () {
                        var e,
                            t = PVI.CAP;
                        t &&
                            0 !== t.state &&
                            "none" === t.style.display &&
                            (PVI.TRG.IMGS_album &&
                                "none" === t.firstChild.style.display &&
                                (e = PVI.stack[PVI.TRG.IMGS_album]) &&
                                e[2] &&
                                (((e = t.firstChild.style).color = PVI.palette.pile_fg),
                                (e.backgroundColor = PVI.palette.pile_bg),
                                (e.display = "inline-block"),
                                cfg.hz.capFlashCount &&
                                    (cfg.hz.capFlashCount > 5 && (cfg.hz.capFlashCount = 5),
                                    clearTimeout(PVI.timers.pile_flash),
                                    (PVI.timers.pile_flash = setTimeout(PVI.flash_caption, PVI.anim.maxDelay)))),
                            PVI.CNT !== PVI.IFR &&
                                ((e = t.children[1]),
                                cfg.hz.capWH || 2 === t.state
                                    ? ((e.style.display = "inline-block"),
                                      (e.style.color = PVI.palette[!1 === PVI.TRG.IMGS_HD ? "wh_fg_hd" : "wh_fg"]),
                                      (e.textContent = (PVI.TRG.IMGS_SVG ? PVI.stack[PVI.IMG.src] : [PVI.CNT.naturalWidth, PVI.CNT.naturalHeight]).join("×")))
                                    : (e.style.display = "none")),
                            (e = t.lastChild),
                            cfg.hz.capText || 2 === t.state
                                ? ((e.textContent = PVI.TRG.IMGS_caption || ""), (e.style.display = "inline"))
                                : (e.style.display = "none"),
                            (t.style.display = PVI.DIV.curdeg % 360 ? "none" : "block"));
                    },
                    attrObserver: function (e, t, i) {
                        if (t) {
                            var r = e.style.backgroundImage;
                            if ((!r || -1 !== i.indexOf(r.slice(5, -2))) && i && -1 === i.indexOf("opacity") && -1 === e.style.cssText.indexOf("opacity"))
                                return;
                        }
                        PVI.resetNode(e);
                    },
                    onAttrChange: function (e) {
                        if (1 === e.attrChange) {
                            var t = e.target;
                            switch (e.attrName) {
                                case "style":
                                    var i = t.style.backgroundImage;
                                    if (
                                        (!i || -1 !== e.prevValue.indexOf(i.slice(5, -2))) &&
                                        -1 === e.prevValue.indexOf("opacity") &&
                                        -1 === t.style.cssText.indexOf("opacity")
                                    )
                                        return;
                                case "href":
                                case "src":
                                case "title":
                                case "alt":
                                    t === PVI.TRG ? (PVI.nodeToReset = t) : PVI.resetNode(t);
                            }
                            e.stopPropagation();
                        }
                    },
                    listen_attr_changes: function (e) {
                        PVI.mutObserver?.observe(e, PVI.mutObserverConf);
                    },
                    resetNode: function (e, t) {
                        if (
                            (delete e.IMGS_c,
                            delete e.IMGS_c_resolved,
                            delete e.IMGS_thumb,
                            delete e.IMGS_thumb_ok,
                            delete e.IMGS_SVG,
                            delete e.IMGS_HD,
                            delete e.IMGS_HD_stack,
                            delete e.IMGS_fallback_zoom,
                            t || delete e.IMGS_album,
                            "a" === e.localName)
                        ) {
                            var i = e.querySelectorAll('img[src], :not(img)[style*="background-image"],b, i, u, strong, em, span, div');
                            i.length &&
                                [].forEach.call(i, function (e) {
                                    e.IMGS_c && PVI.resetNode(e);
                                });
                        }
                    },
                    getImages: function (t) {
                        var i,
                            r,
                            a = t && t instanceof e.HTMLElement;
                        return (
                            a &&
                                (t.childElementCount > 0 && t.childElementCount < 3
                                    ? ((i = t.firstElementChild).childElementCount &&
                                          i.childElementCount < 4 &&
                                          ("img" === i.firstElementChild.localName
                                              ? (i = i.firstElementChild)
                                              : "img" === i.lastElementChild.localName && (i = i.lastElementChild)),
                                      i.src &&
                                          !/\S/.test(t.textContent) &&
                                          t.offsetWidth - i.offsetWidth < 25 &&
                                          t.offsetHeight - i.offsetHeight < 25 &&
                                          (t = i))
                                    : !t.childElementCount &&
                                      t.parentNode.childElementCount <= 5 &&
                                      ("img" === t.localName
                                          ? 0 === t.src.lastIndexOf("data:", 0) || t.naturalWidth < 3 || t.naturalHeight < 3 || "0" === t.style.opacity
                                          : !/\S/.test(t.textContent)) &&
                                      "u" !== t.style.backgroundImage[0] &&
                                      [(r = t.previousElementSibling) && r.previousElementSibling, r, t.nextElementSibling].some(function (e) {
                                          if (
                                              e &&
                                              "img" === e.localName &&
                                              e.offsetParent === t.offsetParent &&
                                              Math.abs(e.offsetLeft - t.offsetLeft) <= 10 &&
                                              Math.abs(e.offsetTop - t.offsetTop) <= 10 &&
                                              Math.abs(e.clientWidth - t.clientWidth) <= 30 &&
                                              Math.abs(e.clientHeight - t.clientHeight) <= 30
                                          )
                                              return (t = e), !0;
                                      })),
                            t.clientWidth > 0.7 * topWinW && t.clientHeight > 0.7 * topWinH
                                ? null
                                : ((i = { imgSRC_o: t.currentSrc || t.src || t.data || null }).imgSRC_o ||
                                      "image" !== t.localName ||
                                      ((i.imgSRC_o = t.getAttributeNS("http://www.w3.org/1999/xlink", "href")),
                                      i.imgSRC_o ? (i.imgSRC_o = PVI.normalizeURL(i.imgSRC_o)) : delete i.imgSRC_o),
                                  i.imgSRC_o &&
                                      (a
                                          ? ((t.naturalWidth > 0 && t.naturalWidth < 3) || (t.naturalHeight > 0 && t.naturalHeight < 3)) && (i.imgSRC_o = null)
                                          : (i.imgSRC_o = PVI.normalizeURL(i.imgSRC_o)),
                                      i.imgSRC_o && (i.imgSRC = i.imgSRC_o.replace(PVI.rgxHTTPs, ""))),
                                  a
                                      ? ("u" === t.style.backgroundImage[0]
                                            ? (i.imgBG_o = t.style.backgroundImage)
                                            : t.parentNode &&
                                              (r = t.parentNode).offsetParent === t.offsetParent &&
                                              r.style &&
                                              "u" === r.style.backgroundImage[0] &&
                                              Math.abs(r.offsetLeft - t.offsetLeft) <= 10 &&
                                              Math.abs(r.offsetTop - t.offsetTop) <= 10 &&
                                              Math.abs(r.clientWidth - t.clientWidth) <= 30 &&
                                              Math.abs(r.clientHeight - t.clientHeight) <= 30 &&
                                              (i.imgBG_o = r.style.backgroundImage),
                                        i.imgBG_o
                                            ? ((i.imgBG_o = i.imgBG_o.match(
                                                  /\burl\(([^'"\)][^\)]*|"[^"\\]+(?:\\.[^"\\]*)*|'[^'\\]+(?:\\.[^'\\]*)*)(?=['"]?\))/g
                                              )),
                                              i.imgBG_o && 1 === i.imgBG_o.length
                                                  ? ((t = i.imgBG_o[0]),
                                                    (i.imgBG_o = PVI.normalizeURL(t.slice(/'|"/.test(t[4]) ? 5 : 4))),
                                                    (i.imgBG = i.imgBG_o.replace(PVI.rgxHTTPs, "")),
                                                    i)
                                                  : i.imgSRC
                                                  ? i
                                                  : null)
                                            : i.imgSRC
                                            ? i
                                            : null)
                                      : i.imgSRC
                                      ? i
                                      : null)
                        );
                    },
                    _replace: function (e, t, i, r, a, n) {
                        var l, I;
                        "function" == typeof a && (PVI.node = n);
                        var o = a ? t.replace(e[r], a) : t;
                        if ("function" == typeof a) {
                            if ("" === o) return 2;
                            if ("null" === o) return null;
                            if (o.indexOf("\n", 7) > -1) {
                                var s = t.replace(e[r], "\r").split("\r");
                                for (o = o.trim().split(/[\n\r]+/g), l = [], I = 0; I < o.length; ++I)
                                    I > 0 && (o[I] = s[0] + o[I]),
                                        I !== o.length - 1 && (o[I] += s[1]),
                                        (o[I] = PVI._replace(e, o[I], i, r, "", n)),
                                        Array.isArray(o[I]) ? (l = l.concat(o[I])) : l.push(o[I]);
                                return l.length > 1 ? l : l[0];
                            }
                        }
                        if (
                            (e.dc && (("link" === r && 2 !== e.dc) || ("img" === r && e.dc > 1)) && (o = decodeURIComponent(decodeURIComponent(o))),
                            "#" === a[0] && "#" !== o[0] && (o = "#" + o.replace("#", "")),
                            (l = (o = PVI.httpPrepend(o, i)).indexOf("#", 1)) > 1 && (l = [l, o.indexOf("#", l + 1)])[1] > 1
                                ? ((l = o.slice(l[0], l[1] + 1)), (o = o.split(l).join("#")), (l = l.slice(1, -1).split(/ |%20/)))
                                : (l = !1),
                            l)
                        ) {
                            for ("#" === o[0] ? ((o = o.slice(1)), (t = "#")) : (t = ""), I = 0; I < l.length; ++I) l[I] = t + o.replace("#", l[I]);
                            o = l.length > 1 ? l : l[0];
                        }
                        return o;
                    },
                    replace: function (e, t, i, r, a) {
                        var n, l, I;
                        if (!1 === PVI.toFunction(e, "to")) return 1;
                        if ((a.IMGS_TRG && (a = a.IMGS_TRG), (i = i.slice(0, i.length - t.length)), Array.isArray(e.to)))
                            for (n = [], l = 0; l < e.to.length; ++l)
                                (I = PVI._replace(e, t, i, r, e.to[l], a)), Array.isArray(I) ? (n = n.concat(I)) : n.push(I);
                        else n = e.to ? PVI._replace(e, t, i, r, e.to, a) : PVI.httpPrepend(t, i);
                        return n;
                    },
                    toFunction: function (e, t, i) {
                        if ("function" != typeof e[t] && (i ? /^:\s*\S/ : /^:\n\s*\S/).test(e[t]))
                            try {
                                e[t] = Function("var $ = arguments; " + (i ? "return " : "") + e[t].slice(1)).bind(PVI);
                            } catch (e) {
                                return console.error(cfg.app?.name + ": " + t + " - " + e.message), !1;
                            }
                    },
                    httpPrepend: function (e, t) {
                        return (
                            t && (e = e.replace(/^(?!#?(?:https?:|\/\/|data:)|$)(#?)/, "$1" + t)),
                            "/" === e[1] &&
                                ("/" === e[0] ? (e = PVI.pageProtocol + e) : "#" === e[0] && "/" === e[2] && (e = "#" + PVI.pageProtocol + e.slice(1))),
                            e
                        );
                    },
                    normalizeURL: function (e) {
                        return "/" === e[1] && "/" === e[0] && (e = PVI.pageProtocol + e), (PVI.HLP.href = e), PVI.HLP.href;
                    },
                    resolve: function (e, t, i, r) {
                        if (!i || i.IMGS_c) return !1;
                        if (i.IMGS_c_resolved && "string" != typeof i.IMGS_c_resolved.URL) return !1;
                        if (((e = e.replace(rgxHash, "")), PVI.stack[e])) return (i.IMGS_album = e), (e = PVI.stack[e])[e[0]][0];
                        var a, n;
                        if (t.rule) t = (a = t).rule;
                        else {
                            for (a = {}, n = 0; n < t.$.length; ) a[n] = t.$[n++];
                            (a.length = t.$.length), delete t.$, (a.rule = t);
                        }
                        if (1 === cfg.sieve[t.id].res) t.req_res = !0;
                        else if (t.skip_resolve) {
                            if ("function" == typeof cfg.sieve[t.id].res)
                                return (a.url = [e]), PVI.onMessage({ cmd: "resolved", id: -1, m: !1, return_url: !0, params: a });
                            delete t.skip_resolve;
                        }
                        return (
                            !cfg.hz.waitHide &&
                                ((PVI.fireHide && PVI.state > 2) || 2 === PVI.state || (PVI.hideTime && Date.now() - PVI.hideTime < 200)) &&
                                (r = !0),
                            PVI.resolve_delay || clearTimeout(PVI.timers.resolver),
                            (i.IMGS_c_resolved = { URL: e, params: a }),
                            (PVI.timers.resolver = setTimeout(function () {
                                (PVI.timers.resolver = null), Port.send({ cmd: "resolve", url: e, params: a, id: PVI.resolving.push(i) - 1 });
                            }, PVI.resolve_delay || (r ? 50 : Math.max(50, cfg.hz.delay)))),
                            null
                        );
                    },
                    find: function (i, r, a) {
                        var n,
                            l,
                            I,
                            o,
                            s,
                            V,
                            P = 0,
                            c = i,
                            d = !1;
                        do {
                            if (void 0 !== c.nodeType) {
                                if (1 !== c.nodeType || c === t.body) break;
                                if ("a" !== c.localName) continue;
                            }
                            if (!c.href) {
                                "" === c.href && PVI.listen_attr_changes(c);
                                break;
                            }
                            if (c instanceof e.HTMLElement) {
                                if (c.childElementCount && c.querySelector("iframe, object, embed")) break;
                                if ("number" == typeof r && "number" == typeof a)
                                    for (s = t.elementsFromPoint(r, a), P = 0; P < 5 && s[P] !== t.body; ++P)
                                        if (s[P].currentSrc || 0 === s[P].style.backgroundImage.lastIndexOf("url(", 0)) {
                                            var f = s[P].getBoundingClientRect();
                                            if (r >= f.left && r < f.right && a >= f.top && a < f.bottom) {
                                                var m = i.getBoundingClientRect();
                                                m.left - 10 <= f.left &&
                                                    m.right + 10 >= f.right &&
                                                    m.top - 10 <= f.top &&
                                                    m.bottom + 10 >= f.bottom &&
                                                    (I = PVI.getImages(s[P], !0));
                                            }
                                            break;
                                        }
                                s && (s = null), (V = c);
                            } else {
                                if (c.getAttributeNS) {
                                    if (!(s = c.getAttributeNS("http://www.w3.org/1999/xlink", "href"))) continue;
                                    c = { href: s };
                                }
                                c.href = PVI.normalizeURL(c.href);
                            }
                            if (((n = c.href.replace(PVI.rgxHTTPs, "")), I && (n === I.imgSRC || n === I.imgBG))) break;
                            for (P = 0; (l = cfg.sieve[P]); ++P) {
                                if (!l.link || !l.link.test(n)) {
                                    if (!l.img) continue;
                                    if (!(s = l.img.test(n))) continue;
                                    o = !0;
                                }
                                if (l.useimg && l.img && (I || (I = PVI.getImages(i)), I)) {
                                    if (I.imgSRC && l.img.test(I.imgSRC)) {
                                        o = [P, !1];
                                        break;
                                    }
                                    if (I.imgBG && (o = l.img.test(I.imgBG))) {
                                        o = [P, o];
                                        break;
                                    }
                                }
                                if (l.res && (!s || (!l.to && l.url))) {
                                    if (e.location.href.replace(rgxHash, "") === c.href.replace(rgxHash, "")) break;
                                    if (!1 === PVI.toFunction(l, "url", !0)) return 1;
                                    "function" == typeof l.url && (PVI.node = i),
                                        (d = l.url ? n.replace(l[s ? "img" : "link"], l.url) : n),
                                        (d = PVI.resolve(
                                            PVI.httpPrepend(d || n, c.href.slice(0, c.href.length - n.length)),
                                            {
                                                id: P,
                                                $: [c.href].concat((n.match(l[s ? "img" : "link"]) || []).slice(1)),
                                                loop_param: s ? "img" : "link",
                                                skip_resolve: "" === d,
                                            },
                                            i.IMGS_TRG || i
                                        ));
                                } else d = PVI.replace(l, n, c.href, s ? "img" : "link", i);
                                if (1 === d) return 1;
                                2 === d && (d = !1),
                                    "string" == typeof d &&
                                        c !== i &&
                                        i.hasAttribute("src") &&
                                        i.src.replace(/^https?:\/\//, "") === d.replace(/^#?(https?:)?\/\//, "") &&
                                        (d = !1);
                                break;
                            }
                            break;
                        } while (++P < 5 && (c = c.parentNode));
                        if (!d && null !== d && (I = PVI.getImages(i) || I) && (I.imgSRC || I.imgBG))
                            for ("object" == typeof o ? ((P = o[0]), (o[0] = !0)) : ((P = 0), (o = [])); (l = cfg.sieve[P]); ++P)
                                if (o[0] || (l.img && ((I.imgSRC && l.img.test(I.imgSRC)) || (I.imgBG && (o[1] = l.img.test(I.imgBG)))))) {
                                    if (
                                        (!o[1] && I.imgSRC ? ((o = 1), (n = I.imgSRC), (I = I.imgSRC_o)) : ((o = 2), (n = I.imgBG), (I = I.imgBG_o)),
                                        !l.to && l.res && l.url)
                                    ) {
                                        if (!1 === PVI.toFunction(l, "url", !0)) return 1;
                                        "function" == typeof l.url && (PVI.node = i),
                                            (d = n.replace(l.img, l.url)),
                                            (d = PVI.resolve(
                                                PVI.httpPrepend(d, I.slice(0, I.length - n.length)),
                                                { id: P, $: [I].concat((n.match(l.img) || []).slice(1)), loop_param: "img", skip_resolve: "" === d },
                                                i.IMGS_TRG || i
                                            ));
                                    } else d = PVI.replace(l, n, I, "img", i);
                                    if (1 === d) return 1;
                                    if (2 === d) return !1;
                                    1 === i.nodeType && ((V = i), cfg.hz.history && (i.IMGS_nohistory = !0));
                                    break;
                                }
                        if (l && l.loop && "string" == typeof d && l.loop & (o ? 2 : 1)) {
                            if ((1 !== i.nodeType && d === i.href) || i.IMGS_loop_count > 5) return !1;
                            (l = d),
                                (d = PVI.find({ href: d, IMGS_TRG: i.IMGS_TRG || i, IMGS_loop_count: 1 + (i.IMGS_loop_count || 0) }))
                                    ? (d = Array.isArray(d) ? d.concat(l) : [d, l])
                                    : null !== d && (d = l);
                        }
                        if ((!0 === s && (i.IMGS_fallback_zoom = c.href), d && ("string" == typeof d || Array.isArray(d)))) {
                            for (
                                n = /^https?:\/\//,
                                    n = [
                                        c && c.href && c.href.replace(n, ""),
                                        1 === i.nodeType && i.src && i.hasAttribute("src") && (i.currentSrc || i.src).replace(n, ""),
                                    ],
                                    "string" == typeof d && (d = [d]),
                                    P = 0;
                                P < d.length;
                                ++P
                            ) {
                                var u = d[P].replace(/^#?(https?:)?\/\//, "");
                                if (n[1] === u) {
                                    if ("#" === d[P][0]) {
                                        o = d = !1;
                                        break;
                                    }
                                } else if (n[0] === u) continue;
                                !0 === s ? (s = 1) : 1 === s && d.splice(P--, 1);
                            }
                            d.length
                                ? 1 === d.length && (d = "#" === d[0][0] ? d[0].slice(1) : d[0])
                                : i.IMGS_fallback_zoom
                                ? ((d = i.IMGS_fallback_zoom), delete i.IMGS_fallback_zoom)
                                : (d = !1);
                        }
                        if (1 !== i.nodeType) return d;
                        e: if ("img" === i.localName && i.hasAttribute("src")) {
                            if (
                                (d && (d !== (i.currentSrc || i.src) || (c && c.href && c === i) ? "number" == typeof o && (o = 3) : (o = d = !1)),
                                rgxIsSVG.test(i.currentSrc || i.src))
                            )
                                break e;
                            for (
                                s = "picture" === i.parentNode.localName ? i.parentNode.querySelectorAll("[srcset]") : i.hasAttribute("srcset") ? [i] : [],
                                    l = { naturalWidth: i.naturalWidth, naturalHeight: i.naturalHeight, src: null },
                                    P = 0;
                                P < s.length;
                                ++P
                            )
                                for (
                                    var h = (n = s[P].getAttribute("srcset")
                                        .trim()
                                        .split(/\s*,\s*/)).length;
                                    h--;

                                ) {
                                    var p = n[h].split(/\s+/);
                                    if (2 === p.length) {
                                        var g = p[1].slice(-1);
                                        if ("x" === g) p[1] = i.naturalWidth * p[1].slice(0, -1);
                                        else {
                                            if ("w" !== g) continue;
                                            p[1] = parseInt(p[1], 10);
                                        }
                                        p[1] > l.naturalWidth && ((l.naturalWidth = p[1]), (PVI.HLP.href = p[0]), (l.src = PVI.HLP.href));
                                    }
                                }
                            l.src && (l.naturalHeight *= l.naturalWidth / i.naturalWidth),
                                (l = l.src && PVI.isEnlargeable(i, l) ? l.src : PVI.isEnlargeable(i) ? i.currentSrc || i.src : null);
                            var y = i;
                            P = 0;
                            do {
                                if (y === t.body || 1 !== y.nodeType) break;
                                if ("fixed" === (s = e.getComputedStyle(y)).position) break;
                                if (0 !== P && ("visible" !== s.overflowY || "visible" !== s.overflowX)) {
                                    switch (s.display) {
                                        case "block":
                                        case "inline-block":
                                        case "flex":
                                        case "inline-flex":
                                        case "list-item":
                                        case "table-caption":
                                            break;
                                        default:
                                            continue;
                                    }
                                    if (l) {
                                        "string" != typeof l && (l = null), (i.IMGS_overflowParent = y);
                                        break;
                                    }
                                    if (!(y.offsetWidth <= 32 || y.offsetHeight <= 32) && PVI.isEnlargeable(y, i, !0)) {
                                        (l = i.currentSrc || i.src), (i.IMGS_fallback_zoom = i.IMGS_fallback_zoom ? [i.IMGS_fallback_zoom, l] : l);
                                        break;
                                    }
                                }
                            } while (++P < 5 && (y = y.parentNode));
                            if (!l) break e;
                            (V = i),
                                "object" == typeof d
                                    ? i.IMGS_fallback_zoom !== l && (i.IMGS_fallback_zoom = i.IMGS_fallback_zoom ? [i.IMGS_fallback_zoom, l] : l)
                                    : d
                                    ? d !== l && (d = [d, l])
                                    : ((d = l), cfg.hz.history && (i.IMGS_nohistory = !0));
                        }
                        if (!d && null !== d) return V && PVI.listen_attr_changes(V), d;
                        o && I ? (2 === o && (i.IMGS_thumb_ok = !0), (i.IMGS_thumb = I)) : 3 === o && (i.IMGS_thumb = !0),
                            (s = c && c.href ? (c.textContent || "").trim() : null) === c.href && (s = null),
                            (P = 0),
                            (c = i);
                        do {
                            if (
                                ((c.IMGS_caption || (c.title && (!i.hasAttribute("src") || i.src !== c.title))) && (i.IMGS_caption = c.IMGS_caption || c.title),
                                0 === P && (i.title = ""),
                                i.IMGS_caption)
                            )
                                break;
                        } while (++P <= 5 && (c = c.parentNode) && 1 === c.nodeType);
                        return (
                            i.IMGS_caption ||
                                (i.alt && i.alt !== i.src && i.alt !== I ? (i.IMGS_caption = i.alt) : s && cfg.hz.capLinkText && (i.IMGS_caption = s)),
                            i.IMGS_caption &&
                                ((!cfg.hz.capLinkText && i.IMGS_caption === s) || i.IMGS_caption === i.href
                                    ? delete i.IMGS_caption
                                    : PVI.prepareCaption(i, i.IMGS_caption)),
                            V && PVI.listen_attr_changes(V),
                            d
                        );
                    },
                    delayed_loader: function () {
                        PVI.TRG && PVI.state < 4 && PVI.show(PVI.LDR_msg, !0);
                    },
                    show: function (t, i) {
                        if (PVI.iFrame) e.parent.postMessage({ vdfDpshPtdhhd: "from_frame", msg: t }, "*");
                        else {
                            if (
                                !i &&
                                "string" == typeof t &&
                                ((PVI.DIV.style.display = "none"),
                                PVI.HD_cursor(!0),
                                (PVI.BOX = PVI.LDR),
                                (PVI.LDR.style.backgroundColor =
                                    cfg.hz.LDRbgOpacity < 100 ? PVI.palette[t].replace(/\(([^\)]+)/, "a($1, " + cfg.hz.LDRbgOpacity / 100) : PVI.palette[t]),
                                cfg.hz.LDRdelay > 20 && (clearTimeout(PVI.timers.delayed_loader), "R" !== t[0] && 3 !== PVI.state && !PVI.fullZm))
                            )
                                return (PVI.state = 3), (PVI.LDR_msg = t), void (PVI.timers.delayed_loader = setTimeout(PVI.delayed_loader, cfg.hz.LDRdelay));
                            var r;
                            if (t) {
                                if (2 === PVI.state && cfg.hz.waitHide) return;
                                viewportDimensions(),
                                    (PVI.state < 3 || PVI.LDR_msg) &&
                                        ((PVI.LDR_msg = null), e.addEventListener("wheel", PVI.wheeler, { capture: !0, passive: !1 })),
                                    !0 === t
                                        ? ((PVI.BOX = PVI.DIV),
                                          (PVI.LDR.style.display = "none"),
                                          cfg.hz.LDRanimate && (PVI.LDR.style.opacity = "0"),
                                          (PVI.CNT.style.display = "block"),
                                          ((PVI.CNT === PVI.IMG ? PVI.VID : PVI.IMG).style.display = "none"),
                                          "function" == typeof PVI.DIV.cursor_hide && PVI.DIV.cursor_hide())
                                        : PVI.state < 4 &&
                                          ((PVI.anim.left || PVI.anim.top) && ((PVI.DIV.style.left = PVI.x + "px"), (PVI.DIV.style.top = PVI.y + "px")),
                                          (PVI.anim.width || PVI.anim.height) && (PVI.DIV.style.width = PVI.DIV.style.height = "0")),
                                    (r = PVI.BOX.style),
                                    (PVI.state < 3 || PVI.BOX === PVI.LDR) &&
                                        "none" === r.display &&
                                        (((PVI.anim.left || PVI.anim.top) && PVI.BOX === PVI.DIV) || (cfg.hz.LDRanimate && PVI.BOX === PVI.LDR)) &&
                                        PVI.show(null),
                                    (r.display = "block"),
                                    "0" === r.opacity &&
                                        ((PVI.BOX === PVI.DIV && PVI.anim.opacity) || (PVI.BOX === PVI.LDR && cfg.hz.LDRanimate)) &&
                                        (2 === PVI.state ? PVI.anim.opacityTransition() : setTimeout(PVI.anim.opacityTransition, 0)),
                                    (PVI.state = PVI.BOX === PVI.LDR ? 3 : 4);
                            }
                            var a,
                                n,
                                l,
                                I,
                                o,
                                s,
                                V = PVI.x,
                                P = PVI.y,
                                c = winW - V,
                                d = winH - P;
                            if (
                                (((void 0 === t && 4 === PVI.state) || !0 === t) &&
                                    ((t = !1),
                                    PVI.TRG.IMGS_SVG
                                        ? ((I = (o = PVI.stack[PVI.IMG.src])[0]), (o = o[1]))
                                        : (I = PVI.CNT.naturalWidth)
                                        ? (o = PVI.CNT.naturalHeight)
                                        : (t = !0)),
                                PVI.fullZm)
                            )
                                return (
                                    PVI.BOX || (PVI.BOX = PVI.LDR),
                                    void (!1 === t
                                        ? (((r = PVI.DIV.style).visibility = "hidden"),
                                          PVI.resize(0),
                                          PVI.m_move(),
                                          (r.visibility = "visible"),
                                          PVI.updateCaption())
                                        : PVI.m_move())
                                );
                            if (!1 === t) {
                                (l = PVI.DIV.curdeg % 180 != 0) && ((s = I), (I = o), (o = s)),
                                    3 === cfg.hz.placement && ((V = (r = PVI.TBOX).left), (P = r.top), (c = winW - r.right), (d = winH - r.bottom)),
                                    (r = PVI.DBOX),
                                    (s = I / o);
                                var f = cfg.hz.fullspace || 2 === cfg.hz.placement,
                                    m =
                                        PVI.CAP &&
                                        PVI.CAP.overhead &&
                                        !(PVI.DIV.curdeg % 360) &&
                                        0 !== PVI.CAP.state &&
                                        (2 === PVI.CAP.state || (PVI.TRG.IMGS_caption && cfg.hz.capText) || PVI.TRG.IMGS_album || cfg.hz.capWH)
                                            ? PVI.CAP.overhead
                                            : 0,
                                    u = r.wm + (l ? r.hpb : r.wpb),
                                    h = r.hm + (l ? r.wpb : r.hpb) + m,
                                    p = Math.min(I, (f ? winW : V < c ? c : V) - u),
                                    g = Math.min(I, winW - u);
                                switch (
                                    ((u = Math.min(o, winH - h)),
                                    (h = Math.min(o, (f ? winH : P < d ? d : P) - h)),
                                    (f = p / s) > u ? (p = u * s) : (u = f),
                                    (f = h * s) > g ? (h = g / s) : (g = f),
                                    g > p ? ((I = Math.round(g)), (o = Math.round(h))) : ((I = Math.round(p)), (o = Math.round(u))),
                                    (p = I + r.wm + (l ? r.hpb : r.wpb)),
                                    (u = o + r.hm + (l ? r.wpb : r.hpb) + m),
                                    (g = PVI.TRG !== PVI.HLP && cfg.hz.minPopupDistance),
                                    cfg.hz.placement)
                                ) {
                                    case 1:
                                        (h = (V < c ? c : V) < p) && cfg.hz.fullspace && (winH - u <= winW - p || p <= (V < c ? c : V)) && (h = !1),
                                            (a = V - (h ? p / 2 : V < c ? 0 : p)),
                                            (n = P - (h ? (P < d ? 0 : u) : u / 2));
                                        break;
                                    case 2:
                                        (a = (winW - p) / 2), (n = (winH - u) / 2), (g = !1);
                                        break;
                                    case 3:
                                        (a = V < c || (p >= PVI.x && winW - PVI.x >= p) ? PVI.TBOX.right : V - p),
                                            (n = P < d || (u >= PVI.y && winH - PVI.y >= u) ? PVI.TBOX.bottom : P - u),
                                            (h =
                                                (V < c ? c : V) < p ||
                                                ((P < d ? d : P) >= u && winW >= p && (PVI.TBOX.width >= winW / 2 || Math.abs(PVI.x - a) >= winW / 3.5))),
                                            (cfg.hz.fullspace && !(h ? u <= (P < d ? d : P) : p <= (V < c ? c : V))) ||
                                                ((f = PVI.TBOX.width / PVI.TBOX.height),
                                                h
                                                    ? ((a = (PVI.TBOX.left + PVI.TBOX.right - p) / 2),
                                                      f > 10 && (a = V < c ? Math.max(a, PVI.TBOX.left) : Math.min(a, PVI.TBOX.right - p)))
                                                    : ((n = (PVI.TBOX.top + PVI.TBOX.bottom - u) / 2),
                                                      f < 0.1 && (n = P < d ? Math.min(n, PVI.TBOX.top) : Math.min(n, PVI.TBOX.bottom - u))));
                                        break;
                                    case 4:
                                        (a = V - p / 2), (n = P - u / 2), (g = !1);
                                        break;
                                    default:
                                        (h = null), (a = V - (V < c ? Math.max(0, p - c) : p)), (n = P - (P < d ? Math.max(0, u - d) : u));
                                }
                                g &&
                                    (h || (V < c ? c : V) < p || winH < u
                                        ? g > (h = P < d ? r.mt : r.mb) && ((g -= h), (n += P < d ? g : -g))
                                        : g > (h = V < c ? r.ml : r.mr) && ((g -= h), (a += V < c ? g : -g))),
                                    (a = a < 0 ? 0 : a > winW - p ? winW - p : a),
                                    (n = n < 0 ? 0 : n > winH - u ? winH - u : n),
                                    m && !cfg.hz.capPos && (n += m),
                                    l && ((l = I), (I = o), (o = l), (a += l = (p - u) / 2), (n -= l)),
                                    (PVI.DIV.style.width = I + "px"),
                                    (PVI.DIV.style.height = o + "px"),
                                    PVI.updateCaption();
                            } else
                                1 === cfg.hz.placement
                                    ? ((a = cfg.hz.minPopupDistance), (n = PVI.LDR.wh[1] / 2))
                                    : ((a = 13), (n = P < d ? -13 : PVI.LDR.wh[1] + 13)),
                                    (a = V - (V < c ? -a : PVI.LDR.wh[0] + a)),
                                    (n = P - n);
                            void 0 !== a && ((PVI.BOX.style.left = a + "px"), (PVI.BOX.style.top = n + "px"));
                        }
                    },
                    album: function (e, t) {
                        var i, r;
                        if (PVI.TRG && PVI.TRG.IMGS_album) {
                            var a = PVI.stack[PVI.TRG.IMGS_album];
                            if (a && !(a.length < 2)) {
                                switch (
                                    (!PVI.fullZm &&
                                        PVI.timers.no_anim_in_album &&
                                        (clearInterval(PVI.timers.no_anim_in_album),
                                        (PVI.timers.no_anim_in_album = null),
                                        (PVI.DIV.style.transition = "all 0s")),
                                    typeof e)
                                ) {
                                    case "boolean":
                                        e = e ? 1 : a.length - 1;
                                        break;
                                    case "number":
                                        e = a[0] + (e || 0);
                                        break;
                                    default:
                                        if (/^[+-]?\d+$/.test(e)) (r = parseInt(e, 10)), (e = "+" === e[0] || "-" === e[0] ? a[0] + r : r || 1);
                                        else {
                                            if (!(e = e.trim())) return;
                                            for (e = RegExp(e, "i"), r = (r = (i = a[0]) + 1) < a.length ? r : 1; r !== i; ++r < a.length ? 0 : (r = 1))
                                                if (a[r][1] && e.test(a[r][1])) {
                                                    e = r;
                                                    break;
                                                }
                                            if ("number" != typeof e) return;
                                        }
                                }
                                if (
                                    ((e = cfg.hz.pileCycle ? ((e = e % (i = a.length - 1) || i) < 0 ? i + e : e) : Math.max(1, Math.min(e, a.length - 1))),
                                    !((i = a[0]) === e && t && PVI.state > 3))
                                ) {
                                    (a[0] = e),
                                        PVI.resetNode(PVI.TRG, !0),
                                        (PVI.CAP.style.display = "none"),
                                        (PVI.CAP.firstChild.textContent = e + " / " + (a.length - 1)),
                                        cfg.hz.capText && PVI.prepareCaption(PVI.TRG, a[e][1]),
                                        PVI.set(a[e][0]),
                                        (i = (i <= e && (1 !== i || e !== a.length - 1)) || (i === a.length - 1 && 1 === e) ? 1 : -1),
                                        (r = 0);
                                    for (var n = cfg.hz.preload < 3 ? 1 : 3; r++ <= n; ) {
                                        if (!a[e + r * i] || e + r * i < 1) return;
                                        PVI._preload(a[e + r * i][0]);
                                    }
                                }
                            }
                        }
                    },
                    set: function (i) {
                        var r, a, n;
                        if (i) {
                            if (PVI.iFrame)
                                return (
                                    (r = PVI.TRG),
                                    void e.parent.postMessage(
                                        {
                                            vdfDpshPtdhhd: "from_frame",
                                            src: i,
                                            thumb: r.IMGS_thumb ? [r.IMGS_thumb, r.IMGS_thumb_ok] : null,
                                            album: r.IMGS_album ? { id: r.IMGS_album, list: PVI.stack[r.IMGS_album] } : null,
                                            caption: r.IMGS_caption,
                                        },
                                        "*"
                                    )
                                );
                            if ((clearInterval(PVI.timers.onReady), PVI.create(), Array.isArray(i))) {
                                if (!i.length) return void PVI.show("R_load");
                                for (a = [], n = [], r = 0; r < i.length; ++r)
                                    i[r] && ("#" === i[r][0] ? n.push(PVI.httpPrepend(i[r].slice(1))) : a.push(PVI.httpPrepend(i[r])));
                                a.length
                                    ? n.length &&
                                      ((PVI.TRG.IMGS_HD = cfg.hz.hiRes),
                                      (r = cfg.hz.hiRes ? a : n),
                                      (PVI.TRG.IMGS_HD_stack = r.length > 1 ? r : r[0]),
                                      (a = cfg.hz.hiRes ? n : a))
                                    : (a = n),
                                    (PVI.TRG.IMGS_c_resolved = a),
                                    (i = a[0]);
                            } else "#" === i[0] && (i = i.slice(1));
                            if (
                                ("/" === i[1] && (i = PVI.httpPrepend(i)),
                                -1 !== i.indexOf("&amp;") && (i = i.replace(/&amp;/g, "&")),
                                rgxIsSVG.test(i) ? (PVI.TRG.IMGS_SVG = !0) : delete PVI.TRG.IMGS_SVG,
                                i !== PVI.CNT.src)
                            ) {
                                if (/^[^?#]+\.(?:m(?:4[abprv]|p[34])|og[agv]|webm)(?:$|[?#])/.test(i) || /#(mp[34]|og[gv]|webm)$/.test(i))
                                    return (
                                        (PVI.CNT = PVI.VID),
                                        PVI.show("load"),
                                        (PVI.VID.naturalWidth = 0),
                                        (PVI.VID.naturalHeight = 0),
                                        (PVI.VID.src = i),
                                        void PVI.VID.load()
                                    );
                                if (
                                    (PVI.CNT !== PVI.IMG && ((PVI.CNT = PVI.IMG), PVI.VID.removeAttribute("src"), PVI.VID.load()),
                                    cfg.hz.thumbAsBG &&
                                        (PVI.interlacer && (PVI.interlacer.style.display = "none"), (PVI.CNT.loaded = PVI.TRG.IMGS_SVG || 1 === PVI.stack[i])),
                                    PVI.TRG.IMGS_SVG || PVI.stack[i] || 1 !== cfg.hz.preload || (new Image().src = i),
                                    PVI.CNT.removeAttribute("src"),
                                    PVI.TRG.IMGS_SVG && !PVI.stack[i])
                                ) {
                                    var l = t.createElement("img");
                                    return (
                                        (l.style.cssText = ["position: fixed", "visibility: hidden", "max-width: 500px", ""].join(" !important;")),
                                        (l.onerror = PVI.content_onerror),
                                        (l.src = i),
                                        (l.counter = 0),
                                        (PVI.timers.onReady = setInterval(function () {
                                            if (l.width || l.counter++ > 300) {
                                                var r = l.width / l.height;
                                                clearInterval(PVI.timers.onReady),
                                                    t.body.removeChild(l),
                                                    (l = null),
                                                    r
                                                        ? ((PVI.stack[i] = [e.screen.width, Math.round(e.screen.width / r)]),
                                                          (PVI.IMG.src = i),
                                                          PVI.assign_src())
                                                        : PVI.show("Rload");
                                            }
                                        }, 100)),
                                        t.body.appendChild(l),
                                        void PVI.show("load")
                                    );
                                }
                                (PVI.CNT.src = i), PVI.checkContentRediness(i, !0);
                            } else PVI.checkContentRediness(i);
                        }
                    },
                    checkContentRediness: function (e, t) {
                        PVI.CNT.naturalWidth || (PVI.TRG.IMGS_SVG && PVI.stack[e])
                            ? PVI.assign_src()
                            : (t && PVI.show("load"), (PVI.timers.onReady = setInterval(PVI.content_onready, PVI.CNT === PVI.IMG ? 100 : 300)));
                    },
                    content_onready: function () {
                        if (!PVI.CNT || !PVI.fireHide) return clearInterval(PVI.timers.onReady), void (PVI.fireHide || PVI.reset());
                        if (PVI.CNT === PVI.VID) {
                            if (!PVI.VID.duration) return void (PVI.VID.readyState > PVI.VID.HAVE_NOTHING && PVI.content_onerror.call(PVI.VID));
                            (PVI.VID.naturalWidth = PVI.VID.videoWidth || 300),
                                (PVI.VID.naturalHeight = PVI.VID.videoHeight || 40),
                                (PVI.VID.audio = !PVI.VID.videoHeight),
                                (PVI.VID.loop = !PVI.VID.duration || PVI.VID.duration <= 60),
                                PVI.VID.audio
                                    ? ((PVI.VID._controls = PVI.VID.controls), (PVI.VID.controls = !0))
                                    : (PVI.VID.controls = !!PVI.fullZm || PVI.VID._controls),
                                PVI.VID.autoplay && PVI.VID.paused && PVI.VID.play();
                        } else if (!PVI.IMG.naturalWidth) return;
                        clearInterval(PVI.timers.onReady), PVI.assign_src();
                    },
                    content_onerror: function () {
                        if ((clearInterval(PVI.timers.onReady), PVI.TRG && this === PVI.CNT)) {
                            var e,
                                t = PVI.TRG,
                                i = t.IMGS_c_resolved,
                                r = this.src;
                            if (r) {
                                this.removeAttribute("src");
                                do {
                                    e = Array.isArray(i) ? i.shift() : null;
                                } while (e === r);
                                (i && i.length) || (e ? (t.IMGS_c_resolved = e) : delete t.IMGS_c_resolved),
                                    e && !e.URL
                                        ? PVI.set(e)
                                        : t.IMGS_HD_stack
                                        ? ((e = t.IMGS_HD_stack), delete t.IMGS_HD_stack, delete t.IMGS_HD, PVI.set(e))
                                        : t.IMGS_fallback_zoom
                                        ? (PVI.set(t.IMGS_fallback_zoom), delete t.IMGS_fallback_zoom)
                                        : (PVI.CAP && (PVI.CAP.style.display = "none"), delete t.IMGS_c_resolved, PVI.show("R_load")),
                                    console.info(cfg.app?.name + ": [" + (this.audio ? "AUDIO" : this.nodeName) + "] Load error > " + r);
                            }
                        }
                    },
                    content_onload: function (e) {
                        cfg.hz.thumbAsBG && (this.loaded = !0),
                            PVI.TRG && delete PVI.TRG.IMGS_c_resolved,
                            PVI.stack[this.src] && !(PVI.TRG || e).IMGS_SVG && (PVI.stack[this.src] = 1),
                            PVI.interlacer && (PVI.interlacer.style.display = "none");
                    },
                    history: function (e) {
                        var t, i, r;
                        if (PVI.CNT && PVI.TRG && !chrome?.extension?.inIncognitoContext)
                            if (e) cfg.hz.history = !cfg.hz.history;
                            else if ((e = void 0 !== e) || !PVI.TRG.IMGS_nohistory) {
                                if (PVI.TRG.IMGS_album) {
                                    if (((t = PVI.stack[PVI.TRG.IMGS_album]), !e && (t.in_history || (t.length > 4 && 1 === t[0])))) return;
                                    t.in_history = !t.in_history;
                                }
                                (r = PVI.TRG), (i = 0);
                                do {
                                    if ("a" === r.localName) {
                                        (t = r.href) && t.baseVal && (t = t.baseVal);
                                        break;
                                    }
                                } while (++i < 5 && (r = r.parentNode) && 1 === r.nodeType);
                                t && Port.send({ cmd: "history", url: t, manual: e });
                            }
                    },
                    HD_cursor: function (e) {
                        PVI.TRG &&
                            (e || (!cfg.hz.capWH && void 0 !== PVI.TRG.IMGS_HD)) &&
                            (e
                                ? (PVI.DIV && (PVI.DIV.style.cursor = ""),
                                  null !== PVI.lastTRGStyle.cursor && ((PVI.TRG.style.cursor = PVI.lastTRGStyle.cursor), (PVI.lastTRGStyle.cursor = null)))
                                : (null === PVI.lastTRGStyle.cursor && (PVI.lastTRGStyle.cursor = PVI.TRG.style.cursor),
                                  (PVI.DIV.style.cursor = PVI.TRG.style.cursor = "crosshair")));
                    },
                    isEnlargeable: function (e, t, i) {
                        if (PVI.CNT && PVI.CNT !== PVI.IMG) return !0;
                        t || (t = e);
                        var r = e.clientWidth,
                            a = e.clientHeight,
                            n = t.naturalWidth,
                            l = t.naturalHeight;
                        if ((n <= 64 && l <= 64 && !i) || n <= 1 || l <= 1) return !1;
                        if (i)
                            return (
                                (r = e.getBoundingClientRect()),
                                (n = t.getBoundingClientRect()).right - 10 > r.right || n.bottom - 10 > r.bottom || n.left + 10 < r.left || n.top + 10 < r.top
                            );
                        if (e === t) {
                            if (n < 600 && l < 600 && Math.abs(n / 2 - (e.width || r)) < 8 && Math.abs(l / 2 - (e.height || a)) < 8) return !1;
                        } else if (/^[^?#]+\.(?:gif|apng)(?:$|[?#])/.test(t.src)) return !0;
                        return (
                            !((r >= n || a >= l) && Math.abs(n / l - r / a) <= 0.2) &&
                            ((r < 0.9 * topWinW && 100 - (100 * r) / n >= cfg.hz.zoomresized) ||
                                (a < 0.9 * topWinH && 100 - (100 * a) / l >= cfg.hz.zoomresized))
                        );
                    },
                    not_enlargeable: function () {
                        if ((PVI.resetNode(PVI.TRG), (PVI.TRG.IMGS_c = !0), PVI.reset(), cfg.hz.markOnHover)) {
                            if ("cr" === cfg.hz.markOnHover)
                                return (PVI.lastTRGStyle.cursor = PVI.TRG.style.cursor), void (PVI.TRG.style.cursor = "not-allowed");
                            null === PVI.lastTRGStyle.outline && (PVI.lastTRGStyle.outline = PVI.TRG.style.outline),
                                (PVI.lastScrollTRG = PVI.TRG),
                                (PVI.TRG.style.outline = "1px solid purple");
                        }
                    },
                    assign_src: function () {
                        if (PVI.TRG && !PVI.switchToHiResInFZ()) {
                            if (PVI.TRG.IMGS_album)
                                delete PVI.TRG.IMGS_thumb, delete PVI.TRG.IMGS_thumb_ok, PVI.interlacer && (PVI.interlacer.style.display = "none");
                            else if (!PVI.TRG.IMGS_SVG) {
                                if (PVI.TRG !== PVI.HLP && PVI.TRG.IMGS_thumb && !PVI.isEnlargeable(PVI.TRG, PVI.IMG)) {
                                    if (PVI.TRG.IMGS_HD_stack && !PVI.TRG.IMGS_HD) return PVI.show("load"), void PVI.key_action({ which: 9 });
                                    if (!PVI.TRG.IMGS_fallback_zoom) return void PVI.not_enlargeable();
                                    PVI.TRG.IMGS_thumb = !1;
                                }
                                var e, i, r;
                                if (PVI.CNT === PVI.IMG && !PVI.IMG.loaded && cfg.hz.thumbAsBG && !1 !== PVI.TRG.IMGS_thumb && !PVI.TRG.IMGS_album)
                                    "string" != typeof PVI.TRG.IMGS_thumb &&
                                        ((PVI.TRG.IMGS_thumb = null),
                                        PVI.TRG.hasAttribute("src")
                                            ? (PVI.TRG.IMGS_thumb = PVI.TRG.src)
                                            : PVI.TRG.childElementCount && (e = PVI.TRG.querySelector("img[src]")) && (PVI.TRG.IMGS_thumb = e.src)),
                                        PVI.TRG.IMGS_thumb === PVI.IMG.src
                                            ? (delete PVI.TRG.IMGS_thumb, delete PVI.TRG.IMGS_thumb_ok)
                                            : PVI.TRG.IMGS_thumb &&
                                              ((i = !0),
                                              PVI.TRG.IMGS_thumb_ok ||
                                                  ((i = (e || PVI.TRG).clientWidth),
                                                  (r = (e || PVI.TRG).clientHeight),
                                                  (PVI.TRG.IMGS_thumb_ok = Math.abs(PVI.IMG.naturalWidth / PVI.IMG.naturalHeight - i / r) <= 0.2),
                                                  (i = i < 1024 && r < 1024 && i < PVI.IMG.naturalWidth && r < PVI.IMG.naturalHeight)),
                                              i &&
                                                  PVI.TRG.IMGS_thumb_ok &&
                                                  (PVI.interlacer
                                                      ? (i = PVI.interlacer.style)
                                                      : ((PVI.interlacer = t.createElement("div")),
                                                        (r = PVI.interlacer),
                                                        cfg.hz.thumbAsBGOpacity > 0 &&
                                                            ((i = parseInt(cfg.hz.thumbAsBGColor.slice(1), 16)),
                                                            (r.appendChild(t.createElement("div")).style.cssText =
                                                                "width: 100%; height: 100%; background-color: rgba(" +
                                                                (i >> 16) +
                                                                "," +
                                                                ((i >> 8) & 255) +
                                                                "," +
                                                                (255 & i) +
                                                                "," +
                                                                parseFloat(cfg.hz.thumbAsBGOpacity) +
                                                                ")")),
                                                        ((i = r.style).cssText =
                                                            "position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: 100% 100%; background-repeat: no-repeat"),
                                                        PVI.DIV.insertBefore(r, PVI.IMG)),
                                                  (i.backgroundImage = "url(" + PVI.TRG.IMGS_thumb + ")"),
                                                  (i.display = "block")),
                                              delete PVI.TRG.IMGS_thumb,
                                              delete PVI.TRG.IMGS_thumb_ok);
                            }
                            delete PVI.TRG.IMGS_c_resolved,
                                (PVI.TRG.IMGS_c = PVI.CNT.src),
                                PVI.TRG.IMGS_SVG || (PVI.stack[PVI.IMG.src] = !0),
                                PVI.show(!0),
                                PVI.HD_cursor(!1 !== PVI.TRG.IMGS_HD),
                                cfg.hz.history && PVI.history(),
                                !PVI.fullZm &&
                                    PVI.anim.maxDelay &&
                                    PVI.TRG.IMGS_album &&
                                    (PVI.timers.no_anim_in_album = setTimeout(function () {
                                        PVI.DIV.style.transition = PVI.anim.css;
                                    }, 100));
                        }
                    },
                    hide: function (t) {
                        if ((PVI.HD_cursor(!0), (PVI.fireHide = !1), PVI.iFrame)) e.parent.postMessage({ vdfDpshPtdhhd: "from_frame", hide: !0 }, "*");
                        else if ((e.removeEventListener("mousemove", PVI.m_move, !0), PVI.state < 3 || PVI.LDR_msg || null === PVI.state))
                            PVI.state >= 2 && PVI.reset();
                        else {
                            var i = PVI.BOX === PVI.DIV && PVI.anim.maxDelay,
                                r = PVI.BOX === PVI.LDR && cfg.hz.LDRanimate;
                            if ((!i && !r) || PVI.fullZm) return cfg.hz.waitHide || (PVI.hideTime = Date.now()), void PVI.reset();
                            (PVI.state = 2),
                                PVI.CAP && ((PVI.HLP.textContent = ""), (PVI.CAP.style.display = "none")),
                                ((i && PVI.anim.left) || r) &&
                                    (PVI.BOX.style.left =
                                        (cfg.hz.follow ? t.clientX || PVI.x : parseInt(PVI.BOX.style.left, 10) + PVI.BOX.offsetWidth / 2) + "px"),
                                ((i && PVI.anim.top) || r) &&
                                    (PVI.BOX.style.top =
                                        (cfg.hz.follow ? t.clientY || PVI.y : parseInt(PVI.BOX.style.top, 10) + PVI.BOX.offsetHeight / 2) + "px"),
                                i && (PVI.anim.width && (PVI.DIV.style.width = "0"), PVI.anim.height && (PVI.DIV.style.height = "0")),
                                ((i && PVI.anim.opacity) || r) && (PVI.BOX.style.opacity = "0"),
                                (PVI.timers.anim_end = setTimeout(PVI.reset, PVI.anim.maxDelay));
                        }
                    },
                    reset: function (i) {
                        PVI.DIV &&
                            (PVI.iFrame && e.parent.postMessage({ vdfDpshPtdhhd: "from_frame", reset: !0 }, "*"),
                            PVI.state && e.removeEventListener("mousemove", PVI.m_move, !0),
                            (PVI.node = null),
                            clearTimeout(PVI.timers.delayed_loader),
                            e.removeEventListener("wheel", PVI.wheeler, !0),
                            (PVI.DIV.style.display = PVI.LDR.style.display = "none"),
                            (PVI.DIV.style.width = PVI.DIV.style.height = "0"),
                            PVI.CNT.removeAttribute("src"),
                            PVI.CNT === PVI.VID && PVI.VID.load(),
                            (PVI.anim.left || PVI.anim.top) && (PVI.DIV.style.left = PVI.DIV.style.top = "auto"),
                            PVI.anim.opacity && (PVI.DIV.style.opacity = "0"),
                            cfg.hz.LDRanimate && ((PVI.LDR.style.left = "auto"), (PVI.LDR.style.top = "auto"), (PVI.LDR.style.opacity = "0")),
                            PVI.CAP && (PVI.CAP.firstChild.style.display = PVI.CAP.style.display = "none"),
                            PVI.IMG.scale && (delete PVI.IMG.scale, (PVI.IMG.style.transform = "")),
                            PVI.VID.scale && (delete PVI.VID.scale, (PVI.VID.style.transform = "")),
                            (PVI.DIV.curdeg = 0),
                            (PVI.DIV.style.transform = ""),
                            PVI.HD_cursor(!0),
                            PVI.fullZm &&
                                ((PVI.fullZm = !1),
                                (PVI.hideTime = null),
                                PVI.anim.maxDelay && (PVI.DIV.style.transition = PVI.anim.css),
                                e.removeEventListener("click", PVI.fzClickAct, !0),
                                e.addEventListener("mouseover", PVI.m_over, !0),
                                t.addEventListener("wheel", PVI.scroller, { capture: !0, passive: !0 }),
                                t.documentElement.addEventListener("mouseleave", PVI.m_leave)),
                            i && ((PVI.lastScrollTRG = PVI.TRG), PVI.scroller()),
                            (PVI.state = 1));
                    },
                    onVisibilityChange: function (e) {
                        PVI.fullZm || (t.hidden ? PVI.fireHide && PVI.m_over({ relatedTarget: PVI.TRG }) : releaseFreeze(e));
                    },
                    keyup_freeze: function (t) {
                        (t && shortcut.key(t) !== cfg.hz.actTrigger) ||
                            ((PVI.freeze = !cfg.hz.deactivate), (PVI.keyup_freeze_on = !1), e.removeEventListener("keyup", PVI.keyup_freeze, !0));
                    },
                    key_action: function (i) {
                        var r, a;
                        if (cfg) {
                            if (shortcut.isModifier(i)) {
                                if (PVI.keyup_freeze_on || "number" == typeof PVI.freeze) return;
                                if (i.repeat || shortcut.key(i) !== cfg.hz.actTrigger) return;
                                return (
                                    PVI.fireHide &&
                                        PVI.state < 3 &&
                                        (cfg.hz.deactivate
                                            ? PVI.m_over({ relatedTarget: PVI.TRG })
                                            : PVI.load(null === PVI.SRC ? PVI.TRG.IMGS_c_resolved : PVI.SRC)),
                                    (PVI.freeze = !!cfg.hz.deactivate),
                                    (PVI.keyup_freeze_on = !0),
                                    void e.addEventListener("keyup", PVI.keyup_freeze, !0)
                                );
                            }
                            if (
                                (i.repeat ||
                                    (PVI.keyup_freeze_on
                                        ? PVI.keyup_freeze()
                                        : !1 === PVI.freeze && !PVI.fullZm && PVI.lastScrollTRG && PVI.mover({ target: PVI.lastScrollTRG })),
                                (a = shortcut.key(i)),
                                PVI.state < 3 && PVI.fireHide && "Esc" === a && PVI.m_over({ relatedTarget: PVI.TRG }),
                                (r = i.target),
                                !cfg.hz.scOffInInput || !r || (!r.isContentEditable && (!(r = r.nodeName.toUpperCase()) || ("X" !== r[2] && "INPUT" !== r))))
                            ) {
                                if (i.altKey && i.shiftKey)
                                    (r = !0),
                                        a === cfg.keys.hz_preload
                                            ? e.top.postMessage({ vdfDpshPtdhhd: "preload" }, "*")
                                            : a === cfg.keys.hz_toggle
                                            ? (e.sessionStorage.IMGS_suspend ? delete e.sessionStorage.IMGS_suspend : (e.sessionStorage.IMGS_suspend = "1"),
                                              e.top.postMessage({ vdfDpshPtdhhd: "toggle" }, "*"))
                                            : (r = !1);
                                else if (i.altKey || i.metaKey || !(PVI.state > 2 || PVI.LDR_msg)) r = !1;
                                else if (((r = !i.ctrlKey), i.ctrlKey)) {
                                    if (4 === PVI.state)
                                        if ("C" === a) {
                                            if (!i.shiftKey && "oncopy" in t) {
                                                (r = !0), (a = Date.now() - PVI.timers.copy < 500 ? PVI.TRG.IMGS_caption : PVI.CNT.src);
                                                var n = function (e) {
                                                    this.removeEventListener(e.type, n), e.clipboardData.setData("text/plain", a), e.preventDefault();
                                                };
                                                t.addEventListener("copy", n), t.execCommand("copy"), (PVI.timers.copy = Date.now());
                                            }
                                        } else
                                            "S" === a
                                                ? (!i.repeat &&
                                                      PVI.CNT.src &&
                                                      Port.send({
                                                          cmd: "download",
                                                          url: PVI.CNT.src,
                                                          priorityExt: (PVI.CNT.src.match(/#([\da-z]{3,4})$/) || [])[1],
                                                          ext: { img: "jpg", video: "mp4", audio: "mp3" }[PVI.CNT.audio ? "audio" : PVI.CNT.localName],
                                                      }),
                                                  (r = !0))
                                                : a === cfg.keys.hz_open
                                                ? ((a = {}),
                                                  ((PVI.TRG.IMGS_caption || "").match(/\b((?:www\.[\w-]+(\.\S{2,7}){1,4}|https?:\/\/)\S+)/g) || []).forEach(
                                                      function (e) {
                                                          a["w" === e[0] ? "http://" + e : e] = 1;
                                                      }
                                                  ),
                                                  (a = Object.keys(a)).length &&
                                                      (Port.send({ cmd: "open", url: a, nf: i.shiftKey }), i.shiftKey || PVI.fullZm || PVI.reset(), (r = !0)))
                                                : ("Left" !== a && "Right" !== a) ||
                                                  ((a = "Left" === a ? -5 : 5), (PVI.VID.currentTime += a * (i.shiftKey ? 3 : 1)));
                                } else if ("-" === a || "+" === a || "=" === a) PVI.resize("-" === a ? "-" : "+");
                                else if ("Tab" === a)
                                    PVI.TRG.IMGS_HD_stack &&
                                        (PVI.CAP && (PVI.CAP.style.display = "none"),
                                        (PVI.TRG.IMGS_HD = !PVI.TRG.IMGS_HD),
                                        (a = PVI.TRG.IMGS_c || PVI.TRG.IMGS_c_resolved),
                                        delete PVI.TRG.IMGS_c,
                                        PVI.set(PVI.TRG.IMGS_HD_stack),
                                        (PVI.TRG.IMGS_HD_stack = a)),
                                        i.shiftKey && (cfg.hz.hiRes = !cfg.hz.hiRes);
                                else if ("Esc" === a)
                                    PVI.CNT === PVI.VID && (e.fullScreen || t.fullscreenElement || (topWinW === e.screen.width && topWinH === e.screen.height))
                                        ? (r = !1)
                                        : PVI.reset(!0);
                                else if (a === cfg.keys.hz_fullZm || "Enter" === a)
                                    PVI.fullZm
                                        ? i.shiftKey
                                            ? (PVI.fullZm = 1 === PVI.fullZm ? 2 : 1)
                                            : PVI.reset(!0)
                                        : (e.removeEventListener("mouseover", PVI.m_over, !0),
                                          t.removeEventListener("wheel", PVI.scroller, !0),
                                          t.documentElement.removeEventListener("mouseleave", PVI.m_leave, !1),
                                          (PVI.fullZm = (1 !== cfg.hz.fzMode) != !i.shiftKey ? 1 : 2),
                                          PVI.switchToHiResInFZ(),
                                          PVI.anim.maxDelay &&
                                              setTimeout(function () {
                                                  PVI.fullZm && (PVI.DIV.style.transition = "all 0s");
                                              }, PVI.anim.maxDelay),
                                          (r = PVI.DIV.style),
                                          PVI.CNT === PVI.VID && (PVI.VID.controls = !0),
                                          PVI.state > 2 &&
                                              2 !== PVI.fullZm &&
                                              ((r.visibility = "hidden"), PVI.resize(0), PVI.m_move(), (r.visibility = "visible")),
                                          PVI.iFrame || e.addEventListener("mousemove", PVI.m_move, !0),
                                          e.addEventListener("click", PVI.fzClickAct, !0));
                                else if (i.which > 31 && i.which < 41) {
                                    if (
                                        ((r = null),
                                        PVI.CNT === PVI.VID &&
                                            ((r = !0),
                                            "Space" === a
                                                ? i.shiftKey
                                                    ? PVI.VID.audio || (PVI.VID.controls = PVI.VID._controls = !PVI.VID._controls)
                                                    : PVI.VID.paused
                                                    ? PVI.VID.play()
                                                    : PVI.VID.pause()
                                                : "Up" === a || "Down" === a
                                                ? i.shiftKey
                                                    ? (PVI.VID.playbackRate *= "Up" === a ? 4 / 3 : 0.75)
                                                    : (r = null)
                                                : i.shiftKey || ("PgUp" !== a && "PgDn" !== a)
                                                ? (r = null)
                                                : PVI.VID.audio
                                                ? (PVI.VID.currentTime += "PgDn" === a ? 4 : -4)
                                                : (PVI.VID.pause(), (PVI.VID.currentTime = (25 * PVI.VID.currentTime + ("PgDn" === a ? 1 : -1)) / 25 + 1e-5))),
                                        !r && PVI.TRG.IMGS_album)
                                    ) {
                                        switch (a) {
                                            case "End":
                                                i.shiftKey && (r = prompt("#", PVI.stack[PVI.TRG.IMGS_album].search || "") || null)
                                                    ? (PVI.stack[PVI.TRG.IMGS_album].search = r)
                                                    : (r = !1);
                                                break;
                                            case "Home":
                                                r = !0;
                                                break;
                                            case "Up":
                                            case "Down":
                                                r = null;
                                                break;
                                            default:
                                                r =
                                                    (("Space" === a && !i.shiftKey) || "Right" === a || "PgDn" === a ? 1 : -1) *
                                                    (i.shiftKey && "Space" !== a ? 5 : 1);
                                        }
                                        null !== r && (PVI.album(r, !0), (r = !0));
                                    }
                                } else if (a === cfg.keys.mOrig || a === cfg.keys.mFit || a === cfg.keys.mFitW || a === cfg.keys.mFitH) PVI.resize(a);
                                else if (a === cfg.keys.hz_fullSpace) (cfg.hz.fullspace = !cfg.hz.fullspace), PVI.show();
                                else if (a === cfg.keys.flipH) flip(PVI.CNT, 0);
                                else if (a === cfg.keys.flipV) flip(PVI.CNT, 1);
                                else if (a === cfg.keys.rotL || a === cfg.keys.rotR)
                                    (PVI.DIV.curdeg += a === cfg.keys.rotR ? 90 : -90),
                                        PVI.CAP &&
                                            PVI.CAP.textContent &&
                                            0 !== PVI.CAP.state &&
                                            (PVI.CAP.style.display = PVI.DIV.curdeg % 360 ? "none" : "block"),
                                        (PVI.DIV.style.transform = PVI.DIV.curdeg ? "rotate(" + PVI.DIV.curdeg + "deg)" : ""),
                                        PVI.fullZm ? PVI.m_move() : PVI.show();
                                else if (a === cfg.keys.hz_caption)
                                    if (i.shiftKey) {
                                        switch ((PVI.createCAP(), PVI.CAP.state)) {
                                            case 0:
                                                a = cfg.hz.capWH || cfg.hz.capText ? 1 : 2;
                                                break;
                                            case 2:
                                                a = 0;
                                                break;
                                            default:
                                                a = cfg.hz.capWH && cfg.hz.capText ? 0 : 2;
                                        }
                                        (PVI.CAP.state = a), (PVI.CAP.style.display = "none"), PVI.updateCaption(), PVI.show();
                                    } else PVI.CAP && (PVI.CAP.style.whiteSpace = "nowrap" === PVI.CAP.style.whiteSpace ? "normal" : "nowrap");
                                else
                                    a === cfg.keys.hz_history
                                        ? PVI.history(i.shiftKey)
                                        : a === cfg.keys.send
                                        ? PVI.CNT === PVI.IMG && imageSendTo({ url: PVI.CNT.src, nf: i.shiftKey })
                                        : a === cfg.keys.hz_open
                                        ? PVI.CNT.src &&
                                          (Port.send({ cmd: "open", url: PVI.CNT.src.replace(rgxHash, ""), nf: i.shiftKey }),
                                          i.shiftKey || PVI.fullZm || PVI.reset())
                                        : a === cfg.keys.prefs
                                        ? (Port.send({ cmd: "open", url: "options/options.html#settings" }), PVI.fullZm || PVI.reset())
                                        : (r = !1);
                                r && pdsp(i);
                            }
                        }
                    },
                    switchToHiResInFZ: function () {
                        if (!PVI.fullZm || !PVI.TRG || cfg.hz.hiResOnFZ < 1) return !1;
                        if (!1 !== PVI.TRG.IMGS_HD) return !1;
                        if (PVI.IMG.naturalWidth < 800 && PVI.IMG.naturalHeight < 800) return !1;
                        var e = PVI.IMG.naturalWidth / PVI.IMG.naturalHeight;
                        return !((e < 1 ? 1 / e : e) < cfg.hz.hiResOnFZ) && (PVI.show("load"), PVI.key_action({ which: 9 }), !0);
                    },
                    fzDragEnd: function () {
                        (PVI.fullZm = PVI.fullZm > 1 ? 2 : 1), e.removeEventListener("mouseup", PVI.fzDragEnd, !0);
                    },
                    fzClickAct: function (e) {
                        if (0 === e.button) {
                            if (!1 === mdownstart) return (mdownstart = null), void pdsp(e);
                            e.target === PVI.CAP || (e.target.parentNode && e.target.parentNode === PVI.CAP)
                                ? PVI.TRG.IMGS_HD_stack && PVI.key_action({ which: 9 })
                                : e.target === PVI.VID
                                ? (e.offsetY || e.layerY || 0) < Math.min(PVI.CNT.clientHeight - 40, (2 * PVI.CNT.clientHeight) / 3)
                                    ? PVI.reset(!0)
                                    : (e.offsetY || e.layerY || 0) < PVI.CNT.clientHeight - 40 &&
                                      (e.offsetY || e.layerY || 0) > (2 * PVI.CNT.clientHeight) / 3 &&
                                      (PVI.VID.paused ? PVI.VID.play() : PVI.VID.pause())
                                : PVI.reset(!0),
                                e.target.IMGS_ && pdsp(e, !1);
                        }
                    },
                    scroller: function (t) {
                        if (t) {
                            if (PVI.fullZm) return;
                            t.target.IMGS_ ||
                                (PVI.lastScrollTRG && PVI.lastScrollTRG !== t.target
                                    ? (PVI.lastScrollTRG = !1)
                                    : !1 !== PVI.lastScrollTRG && (PVI.lastScrollTRG = t.target));
                        }
                        PVI.freeze ||
                            PVI.keyup_freeze_on ||
                            (t && (PVI.fireHide && PVI.m_over({ relatedTarget: PVI.TRG }), (PVI.x = t.clientX), (PVI.y = t.clientY)),
                            (PVI.freeze = !0),
                            e.addEventListener("mousemove", PVI.mover, !0));
                    },
                    mover: function (t) {
                        (PVI.x === t.clientX && PVI.y === t.clientY) ||
                            (e.removeEventListener("mousemove", PVI.mover, !0),
                            PVI.keyup_freeze_on ||
                                (!0 === PVI.freeze && (PVI.freeze = !cfg.hz.deactivate),
                                PVI.lastScrollTRG !== t.target && ((PVI.hideTime -= 1e3), PVI.m_over(t))),
                            (PVI.lastScrollTRG = null));
                    },
                    wheeler: function (e) {
                        if (!(e.clientX >= winW || e.clientY >= winH)) {
                            var t = cfg.hz.scrollDelay;
                            if (
                                (PVI.state > 2 && t >= 20 && (e.timeStamp - (PVI.lastScrollTime || 0) < t ? (t = null) : (PVI.lastScrollTime = e.timeStamp)),
                                PVI.TRG &&
                                    PVI.TRG.IMGS_album &&
                                    cfg.hz.pileWheel &&
                                    (!PVI.fullZm || (e.clientX < 50 && e.clientY < 50) || (PVI.CAP && e.target === PVI.CAP.firstChild)))
                            ) {
                                if (null !== t) {
                                    if (2 === cfg.hz.pileWheel) {
                                        if (!e.deltaX && !e.wheelDeltaX) return;
                                        t = (e.deltaX || -e.wheelDeltaX) > 0;
                                    } else t = (e.deltaY || -e.wheelDelta) > 0;
                                    PVI.album(t ? 1 : -1, !0);
                                }
                                pdsp(e);
                            } else {
                                if (PVI.fullZm && PVI.fullZm < 4)
                                    return (
                                        null !== t &&
                                            PVI.resize(
                                                (e.deltaY || -e.wheelDelta) > 0 ? "-" : "+",
                                                PVI.fullZm > 1 ? (e.target === PVI.CNT ? [e.offsetX || e.layerX || 0, e.offsetY || e.layerY || 0] : []) : null
                                            ),
                                        void pdsp(e)
                                    );
                                (PVI.lastScrollTRG = PVI.TRG), PVI.reset();
                            }
                        }
                    },
                    resize: function (e, t) {
                        if (4 === PVI.state && PVI.fullZm) {
                            var i = PVI.TRG.IMGS_SVG ? PVI.stack[PVI.IMG.src].slice() : [PVI.CNT.naturalWidth, PVI.CNT.naturalHeight],
                                r = cfg.keys,
                                a = PVI.DIV.curdeg % 180;
                            switch (
                                (viewportDimensions(),
                                a && i.reverse(),
                                e === r.mFit && (e = winW / winH < i[0] / i[1] ? (winW > i[0] ? 0 : r.mFitW) : winH > i[1] ? 0 : r.mFitH),
                                e)
                            ) {
                                case r.mFitW:
                                    (winW -= PVI.DBOX.wpb), (i[1] *= winW / i[0]), (i[0] = winW), PVI.fullZm > 1 && (PVI.y = 0);
                                    break;
                                case r.mFitH:
                                    (winH -= PVI.DBOX.hpb), (i[0] *= winH / i[1]), (i[1] = winH), PVI.fullZm > 1 && (PVI.y = 0);
                                    break;
                                case "+":
                                case "-":
                                    ((r = [parseInt(PVI.DIV.style.width, 10), 0])[1] = (r[0] * i[a ? 0 : 1]) / i[a ? 1 : 0]),
                                        t &&
                                            (void 0 === t[1] || a
                                                ? ((t[0] = r[0] / 2), (t[1] = r[1] / 2))
                                                : PVI.DIV.curdeg % 360 && (PVI.DIV.curdeg % 180 || ((t[0] = r[0] - t[0]), (t[1] = r[1] - t[1]))),
                                            (t[0] /= r[a ? 1 : 0]),
                                            (t[1] /= r[a ? 0 : 1])),
                                        (e = "+" === e ? 4 / 3 : 0.75),
                                        (i[0] = e * Math.max(16, r[a ? 1 : 0])),
                                        (i[1] = e * Math.max(16, r[a ? 0 : 1])),
                                        t && ((t[0] *= r[a ? 1 : 0] - i[0]), (t[1] *= r[a ? 0 : 1] - i[1]));
                            }
                            t || (t = [!0, null]), t.push(i[a ? 1 : 0], i[a ? 0 : 1]), PVI.m_move(t);
                        }
                    },
                    m_leave: function (e) {
                        PVI.fireHide &&
                            !e.relatedTarget &&
                            ((PVI.x === e.clientX && PVI.y === e.clientY) || PVI.m_over({ relatedTarget: PVI.TRG, clientX: e.clientX, clientY: e.clientY }));
                    },
                    m_over: function (t) {
                        var i, r, a;
                        if (!cfg.hz.deactivate || (!PVI.freeze && !t[cfg._freezeTriggerEventKey])) {
                            if (PVI.fireHide) {
                                if (t.target && (t.target.IMGS_ || ((t.relatedTarget || t).IMGS_ && t.target === PVI.TRG)))
                                    return void (cfg.hz.capNoSBar && t.preventDefault());
                                if (
                                    (PVI.CAP && ((PVI.CAP.style.display = "none"), (PVI.CAP.firstChild.style.display = "none")),
                                    clearTimeout(PVI.timers.preview),
                                    clearInterval(PVI.timers.onReady),
                                    PVI.timers.resolver && (clearTimeout(PVI.timers.resolver), (PVI.timers.resolver = null)),
                                    t.relatedTarget &&
                                        (null !== (r = PVI.lastTRGStyle).outline && ((t.relatedTarget.style.outline = r.outline), (r.outline = null)),
                                        null !== r.cursor && ((t.relatedTarget.style.cursor = r.cursor), (r.cursor = null))),
                                    PVI.nodeToReset && (PVI.resetNode(PVI.nodeToReset), (PVI.nodeToReset = null)),
                                    PVI.TRG &&
                                        (PVI.DIV &&
                                            PVI.timers.no_anim_in_album &&
                                            ((PVI.timers.no_anim_in_album = null), (PVI.DIV.style.transition = PVI.anim.css)),
                                        (PVI.TRG = null)),
                                    0 === PVI.hideTime && PVI.state < 3 && (PVI.hideTime = Date.now()),
                                    !t.target)
                                )
                                    return void PVI.hide(t);
                            }
                            if (!0 !== t.target.IMGS_c)
                                if (
                                    ((a = (r = t.target).IMGS_c) || (r.IMGS_c_resolved ? (i = r.IMGS_c_resolved) : (PVI.TRG = r)),
                                    a || i || (i = PVI.find(r, t.clientX, t.clientY)) || null === i)
                                ) {
                                    1 === i && (i = !1),
                                        cfg.hz.capNoSBar && t.preventDefault(),
                                        clearTimeout(PVI.timers.preview),
                                        cfg.hz.waitHide || clearTimeout(PVI.timers.anim_end),
                                        PVI.iFrame || e.addEventListener("mousemove", PVI.m_move, !0),
                                        a || !i || r.IMGS_c_resolved || (2 !== cfg.hz.preload || PVI.stack[i] || PVI._preload(i), (r.IMGS_c_resolved = i)),
                                        (PVI.TRG = r),
                                        (PVI.SRC = a || i),
                                        (PVI.x = t.clientX),
                                        (PVI.y = t.clientY);
                                    var n = PVI.freeze && !cfg.hz.deactivate && !t[cfg._freezeTriggerEventKey];
                                    if (
                                        !n &&
                                        (!cfg.hz.waitHide || cfg.hz.delay < 15) &&
                                        ((PVI.fireHide && PVI.state > 2) || 2 === PVI.state || (PVI.hideTime && Date.now() - PVI.hideTime < 200))
                                    )
                                        return PVI.hideTime && (PVI.hideTime = 0), (PVI.fireHide = 1), void PVI.load(PVI.SRC);
                                    if (
                                        (PVI.fireHide &&
                                            PVI.state > 2 &&
                                            (cfg.hz.waitHide || !cfg.hz.deactivate) &&
                                            (PVI.hide(t),
                                            PVI.anim.maxDelay || PVI.iFrame || e.addEventListener("mousemove", PVI.m_move, !0),
                                            PVI.hideTime && (PVI.hideTime = 0)),
                                        (PVI.fireHide = !0),
                                        cfg.hz.markOnHover &&
                                            (n || cfg.hz.delay >= 25) &&
                                            ("cr" === cfg.hz.markOnHover
                                                ? ((PVI.lastTRGStyle.cursor = r.style.cursor), (r.style.cursor = "zoom-in"))
                                                : ((PVI.lastTRGStyle.outline = r.style.outline), (r.style.outline = "1px " + cfg.hz.markOnHover + " red"))),
                                        n)
                                    )
                                        return void clearTimeout(PVI.timers.resolver);
                                    var l = (2 === PVI.state || PVI.hideTime) && cfg.hz.waitHide ? PVI.anim.maxDelay : cfg.hz.delay;
                                    l ? (PVI.timers.preview = setTimeout(PVI.load, l)) : PVI.load(PVI.SRC);
                                } else (r.IMGS_c = !0), (PVI.TRG = null), PVI.fireHide && PVI.hide(t);
                            else PVI.fireHide && PVI.hide(t);
                        }
                    },
                    load: function (t) {
                        if (
                            ((!cfg.hz.waitHide && cfg.hz.deactivate) || !PVI.anim.maxDelay || PVI.iFrame || e.addEventListener("mousemove", PVI.m_move, !0),
                            PVI.TRG)
                        ) {
                            if (
                                (void 0 === t && (t = (cfg.hz.delayOnIdle && PVI.TRG.IMGS_c_resolved) || PVI.SRC),
                                void 0 !== PVI.SRC && (PVI.SRC = void 0),
                                (PVI.TBOX = (PVI.TRG.IMGS_overflowParent || PVI.TRG).getBoundingClientRect()),
                                (PVI.TBOX.Left = PVI.TBOX.left + e.pageXOffset),
                                (PVI.TBOX.Right = PVI.TBOX.Left + PVI.TBOX.width),
                                (PVI.TBOX.Top = PVI.TBOX.top + e.pageYOffset),
                                (PVI.TBOX.Bottom = PVI.TBOX.Top + PVI.TBOX.height),
                                "cr" !== cfg.hz.markOnHover
                                    ? ((PVI.TRG.style.outline = PVI.lastTRGStyle.outline), (PVI.lastTRGStyle.outline = null))
                                    : null !== PVI.lastTRGStyle.cursor &&
                                      (PVI.DIV && (PVI.DIV.style.cursor = ""),
                                      (PVI.TRG.style.cursor = PVI.lastTRGStyle.cursor),
                                      (PVI.lastTRGStyle.cursor = null)),
                                null === t || (t && t.params) || !1 === t)
                            ) {
                                if (!1 === t || (t && 1 === (t = PVI.resolve(t.URL, t.params, PVI.TRG)))) return PVI.create(), void PVI.show("R_js");
                                if (!1 === t) return void PVI.reset();
                                if (null === t)
                                    return void (
                                        (PVI.state < 4 || !PVI.TRG.IMGS_c) &&
                                        (PVI.state > 3 && PVI.IMG.removeAttribute("src"), PVI.create(), PVI.show("res"))
                                    );
                            }
                            if (PVI.TRG.IMGS_album) return PVI.createCAP(), void PVI.album("" + PVI.stack[PVI.TRG.IMGS_album][0]);
                            PVI.set(t);
                        }
                    },
                    m_move: function (t) {
                        if (!t || PVI.x !== t.clientX || PVI.y !== t.clientY) {
                            if (PVI.fullZm) {
                                var i,
                                    r,
                                    a = PVI.x,
                                    n = PVI.y;
                                if (
                                    (t || (t = {}),
                                    !0 === mdownstart && (mdownstart = !1),
                                    t.target && ((PVI.x = t.clientX), (PVI.y = t.clientY)),
                                    PVI.fullZm > 1 && !0 !== t[0])
                                )
                                    (i = PVI.BOX.style),
                                        3 === PVI.fullZm && t.target
                                            ? ((a = parseInt(i.left, 10) - a + t.clientX), (n = parseInt(i.top, 10) - n + t.clientY))
                                            : void 0 !== t[1]
                                            ? ((a = parseInt(i.left, 10) + t[0]), (n = parseInt(i.top, 10) + t[1]))
                                            : (a = null);
                                else {
                                    var l = 4 === PVI.state && PVI.DIV.curdeg % 180;
                                    PVI.BOX === PVI.DIV
                                        ? (PVI.TRG.IMGS_SVG && (r = (r = PVI.stack[PVI.IMG.src])[1] / r[0]),
                                          (i = t[2] || parseInt(PVI.DIV.style.width, 10)),
                                          (r = parseInt(i * (r || PVI.CNT.naturalHeight / PVI.CNT.naturalWidth) + PVI.DBOX.hpb, 10)),
                                          (i += PVI.DBOX.wpb))
                                        : ((i = PVI.LDR.wh[0]), (r = PVI.LDR.wh[1])),
                                        l ? ((l = i), (l = ((i = r) - (r = l)) / 2)) : (l = 0),
                                        (a = (i - PVI.DBOX.wpb > winW ? (-PVI.x * (i - winW + 80)) / winW + 40 : (winW - i) / 2) + l - PVI.DBOX.ml),
                                        (n = (r - PVI.DBOX.hpb > winH ? (-PVI.y * (r - winH + 80)) / winH + 40 : (winH - r) / 2) - l - PVI.DBOX.mt);
                                }
                                return (
                                    void 0 !== t[2] && ((PVI.BOX.style.width = t[2] + "px"), (PVI.BOX.style.height = t[3] + "px")),
                                    void (null !== a && ((PVI.BOX.style.left = a + "px"), (PVI.BOX.style.top = n + "px")))
                                );
                            }
                            (PVI.x = t.clientX),
                                (PVI.y = t.clientY),
                                (!PVI.freeze || cfg.hz.deactivate || t[cfg._freezeTriggerEventKey]) &&
                                    (PVI.state < 3
                                        ? cfg.hz.delayOnIdle &&
                                          1 !== PVI.fireHide &&
                                          PVI.state < 2 &&
                                          (PVI.timers.resolver && clearTimeout(PVI.timers.resolver),
                                          clearTimeout(PVI.timers.preview),
                                          (PVI.timers.preview = setTimeout(PVI.load, cfg.hz.delay)))
                                        : (t.target.IMGS_ &&
                                              PVI.TBOX &&
                                              (PVI.TBOX.Left > t.pageX || PVI.TBOX.Right < t.pageX || PVI.TBOX.Top > t.pageY || PVI.TBOX.Bottom < t.pageY)) ||
                                          (!t.target.IMGS_ && PVI.TRG !== t.target)
                                        ? PVI.m_over({ relatedTarget: PVI.TRG, clientX: t.clientX, clientY: t.clientY })
                                        : cfg.hz.move &&
                                          PVI.state > 2 &&
                                          !PVI.timers.m_move &&
                                          (3 === PVI.state || cfg.hz.placement < 2 || cfg.hz.placement > 3) &&
                                          (PVI.timers.m_move = e.requestAnimationFrame(PVI.m_move_show)));
                        }
                    },
                    m_move_show: function () {
                        PVI.state > 2 && PVI.show(), (PVI.timers.m_move = null);
                    },
                    _preload: function (e) {
                        if (!Array.isArray(e)) {
                            if ("string" != typeof e) return;
                            e = [e];
                        }
                        for (var t = 0, i = e.length - 1; t <= i; ++t) {
                            var r = e[t],
                                a = "#" === r[0];
                            if (!((cfg.hz.hiRes && a) || (!cfg.hz.hiRes && !a))) {
                                if (t !== i) continue;
                                0 !== t && (a = "#" === (r = e[0])[0]);
                            }
                            return (
                                a && (r = r.slice(1)),
                                -1 !== r.indexOf("&amp;") && (r = r.replace(/&amp;/g, "&")),
                                void (new Image().src = "/" === r[1] ? PVI.httpPrepend(r) : r)
                            );
                        }
                    },
                    preload: function (e) {
                        if (PVI.preloading) {
                            if (!e || "DOMNodeInserted" !== e.type)
                                return void (!1 === e && (delete PVI.preloading, t.body.removeEventListener("DOMNodeInserted", PVI.preload, !0)));
                        } else (e = null), (PVI.preloading = []), t.body.addEventListener("DOMNodeInserted", PVI.preload, !0);
                        var i = (e && e.target) || t.body;
                        i &&
                            !i.IMGS_ &&
                            1 === i.nodeType &&
                            (i = i.querySelectorAll('img[src], :not(img)[style*="background-image"], a[href]')) &&
                            i.length &&
                            ((i = [].slice.call(i)),
                            (PVI.preloading = PVI.preloading ? PVI.preloading.concat(i) : PVI.preloading),
                            (i = function () {
                                var e,
                                    t,
                                    r = 50,
                                    a = function () {
                                        (this.src = this.IMGS_src_arr.shift().replace(/^#/, "")), this.IMGS_src_arr.length || (this.onerror = null);
                                    };
                                for (PVI.resolve_delay = 200; (e = PVI.preloading.shift()); )
                                    if (
                                        !(
                                            ("A" === e.nodeName.toUpperCase() && e.childElementCount) ||
                                            e.IMGS_c_resolved ||
                                            e.IMGS_c ||
                                            "string" == typeof e.IMGS_caption ||
                                            e.IMGS_thumb
                                        )
                                    ) {
                                        if ((t = PVI.find(e))) {
                                            if (((e.IMGS_c_resolved = t), Array.isArray(t))) {
                                                var n,
                                                    l = new Image();
                                                for (l.IMGS_src_arr = [], n = 0; n < t.length; ++n)
                                                    cfg.hz.hiRes && "#" === t[n][0]
                                                        ? l.IMGS_src_arr.push(t[n].slice(1))
                                                        : "#" !== t[n][0] && l.IMGS_src_arr.push(t[n]);
                                                if (!l.IMGS_src_arr.length) return;
                                                (l.onerror = a), l.onerror();
                                            } else "string" != typeof t || rgxIsSVG.test(t) || (new Image().src = t);
                                            break;
                                        }
                                        if (null === t || r-- < 1) break;
                                    }
                                (PVI.resolve_delay = 0), PVI.preloading.length ? (PVI.timers.preload = setTimeout(i, 300)) : delete PVI.timers.preload;
                            }),
                            PVI.timers.preload ? (clearTimeout(PVI.timers.preload), (PVI.timers.preload = setTimeout(i, 300))) : i());
                    },
                    toggle: function (e) {
                        PVI.state || !0 === e ? PVI.init(null, !0) : cfg ? PVI.init() : Port.send({ cmd: "hello", no_grants: !0 });
                    },
                    onWinResize: function () {
                        viewportDimensions(), PVI.state < 3 || (PVI.fullZm ? 1 === PVI.fullZm && PVI.m_move() : PVI.show());
                    },
                    winOnMessage: function (i) {
                        var r = i.data,
                            a = r && r.vdfDpshPtdhhd;
                        if ("toggle" === a || "preload" === a || "isFrame" === a) {
                            var n = e.frames;
                            if (!n) return;
                            for (var l = n.length; l--; )
                                if (n[l] && n[l].postMessage) {
                                    try {
                                        if (0 === n[l].location.href.lastIndexOf("about:", 0)) continue;
                                    } catch (e) {}
                                    n[l].postMessage({ vdfDpshPtdhhd: a, parent: t.body.nodeName.toUpperCase() }, "*");
                                }
                            "isFrame" === a ? ((PVI.iFrame = "BODY" === r.parent), PVI.iFrame || e.addEventListener("resize", PVI.onWinResize, !0)) : PVI[a](r);
                        } else if ("from_frame" === a) {
                            if (PVI.iFrame) return void e.parent.postMessage(r, "*");
                            if (PVI.fullZm) return;
                            if (r.reset) return void PVI.reset();
                            if ((PVI.create(), (PVI.fireHide = !0), (PVI.TRG = PVI.HLP), PVI.resetNode(PVI.TRG), r.hide))
                                return void PVI.hide({
                                    target: PVI.TRG,
                                    clientX: PVI.DIV.offsetWidth / 2 + cfg.hz.margin,
                                    clientY: PVI.DIV.offsetHeight / 2 + cfg.hz.margin,
                                });
                            if (((PVI.x = PVI.y = 0), "string" == typeof r.msg)) return void PVI.show(r.msg);
                            if (!r.src) return;
                            (PVI.TRG.IMGS_caption = r.caption),
                                r.album &&
                                    ((PVI.TRG.IMGS_album = r.album.id),
                                    PVI.stack[r.album.id] || (PVI.stack[r.album.id] = r.album.list),
                                    (r.album = "" + PVI.stack[r.album.id][0])),
                                r.thumb && r.thumb[0] && ((PVI.TRG.IMGS_thumb = r.thumb[0]), (PVI.TRG.IMGS_thumb_ok = r.thumb[1])),
                                r.album ? PVI.album(r.album) : PVI.set(r.src);
                        }
                    },
                    onMessage: function (t) {
                        if (t)
                            if ("resolved" === t.cmd) {
                                var i = PVI.resolving[t.id] || PVI.TRG,
                                    r = cfg.sieve[t.params.rule.id];
                                if ((delete PVI.resolving[t.id], t.return_url || PVI.create(), !t.cache && (!0 === t.m || t.params.rule.skip_resolve))) {
                                    try {
                                        1 === r.res && "string" == typeof t.params.rule.req_res && (r.res = Function("$", t.params.rule.req_res)),
                                            (PVI.node = i),
                                            (t.m = r.res.call(PVI, t.params));
                                    } catch (e) {
                                        return (
                                            console.error(cfg.app?.name + ": [rule " + t.params.rule.id + "] " + e.message),
                                            t.return_url || i !== PVI.TRG || PVI.show("R_js"),
                                            1
                                        );
                                    }
                                    t.params.url && (t.params.url = t.params.url.join("")),
                                        cfg.tls.sieveCacheRes &&
                                            !t.params.rule.skip_resolve &&
                                            t.m &&
                                            Port.send({ cmd: "resolve_cache", url: t.params.url, cache: JSON.stringify(t.m), rule_id: t.params.rule.id });
                                }
                                if (
                                    (t.m &&
                                        !Array.isArray(t.m) &&
                                        "object" == typeof t.m &&
                                        (t.m[""]
                                            ? ("number" == typeof t.m.idx && (t.idx = t.m.idx + 1), (t.m = t.m[""]))
                                            : "string" == typeof t.m.loop && ((t.loop = !0), (t.m = t.m.loop))),
                                    Array.isArray(t.m)
                                        ? t.m.length
                                            ? (Array.isArray(t.m[0]) &&
                                                  (t.m.forEach(function (e) {
                                                      Array.isArray(e[0]) && 1 === e[0].length && (e[0] = e[0][0]);
                                                  }),
                                                  t.m.length > 1
                                                      ? ((i.IMGS_album = t.params.url),
                                                        PVI.stack[t.params.url]
                                                            ? ((t.m = PVI.stack[t.params.url]), (t.m = t.m[t.m[0]]))
                                                            : (PVI.createCAP(),
                                                              (t.idx = Math.max(1, Math.min(t.idx, t.m.length)) || 1),
                                                              t.m.unshift(t.idx),
                                                              (PVI.stack[t.params.url] = t.m),
                                                              (t.m = t.m[t.idx]),
                                                              (t.idx += "")))
                                                      : (t.m = t.m[0])),
                                              cfg.hz.capText &&
                                                  t.m[0] &&
                                                  (t.m[1] ? PVI.prepareCaption(i, t.m[1]) : cfg.hz.capLinkText && i.IMGS_caption && (t.m[1] = i.IMGS_caption)),
                                              (t.m = t.m[0]))
                                            : (t.m = null)
                                        : "object" != typeof t.m && "string" != typeof t.m && (t.m = !1),
                                    t.m)
                                ) {
                                    if (
                                        !t.noloop &&
                                        !i.IMGS_album &&
                                        "string" == typeof t.m &&
                                        (t.loop || (r.loop && r.loop & ("img" === t.params.rule.loop_param ? 2 : 1)))
                                    ) {
                                        if (((t.m = PVI.find({ href: t.m, IMGS_TRG: i })), null === t.m || 1 === t.m)) return t.m;
                                        if (!1 === t.m) return t.return_url || PVI.show("R_res"), t.m;
                                    }
                                    if (t.return_url) return t.m;
                                    i === PVI.TRG
                                        ? i.IMGS_album
                                            ? PVI.album(t.idx || "1")
                                            : PVI.set(t.m)
                                        : ((cfg.hz.preload > 1 || PVI.preloading) && PVI._preload(t.m), (i.IMGS_c_resolved = t.m));
                                } else {
                                    if (t.return_url) return delete PVI.TRG.IMGS_c_resolved, t.m;
                                    if (i === PVI.TRG) {
                                        if (i.IMGS_fallback_zoom) return PVI.set(i.IMGS_fallback_zoom), void delete i.IMGS_fallback_zoom;
                                        !1 === t.m ? (PVI.m_over({ relatedTarget: i }), (i.IMGS_c = !0), delete i.IMGS_c_resolved) : PVI.show("R_res");
                                    }
                                }
                            } else if ("toggle" === t.cmd || "preload" === t.cmd) e.top.postMessage({ vdfDpshPtdhhd: t.cmd }, "*");
                            else if ("hello" === t.cmd) {
                                var a = !!PVI.DIV;
                                PVI.init(null, !0), PVI.init(t), a && PVI.create();
                            }
                    },
                    init: function (i, r) {
                        if (r)
                            PVI.reset(),
                                (PVI.state = 0),
                                PVI.iFrame || e.removeEventListener("resize", PVI.onWinResize, !0),
                                PVI.DIV &&
                                    (t.documentElement.removeChild(PVI.DIV),
                                    t.documentElement.removeChild(PVI.LDR),
                                    (PVI.BOX = PVI.DIV = PVI.CNT = PVI.VID = PVI.IMG = PVI.CAP = PVI.TRG = PVI.interlacer = null)),
                                (PVI.lastScrollTRG = null);
                        else {
                            if (void 0 !== i) {
                                if (!i) return void PVI.initOnMouseMoveEnd();
                                if (((cfg = i.prefs), cfg && !cfg.hz.deactivate && "0" === cfg.hz.actTrigger && (cfg = null), !cfg))
                                    return void PVI.init(null, !0);
                                (PVI.freeze = !cfg.hz.deactivate),
                                    (cfg._freezeTriggerEventKey = cfg.hz.actTrigger.toLowerCase() + "Key"),
                                    PVI.convertSieveRegexes();
                                var a = function () {
                                    t.removeEventListener("DOMContentLoaded", a), t.body && (t.body.IMGS_c = !0), 3 === cfg.hz.preload && PVI.preload();
                                };
                                "loading" === t.readyState ? t.addEventListener("DOMContentLoaded", a) : a();
                            } else if (!cfg) return void PVI.initOnMouseMoveEnd();
                            viewportDimensions(),
                                Port.listen(PVI.onMessage),
                                (catchEvent.onkeydown = PVI.key_action),
                                (catchEvent.onmessage = PVI.winOnMessage);
                        }
                        t[(i = (r ? "remove" : "add") + "EventListener")]("wheel", PVI.scroller, { capture: !0, passive: !0 }),
                            t.documentElement[i]("mouseleave", PVI.m_leave, !1),
                            t[i]("visibilitychange", PVI.onVisibilityChange, !0),
                            e[i]("contextmenu", onContextMenu, !0),
                            e[i]("mouseover", PVI.m_over, !0),
                            e[i]("mousedown", onMouseDown, !0),
                            e[i]("mouseup", releaseFreeze, !0),
                            e[i]("dragend", releaseFreeze, !0);
                        try {
                            r || "1" !== e.sessionStorage.IMGS_suspend || PVI.toggle(!0);
                        } catch (e) {}
                        PVI.initOnMouseMoveEnd(!!PVI.capturedMoveEvent),
                            e.MutationObserver
                                ? (PVI.mutObserver && (PVI.mutObserver.disconnect(), (PVI.mutObserver = null)),
                                  r ||
                                      ((PVI.mutObserver = new e.MutationObserver(function (e) {
                                          for (var t = e.length; t--; ) {
                                              var i = e[t],
                                                  r = i.target,
                                                  a = i.attributeName;
                                              e: if (r !== PVI.TRG) {
                                                  if (PVI.TRG && (r.contains(PVI.TRG) || PVI.TRG.contains(r))) break e;
                                                  PVI.attrObserver(r, "style" === a, i.oldValue);
                                                  continue;
                                              }
                                              if ("title" === a || "alt" === a) {
                                                  if ("" === r[a]) continue;
                                              } else if ("style" === a) {
                                                  var n = r.style.backgroundImage;
                                                  if (!n) continue;
                                                  if (-1 !== i.oldValue.indexOf(n)) continue;
                                              }
                                              PVI.nodeToReset = r;
                                          }
                                      })),
                                      (PVI.mutObserverConf = {
                                          attributes: !0,
                                          attributeOldValue: !0,
                                          attributeFilter: ["href", "src", "style", "alt", "title"],
                                      })))
                                : (PVI.attrObserver = null);
                    },
                    _: function (i) {
                        var r,
                            a = Math.random().toString(36).slice(2),
                            n = function (e) {
                                this.removeEventListener(e.type, n), (r = e.detail);
                            };
                        e.addEventListener(a, n);
                        var l = t.createElement("script");
                        return (
                            (l.textContent = "dispatchEvent(new CustomEvent('" + a + "', {bubbles: false, detail: window['" + i + "']}))"),
                            t.body.appendChild(l).parentNode.removeChild(l),
                            r
                        );
                    },
                    capturedMoveEvent: null,
                    onInitMouseMove: function (t) {
                        PVI.capturedMoveEvent
                            ? (PVI.capturedMoveEvent = t)
                            : ((PVI.capturedMoveEvent = t),
                              e.top.postMessage({ vdfDpshPtdhhd: "isFrame" }, "*"),
                              Port.listen(PVI.init),
                              Port.send({ cmd: "hello" }));
                    },
                    initOnMouseMoveEnd: function (e) {
                        window.removeEventListener("mousemove", PVI.onInitMouseMove, !0),
                            !cfg || !e || (PVI.x && null === PVI.state) || PVI.m_over(PVI.capturedMoveEvent),
                            delete PVI.onInitMouseMove,
                            delete PVI.capturedMoveEvent,
                            (PVI.initOnMouseMoveEnd = function () {});
                    },
                };
            window.addEventListener("mousemove", PVI.onInitMouseMove, !0), (catchEvent.onmessage = PVI.winOnMessage);
        }
    }
}
