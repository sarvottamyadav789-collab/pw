// functions/[[path]].js
var TARGET_HOST = "www.learnxpw.site";
var TARGET_ORIGIN = `https://${TARGET_HOST}`;
var BRAND_NAME = "GB STUDY";
var TELEGRAM_URL = "https://t.me/GBFreestudy";
var ICON_URL = "https://i.ibb.co/Q3g9fGSt/1791541921524.png";
var OLD_ICON_URL = "https://i.ibb.co/V8CbjrG/image.png";
var OLD_TG_URL = "https://t.me/+AgMz8cG-x8VmNGY1";
var OLD_TG_URL_ALT = "https://t.me/AgMz8cG-x8VmNGY1";
var cachedAccessCookie = "studymeta_access=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6ImZ1bGwiLCJpYXQiOjE3OTM2MjM4ODAsImV4cCI6MTc5MzcxMDI4MH0.RRjEAcW3pPiuWyKF6EDDgK0epLc-gCLCVMna1DFk_nA";
var refreshPromise = null;
function base64UrlDecode(str) {
  try {
    let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    return atob(b64);
  } catch {
    return "";
  }
}
function isTokenExpired(cookieStr) {
  try {
    const rawJwt = cookieStr.replace(/^studymeta_access=/, "").split(";")[0];
    const parts = rawJwt.split(".");
    if (parts.length < 2) return true;
    const decoded = base64UrlDecode(parts[1]);
    if (!decoded) return true;
    const payload = JSON.parse(decoded);
    if (!payload.exp) return true;
    return Math.floor(Date.now() / 1e3) >= payload.exp - 7200;
  } catch {
    return true;
  }
}
async function fetchFreshAccessCookie() {
  try {
    const anonId = "anon_" + Date.now();
    const keyGenUrl = `${TARGET_ORIGIN}/key-generate?redirect=%2Fstudy%2Fbatches&type=full&anon_id=${anonId}`;
    const res = await fetch(keyGenUrl, {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        referer: `${TARGET_ORIGIN}/study/batches`,
        cookie: `anon_id=${anonId}`
      }
    });
    const pageText = await res.text();
    const m = pageText.match(/\\?"token\\?":\s*\\?"([^"\\]+)\\?"/);
    if (!m || !m[1]) {
      return cachedAccessCookie;
    }
    const token = m[1];
    const verifyRes = await fetch(`${TARGET_ORIGIN}/api/complete-verification`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        referer: `${TARGET_ORIGIN}/verify?token=${encodeURIComponent(token)}`
      },
      body: JSON.stringify({ token })
    });
    const setCookie = verifyRes.headers.get("set-cookie");
    if (setCookie && setCookie.includes("studymeta_access=")) {
      const match = setCookie.match(/studymeta_access=[^;]+/);
      if (match) {
        cachedAccessCookie = match[0];
        return cachedAccessCookie;
      }
    }
  } catch (err) {
    console.error("[Cloudflare Edge] Failed to auto-refresh access cookie:", err);
  }
  return cachedAccessCookie;
}
async function getAccessCookie() {
  if (cachedAccessCookie && !isTokenExpired(cachedAccessCookie)) {
    return cachedAccessCookie;
  }
  if (!refreshPromise) {
    refreshPromise = fetchFreshAccessCookie().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}
function transformText(content) {
  let text = content;
  text = text.replaceAll("https://www.learnxpw.site", "");
  text = text.replaceAll("http://www.learnxpw.site", "");
  text = text.replaceAll("https:\\/\\/www.learnxpw.site", "");
  text = text.replaceAll("https://learnxpw.site", "");
  text = text.replaceAll("http://learnxpw.site", "");
  text = text.replaceAll("https:\\/\\/learnxpw.site", "");
  text = text.replaceAll(OLD_ICON_URL, ICON_URL);
  text = text.replaceAll(
    "https:\\/\\/i.ibb.co\\/V8CbjrG\\/image.png",
    ICON_URL.replace(/\//g, "\\/")
  );
  text = text.replaceAll("V8CbjrG/image.png", "Q3g9fGSt/1791541921524.png");
  text = text.replaceAll("V8CbjrG\\/image.png", "Q3g9fGSt\\/1791541921524.png");
  text = text.replaceAll("https://ibb.co/0R7qc34v", ICON_URL);
  text = text.replaceAll(
    "https:\\/\\/ibb.co\\/0R7qc34v",
    ICON_URL.replace(/\//g, "\\/")
  );
  text = text.replaceAll(OLD_TG_URL, TELEGRAM_URL);
  text = text.replaceAll(
    "https:\\/\\/t.me\\/+AgMz8cG-x8VmNGY1",
    TELEGRAM_URL.replace(/\//g, "\\/")
  );
  text = text.replaceAll(OLD_TG_URL_ALT, TELEGRAM_URL);
  text = text.replaceAll(
    "https:\\/\\/t.me\\/AgMz8cG-x8VmNGY1",
    TELEGRAM_URL.replace(/\//g, "\\/")
  );
  text = text.replaceAll("://t.me/+AgMz8cG-x8VmNGY1", "://t.me/GBFreestudy");
  text = text.replaceAll(":\\/\\/t.me\\/+AgMz8cG-x8VmNGY1", ":\\/\\/t.me\\/GBFreestudy");
  text = text.replaceAll("+AgMz8cG-x8VmNGY1", "GBFreestudy");
  text = text.replaceAll("AgMz8cG-x8VmNGY1", "GBFreestudy");
  text = text.replaceAll("@bookverse_probot", "@GBFreestudy");
  text = text.replaceAll('"webName":"Learnxpw"', `"webName":"${BRAND_NAME}"`);
  text = text.replaceAll(
    '"sidebarTitle":"Learnxpw"',
    `"sidebarTitle":"${BRAND_NAME}"`
  );
  text = text.replaceAll(
    "Learnxpw \u2014 a comprehensive online study platform",
    `${BRAND_NAME} \u2014 a comprehensive online study platform`
  );
  text = text.replaceAll("<title>Learnxpw</title>", `<title>${BRAND_NAME}</title>`);
  text = text.replaceAll("\xA9 2026 Learnxpw", `\xA9 2026 ${BRAND_NAME}`);
  text = text.replaceAll("\xA9 2025 Learnxpw", `\xA9 2025 ${BRAND_NAME}`);
  text = text.replaceAll("Learnxpw", BRAND_NAME);
  text = text.replaceAll("LEARNXPW", BRAND_NAME);
  text = text.replaceAll("learnxpw", BRAND_NAME);
  text = text.replaceAll(/"shortner_servers":\[[^\]]*\]/g, '"shortner_servers":[]');
  text = text.replaceAll('"isDirectLoginOpen":false', '"isDirectLoginOpen":true');
  const EXISTING_HEAD_SCRIPT = `document.querySelectorAll('body link[rel="icon"], body link[rel="apple-touch-icon"]').forEach(el => document.head.appendChild(el))`;
  const ENHANCED_HEAD_SCRIPT = `${EXISTING_HEAD_SCRIPT};
(function() {
  if (typeof window === 'undefined') return;
  var pwIconUrl = 'https://i.ibb.co/Q3g9fGSt/1791541921524.png';

  function injectPwBooks() {
    try {
      if (document.querySelector('a[data-pw-books="1"]')) return;
      var targets = document.querySelectorAll('a[href*="missionjeet"], a[href*="nexttoppers"], nav a');
      var target = null;
      for (var i = 0; i < targets.length; i++) {
        var h = targets[i].getAttribute('href') || '';
        if (h.includes('missionjeet')) { target = targets[i]; break; }
      }
      if (!target && targets.length > 0) target = targets[targets.length - 1];
      if (target && target.parentNode && !target.parentNode.querySelector('a[data-pw-books="1"]')) {
        var a = document.createElement('a');
        a.href = 'https://gb-study-1-322206542053.asia-south1.run.app/';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('data-pw-books', '1');
        a.className = target.className || '';
        a.innerHTML = '<div class="flex items-center text-foreground gap-3 px-4 py-3 rounded-lg cursor-pointer text-sm transition-colors duration-200 hover:bg-foreground/20 text-background"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open w-5 h-5 flex-shrink-0 text-[#5a4bda]"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg><span style="font-weight:600;">PW BOOKS</span></div>';
        target.parentNode.insertBefore(a, target.nextSibling);
      }
    } catch(e) {}
  }

  function injectPoweredBy() {
    try {
      if (document.querySelector('#gb-powered-by')) return;
      var allButtons = document.querySelectorAll('button');
      var parentBox = null;
      for (var i = 0; i < allButtons.length; i++) {
        var txt = (allButtons[i].textContent || '').trim();
        if (txt === 'Load More' || txt === 'Loading...') {
          var pb = allButtons[i].closest('.flex.justify-center') || allButtons[i].parentElement;
          if (pb && pb.parentElement) {
            parentBox = pb.parentElement;
            break;
          }
        }
      }
      if (!parentBox) {
        var grids = document.querySelectorAll('.grid');
        if (grids.length > 0) parentBox = grids[grids.length - 1].parentElement;
      }
      if (!parentBox) {
        var mainEl = document.querySelector('main') || document.body;
        parentBox = mainEl;
      }
      if (parentBox && !parentBox.querySelector('#gb-powered-by')) {
        var pBox = document.createElement('div');
        pBox.id = 'gb-powered-by';
        pBox.className = 'w-full text-center py-6 mt-4 mb-8 flex justify-center items-center text-sm text-slate-400 font-medium tracking-wide';
        pBox.innerHTML = 'Powered by&nbsp;<a href="https://t.me/sarvottamji" target="_blank" rel="noopener noreferrer" class="font-bold underline underline-offset-4 transition-colors" style="color: #ef4444 !important; font-weight: 700; text-decoration: underline; text-underline-offset: 4px;"><span style="color: #ef4444 !important;">GB STUDY</span></a>';
        parentBox.appendChild(pBox);
      }
    } catch(e) {}
  }

  function fixMissingBatchBanners() {
    try {
      var imgs = document.querySelectorAll('img');
      imgs.forEach(function(img) {
        var s = img.getAttribute('src') || img.src || '';
        if (!s || s.trim() === '' || s.includes('undefined') || s.includes('null')) {
          img.src = pwIconUrl;
        }
        if (!img.dataset.pwErrorBound) {
          img.dataset.pwErrorBound = '1';
          img.addEventListener('error', function() {
            this.src = pwIconUrl;
          });
        }
      });
    } catch(e) {}
  }

  var isHydrated = false;

  function enableEnhancer() {
    if (isHydrated) return;
    isHydrated = true;
    runAll();
    setInterval(runAll, 500);
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
      setTimeout(enableEnhancer, 1200);
    });

    ['pointerdown', 'touchstart', 'click', 'scroll'].forEach(function(evt) {
      window.addEventListener(evt, function() {
        enableEnhancer();
        setTimeout(runAll, 50);
      }, { passive: true });
    });
  }

  function runAll() {
    if (!isHydrated) return;
    injectPwBooks();
    injectPoweredBy();
    fixMissingBatchBanners();
  }
})();`;
  if (text.includes(EXISTING_HEAD_SCRIPT)) {
    text = text.replace(EXISTING_HEAD_SCRIPT, ENHANCED_HEAD_SCRIPT);
  }
  return text;
}
async function handleEdgeRequest(req, _env, _ctx) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  if (pathname === "/") {
    if (url.searchParams.get("home") !== "1") {
      return Response.redirect(`${url.origin}/study/batches`, 307);
    }
  }
  if (pathname === "/key-generate") {
    const accessCookie2 = await getAccessCookie();
    const target = url.searchParams.get("redirect") || "/study/batches";
    const headers = new Headers();
    if (accessCookie2) {
      headers.set("Set-Cookie", `${accessCookie2}; Path=/; SameSite=Lax; Max-Age=86400`);
    }
    headers.set("Location", target.startsWith("http") ? target : `${url.origin}${target}`);
    return new Response(null, { status: 307, headers });
  }
  if (pathname === "/verify") {
    const accessCookie2 = await getAccessCookie();
    const headers = new Headers();
    if (accessCookie2) {
      headers.set("Set-Cookie", `${accessCookie2}; Path=/; SameSite=Lax; Max-Age=86400`);
    }
    headers.set("Location", `${url.origin}/study/batches`);
    return new Response(null, { status: 307, headers });
  }
  if (pathname === "/study/key") {
    return Response.redirect(`${url.origin}/study/batches`, 307);
  }
  if (pathname === "/logo.png") {
    return Response.redirect(ICON_URL, 307);
  }
  if (pathname === "/api/auth/serverInfo") {
    return new Response(
      JSON.stringify({
        webName: BRAND_NAME,
        sidebarLogoUrl: ICON_URL,
        sidebarTitle: BRAND_NAME,
        maintenanceMode: false,
        tg_channel: TELEGRAM_URL,
        tg_username: "",
        isDirectLoginOpen: true,
        tg_bot: "@GBFreestudy",
        shortner_servers: []
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
  const targetUrl = new URL(pathname + url.search, TARGET_ORIGIN);
  let refererHeader = `${TARGET_ORIGIN}/`;
  const incomingReferer = req.headers.get("referer");
  if (incomingReferer) {
    try {
      const u = new URL(incomingReferer);
      u.protocol = "https:";
      u.host = TARGET_HOST;
      refererHeader = u.toString();
    } catch {
      refererHeader = `${TARGET_ORIGIN}/`;
    }
  }
  if (pathname.startsWith("/api/video-url") || pathname.startsWith("/api/get-video-url") || pathname.startsWith("/api/Schedule") || pathname.startsWith("/api/play") || pathname.startsWith("/api/get-otp")) {
    const q = url.searchParams;
    const batchId = q.get("batch_id") || q.get("batchId") || q.get("BatchId") || "";
    const subjectId = q.get("subject_id") || q.get("subjectId") || q.get("SubjectId") || "";
    const videoId = q.get("video_id") || q.get("videoId") || q.get("childId") || q.get("ChildId") || q.get("contentId") || q.get("ContentId") || "";
    if (batchId || subjectId || videoId) {
      refererHeader = `${TARGET_ORIGIN}/watch?batchId=${batchId}&SubjectId=${subjectId}&ContentId=${videoId}`;
    } else {
      refererHeader = `${TARGET_ORIGIN}/watch`;
    }
  }
  if (pathname === "/api/Schedule") {
    const batchId = url.searchParams.get("BatchId") || url.searchParams.get("batchId") || url.searchParams.get("batch_id") || "";
    const subjectId = url.searchParams.get("SubjectId") || url.searchParams.get("subjectId") || url.searchParams.get("subject_id") || "";
    const contentId = url.searchParams.get("ContentId") || url.searchParams.get("contentId") || url.searchParams.get("ChildId") || url.searchParams.get("childId") || url.searchParams.get("videoId") || url.searchParams.get("video_id") || "";
    const accessCookie2 = await getAccessCookie();
    try {
      const scheduleRes = await fetch(
        `${TARGET_ORIGIN}/api/Schedule?BatchId=${encodeURIComponent(batchId)}&SubjectId=${encodeURIComponent(subjectId)}&ContentId=${encodeURIComponent(contentId)}`,
        {
          headers: {
            "user-agent": req.headers.get("user-agent") || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            referer: refererHeader,
            cookie: accessCookie2
          }
        }
      );
      if (scheduleRes.status === 200) {
        const data = await scheduleRes.json().catch(() => null);
        if (data && data.success && (data.data?.urlType || Array.isArray(data.data) && data.data[0]?.urlType)) {
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          });
        }
      }
    } catch {
    }
    let urlType = "penpencilvdo";
    let videoUrl = "";
    try {
      const vRes = await fetch(
        `${TARGET_ORIGIN}/api/video-url?batch_id=${encodeURIComponent(batchId)}&subject_id=${encodeURIComponent(subjectId)}&video_id=${encodeURIComponent(contentId)}`,
        {
          headers: {
            "user-agent": req.headers.get("user-agent") || "Mozilla/5.0",
            referer: refererHeader,
            cookie: accessCookie2
          }
        }
      );
      if (vRes.status === 200) {
        const vData = await vRes.json().catch(() => null);
        if (vData?.success && vData?.data) {
          urlType = vData.data.urlType || "penpencilvdo";
          videoUrl = vData.data.url || "";
        }
      }
    } catch {
    }
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          _id: contentId,
          topic: "Class Lecture",
          title: "Class Lecture",
          name: "Class Lecture",
          urlType,
          url: videoUrl,
          videoDetails: {},
          availableFor: [],
          platformRestricted: false,
          restrictedSchedule: false,
          restrictedTime: 0
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
  const accessCookie = await getAccessCookie();
  const incomingCookie = req.headers.get("cookie") || "";
  const mergedCookies = [accessCookie];
  if (incomingCookie) {
    const filteredIncoming = incomingCookie.split(";").map((c) => c.trim()).filter((c) => !c.startsWith("studymeta_access="));
    if (filteredIncoming.length > 0) {
      mergedCookies.push(...filteredIncoming);
    }
  }
  const forwardHeaders = new Headers();
  req.headers.forEach((val, key) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey !== "host" && lowerKey !== "connection" && lowerKey !== "transfer-encoding" && lowerKey !== "x-forwarded-proto") {
      forwardHeaders.set(key, val);
    }
  });
  forwardHeaders.set("host", TARGET_HOST);
  forwardHeaders.set("origin", TARGET_ORIGIN);
  forwardHeaders.set("referer", refererHeader);
  forwardHeaders.set("cookie", mergedCookies.join("; "));
  const isDirectMedia = pathname.startsWith("/api/play") || pathname.startsWith("/api/get-otp") || pathname.startsWith("/api/video-url") || pathname.includes(".mpd") || pathname.includes(".m3u8") || pathname.includes(".m4s") || pathname.includes(".mp4");
  try {
    let upstreamRes = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: forwardHeaders,
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : void 0,
      redirect: "manual"
    });
    if ((upstreamRes.status === 307 || upstreamRes.status === 308) && upstreamRes.headers.get("location")?.includes("key-generate")) {
      cachedAccessCookie = "";
      const newCookie = await fetchFreshAccessCookie();
      forwardHeaders.set("cookie", `${newCookie}; ${mergedCookies.join("; ")}`);
      upstreamRes = await fetch(targetUrl.toString(), {
        method: req.method,
        headers: forwardHeaders,
        body: req.method !== "GET" && req.method !== "HEAD" ? req.body : void 0,
        redirect: "manual"
      });
    }
    const resHeaders = new Headers();
    upstreamRes.headers.forEach((val, key) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey !== "x-frame-options" && lowerKey !== "content-security-policy" && lowerKey !== "content-security-policy-report-only") {
        resHeaders.set(key, val);
      }
    });
    resHeaders.set("Access-Control-Allow-Origin", "*");
    resHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, HEAD");
    resHeaders.set("Access-Control-Allow-Headers", "*");
    const loc = upstreamRes.headers.get("location");
    if (loc) {
      let relativeLoc = loc.replace(/https?:\/\/(www\.)?learnxpw\.site/gi, "");
      if (relativeLoc.includes("key-generate")) {
        try {
          const locU = new URL(loc, TARGET_ORIGIN);
          relativeLoc = locU.searchParams.get("redirect") || "/study/batches";
        } catch {
          relativeLoc = "/study/batches";
        }
      }
      resHeaders.set("location", relativeLoc);
    }
    if (accessCookie) {
      resHeaders.append(
        "Set-Cookie",
        `${accessCookie}; Path=/; SameSite=Lax; Max-Age=86400`
      );
    }
    if (isDirectMedia) {
      return new Response(upstreamRes.body, {
        status: upstreamRes.status,
        headers: resHeaders
      });
    }
    const contentType = (resHeaders.get("content-type") || "").toLowerCase();
    const isText = contentType.includes("text/html") || contentType.includes("application/javascript") || contentType.includes("text/javascript") || contentType.includes("text/x-component") || contentType.includes("application/json") && !pathname.startsWith("/api/play");
    if (!isText) {
      return new Response(upstreamRes.body, {
        status: upstreamRes.status,
        headers: resHeaders
      });
    }
    if (pathname === "/api/AllBatches") {
      const originalText2 = await upstreamRes.text();
      try {
        const parsed = JSON.parse(originalText2);
        if (parsed.success && Array.isArray(parsed.batches)) {
          for (const b of parsed.batches) {
            if (!b.previewImage || !b.previewImage.startsWith("http") || b.previewImage.trim() === "") {
              b.previewImage = ICON_URL;
            }
          }
          const modified = transformText(JSON.stringify(parsed));
          resHeaders.set("Content-Type", "application/json");
          return new Response(modified, {
            status: upstreamRes.status,
            headers: resHeaders
          });
        }
      } catch {
      }
      return new Response(transformText(originalText2), {
        status: upstreamRes.status,
        headers: resHeaders
      });
    }
    const originalText = await upstreamRes.text();
    const modifiedText = transformText(originalText);
    if (contentType.includes("text/html")) {
      resHeaders.set("Cache-Control", "no-cache, no-store, must-revalidate");
    }
    return new Response(modifiedText, {
      status: upstreamRes.status,
      headers: resHeaders
    });
  } catch (err) {
    return new Response(`[GB STUDY Edge Proxy Error]: ${err?.message || err}`, {
      status: 502,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }
}
var onRequest = async (context) => {
  return handleEdgeRequest(context.request, context.env, context);
};
var path_default = {
  async fetch(request, env, ctx) {
    return handleEdgeRequest(request, env, ctx);
  }
};
export {
  path_default as default,
  handleEdgeRequest,
  onRequest
};
