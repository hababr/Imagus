"use strict";
let cfg;
const catchEvent = {},
    app = { name: "Imagus", version: "0.9.9" };
function buildNodes(e, t) {
    if (e && Array.isArray(t)) {
        if (!t.length) return e;
        for (var n = e.ownerDocument, s = n.createDocumentFragment(), r = 0, i = t.length; r < i; r++)
            if (t[r])
                if ("string" != typeof t[r]) {
                    var o = n.createElement(t[r].tag);
                    if (t[r].attrs) for (var a in t[r].attrs) "style" === a ? (o.style.cssText = t[r].attrs[a]) : o.setAttribute(a, t[r].attrs[a]);
                    t[r].nodes ? buildNodes(o, t[r].nodes) : t[r].text && (o.textContent = t[r].text), s.appendChild(o);
                } else s.appendChild(n.createTextNode(t[r]));
        return s.childNodes.length && e.appendChild(s), e;
    }
}
window.addEventListener(
    "message",
    function (e) {
        e.data.hasOwnProperty("vdfDpshPtdhhd") && (e.stopImmediatePropagation(), catchEvent?.onmessage?.(e));
    },
    !0
),
    window.addEventListener(
        "keydown",
        function (e) {
            catchEvent?.onkeydown?.(e);
        },
        !0
    );
const Port = {
    listen: function (e) {
        this.listener && chrome.runtime.onMessage.removeListener(this.listener),
            "function" == typeof e
                ? (/^(ms-browser|moz)-extension:/.test(location.protocol)
                      ? (this.listener = function (t, n) {
                            n || e(t);
                        })
                      : (this.listener = e),
                  chrome.runtime.onMessage.addListener(this.listener))
                : (this.listener = null);
    },
    send: function (e) {
        Port.listener ? chrome.runtime.sendMessage(e, Port.listener) : chrome.runtime.sendMessage(e);
    },
};
