# Zero Width Replacer

Tampermonkey userscript that replaces zero-width characters (ZWSP, ZWNJ, ZWJ, BOM) with a visible emoji 🚨.  

---

## ✨ Features
- Detects and replaces hidden characters (`\u200B`, `\u200C`, `\u200D`, `\uFEFF`)
- Shows 🚨 emoji instead, so invisible text becomes noticeable
- Runs automatically and in real time

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
