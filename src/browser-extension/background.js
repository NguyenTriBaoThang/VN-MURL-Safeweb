// VN-MURL SafeWeb - Background Service Worker (Manifest V3)
const DEFAULT_API_BASE = "http://localhost:5000";

async function getState() {
  const st = await chrome.storage.local.get(["vnmurl_token", "vnmurl_enabled", "vnmurl_api"]);
  return {
    token: st.vnmurl_token || null,
    enabled: typeof st.vnmurl_enabled === "boolean" ? st.vnmurl_enabled : true,
    apiBase: st.vnmurl_api || DEFAULT_API_BASE,
  };
}

async function setToken(token) {
  await chrome.storage.local.set({ vnmurl_token: token });
}

async function setEnabled(enabled) {
  await chrome.storage.local.set({ vnmurl_enabled: !!enabled });
}

async function setApiBase(apiBase) {
  await chrome.storage.local.set({ vnmurl_api: apiBase });
}

// Ignore localhost, private networks and browser internal schemes
function isExemptUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (parsed.protocol === "chrome:" || parsed.protocol === "chrome-extension:" || parsed.protocol === "edge:") {
      return true;
    }
    if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
      return true;
    }
    if (host.startsWith("192.168.") || host.startsWith("10.") || (host.startsWith("172.") && parseInt(host.split(".")[1]) >= 16 && parseInt(host.split(".")[1]) <= 31)) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
}

async function scanWithApi(url) {
  if (isExemptUrl(url)) {
    return {
      url,
      label: "BENIGN",
      action: "ALLOW",
      confidence: 1.0,
      reason: "Local network or internal browser scheme is exempt from scanning",
    };
  }

  const { token, apiBase } = await getState();

  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${apiBase}/api/scan`, {
      method: "POST",
      headers,
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        url,
        label: "BENIGN",
        action: "ALLOW",
        confidence: 0.5,
        reason: `API scan error (${res.status}): ${errText}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("[VN-MURL] Network error while calling SafeWeb API:", err);
    return {
      url,
      label: "BENIGN",
      action: "ALLOW",
      confidence: 0.5,
      reason: "Could not reach SafeWeb API backend",
    };
  }
}

// MV3 Runtime Message Listener
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      if (msg?.type === "VNMURL_PING") {
        const st = await getState();
        sendResponse({ ok: true, enabled: st.enabled, apiBase: st.apiBase });
        return;
      }

      if (msg?.type === "VNMURL_GET_STATE") {
        const st = await getState();
        sendResponse({ ok: true, ...st });
        return;
      }

      if (msg?.type === "VNMURL_TOGGLE") {
        await setEnabled(!!msg.enabled);
        const st = await getState();
        sendResponse({ ok: true, enabled: st.enabled });
        return;
      }

      if (msg?.type === "VNMURL_SET_API") {
        if (msg.apiBase) {
          await setApiBase(msg.apiBase);
        }
        sendResponse({ ok: true });
        return;
      }

      if (msg?.type === "VNMURL_SCAN") {
        const st = await getState();
        if (!st.enabled) {
          sendResponse({
            ok: true,
            result: {
              url: msg.url,
              label: "BENIGN",
              action: "ALLOW",
              confidence: 1.0,
              reason: "VN-MURL SafeWeb protection is currently paused by user",
            },
          });
          return;
        }

        const result = await scanWithApi(msg.url || "");
        sendResponse({ ok: true, result });
        return;
      }

      sendResponse({ ok: false, message: "Unknown message type" });
    } catch (e) {
      sendResponse({ ok: false, message: String(e?.message || e) });
    }
  })();

  return true; // Keep channel open for async response
});
