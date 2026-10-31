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

## 季節デザイン：Christmas Toyland（2026）

新しい候補は `christmas-toyland-2026` ブランチです。夜空、キャンディカラーの見出し、アニメ塗りのサンタ衣装のぐろちゃんと、Three.jsの雪の広場を組み合わせています。

トップは、ぐろちゃんを大きく配置した背景と、手前の3Dの地面・サンタたちを同じビジュアル内に重ねています。ぐろちゃんは顔と輪郭がくっきりしたバストアップに描き直し、手がフレームに入らない構図にしています。イラスト専用の固定高さをなくし、スマホの説明とボタンも内容に沿って並べ、作品一覧までの余白を詰めています。

雪の地面は厚みのある円形台座から、画面の下端を越えて続く雪原に変更しています。3Dの雪面と操作ボタンの背景を同じ色でつなぎ、下の赤い帯まで隙間が出ない構成です。影は別の受け面で描画し、雪面自体の色は照明や露出で変えません。

- **新しい3D版**：`/`（ローカルでは http://127.0.0.1:8000/ ）
- **最初の候補**：`/candidate-a/`（元の `christmas-2026` ブランチも保持）
- **モデル**：サンタ、トナカイ、雪だるま、オーナメントと電飾付きツリー、リボン付きプレゼント。`christmas-models.js` で形状から制作しています。
- **操作**：モデルをタップ、または下のボタンをクリック／キーボード操作。サンタの手振り、トナカイの首振り、雪だるまのリアクション、ツリーの星と照明、プレゼントの開閉を楽しめます。
- **電飾と雪**：上部の電球に白い光の芯・色付きのにじみ・きらめきを加え、3Dツリーにも加算合成の光を追加。背景全体を3層の雪が流れ、広場にも3Dの雪が降ります。
- **動作制御**：雪・電飾・3Dをまとめて停止・再開。動きを減らす設定、データセーバー、画面外・バックグラウンドでのアニメーション停止に対応。WebGLが使えない場合は静的な広場と通常の作品一覧を表示し、背景の雪と停止操作は引き続き使えます。
- **画面サイズ**：スマホではモデルの配置も変更し、ツリーの後ろにほかの仲間が隠れないようにしています。
- **依存**：[Three.js](https://threejs.org/) 0.180.0を `vendor/three/` に同梱。3D表示のための外部CDNアクセスは不要です。MITライセンスを同梱しています。
- 作品13件の内容・リンクと既存の転送ページは維持しています。

### イラストと候補の保存

組み込みの imagegen ツールで、既存キャラクターを参照したアニメ塗りの透過イラストを制作しました。

- 現行のバストアップ：`santa_bust_full.webp`（1254×1254px・透過・可逆圧縮）と `santa_bust_640.webp` / `santa_bust_960.webp`。原本：`_src/christmas/santa_bust_v2.png`（git管理対象外）。表示枠の幅だけでなく `object-fit: cover` による拡大を考慮して画像を選び、画像自体へのぼかし・影フィルターも外しています。
- 前の全身イラスト：`santa_anime_480.webp` / `santa_anime_800.webp` を候補として保存。原本：`_src/christmas/santa_anime.png`（git管理対象外）。
- 前の候補：`hero_christmas_*.webp` / `hero_christmas_1200.jpg`、`christmas.css`、`abs_mart_logo_christmas.svg` を保存。`candidate-a/` から閲覧できます。
- 新しいロゴ：`abs_mart_logo_toyland.svg`。共有用画像は最初の候補の `hero_christmas_1200.jpg` を引き続き使用しています。
- 各生成プロンプトは末尾に記録しています。

ハロウィンのCSS・3Dモデル・画像は履歴用に残していますが、現行ページでは読み込みません。

<details>
<summary>現行バストアップの生成プロンプト（組み込み imagegen）</summary>

```text
Use case: identity-preserve
Asset type: high-resolution transparent anime bust portrait for a website, a NEW replacement illustration.
Reference image: use ONLY the adult woman's character identity — tan skin, blonde hair with pink ends, turquoise twin hair clips, confident gyaru smile, heart earrings. Do not retain Halloween costume or background.
Primary request: a beautifully drawn CRISP bust-up anime portrait of this adult woman wearing a classic red Santa hat and red Santa coat with a thick ivory fur collar and a small gold heart pendant. She faces the viewer, shoulders slightly angled, head gently tilted, both eyes open and a bright friendly smile.
Framing: BUST UP ONLY, from the complete Santa hat down to the lower chest. Her face occupies about 35% of the full image height. Entire hat and both shoulders visible, balanced centered composition. Arms hang naturally DOWN OUTSIDE THE FRAME. Absolutely NO hands, NO fingers, NO gift box, NO waving pose. Bottom is a clean chest-level portrait crop.
Art direction: clean Japanese anime key art, sharp confident ink outlines, crisp eyelashes, sharply separated hair strands, hard-edged two-tone cel shadows, vibrant but controlled color. Precise clean anatomy and facial proportions. No blur, no depth-of-field, no haze, no glow around the character, no painterly soft shading, no plastic skin. Preserve readable strong silhouette at website size.
Background: genuinely transparent alpha including every area outside the character, with clean opaque character pixels and only narrow antialiased edge pixels. No background colors, no gradient backdrop, no cast shadow, no vignette, no atmospheric fringe. No text or logos.
Output: square composition, 2048 x 2048 if possible; maximum sharpness and detail at native resolution.
```

</details>

### 確認

JavaScriptの構文、13作品へのリンクとローカル画像参照、5種類の3Dモデル生成、320〜1380px幅のカメラ内への収まりを確認。モック描画環境で、プレゼント開閉、全キャラクターの操作、停止・再開、動きを減らす設定、データセーバー、WebGL障害時のフォールバック、コンテキスト復旧、ページ復帰・破棄を確認しています。ブラウザ連携が起動できず、新しい版の実ブラウザでの描画・目視確認は未実施です。

## ファイル構成

```
index.html                     ページ本体
style.css                      共通スタイル
toyland.css                    新しい3Dクリスマス版のスタイル
christmas-models.js            サンタ・トナカイ・雪だるま・ツリー・ギフトの形状
christmas-world.js             3D描画・操作・アニメーションの制御
vendor/three/                  Three.js 0.180.0とMITライセンス
santa_bust_*.webp              現行の透過サンタ・バストアップ
santa_anime_*.webp             前の全身イラスト（保存）
candidate-a/                   最初の候補の比較用ページ
christmas.css                  最初の候補用のスタイル
script.js                      ナビ追従・出現アニメ・雪と電飾の停止制御
hero-depth.js                  旧ハロウィン版の立体視差（現在は未使用）
favicon-christmas.svg          クリスマス版ファビコン
abs_mart_logo_toyland.svg       新しい3D版のロゴ
abs_mart_logo_christmas.svg     最初の候補のロゴ
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
<summary>最初の候補のイラスト生成プロンプト（組み込み imagegen）</summary>

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

<details>
<summary>新しいアニメ塗り立ち絵の生成プロンプト（組み込み imagegen）</summary>

```text
Use case: style-transfer
Asset type: a transparent anime character cutout for a playful interactive Christmas website.
Input image 1: character identity reference only. Make a NEW illustration and NEW pose, not a recolor of this scene.
Subject: the same adult gyaru mascot with tan skin, blonde hair with pastel-pink tips, two turquoise hair clips, lively eyes, heart earrings, cheerful confident personality.
Style: authentic Japanese TV anime CEL SHADING / アニメ塗り. Crisp clean dark linework, solid flat base colors, exactly one or two hard-edged shadow shapes per material, simple small hard highlights. Vibrant red, cream white, emerald accents. No painterly rendering, no soft airbrushing, no realistic glossy skin, no elaborate gradients, no photographic lighting. Appeal of a polished anime character key visual.
Outfit: cute red Santa mini coat dress with fluffy white cuffs and white hem, a closed high white fur collar, black belt with a gold square buckle, red floppy Santa hat, warm dark tights and red winter boots. Festive and stylish, fully dressed.
Pose: FULL BODY, dynamic three-quarter view, standing with weight on one leg and the other boot lifted playfully behind. One hand raised in a cheerful wave, the other arm hugging a big mint-green present with a bright golden ribbon. Hair flows gently to the side, happy open smile. Entire body, hat, raised hand and boots must fit with 7% transparent padding all around.
Background: completely transparent alpha, no background, no snow, no floor, no cast ground shadow, no scene, no other characters. Isolated character and the gift only. Portrait 2:3 framing. No text, no logos, no watermark.
```

</details>
