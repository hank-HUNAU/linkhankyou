# 《中国文化概况》Overview 在线学习资源

英语教学配套的在线学习资源，随附 4 音色（英式女/男、美式女/男）合成朗读音频，由 GitHub Pages 托管。

## 在线入口
- 根地址（主页）：本页，提供两个应用入口
- **电子课本**：`电子课本/Overview电子课本.html`
  课文幻灯阅读 + 段落朗读 + 逐段译文对照（行内 / 左右分栏），朗读时同步高亮
- **词汇预习 · 复习 · 自测**：`中国文化概况电子资源/overview_vocabulary.html`
  词卡（教材重点 / 真题扩展 / 高频补充）+ 拼写自测，进度本地保存

## 目录结构
```
├── index.html                     主页（双应用入口）
├── 电子课本/                      电子课本应用（相对链接，独立可部署）
│   ├── Overview电子课本.html
│   ├── slide_helpers.js / etextbook_data.js / etextbook_tr.js
│   └── Overview_原文朗读/段落朗读/<音色>/<段落id>.mp3
└── 中国文化概况电子资源/           词汇预习复习自测应用
    ├── overview_vocabulary.html
    └── Overview词卡音频/<音色>/<词或例句>.mp3
```

## 说明
- 两个应用均为纯静态 HTML + JS，全部使用相对链接，可整体拷贝到任意静态托管（GitHub Pages / Gitee Pages 等）。
- 音色切换、字号调整、已掌握进度等均保存在浏览器本地（localStorage）。
- 音频为教学用途合成语音（48kbps MP3），数据取自教材与历年真题。
