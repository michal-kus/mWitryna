chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateIcon') {
    const tabId = sender.tab.id;

    if (request.verified === true) {
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
