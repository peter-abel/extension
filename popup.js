document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    document.getElementById('cbtPrompt').addEventListener('click', showCBTPrompt);
  });
  
  function updateStats() {
    chrome.storage.local.get(['timeSpent', 'scrollDistance'], (result) => {
      const timeSpentElement = document.getElementById('timeSpent');
      const scrollDistanceElement = document.getElementById('scrollDistance');
  
      // Update UI with time spent and scroll distance
      // Implement data visualization here
    });
  }
  
  function showCBTPrompt() {
    const prompts = [
      "What's your goal for opening this app? Write it down. Can you achieve it in the next 10 minutes?",
      "You've been scrolling for 10 minutes. How about a 2-minute break to reset? Set a timer for your next session.",
      "Pause and check in: How are you feeling right now? What thoughts are running through your mind as you scroll?",
      "Noticed any negative thoughts creeping in? Take a moment to reframe: Is there evidence that your thought is 100% true?",
      "Before you tap, try a 5-second pause. What do you really want to achieve with this action?",
      "Time for a quick break! Stand up, stretch, or take a walk for 2 minutes. How does your body feel now?",
      "Great job taking a break! Reward yourself with something small, like a glass of water or listening to your favorite song.",
      "Before you close the app, write down 3 things you're grateful for today."
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    alert(randomPrompt);
  }

  document.addEventListener('DOMContentLoaded', updateStats);

function updateStats() {
  chrome.storage.local.get(['timeSpent', 'breaksTaken'], (result) => {
    updateTimeSpent(result.timeSpent);
    updateBreaksTaken(result.breaksTaken);
  });
}

function updateTimeSpent(timeSpent) {
    const timeSpentElement = document.getElementById('timeSpent');
    if (timeSpent) {
      let totalTime = 0;
      for (const site in timeSpent) {
        totalTime += timeSpent[site];
      }
      timeSpentElement.textContent = formatTime(totalTime);
    } else {
      timeSpentElement.textContent = 'No data yet';
    }
  }

function updateBreaksTaken(breaksTaken) {
  const breaksElement = document.getElementById('breaksTaken');
  breaksElement.textContent = breaksTaken || 0;
}

function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}