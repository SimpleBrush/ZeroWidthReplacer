# Zero Width Replacer

Tampermonkey userscript that replaces invisible and zero-width characters (ZWSP, ZWNJ, ZWJ, BOM, BiDi controls, etc.) with a visible, selectable emoji.  

---

## ✨ Features
- Detects and replaces a wide range of hidden characters, including zero-width spaces (`\u200B`, `\u200C`, `\u200D`, `\uFEFF`) and BiDi control characters (`\u200E`, `\u200F`, `\u202A–\u202E`, `\u2066–\u2069`)
- Shows a selectable emoji marker instead, so invisible text becomes noticeable
- Provides a draggable control panel with position persistence
- Allows choosing the replacement emoji from predefined options

---

## 🎯 Purpose
This script is made specifically for [wplace.live](https://wplace.live/) to prevent impersonation.  
Some users insert zero-width characters into nicknames or alliances to mimic others.  
By making these characters visible, such tricks become immediately noticeable.

---

## 🛠 Installation
1. Install [Tampermonkey](https://www.tampermonkey.net/) extension in your browser
2. [Click here to install the script](https://github.com/SimpleBrush/ZeroWidthReplacer/raw/main/zero-width-replacer.user.js)

---

## 📜 License
This project is released under [The Unlicense](LICENSE).  
Free and unencumbered software released into the public domain.
