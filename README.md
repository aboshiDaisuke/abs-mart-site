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

トップは、ぐろちゃんを大きく配置した背景と、手前の3Dの地面・サンタたちを同じビジュアル内に重ねています。ぐろちゃんは元の赤いオフショルダー衣装・白いファー・ハートのアクセサリーを保ち、見る側の左でピースする一枚のイラストとして描き直しました。肩から肘・手首を含めて描いており、別画像の手は重ねません。スマホでは説明文の下にイラストを置いて手や肘を切り抜かず、手前の雪の広場を重ねています。

雪の地面は厚みのある円形台座から、画面の下端を越えて続く雪原に変更しています。3Dの雪面と操作ボタンの背景を同じ色でつなぎ、下の赤い帯まで隙間が出ない構成です。影は別の受け面で描画し、雪面自体の色は照明や露出で変えません。

- **新しい3D版**：`/`（ローカルでは http://127.0.0.1:8000/ ）
- **最初の候補**：`/candidate-a/`（元の `christmas-2026` ブランチも保持）
- **モデル**：サンタ、トナカイ、雪だるま、オーナメントと電飾付きツリー、リボン付きプレゼント。`christmas-models.js` と `christmas-props.js` で形状から制作しています。
- **ツリーの細部**：枝先に凹凸を付けた7層の葉、630束の枝葉、枝に沿った雪、61灯の電飾、金具と吊り紐を持つ17個のオーナメント、キャンディケイン、面ごとに光を反射する星。枝葉・雪・電球はインスタンス描画でまとめています。
- **プレゼントの細部**：角を丸めた箱と蓋、厚みのある側面、内張り、雪の結晶柄の包装紙、幅とねじれのあるサテンのリボン、結び目・垂れる端・タグ。開くと箱の内側と回転する星が見えます。
- **質感**：包装紙の柄と反射用のHDR環境をコードで生成。金属の飾り、サテンのリボン、紙、葉、雪で粗さと反射の強さを変えています。外部テクスチャのダウンロードは不要です。
- **プレゼントの配置**：ツリーの枝にめり込んでいた根元の箱をなくし、プレゼントを右側へ分離。PCでは小さな2箱と開閉できる大きな箱を間隔を空けて並べ、スマホでは大きな箱を表示します。ツリー・雪だるま・ほかの箱との画面上の重なりと、画面端での切れを座標計算で確認しています。
- **操作**：モデルをタップ、または下のボタンをクリック／キーボード操作。サンタの手振り、トナカイの首振り、雪だるまのリアクション、ツリーの星と照明、プレゼントの開閉を楽しめます。
- **電飾と雪**：上部の電球に白い光の芯・色付きのにじみ・きらめきを加え、3Dツリーにも加算合成の光を追加。背景全体を3層の雪が流れ、広場にも3Dの雪が降ります。
- **動作制御**：雪・電飾・3Dをまとめて停止・再開。動きを減らす設定、データセーバー、画面外・バックグラウンドでのアニメーション停止に対応。WebGLが使えない場合は静的な広場と通常の作品一覧を表示し、背景の雪と停止操作は引き続き使えます。
- **画面サイズ**：スマホではモデルの配置も変更し、ツリーの後ろにほかの仲間が隠れないようにしています。
- **依存**：[Three.js](https://threejs.org/) 0.180.0と同バージョンの公式 [RoundedBoxGeometry](https://github.com/mrdoob/three.js/blob/r180/examples/jsm/geometries/RoundedBoxGeometry.js) を `vendor/three/` に同梱。アドオンのimport先だけローカルのThree.jsに変更しています。3D表示のための外部CDNアクセスは不要です。MITライセンスを同梱しています。
- 作品13件の内容・リンクと既存の転送ページは維持しています。

### イラストと候補の保存

組み込みの imagegen ツールで、既存キャラクターを参照したアニメ塗りの透過イラストを制作しました。

- 現行のピース姿：`santa_peace_full.webp`（1254×1254px・透過・可逆圧縮）と `santa_peace_640.webp` / `santa_peace_960.webp`。原本：`_src/christmas/santa_peace_v4.png`（git管理対象外）。全体を一枚絵として描き直し、表示サイズに合った画像を読み込みます。
- 前のバストアップ：`santa_bust_full.webp` / `santa_bust_640.webp` / `santa_bust_960.webp` を保存。原本：`_src/christmas/santa_bust_v2.png`（git管理対象外）。今回の顔・髪・衣装の参照元です。
- 不採用の手の重ね合わせ案：`santa_peace_hand_full.webp` / `santa_peace_hand_640.webp`。原本：`_src/christmas/santa_peace_hand.png`（git管理対象外）。元絵の下がった腕とつながらず不自然だったため、ページから手の表示と位置調整処理を撤去しました。素材は履歴用に保存し、現行ページでは読み込みません。
- 前の全身イラスト：`santa_anime_480.webp` / `santa_anime_800.webp` を候補として保存。原本：`_src/christmas/santa_anime.png`（git管理対象外）。
- 前の候補：`hero_christmas_*.webp` / `hero_christmas_1200.jpg`、`christmas.css`、`abs_mart_logo_christmas.svg` を保存。`candidate-a/` から閲覧できます。
- 新しいロゴ：`abs_mart_logo_toyland.svg`。共有用画像は最初の候補の `hero_christmas_1200.jpg` を引き続き使用しています。
- 各生成プロンプトは末尾に記録しています。

ハロウィンのCSS・3Dモデル・画像は履歴用に残していますが、現行ページでは読み込みません。

<details>
<summary>前のバストアップの生成プロンプト（組み込み imagegen）</summary>

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

<details>
<summary>不採用のピース素材の生成プロンプト（組み込み imagegen）</summary>

```text
Use case: background-extraction
Asset type: transparent foreground hand-and-sleeve cutout to layer in a website.
Input image: hand pose and drawing-style reference ONLY.
Make an isolated cutout of ONLY the raised RIGHT hand, wrist and red sleeve with white fluffy fur cuff visible on the VIEWER'S LEFT of the reference. Preserve the hand pose, tan skin color, long hot-pink fingernails, crisp anime linework and cel shading.
Show a natural five-digit peace sign with palm toward the viewer: index and middle finger extended in a V, ring and little finger curled down, one thumb across the folded fingers. Match the exact hand orientation of the reference. Include the full fingers, wrist, large white fur cuff, and a short red sleeve continuing down toward the lower-left corner. The lower sleeve should have a naturally rounded end that can overlap an existing sleeve. Keep the whole cutout inside the canvas with transparent margins.
DO NOT include any face, head, hair, neck, torso, chest, necklace, hat, or other body parts. Only a single hand, wrist, fur cuff, and short sleeve. No background or cast shadow, no objects or letters. True transparent alpha, sharp edges, clean high-resolution drawing. Portrait 2:3 composition.
```

</details>

<details>
<summary>現行ピース姿の生成プロンプト（組み込み imagegen・元のバストアップを参照）</summary>

```text
Create one new, coherent anime illustration using the reference for this adult Christmas mascot's identity and clothing design.

The picture focuses on her cheerful smiling face and a natural right-hand peace sign, which appears on the VIEWER'S LEFT. Repose the whole shoulder, upper arm, bent elbow, forearm and hand together. Show a believable bent arm, normal adult proportions, one shoulder connection, one elbow and one wrist. The original lowered right-arm pose must be replaced. Use correct overlaps between the raised arm, sleeve, hair and torso. Her other arm remains down.

Keep her recognizable face, tan skin, blonde hair with pink ends, turquoise twin hair clips, pink heart earrings, gold chain with pink heart pendant, and red Santa hat. Preserve the reference's red off-shoulder Santa clothing with its broad fluffy ivory fur neckline and gold button. Keep this same clothing style and colors; do not substitute a high-neck coat or a center fur stripe.

Friendly everyday holiday pose, face and gesture as the visual focus, relaxed expression, normal anatomy. Frame from above the Santa hat to the upper chest, keeping the entire raised hand and bent arm visible on the left. Palm faces the viewer; index and middle fingers form a V, ring and little fingers curl into the palm, and one thumb rests across them. Five fingers total.

Clean Japanese anime cel shading, crisp outlines, sharp eyes and hair strands. Single complete character illustration on a genuinely transparent background. No detached hand layer, no separate body parts, no scenery, text, haze, glow, or blur.
```

</details>

### 確認

JavaScriptの構文、13作品へのリンクとローカル画像参照、5種類の3Dモデル生成、320〜1380px幅のカメラ内への収まりを確認。モック描画環境で、プレゼント開閉、全キャラクターの操作、停止・再開、動きを減らす設定、データセーバー、WebGL障害時のフォールバック、コンテキスト復旧、ページ復帰・破棄を確認しています。ブラウザ連携が起動できず、新しい版の実ブラウザでの描画・目視確認は未実施です。

作り込んだツリーとプレゼントは、実際の形状をBlenderに渡し、閉じた状態・蓋を開いた状態を拡大レンダリングして目視確認しています（造形確認用で、ブラウザとは照明・描画方式が異なります）。画像は `_src/christmas/props-detail-preview.png` / `props-detail-open.png` に保存。320〜1100pxの描画幅で、開閉・視差回転を含めてツリー、プレゼント、雪だるまが重ならず、画面端で切れないことを座標計算でも確認しています。

## ファイル構成

```
index.html                     ページ本体
style.css                      共通スタイル
toyland.css                    新しい3Dクリスマス版のスタイル
christmas-models.js            サンタ・トナカイ・雪だるま・ツリー・ギフトの形状
christmas-props.js             詳細な枝葉・電飾・飾り・箱・リボン・質感
christmas-world.js             3D描画・操作・アニメーションの制御
vendor/three/                  Three.js 0.180.0とMITライセンス
santa_peace_*.webp             現行のピース姿の一枚絵
santa_bust_*.webp              前のバストアップ（保存）
santa_peace_hand_*.webp        不採用の手の重ね合わせ案（未使用）
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
