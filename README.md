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
| 01 | KAMI VIBES 神様占い（生年月日と神社で占う無料占い） | https://kami-uranai-github.pages.dev/ |
| 02 | 鮨図鑑（鮨ネタクイズゲーム） | https://sushi-zukan.pages.dev/ |
| 03 | 金萬 3D（3Dビューア・非公式ファンメイド） | https://aboshidaisuke.github.io/kinman-3d/ |
| 04 | GRO-CHAN SKY BLASTER（シューティングゲーム） | https://grochan-sky-blaster.pages.dev/ |
| 05 | 夜桜詣（3D散策ゲーム） | https://yozakura.app/ |
| 06 | SUNSET DRIVE（3Dカートレーシング） | https://sunset-drive.pages.dev/ |
| 07 | ずんだもん動画制作キット | https://aboshidaisuke.github.io/zundamon-remotion/ |
| 08 | こえくらべ（Gemini TTS 聴きくらべ・非公式） | https://koekurabe-app.web.app/ |
| 09 | おみやげ配布あみだくじ（抽選） | https://aboshidaisuke.github.io/amidakuji/ |
| 10 | SRT to FCPXML Editor（字幕変換） | https://aboshidaisuke.github.io/srt-to-fcpxml/ |
| 11 | Media to MP3 Merger（音声結合） | https://aboshidaisuke.github.io/media-to-mp3-merger/ |
| 12 | PDF Editor | https://aboshidaisuke.github.io/pdf-editor/ |
| 13 | 飲み会 予算管理 | https://aboshidaisuke.github.io/BBQ/ |

## 季節デザイン：クリスマス版（2026）

作業ブランチ：`christmas-2026`。深いグリーン、クリスマスレッド、アイボリーを使ったクリスマスマーケット風のデザインです。

- 季節スタイル：`christmas.css`（共通の `style.css` の後に読み込み）
- サンタ帽付きロゴ：`abs_mart_logo_christmas.svg`
- サンタ姿のぐろちゃん：`hero_christmas_640.webp` / `hero_christmas_960.webp` / `hero_christmas_1536.webp`
- JPEGフォールバック・OG/Twitter共有画像：`hero_christmas_1200.jpg`（1200 × 800）
- 季節ファビコン：`favicon-christmas.svg`
- 雪の演出：CSSアニメーション。`script.js` のボタンで停止・再開でき、`prefers-reduced-motion`・データセーバー使用時は無効です。
- 作品13件の内容・リンクと、既存の転送ページは維持しています。

ハロウィンのCSS・3Dモデル・奥行き演出・画像は履歴用に残していますが、クリスマス版では読み込みません。ハロウィン前の状態には `pre-halloween-2026` タグがあります。

### イラスト制作

組み込みの imagegen ツールで、既存のハロウィン画像を参照してサンタ衣装とクリスマスマーケットの背景を生成しました。配信用画像は上記4ファイル、生成原本は `_src/christmas/hero_santa.png`（git管理対象外）です。生成プロンプトは末尾に記録しています。

## ファイル構成

```
index.html                     ページ本体
style.css                      共通スタイル
christmas.css                  クリスマス版の上書きスタイル
script.js                      ナビ追従・出現アニメ・雪の停止切り替え
hero-depth.js                  旧ハロウィン版の立体視差（現在は未使用）
favicon-christmas.svg          クリスマス版ファビコン
abs_mart_logo_christmas.svg     クリスマス版ロゴ
hero_christmas_*               サンタのヒーロー画像・共有画像
favicon.svg                    通常版ファビコン（保存）
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

<details>
<summary>クリスマスイラストの生成プロンプト（組み込み imagegen）</summary>

```text
Use case: identity-preserve
Asset type: Christmas hero illustration for the Japanese games and tools website ABS Mart.
Input image 1: edit target and character identity reference. Transform this Halloween illustration into an entirely Christmas version.
Primary request: The same cheerful adult gyaru woman becomes a Santa girl at a magical Christmas market. Preserve her recognizable face, warm tan skin, blonde hair with pink tips, turquoise hair clips, expressive eyes and confident friendly smile, and the polished detailed anime illustration style.
Change her costume completely to a rich Christmas-red velvet Santa coat/dress with fluffy ivory fur collar and cuffs, a classic floppy Santa hat, tasteful gold heart jewelry and red gloves. Warm festive outfit, no devil costume, no horns, no bat wings, no lingerie. She holds a beautifully wrapped emerald-green gift box with a gold ribbon toward the viewer.
Scene: snow-covered European Christmas market at blue hour, a magnificent evergreen Christmas tree with warm golden fairy lights, red and gold baubles, illuminated little wooden stalls, snowy rooftops, a few gently falling snowflakes. Warm and welcoming, luminous and richly illustrated.
Composition: landscape 3:2 illustration, waist-up portrait, woman centered slightly right with entire Santa hat fully in frame and generous headroom. Her face and gift are the unmistakable focus. Background clearly visible around her. Site copy will be outside the image. No text, letters, logos, watermark or border.
Palette: deep evergreen, cranberry red, ivory snow, warm metallic gold; softly glowing blue night sky. High quality clean anime line work, nuanced painted lighting. Remove all Halloween imagery.
```

</details>
