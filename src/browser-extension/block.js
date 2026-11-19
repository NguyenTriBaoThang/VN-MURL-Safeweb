// block.js - Dynamic updates for extension block page
(() => {
  const params = new URLSearchParams(window.location.search);
  const url = params.get("url") || "Không xác định";
  const label = (params.get("label") || "PHISHING").toUpperCase();
  const reasonParam = params.get("reason");

  const isPhishing = label === "PHISHING";
  const defaultReason = isPhishing
    ? "Phát hiện URL có dấu hiệu phishing/lừa đảo."
    : "Nội dung có thể không phù hợp với trẻ em.";

  const reason = reasonParam || defaultReason;

  // Update DOM elements
  const urlEl = document.getElementById("blocked-url");
  if (urlEl) urlEl.textContent = url;

  const reasonEl = document.getElementById("blocked-reason");
  if (reasonEl) {
    reasonEl.textContent = reason;
    reasonEl.className = isPhishing ? "val-reason reason-phishing" : "val-reason reason-adult";
  }

  const badgeEl = document.getElementById("badge");
  if (badgeEl) {
    badgeEl.textContent = isPhishing ? "PHISHING DETECTED" : "ADULT CONTENT DETECTED";
    badgeEl.className = isPhishing ? "badge badge-phishing" : "badge badge-adult";
  }

  const svgEl = document.getElementById("icon-svg");
  if (svgEl) {
    if (isPhishing) {
      svgEl.setAttribute("stroke", "#ef4444");
      svgEl.innerHTML = `
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      `;
    } else {
      svgEl.setAttribute("stroke", "#f59e0b");
      svgEl.innerHTML = `
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      `;
    }
  }
})();
