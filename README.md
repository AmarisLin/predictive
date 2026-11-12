# 聯想詞predictive
以手機聊天、聯想詞與個人詞庫為媒介的繁體中文模擬恐怖互動遊戲。蘇蘇向男友阿寧反映輸入法異常；玩家透過回覆、詞庫、地址和照片，逐步遇到無法解釋的情況。包含兩個結局。

遊玩前記得開啟裝置聲音。點開始後自動播放音效；不需要麥克風權限。

## 公開連結
- 目前完成版：https://apex-ai-racing-lab.miwanman8741.chatgpt.site/
- GitHub儲存庫：https://github.com/Amarislin/predictive
- GitHub Pages：https://amarislin.github.io/predictive/

本包是2026-11-12確認完成版；本次更新完成版網站及作業包，GitHub與GitHub Pages仍需依 docs/deploy.md 手動上傳，尚未由本次作業更新。

## 操作
1. 先看遊玩教學。點鍵盤中的預設回覆逐字帶入，再按↑送出。
2. 聯想詞和字鍵僅為畫面顯示，無法點選輸入。
3. 必要時查看詞庫，可清除、複製地址；地址複製後回鍵盤貼上再送出。
4. 朋友要求照片時查看照片並傳送，後續可比對兩版本。
5. 按劇情提示繼續；部分異常會自動送出或觸發，無需額外按鈕。
6. 可暫停／繼續、調整訊息速度、重看教學與結局紀錄。音效自動開啟，低動態固定關閉。

## 在電腦開啟
解壓縮後，直接雙擊 predictive/index.html。建議用Chrome或Edge；若瀏覽器限制本機儲存，請以以下方式啟動：
```sh
cd predictive
python -m http.server 8000
```
然後瀏覽 http://localhost:8000/ 。手機可直接開公開連結。

## 專案結構
AGENTS.md 是AI開發規則，涵蓋目的、風格、互動順序、兩結局、檔案分工、新內容格式及驗證；程式依檔案職責拆分，便於AI依規則維護。
- story.js：劇本資料；engine.js：狀態邏輯；branch.js：結局與通話。
- game.js：互動與渲染；sound.js：本地合成音效。
- index.html／styles.css：介面；art.js／assets/：照片與教學圖片。
- docs/submission.txt：可貼到作業平台的繳交內容。
- docs/deploy.md：GitHub上傳與Pages發布步驟。
- docs/solutions.md：完整流程與測試範圍，含劇透。

## 驗證與限制
```sh
node scripts/check.mjs
node scripts/branches-check.mjs
node scripts/words-check.mjs
python3 build.py
```
使用Node內建模組驗證主線、門檻、兩結局、存檔、候選抽樣、阿寧先行訊息及音效生命週期。無npm安裝需求。Python只用於本機伺服器或建立dist，公開網頁無需Python。
遊戲採固定劇本，不即時呼叫生成式AI；AI參與企劃、程式、素材與文件製作。所有登入、雲端、通話、電量及錄影皆為網頁模擬。音效以Web Audio合成，不連真實通訊服務。
