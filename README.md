# Gulpのテンプレート

各バージョン  
Node.js v10.14.1  
npm        v  6.4.1  
Gulp       v  3.9.1  
webpack    v  4.29.0  
@babel/core v 7.0.0

ファイル構成
```
.
├── package-lock.json         
├── package.json                    // node.jsのモジュール $ npm install -D gulp　　　でパッケージをインストール
└── project                          // プロジェクトのルート
    ├── gulpfile.js                    // gulpの設定ファイル  $ npx gulp で起動
    ├── webpack.config.js            // webpackの設定ファイル
    │
    ├── source
    ├── dist                    // 公開用ルートディレクトリ
    │   └── assets
    │       ├── css
    │       ├── images
    │       └── js
    └── src                     // ソース用ルートディレクトリ
        │
        ├── comp_images      // タスク「img」で画像が出力されるディレクトリ
        │
        ├── nat_images　　　　　　　　　　　　　　// タスク「img」で圧縮したい画像を入れるディレクトリ
        ├── js
        │   ├── main.js
        ├── pug
        │   └── index.pug
        └── scss
            └── style.scss
```
# temp_gulp_pug
