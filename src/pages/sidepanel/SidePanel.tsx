/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/sidepanel/SidePanel.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

const SidePanel = () => {
  const theme = useStorage(exampleThemeStorage);
  const [currentPage, setCurrentPage] = useState('');
  const [actions, setActions] = useState([]);

  const onClickMe = () => {
    //  currently identify the site url
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs && tabs.length > 0) {
        const currentTab = tabs[0];
        const currentUrl = currentTab.url;
        console.log('Current URL:', currentUrl);
        setCurrentPage(currentUrl);
      }
    });
  };

  const toggleGrayscale = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tab = tabs[0];
      if (tab && tab.id !== undefined) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'removeColorControl',
        });
      }
    });
  };

  const onclear = () => {
    setActions([]);
  };

  useEffect(() => {
    let debounceTimer;
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'addActionToUI') {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {  
          setActions(prevActions => [...prevActions, message.data]);
        }, 1000);
      }
      if (message.action === "updateUI") {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          setActions(prevActions => [...prevActions, message.data]);
        }, 1000); 
      }
    });

    return () => {
      clearTimeout(debounceTimer);
    };
  }, []);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs && tabs.length > 0) {
        const currentTab = tabs[0];
        const currentUrl = currentTab.url;
        console.log('Current URL:', currentUrl);
        setCurrentPage(currentUrl);
      }
    });
  }, []);

  // function removeAllEventListeners() {
  //   document.querySelectorAll('*').forEach(element => {
  //     // Clone the element to remove listeners without triggering them
  //     const clonedElement = element.cloneNode(true);
  //     element.replaceWith(clonedElement);
  //   });
  // }

  // const eventListenersMap = new WeakMap();

  // function addAllEventListeners() {
  //   document.querySelectorAll('*').forEach(element => {
  //     const clonedElement = element.cloneNode(true);
  //     element.parentNode.replaceChild(clonedElement, element);
  //     if (eventListenersMap.has(element)) {
  //       const listeners = eventListenersMap.get(element);
  //       listeners.forEach(listener => {
  //         clonedElement.addEventListener(listener.type, listener.callback, listener.options);
  //       });
  //     }
  //   });
  // }

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px' }}>
        {/* <button onClick={removeAllEventListeners}>
         Clear All Event Listeners
       </button>
       <button onClick={addAllEventListeners}>
        Add All Event Listeners
       </button> */}
        <button
          onClick={toggleGrayscale}
          style={{
            backgroundColor: '#c4afff',
            boxShadow: 'none',
            border: '0px',
            padding: '9px 7px',
            borderRadius: '4px',
          }}>
          Remove Color
        </button>
        <button
          onClick={onclear}
          style={{
            backgroundColor: '#c4afff',
            boxShadow: 'none',
            border: '0px',
            padding: '9px 7px',
            borderRadius: '4px',
          }}>
          clear
        </button>
        <button
          onClick={reloadPage}
          style={{
            backgroundColor: '#c4afff',
            boxShadow: 'none',
            border: '0px',
            padding: '9px 7px',
            borderRadius: '4px',
          }}>
          Reload Page
        </button>
      </div>
      <div style={{ padding: '2px 10px' }}>
        <button
          onClick={onClickMe}
          style={{
            backgroundColor: '#6f90f7',
            boxShadow: 'none',
            border: '0px',
            padding: '9px 7px',
            borderRadius: '4px',
          }}>
          click me to current url of the page
        </button>
        <div>
        <p style={{  color: '#fff',fontSize:'12px' }}>Current Page: {currentPage}</p>
        </div>
      </div>
      {actions.map((action, index) => (
        <li style={{ color: '#fff', fontWeight: '500',fontSize:'12px' }} key={index}>
          {action}
        </li>
      ))}
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
