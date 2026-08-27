/* EgoANT likes + comments — same public JSON store pattern as a static-blog interaction bar. */
(function () {
  var API = "https://api.restful-api.dev/objects";
  var STORE_ID = "ff8081819ff5b11001a04100fae92da3";
  var POST_ID = "egoant-report";
  var LS_LIKE_KEY = "egoantLiked:" + POST_ID;
  var LS_CLIKE_PREFIX = "egoantCLiked:" + POST_ID + ":";
  var LS_MINE = "egoantMyComments:" + POST_ID;
  var LS_VIEWED = "egoantViewedSession:" + POST_ID;

  var ICON = {
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.7-4.35-9.3-8.05C.9 10.2 1.4 6.9 4.1 5.6c2-1 4.2-.3 5.4 1.3L12 9l2.5-2.1c1.2-1.6 3.4-2.3 5.4-1.3 2.7 1.3 3.2 4.6 1.4 7.35C18.7 16.65 12 21 12 21z"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>',
    comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/></svg>'
  };

  var state = { views: 0, likes: 0, comments: [] };
  var toastTimer = null;

  function lang() {
    return window.__LANG__ === "en" ? "en" : "zh";
  }
  function t(key, vars) {
    var val = (window.EgoANT_I18N && window.EgoANT_I18N.t)
      ? window.EgoANT_I18N.t(key, lang())
      : key;
    if (vars && typeof val === "string") {
      Object.keys(vars).forEach(function (k) {
        val = val.replace("{" + k + "}", vars[k]);
      });
    }
    return val;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function myComments() {
    try { return JSON.parse(localStorage.getItem(LS_MINE) || "[]"); }
    catch (e) { return []; }
  }
  function rememberMine(id) {
    var ids = myComments();
    if (ids.indexOf(id) === -1) ids.push(id);
    try { localStorage.setItem(LS_MINE, JSON.stringify(ids)); } catch (e) {}
  }
  function relTime(ms) {
    if (!ms) return t("social.justNow");
    var diff = (Date.now() - ms) / 1000;
    if (diff < 60) return t("social.justNow");
    if (diff < 3600) return t("social.minAgo", { n: Math.floor(diff / 60) });
    if (diff < 86400) return t("social.hourAgo", { n: Math.floor(diff / 3600) });
    if (diff < 604800) return t("social.dayAgo", { n: Math.floor(diff / 86400) });
    return new Date(ms).toLocaleDateString(lang() === "zh" ? "zh-CN" : "en", {
      year: "numeric", month: "short", day: "numeric"
    });
  }
  function showToast(msg) {
    var el = document.querySelector(".bs-toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "bs-toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    void el.offsetWidth;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2000);
  }

  function loadState() {
    return fetch(API + "/" + STORE_ID, { headers: { Accept: "application/json" } })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var d = (j && j.data) || {};
        state.views = typeof d.views === "number" ? d.views : 0;
        state.likes = typeof d.likes === "number" ? d.likes : 0;
        state.comments = Array.isArray(d.comments) ? d.comments : [];
        return state;
      })
      .catch(function () { return state; });
  }
  function saveState() {
    return fetch(API + "/" + STORE_ID, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "shuai-zhou-" + POST_ID,
        data: { views: state.views, likes: state.likes, comments: state.comments }
      })
    });
  }

  function refreshCounts() {
    var v = document.getElementById("bs-view-count");
    var l = document.getElementById("bs-like-count");
    if (v) v.textContent = state.views;
    if (l) l.textContent = state.likes;
  }

  function buildBar() {
    var bar = document.getElementById("blog-interaction-bar");
    if (!bar) return;
    var liked = localStorage.getItem(LS_LIKE_KEY) === "1";
    bar.innerHTML =
      '<span class="bs-btn bs-views" title="' + esc(t("social.views")) + '">' +
        ICON.eye + '<span class="bs-count" id="bs-view-count">' + state.views + "</span></span>" +
      '<button type="button" class="bs-btn bs-like-btn' + (liked ? " liked" : "") +
        '" aria-pressed="' + (liked ? "true" : "false") + '" aria-label="' + esc(t("social.likePost")) + '">' +
        ICON.heart + '<span class="bs-count" id="bs-like-count">' + state.likes + "</span></button>" +
      '<button type="button" class="bs-btn bs-share-btn" aria-label="' + esc(t("social.share")) + '">' +
        ICON.share + "<span>" + esc(t("social.share")) + "</span></button>" +
      '<button type="button" class="bs-btn bs-comment-btn" aria-label="' + esc(t("social.leaveComment")) + '">' +
        ICON.comment + "<span>" + esc(t("social.leaveComment")) + "</span></button>";

    bar.querySelector(".bs-like-btn").addEventListener("click", onLikePost);
    bar.querySelector(".bs-share-btn").addEventListener("click", onShare);
    bar.querySelector(".bs-comment-btn").addEventListener("click", function () {
      var ta = document.getElementById("bs-comment-text");
      if (ta) {
        ta.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(function () { ta.focus(); }, 400);
      }
    });
  }

  function onLikePost() {
    var btn = document.querySelector(".bs-like-btn");
    var wasLiked = localStorage.getItem(LS_LIKE_KEY) === "1";
    var nowLiked = !wasLiked;
    localStorage.setItem(LS_LIKE_KEY, nowLiked ? "1" : "0");
    if (btn) {
      btn.classList.toggle("liked", nowLiked);
      btn.setAttribute("aria-pressed", nowLiked ? "true" : "false");
    }
    loadState().then(function () {
      state.likes = Math.max(0, state.likes + (nowLiked ? 1 : -1));
      refreshCounts();
      return saveState();
    }).catch(function () {});
  }

  function onShare() {
    var url = location.href;
    function done() { showToast(t("social.copied")); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      done();
    }
  }

  function renderComments() {
    var list = document.getElementById("bs-comment-list");
    if (!list) return;
    var mine = myComments();
    var arr = (state.comments || []).slice().sort(function (a, b) {
      return (b.ts || 0) - (a.ts || 0);
    });
    if (!arr.length) {
      list.innerHTML = "";
      return;
    }
    list.innerHTML = arr.map(function (c) {
      var cliked = localStorage.getItem(LS_CLIKE_PREFIX + c.id) === "1";
      var canDelete = mine.indexOf(c.id) !== -1;
      return '<li class="bs-comment" data-id="' + esc(c.id) + '">' +
        '<div class="bs-comment-head">' +
          '<span class="bs-comment-author">' + esc(t("social.anonymous")) + "</span>" +
          '<span class="bs-comment-time">' + esc(relTime(c.ts)) + "</span>" +
        "</div>" +
        '<div class="bs-comment-text">' + esc(c.text) + "</div>" +
        '<div class="bs-comment-actions">' +
          '<button type="button" class="bs-clike' + (cliked ? " liked" : "") + '" data-id="' + esc(c.id) +
            '" aria-label="' + esc(t("social.likePost")) + '">' + ICON.heart +
            '<span class="bs-clike-count">' + (c.likes || 0) + "</span></button>" +
          (canDelete
            ? '<button type="button" class="bs-cdelete" data-id="' + esc(c.id) +
              '" aria-label="' + esc(t("social.delete")) + '">' + ICON.trash +
              "<span>" + esc(t("social.delete")) + "</span></button>"
            : "") +
        "</div></li>";
    }).join("");
    list.querySelectorAll(".bs-clike").forEach(function (b) {
      b.addEventListener("click", function () { onLikeComment(b.dataset.id); });
    });
    list.querySelectorAll(".bs-cdelete").forEach(function (b) {
      b.addEventListener("click", function () { onDeleteComment(b.dataset.id); });
    });
  }

  function onPostComment(e) {
    e.preventDefault();
    var textEl = document.getElementById("bs-comment-text");
    var submit = document.getElementById("bs-comment-submit");
    var text = (textEl.value || "").trim();
    if (!text) return;
    submit.disabled = true;
    loadState().then(function () {
      var id = "c" + Date.now() + Math.floor(Math.random() * 1e4).toString(36);
      state.comments.push({ id: id, name: "", text: text, ts: Date.now(), likes: 0 });
      rememberMine(id);
      return saveState();
    }).then(function () {
      textEl.value = "";
      renderComments();
    }).catch(function () {
      showToast(t("social.postFail"));
    }).then(function () {
      submit.disabled = false;
    });
  }

  function onLikeComment(id) {
    var key = LS_CLIKE_PREFIX + id;
    var nowLiked = localStorage.getItem(key) !== "1";
    localStorage.setItem(key, nowLiked ? "1" : "0");
    loadState().then(function () {
      var c = state.comments.filter(function (x) { return x.id === id; })[0];
      if (c) c.likes = Math.max(0, (c.likes || 0) + (nowLiked ? 1 : -1));
      renderComments();
      return saveState();
    }).catch(function () {});
  }

  function onDeleteComment(id) {
    if (myComments().indexOf(id) === -1) return;
    if (!confirm(t("social.deleteConfirm"))) return;
    loadState().then(function () {
      state.comments = state.comments.filter(function (x) { return x.id !== id; });
      renderComments();
      return saveState();
    }).catch(function () {
      showToast(t("social.deleteFail"));
    });
  }

  function boot() {
    var form = document.getElementById("bs-comment-form");
    if (form && !form.dataset.bound) {
      form.dataset.bound = "1";
      form.addEventListener("submit", onPostComment);
    }
    buildBar();
    renderComments();
    loadState().then(function () {
      var already = false;
      try { already = sessionStorage.getItem(LS_VIEWED) === "1"; } catch (e) {}
      if (!already) {
        state.views = (state.views || 0) + 1;
        try { sessionStorage.setItem(LS_VIEWED, "1"); } catch (e) {}
        saveState().catch(function () {});
      }
      refreshCounts();
      renderComments();
    }).catch(function () {});
  }

  window.__rerenderSocialI18n = function () {
    buildBar();
    renderComments();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
