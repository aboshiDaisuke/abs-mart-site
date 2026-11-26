// www.abs-mart.net を https://abs-mart.net へ 301 転送するだけの Worker。
// GitHub Pages が www の証明書を出さないため、Cloudflare 側で受けて転送する（2026-11-27）。
export default {
  fetch(request) {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.hostname = "abs-mart.net";
    url.port = "";
    return Response.redirect(url.toString(), 301);
  },
};
