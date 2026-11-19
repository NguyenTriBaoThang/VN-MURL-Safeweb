// VN-MURL SafeWeb - Content Script
(() => {
  const currentUrl = window.location.href;

  // Do not scan internal extension pages
  if (currentUrl.startsWith("chrome-extension://") || currentUrl.startsWith("chrome://")) {
    return;
  }

  // Do not scan localhost development dashboard
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return;
  }

  // Request scan from background service worker
  try {
    chrome.runtime.sendMessage(
      { type: "VNMURL_SCAN", url: currentUrl },
      (response) => {
        if (chrome.runtime.lastError) {
          console.debug("[VN-MURL] SafeWeb background worker connecting...", chrome.runtime.lastError.message);
          return;
        }

        if (response && response.ok && response.result) {
          const res = response.result;

          // If ML model or Policy dictates BLOCK
          if (res.action === "BLOCK" || res.label === "PHISHING" || res.label === "ADULT") {
            console.warn(`[VN-MURL SafeWeb] Blocked dangerous URL: ${currentUrl} | Label: ${res.label}`);

            // Immediately halt page execution and redirect to blocked warning page
            const blockUrl = chrome.runtime.getURL("block.html") +
              `?url=${encodeURIComponent(currentUrl)}` +
              `&label=${encodeURIComponent(res.label)}` +
              `&reason=${encodeURIComponent(res.reason || "Trang web bị chặn theo chính sách an ninh")}`;

            window.location.replace(blockUrl);
          }
        }
      }
    );
  } catch (err) {
    console.debug("[VN-MURL] Extension content script caught:", err);
  }
})();
