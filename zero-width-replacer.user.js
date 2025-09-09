// ==UserScript==
// @name         Zero Width Replacer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace zero-width characters with emojis in wplace.live
// @author       SimpleBrush
// @license      Unlicense
// @match        https://wplace.live/*
// @grant        none
// ==/UserScript==

/*
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org>
*/

(function () {
    'use strict';

    const marker = "🚨";

    const zwcRegex = /[\u200B\u200C\u200D\uFEFF]/g;

    function replaceInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (zwcRegex.test(node.nodeValue)) {
                node.nodeValue = node.nodeValue.replace(zwcRegex, marker);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(replaceInNode);
        }
    }

    replaceInNode(document.body);

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(replaceInNode);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
})();
