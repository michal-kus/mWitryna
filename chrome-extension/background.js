// Background service worker for extension icon management

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateIcon') {
    const tabId = sender.tab.id;

    if (request.verified === true) {
      // Green checkmark - verified gov.pl site
      chrome.action.setTitle({
        tabId: tabId,
        title: "✅ Zweryfikowana strona gov.pl"
      });

      chrome.action.setBadgeText({
        tabId: tabId,
        text: "✓"
      });

      chrome.action.setBadgeBackgroundColor({
        tabId: tabId,
        color: "#22c55e" // Green
      });

    } else if (request.verified === false) {
      // Red warning - suspicious site
      chrome.action.setTitle({
        tabId: tabId,
        title: "⚠️ Strona niezweryfikowana - możliwe oszustwo!"
      });

      chrome.action.setBadgeText({
        tabId: tabId,
        text: "!"
      });

      chrome.action.setBadgeBackgroundColor({
        tabId: tabId,
        color: "#ef4444" // Red
      });
    }

    sendResponse({status: "ok"});
  }
});
