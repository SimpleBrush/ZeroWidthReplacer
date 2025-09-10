// ==UserScript==
// @name         Zero Width Replacer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replace zero-width characters with emojis in wplace.live
// @author       SimpleBrush
// @license      Unlicense
// @match        https://wplace.live/*
// @updateURL    https://github.com/SimpleBrush/ZeroWidthReplacer/raw/main/zero-width-replacer.user.js
// @downloadURL  https://github.com/SimpleBrush/ZeroWidthReplacer/raw/main/zero-width-replacer.user.js
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

  // ===== Config =====
  const choices = ["", "🚨", "❌", "⚠️", "␣"];
  let marker = localStorage.getItem("zwr-marker") ?? "🚨";

  let highlightOn = localStorage.getItem("zwr-highlight-on") === "true";
  let highlightColor = localStorage.getItem("zwr-highlight-color") || "yellow";

  const zwcRegex = /[\u200B\u200C\u200D\uFEFF\u2060\u00AD\u180E\u202A-\u202E\u2066-\u2069\u200E\u200F\u061C]/g;

  // ===== Replacement =====
  function replaceInNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      if (!zwcRegex.test(text)) return;

      const frag = document.createDocumentFragment();
      let i = 0;
      text.replace(zwcRegex, (_m, off) => {
        if (off > i) frag.appendChild(document.createTextNode(text.slice(i, off)));
        const span = document.createElement('span');
        span.className = 'zwr-marker';
        span.textContent = marker;
        frag.appendChild(span);
        i = off + 1;
      });
      if (i < text.length) frag.appendChild(document.createTextNode(text.slice(i)));
      node.parentNode.replaceChild(frag, node);
      applyHighlight();
    } else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('zwr-marker')) {
      node.childNodes.forEach(replaceInNode);
    }
  }

  function applyReplacement() {
    document.querySelectorAll('.zwr-marker').forEach(s => { s.textContent = marker; });
    applyHighlight();
  }

  function applyHighlight() {
    document.querySelectorAll('.zwr-marker').forEach(span => {
      if (span.parentElement) {
        span.parentElement.style.backgroundColor = highlightOn ? highlightColor : "";
      }
    });
  }

  replaceInNode(document.body);

  const observer = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(replaceInNode));
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  // ===== Panel =====
  const panel = document.createElement('div');
  panel.style.position = 'fixed';

  const savedLeft = localStorage.getItem('zwr-panel-left');
  const savedTop = localStorage.getItem('zwr-panel-top');

  if (savedLeft && savedTop) {
    panel.style.left = savedLeft;
    panel.style.top = savedTop;
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
  } else {
    panel.style.left = 'auto';
    panel.style.bottom = 'auto';
    panel.style.right = '10px';
    panel.style.top = '10px';
  }

  panel.style.background = 'rgba(30,30,30,0.85)';
  panel.style.color = '#fff';
  panel.style.border = '1px solid #555';
  panel.style.borderRadius = '5px';
  panel.style.padding = '3px 6px 6px 6px';
  panel.style.zIndex = 99999;
  panel.style.fontSize = '20px';
  panel.style.boxShadow = '0 2px 6px rgba(0,0,0,0.5)';
  panel.style.userSelect = 'none';
  panel.style.width = 'fit-content';

  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  panel.appendChild(wrapper);

  // ===== Drag handle =====
  const dragHandle = document.createElement('div');
  dragHandle.textContent = '⋮ drag';
  dragHandle.style.cursor = 'move';
  dragHandle.style.textAlign = 'center';
  dragHandle.style.fontSize = '14px';
  dragHandle.style.background = '#444';
  dragHandle.style.color = '#eee';
  dragHandle.style.borderRadius = '3px';
  dragHandle.style.marginBottom = '3px';
  wrapper.appendChild(dragHandle);

  // ===== Preview and toggle =====
  const previewBox = document.createElement('div');
  previewBox.style.display = 'inline-flex';
  previewBox.style.alignItems = 'center';
  previewBox.style.background = '#555';
  previewBox.style.color = '#fff';
  previewBox.style.padding = '2px 6px';
  previewBox.style.border = '1px solid #888';
  previewBox.style.borderRadius = '3px';
  previewBox.style.cursor = 'pointer';
  previewBox.style.gap = '6px';
  previewBox.style.position = 'relative';
  wrapper.appendChild(previewBox);

  const previewEmoji = document.createElement('span');
  previewEmoji.textContent = marker;
  previewEmoji.style.fontSize = '20px';
  previewEmoji.style.display = 'inline-block';
  previewEmoji.style.width = '24px';
  previewEmoji.style.height = '24px';
  previewEmoji.style.lineHeight = '24px';
  previewEmoji.style.textAlign = 'center';

  const toggleIcon = document.createElement('span');
  toggleIcon.textContent = '▼';
  toggleIcon.style.fontSize = '14px';

  previewBox.appendChild(previewEmoji);
  previewBox.appendChild(toggleIcon);

  // ===== Dropdown =====
  const choiceContainer = document.createElement('div');
  choiceContainer.style.display = 'none';
  choiceContainer.style.position = 'absolute';
  choiceContainer.style.top = '100%';
  choiceContainer.style.marginTop = '4px';
  choiceContainer.style.background = '#333';
  choiceContainer.style.padding = '6px';
  choiceContainer.style.border = '1px solid #555';
  choiceContainer.style.borderRadius = '4px';
  choiceContainer.style.boxShadow = '0 4px 10px rgba(0,0,0,0.4)';
  choiceContainer.style.gap = '10px';
  choiceContainer.style.flexDirection = 'column';
  previewBox.appendChild(choiceContainer);

  ['click', 'mousedown', 'mouseup'].forEach(ev => {
    choiceContainer.addEventListener(ev, e => e.stopPropagation());
  });

  // ===== Section: emoji choices =====
  const choiceBox = document.createElement('div');
  choiceBox.style.display = 'grid';
  choiceBox.style.gridTemplateColumns = 'repeat(4, auto)';
  choiceBox.style.justifyContent = 'start';
  choiceBox.style.gap = '6px';
  choiceContainer.appendChild(choiceBox);

  function renderChoices() {
    choiceBox.innerHTML = '';
    choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.textContent = ch;
      btn.style.fontSize = '20px';
      btn.style.width = '40px';
      btn.style.height = '40px';
      btn.style.lineHeight = '40px';
      btn.style.border = '2px solid transparent';
      btn.style.background = '#222';
      btn.style.color = '#fff';
      btn.style.borderRadius = '6px';
      btn.style.textAlign = 'center';
      if (ch === marker) {
        btn.style.border = '2px solid deepskyblue';
        btn.style.background = '#225';
      }
      btn.onclick = e => {
        e.stopPropagation();
        marker = ch;
        localStorage.setItem('zwr-marker', marker);
        applyReplacement();
        previewEmoji.textContent = marker;
        renderChoices();
      };
      choiceBox.appendChild(btn);
    });
  }
  renderChoices();

  // ===== Section: highlight =====
  const highlightSection = document.createElement('div');
  highlightSection.style.display = 'flex';
  highlightSection.style.flexDirection = 'column';
  highlightSection.style.gap = '6px';
  choiceContainer.appendChild(highlightSection);

  const highlightToggle = document.createElement('button');
  highlightToggle.style.display = 'flex';
  highlightToggle.style.alignItems = 'center';
  highlightToggle.style.gap = '6px';
  highlightToggle.style.fontSize = '16px';
  highlightToggle.style.padding = '4px 8px';
  highlightToggle.style.background = '#222';
  highlightToggle.style.color = '#fff';
  highlightToggle.style.border = '1px solid #555';
  highlightToggle.style.borderRadius = '4px';
  highlightToggle.style.cursor = 'pointer';

  function renderHighlightToggle() {
    highlightToggle.textContent = highlightOn ? '✅ Highlight' : '⬜ Highlight';
  }
  renderHighlightToggle();

  highlightToggle.onclick = e => {
    e.stopPropagation();
    highlightOn = !highlightOn;
    localStorage.setItem('zwr-highlight-on', highlightOn);
    renderHighlightToggle();
    applyHighlight();
  };

  highlightSection.appendChild(highlightToggle);

  const palette = [
    { color: 'yellow', emoji: '🟨' },
    { color: 'lightgreen', emoji: '🟩' },
    { color: 'lightblue', emoji: '🟦' },
    { color: 'red', emoji: '🟥' }
  ];

  const paletteBox = document.createElement('div');
  paletteBox.style.display = 'grid';
  paletteBox.style.gridTemplateColumns = 'repeat(4, auto)';
  paletteBox.style.gap = '4px';
  highlightSection.appendChild(paletteBox);

  function renderPalette() {
    paletteBox.innerHTML = '';
    palette.forEach(item => {
      const btn = document.createElement('button');
      btn.textContent = item.emoji;
      btn.style.fontSize = '20px';
      btn.style.width = '32px';
      btn.style.height = '32px';
      btn.style.lineHeight = '32px';
      btn.style.border = '2px solid transparent';
      btn.style.borderRadius = '4px';
      btn.style.background = '#222';
      if (item.color === highlightColor) {
        btn.style.border = '2px solid deepskyblue';
      }
      btn.onclick = e => {
        e.stopPropagation();
        highlightColor = item.color;
        localStorage.setItem('zwr-highlight-color', highlightColor);
        applyHighlight();
        renderPalette();
      };
      paletteBox.appendChild(btn);
    });
  }
  renderPalette();

  // ===== Dropdown toggle =====
  previewBox.onclick = e => {
    e.stopPropagation();
    if (choiceContainer.style.display === 'none') {
      choiceContainer.style.display = 'flex';
      const pv = previewBox.getBoundingClientRect();
      const w = choiceContainer.offsetWidth;
      const overflowRight = pv.left + w > window.innerWidth;
      choiceContainer.style.left = overflowRight ? 'auto' : '0';
      choiceContainer.style.right = overflowRight ? '0' : 'auto';
      toggleIcon.textContent = '▲';
    } else {
      choiceContainer.style.display = 'none';
      toggleIcon.textContent = '▼';
    }
  };

  document.body.appendChild(panel);

  // ===== Dragging =====
  let dragging = false, offsetX = 0, offsetY = 0;

  function movePanel(x, y) {
    let left = x - offsetX;
    let top = y - offsetY;
    const maxLeft = window.innerWidth - panel.offsetWidth;
    const maxTop = window.innerHeight - panel.offsetHeight;
    if (left < 0) left = 0;
    if (top < 0) top = 0;
    if (left > maxLeft) left = maxLeft;
    if (top > maxTop) top = maxTop;
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
  }

  // Mouse events
  dragHandle.addEventListener('mousedown', e => {
    dragging = true;
    const r = panel.getBoundingClientRect();
    offsetX = e.clientX - r.left;
    offsetY = e.clientY - r.top;
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    movePanel(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    localStorage.setItem('zwr-panel-left', panel.style.left);
    localStorage.setItem('zwr-panel-top', panel.style.top);
  });

  // Touch events
  dragHandle.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    dragging = true;
    const r = panel.getBoundingClientRect();
    offsetX = touch.clientX - r.left;
    offsetY = touch.clientY - r.top;
    e.preventDefault();
  });

  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const touch = e.touches[0];
    movePanel(touch.clientX, touch.clientY);
  });

  document.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    localStorage.setItem('zwr-panel-left', panel.style.left);
    localStorage.setItem('zwr-panel-top', panel.style.top);
  });

  // ===== Re-clamp on resize =====
  window.addEventListener('resize', () => {
    let left = parseInt(panel.style.left, 10);
    let top = parseInt(panel.style.top, 10);
    if (isNaN(left)) left = panel.getBoundingClientRect().left;
    if (isNaN(top)) top = panel.getBoundingClientRect().top;
    const maxLeft = window.innerWidth - panel.offsetWidth;
    const maxTop = window.innerHeight - panel.offsetHeight;
    if (left > maxLeft) left = maxLeft;
    if (top > maxTop) top = maxTop;
    if (left < 0) left = 0;
    if (top < 0) top = 0;
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
    localStorage.setItem('zwr-panel-left', panel.style.left);
    localStorage.setItem('zwr-panel-top', panel.style.top);
  });

  // ===== Init highlight =====
  applyHighlight();
})();
