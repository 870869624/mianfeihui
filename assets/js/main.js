/* ═══════════════════════════════════════════════════════════════
 *  原创圈 · 官网脚本
 *
 *  ★★★ 下载链接配置（重要） ★★★
 *  把下面两个空字符串替换为你自己的「蓝奏云」分享链接即可，
 *  页面底部 iOS / 安卓两个下载按钮会自动使用这里的地址。
 *  无需改动 index.html。
 *
 *  示例:
 *    ios:     "https://wwoop.lanzouq.com/b0123abcd"
 *    android: "https://wwoop.lanzouq.com/b0456efgh"
 * ═══════════════════════════════════════════════════════════════ */

const DOWNLOAD_LINKS = {
  ios:     "",   // ← 在此粘贴蓝奏云 iOS 安装包分享链接
  android: "https://wwbkr.lanzoul.com/iREt34abv3wh",   // ← 在此粘贴蓝奏云安卓安装包分享链接
};

/* ─────────────────────────────────────────────
 * 以下为通用交互逻辑，一般无需修改
 * ───────────────────────────────────────────── */

(function () {
  "use strict";

  /* ── 1. 下载按钮：注入蓝奏云链接 ── */
  const dlMap = {
    dlIos: DOWNLOAD_LINKS.ios,
    dlAndroid: DOWNLOAD_LINKS.android,
  };

  Object.entries(dlMap).forEach(([id, url]) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    const filled = typeof url === "string" && /^https?:\/\//i.test(url.trim());
    if (filled) {
      btn.href = url.trim();
      btn.classList.add("dl-ready");
    } else {
      // 链接未配置：按钮置灰，点击给出提示，不跳转
      btn.classList.add("dl-disabled");
      btn.setAttribute("aria-disabled", "true");
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        showToast("下载链接尚未配置：请站点管理员在 assets/js/main.js 顶部的 DOWNLOAD_LINKS 中填写蓝奏云链接。");
      });
    }
  });

  /* ── 2. 导航滚动态 ── */
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── 3. 移动端菜单 ── */
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  toggle.addEventListener("click", function () {
    const open = nav.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
  });

  // 点击菜单项后自动收起
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ── 4. 滚动入场动画（IntersectionObserver） ── */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ── 5. FAQ 手风琴：同一时间只展开一项 ── */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ── 6. 备案号占位：不跳转 ── */
  const filing = document.getElementById("filingLink");
  if (filing) {
    filing.addEventListener("click", (e) => e.preventDefault());
  }

  /* ── 工具：底部提示浮层 ── */
  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3600);
  }
})();
