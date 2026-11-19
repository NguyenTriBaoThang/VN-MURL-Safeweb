// popup.js - Extension popup logic
let isEnabled = true;
let currentTabUrl = "";

async function init() {
  const statusIndicator = document.getElementById("status-indicator");
  const tabUrlEl = document.getElementById("tab-url");
  const btnToggle = document.getElementById("btn-toggle");
  const btnScan = document.getElementById("btn-scan");
  const resultBox = document.getElementById("result-box");
  const resultText = document.getElementById("result-text");
  const resultReason = document.getElementById("result-reason");

  // Get current tab
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs[0]) {
      currentTabUrl = tabs[0].url || "";
      tabUrlEl.textContent = currentTabUrl;
    }
  } catch (e) {
    tabUrlEl.textContent = "Không lấy được URL tab";
  }

  // Get extension status
  chrome.runtime.sendMessage({ type: "VNMURL_GET_STATE" }, (resp) => {
    if (resp && resp.ok) {
      isEnabled = resp.enabled;
      updateUI();
    }
  });

  function updateUI() {
    if (isEnabled) {
      statusIndicator.textContent = "● ĐANG BẬT";
      statusIndicator.className = "status-active";
      btnToggle.textContent = "Tạm Dừng Bảo Vệ";
    } else {
      statusIndicator.textContent = "○ ĐÃ TẮT";
      statusIndicator.className = "status-paused";
      btnToggle.textContent = "Bật Lại Bảo Vệ";
    }
  }

  btnToggle.addEventListener("click", () => {
    isEnabled = !isEnabled;
    chrome.runtime.sendMessage({ type: "VNMURL_TOGGLE", enabled: isEnabled }, () => {
      updateUI();
    });
  });

  btnScan.addEventListener("click", () => {
    if (!currentTabUrl) return;
    btnScan.textContent = "Đang phân tích...";
    btnScan.disabled = true;

    chrome.runtime.sendMessage({ type: "VNMURL_SCAN", url: currentTabUrl }, (resp) => {
      btnScan.textContent = "Quét Tab Hiện Tại";
      btnScan.disabled = false;

      if (resp && resp.ok && resp.result) {
        const res = resp.result;
        resultBox.style.display = "block";
        resultText.textContent = `${res.label} (${res.action}) - ${(res.confidence * 100).toFixed(1)}%`;
        resultReason.textContent = res.reason;

        resultBox.className = "result-box " + (
          res.label === "BENIGN" ? "result-benign" :
          res.label === "PHISHING" ? "result-phishing" : "result-adult"
        );
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", init);
