let lastScrollPosition = window.pageYOffset;
let scrollDistance = 0;

window.addEventListener('scroll', () => {
  const currentScrollPosition = window.pageYOffset;
  scrollDistance += Math.abs(currentScrollPosition - lastScrollPosition);
  lastScrollPosition = currentScrollPosition;

  chrome.runtime.sendMessage({ 
    action: 'updateScrollDistance', 
    distance: scrollDistance 
  });

  scrollDistance = 0;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showBreakReminder') {
    showBreakReminder(request.type);
  }
});

function showBreakReminder(type) {
  const message = type === 'time' 
    ? "You've been browsing for a while. Time for a break!" 
    : "You've been scrolling a lot. How about a quick break?";

  // You can replace this with a more sophisticated UI
  if (confirm(message + "\n\nDid you take a break?")) {
    chrome.runtime.sendMessage({ action: 'breakTaken' });
  }
}
