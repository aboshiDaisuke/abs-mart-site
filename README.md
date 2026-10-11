# ABS Mart — ランディングページ

遊べる・使える無料ゲーム＆ツール集 **[ABS Mart](https://abs-mart.net/)** の紹介用ランディングページです。
GitHub Pages でホスティングしています。

🔗 公開URL: **https://abs-mart.net/**

## 概要

遊べるゲームと便利なツールを紹介する、静的な1ページサイトです（ずんだもん動画制作キットはPCに入れて使う制作キット、こえくらべは各自のGemini APIキーで動く仕組みです）。
HTML / CSS / 最小限の JavaScript のみで構成し、フレームワーク・ビルド工程はありません。

## 紹介しているゲーム＆ツール

| # | ゲーム・ツール | リンク |
|---|---|---|
| 01 | 鮨図鑑（鮨ネタクイズゲーム） | https://sushi-zukan.pages.dev/ |
| 02 | GRO-CHAN SKY BLASTER（シューティングゲーム） | https://grochan-sky-blaster.pages.dev/ |
| 03 | SUNSET DRIVE（3Dカートレーシング） | https://sunset-drive.pages.dev/ |
| 04 | 夜桜詣（3D散策ゲーム） | https://yozakura.app/ |
| 05 | 金萬 3D（3Dビューア・非公式ファンメイド） | https://aboshidaisuke.github.io/kinman-3d/ |
| 06 | KAMI VIBES 神様占い（生年月日と神社で占う無料占い） | https://kami-uranai-github.pages.dev/ |
| 07 | ずんだもん動画制作キット | https://aboshidaisuke.github.io/zundamon-remotion/ |
| 08 | こえくらべ（Gemini TTS 聴きくらべ・非公式） | https://koekurabe-app.web.app/ |
| 09 | おみやげ配布あみだくじ（抽選） | https://aboshidaisuke.github.io/amidakuji/ |
| 10 | SRT to FCPXML Editor（字幕変換） | https://aboshidaisuke.github.io/srt-to-fcpxml/ |
| 11 | Media to MP3 Merger（音声結合） | https://aboshidaisuke.github.io/media-to-mp3-merger/ |
| 12 | PDF Editor | https://aboshidaisuke.github.io/pdf-editor/ |
| 13 | 飲み会 予算管理 | https://aboshidaisuke.github.io/BBQ/ |

## 季節デザイン：ハロウィン版（2026）

2026年のハロウィン期間は、ギャル×ハロウィン仕様で公開しています。

- 上書きスタイル：`halloween.css`（`style.css` の後に読み込み）
- タイトルロゴ：`abs_mart_logo_halloween.webp`
- トップ画像：`hero_halloween_*.webp` / `hero_halloween_1280.jpg`（動画の代わり）
- 3Dおばけ：`models/halloween/*.glb`（[model-viewer](https://modelviewer.dev/) で表示）
- トップ画像の立体視差：`hero-depth.js` + 奥行きマップ `hero_halloween_depth.webp`（three.js を読み込み後に遅延ロード。視差を減らす設定・データセーバー・WebGL非対応時は静止画のまま）
- ヒョウ柄タイル：`leopard.svg`
- 上に戻るボタン：`style.css` / `script.js` に追加（通常版でもそのまま使えます）

### 元に戻す方法

ハロウィン版の直前の状態に、タグ `pre-halloween-2026` を付けてあります。
ハロウィン版はマージコミット1つにまとめて `main` に入れているので、そのマージを打ち消せば元に戻ります。

```sh
# ハロウィン版のマージコミットを探す
git log --merges --oneline --grep="Halloween"

# そのマージを打ち消して公開する
git revert -m 1 <マージコミット>
git push origin main
```

ファイルを丸ごとハロウィン前に戻したい場合は、`git checkout pre-halloween-2026 -- .` のあとでコミットします（ハロウィン以降の変更も消えるので注意）。

## ファイル構成

```
index.html                     ページ本体
style.css                      スタイル
script.js                      ナビ追従・出現アニメ（IntersectionObserver）
hero-depth.js                  ハロウィン版トップ画像の立体視差・霧・火の粉（three.js）
favicon.svg                    ファビコン
abs_mart_hero.mp4              ヒーロー動画（自動再生・ループ）
abs_mart_hero_poster.jpg       ヒーロー動画のポスター/フォールバック画像
abs_mart_share.jpg             OG/Twitter共有画像
work_*_generated.jpg           各ツールのビジュアル
CNAME                          カスタムドメイン（abs-mart.net）
<ツール名>/index.html           旧URL abs-mart.net/<ツール名>/ → aboshidaisuke.github.io/<ツール名>/ への転送ページ
DOMAIN_MANAGEMENT.md           ドメイン管理メモ
_src/                          画像の原本（AI生成ソース・gitignore）
```

## 開発・確認

ビルド不要。ローカル確認は任意の静的サーバーで：

```sh
python3 -m http.server 8000
# → http://127.0.0.1:8000/
```

## デプロイ

`main` ブランチへ push すると GitHub Pages が自動公開します。
ドメイン・DNS の設定は [DOMAIN_MANAGEMENT.md](DOMAIN_MANAGEMENT.md) を参照。
