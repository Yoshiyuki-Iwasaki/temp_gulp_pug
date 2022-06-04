# GULP + PUG + SCSSテンプレート

##  各バージョン
Node.js     v10.14.1

npm         v6.4.1

Gulp        v3.9.1

webpack     v4.29.0

@babel/core v7.0.0

## インストール方法

1. npm install -D gulp でパッケージをインストール

2. npx gulp で起動

##  ファイル構成
```
.
├── package-lock.json
├── package.json        // node.jsのモジュール
├── gulpfile.js         // gulpの設定ファイル
├── webpack.config.js   // webpackの設定ファイル
│
├── dist                // 公開用ルートディレクトリ
│   └── assets
│       ├── css
│       ├── images
│       └── js
└── src                 // ソース用ルートディレクトリ
     └── images         // 圧縮したい画像を入れるディレクトリ
     ├── js
     │   ├── main.js
     ├── pug
     │   └── index.pug
     └── scss
        └── style.scss
```
