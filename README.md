# Zero Width Replacer

Tampermonkey userscript that highlights invisible and lookalike characters inside alliance tags,
helping you spot impersonation tricks at a glance.

---

## ✨ Features
- Detects and replaces a wide range of hidden characters, including:
  - Zero-width spaces (`\u200B`, `\u200C`, `\u200D`, `\uFEFF`)
  - Control characters like BiDi marks (`\u200E`, `\u200F`, `\u202A–\u202E`, `\u2066–\u2069`)
  - Non-breaking space (`\u00A0`)
  - Tab (`\u0009`)
- Shows a selectable emoji marker instead, so invisible text becomes noticeable
- Provides a draggable control panel with position persistence
- Allows choosing the replacement emoji from preset options
- Offers a highlight toggle with preset color options
- Applies a monospace-based font style to alliance tags, making homoglyph-based impersonation easier to spot

---

## 🎯 Purpose
This script is made specifically for [wplace.live](https://wplace.live/) to prevent impersonation.
Some users insert zero-width, confusing, or lookalike characters into alliance tags to mimic others.
By making these characters visible and applying a consistent font style, such tricks become immediately noticeable.
The script focuses only on alliance tags, so normal text elsewhere on the page is unaffected.

---

## 🛠 Installation
1. Install [Tampermonkey](https://www.tampermonkey.net/) extension in your browser
2. [Click here to install the script](https://github.com/SimpleBrush/ZeroWidthReplacer/raw/main/zero-width-replacer.user.js)

---

## 📜 License
This project is released under [The Unlicense](LICENSE).
Free and unencumbered software released into the public domain.
