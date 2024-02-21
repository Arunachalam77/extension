/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/content/injected/event');

async function event() {
   
    
function removeColorControl(action) {
  const styleId = "un-color-display";
  const styleContent = `
         html {
           filter: grayscale(3)!important;
         }
       `;

  const styleElement = document.getElementById(styleId);

  if (styleElement) {
    document.head.removeChild(styleElement);
  } else {
    const newStyleElement = document.createElement("style");
    newStyleElement.id = styleId;
    newStyleElement.innerHTML = styleContent;
    document.head.appendChild(newStyleElement);
  }

  // Send a message to the extension with the action performed
  chrome.runtime.sendMessage({ action: action });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'removeColorControl') {
    removeColorControl('removeColorControl');
  }
});


function sendActionToBackground(action) {
  chrome.runtime.sendMessage({ action: 'addActionToUI', data: action });
}

function sendActionToWindow(action) {
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "addActionToUI") {
    console.log("Received action from content script:", message.data);
     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "updateUI", data: message.data });
    });
  }
});
}
// Listen for (input) events on the document
document.addEventListener('input', (event:any) => {
  const inputElement = event.target.closest('input');
  if (inputElement && event.target === inputElement) {
    const xpath = getXPath(inputElement);
      sendActionToBackground(`Typed "${event.target.value}" in input field: ${inputElement.name || inputElement.id} - (XPath: ${xpath})`);
  }
});


// Listen for (focus) events on the document
document.addEventListener('focus', (event:any) => {
  const inputElement = event.target.closest('input');
  if (inputElement) {
    sendActionToBackground(`Focused on input field: ${inputElement.name || inputElement.id}`);
  }
}, true);


// Listen for input (textarea) events on the document
document.addEventListener('input', (event:any) => {
  const textareaElement = event.target.closest('textarea');
  if (textareaElement) {
    sendActionToBackground(`Typed "${event.target.value}" in textarea field: ${textareaElement.name || textareaElement.id}`);
  }
});


// Listen for (link) events on the document
document.addEventListener('click', (event:any) => {
  const anchorElement = event.target.closest('a');
  if (anchorElement) {
    const clickedUrl = anchorElement.href;
    sendActionToBackground(`Clicked on link: ${clickedUrl}`);
  }
});

// Listen for (button) events on the document
document.addEventListener('click', (event:any) => {
  if (event.target.tagName === 'BUTTON') {
    sendActionToBackground(`Clicked on button: ${event.target.innerText}`);
  }
});

// Listen for (blur) events on the document
document.addEventListener('blur', (event:any) => {
  const inputElement = event.target.closest('blur');
  if (inputElement) {
    sendActionToBackground(`Input blurred: ${event.target.value}`);
  }
});

// Listen for (Keypress) events on the document
document.addEventListener('keypress', (event) => {
  console.log(`Key pressed: ${event.key}`);
  sendActionToBackground(`keypressed: ${event.key}`);
  // chrome.runtime.sendMessage({ action: 'keyPressed', key: event.key });
});

// Listen for (copy)  events on the document
document.addEventListener('copy', (event) => {
  const selection = document.getSelection();
  if (selection && !selection.isCollapsed) {
    const copiedText = selection.toString();
    sendActionToBackground(`Copied "${copiedText}"`);
  }
});

// Listen for (cut)  events on the document
document.addEventListener('cut', (event) => {
  const selection = document.getSelection();
  if (selection && !selection.isCollapsed) {
    const cutText = selection.toString();
    sendActionToBackground(`Cut "${cutText}"`);
  }
});


// Listen for (drag)  events on the document
document.addEventListener('dragstart', (event:any) => {
  const draggedElement = event.target;
  sendActionToBackground(`Started dragging element: ${draggedElement.tagName}`);
});

// Listen for (drop)  events on the document
document.addEventListener('drop', (event:any) => {
  const droppedElement = event.target;
  sendActionToBackground(`Dropped element: ${droppedElement.tagName}`);
});


// // Listen for scroll events on the document
// document.addEventListener('scroll', (event:any) => {
//   const scrollElement = event.target;
//   const scrollPosition = {
//     x: scrollElement.scrollLeft,
//     y: scrollElement.scrollTop
//   };
//   sendActionToBackground(`Scrolled to position: (${scrollPosition.x}, ${scrollPosition.y})`);
// });


// Listen for (scroll) events on the window
window.addEventListener('scroll', (event) => {
  requestAnimationFrame(() => {
    const scrollPosition = {
      x: window.scrollX,
      y: window.scrollY
    };
    sendActionToBackground(`Scrolled to position: (${scrollPosition.x}, ${scrollPosition.y})`);
  });
});

// Listen for (resize) events on the window
window.addEventListener('resize', (event) => {
  const newSize = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  sendActionToBackground(`Resized window to: ${newSize.width}x${newSize.height}`);
});


// Listen for (onload) events on the window
window.addEventListener('load', (event) => {
  sendActionToBackground('Page has fully loaded');
});

// Listen for (mouseover) events on the document
// document.addEventListener('mouseover', (event:any) => {
//   const targetElement = event.target;
//   sendActionToBackground(`Mouse over element: ${targetElement.tagName}`);
// });


// Listen for (KeyDown) events on the document
document.addEventListener('keydown', (event) => {
  console.log(`Key pressed: ${event.key}`);
  sendActionToBackground(`keydown:${event.key}`);
});

// Listen for when a new window is created
document.addEventListener('open', (event) => {
  console.log(`Key pressed: ${event}`);
  sendActionToBackground(`keydown:newtab open`);
});

//xpath
function getXPath(element:any) {
  const idx:any = (sib, name) => sib
    ? idx(sib.previousElementSibling, name||sib.localName) + (sib.localName == name)
    : 1;
  const segs = (elm:any) => !elm || elm.nodeType !== 1
    ? ['']
    : elm.id && document.getElementById(elm.id) === elm
      ? [`id("${elm.id}")`]
      : [...segs(elm.parentNode), `${elm.localName.toLowerCase()}[${idx(elm)}]`];
  return segs(element).join('/');
}


// //listen svg document
// document.addEventListener('click', (event:any) => {
//   const svgElement = event.target.closest('svg');
//   if (svgElement) {
//     sendActionToBackground(`Clicked the SVG element with ID "${svgElement.id}"`);
//   }
// });

// // onload need to clarify
// document.addEventListener('DOMContentLoaded', (event) => {
//   console.log('DOMContentLoaded event fired');
//   // Send a message to the background script
//   chrome.runtime.sendMessage({ action: 'DOMContentLoaded' });
// });


// // mousedown for document
// document.addEventListener('mousedown', (event:any) => {
//   console.log(`Element clicked: ${event.target.tagName}`);
//   sendActionToBackground(`mousedown:${event.target.tagName}`);
// });




}


void event();
