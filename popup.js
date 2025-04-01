document.getElementById('openSidebar').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.sidePanel.open({
        tabId: tabs[0].id,
      }).catch(err => console.error("Error opening side panel:", err));
    } else {
      console.error("No active tab found.");
    }
  });
});