/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import '@pages/popup/Popup.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const [currentPage, setCurrentPage] = useState('');
  const [interactionClicked, setInteractionClicked] = useState(false);
  const parentRef = useRef(null);
  const [contentState, setContentState] = useState();
  const [state, setState] = useState({
    openicon: true,
  });

  useEffect(() => {
    // Check if interaction was clicked in the current URL
    chrome.storage.local.get('interactionClicked', (data) => {
      if (data.interactionClicked) {
        // Update state to reflect the interaction was clicked
        setInteractionClicked(true);
        setCurrentPage(data.currentUrl);

        console.log(interactionClicked,'interactionClickedinteractionClickedinteractionClicked>>>>>>>')
      }
    });
  }, []);




  const onClickMe = () => {

    //  currently identify the site url
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        const currentTab = tabs[0];
        const currentUrl = currentTab.url;
        console.log('Current URL:', currentUrl);
        setCurrentPage(currentUrl);

        // Save the state to storage
        chrome.storage.local.set({ interactionClicked: true, currentUrl });
      }
    });
  }






  useEffect(()=>{
    // prevent popup close
    const handleClickOutside = (event) => {
      if (parentRef.current && !parentRef.current.contains(event.target)) {
        // Clicked outside the parentRef, prevent closing the popup
        event.preventDefault();
        event.stopPropagation();
      }
    };
  
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }
  ,[parentRef])

  


  return (
    
    <button className="App" ref={parentRef}>
      <button onClick={onClickMe}>click me</button>
      <p style={{ width: '160px' }}>Current Page: {currentPage}</p>
    </button>
  );
};

export default Popup
