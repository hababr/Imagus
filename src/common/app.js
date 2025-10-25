"use strict";

let cfg;

const catchEvent = {};
const app = {};

function buildNodes(element, nodes) {
    if (!element || !Array.isArray(nodes)) {
        return;
    }

    if (!nodes.length) {
        return element;
    }

    const doc = element.ownerDocument;
    const fragment = doc.createDocumentFragment();

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!node) continue;

        if (typeof node !== "string") {
            const element = doc.createElement(node.tag);

            if (node.attrs) {
                for (const attr in node.attrs) {
                    if (attr === "style") {
                        element.style.cssText = node.attrs[attr];
                    } else {
                        element.setAttribute(attr, node.attrs[attr]);
                    }
                }
            }

            if (node.nodes) {
                buildNodes(element, node.nodes);
            } else if (node.text) {
                element.textContent = node.text;
            }

            fragment.appendChild(element);
        } else {
            fragment.appendChild(doc.createTextNode(node));
        }
    }

    if (fragment.childNodes.length) {
        element.appendChild(fragment);
    }

    return element;
}

// Message event listener
window.addEventListener(
    "message",
    function (event) {
        if (event.data.hasOwnProperty("vdfDpshPtdhhd")) {
            event.stopImmediatePropagation();
            catchEvent?.onmessage?.(event);
        }
    },
    true
);

// Keydown event listener
window.addEventListener(
    "keydown",
    function (event) {
        catchEvent?.onkeydown?.(event);
    },
    true
);

// Port handling
const Port = {
    listen: function (callback) {
        if (this.listener) {
            chrome.runtime.onMessage.removeListener(this.listener);
        }

        if (typeof callback === "function") {
            if (/^(ms-browser|moz)-extension:/.test(location.protocol)) {
                this.listener = function (message, sender) {
                    if (!sender) {
                        callback(message);
                    }
                };
            } else {
                this.listener = callback;
            }
            chrome.runtime.onMessage.addListener(this.listener);
        } else {
            this.listener = null;
        }
    },

    send: async function (message) {
        if (Port.listener) {
            return chrome.runtime.sendMessage(message, Port.listener);
        } else {
            return chrome.runtime.sendMessage(message);
        }
    },
};
