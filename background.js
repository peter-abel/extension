const SOCIAL_MEDIA_SITES = ['facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com'];
const BREAK_INTERVAL = 20; // minutes
const SCROLL_THRESHOLD = 1000; // pixels

let activeTabId = null;
let sessionStartTime = null;
let totalScrollDistance = 0;

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => {
    if (isSocialMediaSite(tab.url)) {
      startSession(tabId);
    } else {
      endSession();
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && isSocialMediaSite(tab.url)) {
    startSession(tabId);
  } else if (changeInfo.status === 'complete' && !isSocialMediaSite(tab.url)) {
    endSession();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateScrollDistance') {
    totalScrollDistance += request.distance;
    if (totalScrollDistance >= SCROLL_THRESHOLD) {
      showBreakReminder('scroll');
      totalScrollDistance = 0;
    }
  } else if (request.action === 'breakTaken') {
    updateBreaksTaken();
  }
});

function isSocialMediaSite(url) {
  return SOCIAL_MEDIA_SITES.some(site => url.includes(site));
}

function startSession(tabId) {
  activeTabId = tabId;
  sessionStartTime = Date.now();
  chrome.alarms.create('breakReminder', { periodInMinutes: BREAK_INTERVAL });
}

function endSession() {
  if (sessionStartTime) {
    const sessionDuration = Date.now() - sessionStartTime;
    updateStoredData(sessionDuration);
  }
  activeTabId = null;
  sessionStartTime = null;
  chrome.alarms.clear('breakReminder');
}

function updateStoredData(duration) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
      chrome.storage.local.get(['timeSpent'], (result) => {
        const timeSpent = result.timeSpent || {};
        const currentSite = new URL(tabs[0].url).hostname;
        timeSpent[currentSite] = (timeSpent[currentSite] || 0) + duration;
        chrome.storage.local.set({ timeSpent });
      });
    }
  });
}

function showBreakReminder(type) {
  chrome.tabs.sendMessage(activeTabId, { action: 'showBreakReminder', type });
}

function updateBreaksTaken() {
  chrome.storage.local.get(['breaksTaken'], (result) => {
    const breaksTaken = (result.breaksTaken || 0) + 1;
    chrome.storage.local.set({ breaksTaken });
  });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'breakReminder') {
    showBreakReminder('time');
  }
});