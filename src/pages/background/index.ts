/* eslint-disable @typescript-eslint/no-unused-vars */
import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
// Listen for messages from content scripts
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     // Check if the message is about the title button being clicked
//     if (message.action === 'wpLoginAttempt') {
//       // Pass the action to your popup or other UI components
//       chrome.runtime.sendMessage({ action: 'wpLoginAttempt' });
//     }
//   });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Check if the message is about adding an action to the UI
    if (message.action === 'addActionToUI') {
      // Pass the action to your popup or other UI components
      chrome.runtime.sendMessage({ action: 'addActionToUI', data: message.data });
    }
  });

reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');
