# 上傳 GitHub 與發布 Pages

1. 解壓縮作業包，打開 predictive 資料夾。
2. 進入 https://github.com/Amarislin/predictive ，選 Add file → Upload files。
3. 把 predictive「裡面的所有檔案和資料夾」拖到上傳區。不要把最外層 predictive 資料夾整個變成儲存庫的額外一層。
4. 確認根目錄有 index.html、AGENTS.md、story.js、engine.js、branch.js、game.js、sound.js、styles.css、art.js、README.md；assets、docs、scripts保留原有資料夾結構。
5. 不要將 assets 的圖片或 docs、scripts 裡的檔案攤平。瀏覽器翻譯功能可暫時關閉，避免誤判英文檔名。
6. 輸入提交訊息「完成聯想詞作業版」，按 Commit changes。
7. Settings → Pages：Source選Deploy from a branch，Branch選main，資料夾選/(root)。按Save；如果Save呈灰色且畫面已顯示main與root，代表設定已相同。
8. Actions中的pages build and deployment出現綠色勾後，開 https://amarislin.github.io/predictive/ 。必要時Ctrl+Shift+R重新載入。
9. 確認首頁有聲音提醒、可開教學、開始可玩，並檢查照片、雲端通知與兩結局。再提交docs/submission.txt內容，補上個人資料。

更新前可先下載GitHub原始碼作備份。這份作業包不包含Sites內部部署設定或憑證，不需把它們上傳GitHub。公開網站是純靜態檔案，不需執行build.py。
