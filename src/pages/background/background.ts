chrome.runtime.onInstalled.addListener(() => {
    // Open the side panel window when the extension is installed or reloaded
    chrome.windows.create({
      url: 'src/pages/sidepanel/index.html',
      type: 'popup',
      width: 300, // Adjust the width as needed
      height: 600, // Adjust the height as needed
      focused: true,
    });
  });