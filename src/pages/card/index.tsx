/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import '@pages/popup/Popup.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { Rnd } from 'react-rnd';

export const Card = () => {
  const theme = useStorage(exampleThemeStorage);
  const [currentPage, setCurrentPage] = useState('');
  const [interactionClicked, setInteractionClicked] = useState(false);
  const [elastic, setElastic] = React.useState("");
  const [shake, setShake] = React.useState("");
  const [dragging, setDragging] = React.useState("");
  const DragRef = useRef(null);
  const PopupRef = useRef(null);

  const onClickMe = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        const currentTab = tabs[0];
        const currentUrl = currentTab.url;
        console.log('Current URL:', currentUrl);
        setCurrentPage(currentUrl);

      }
    });
  };
  const handleDrop = (e, d) => {
    
  };
  const handleDrag = (e, d) => {
    // Width and height
    const width = PopupRef.current.getBoundingClientRect().width;
    const height = PopupRef.current.getBoundingClientRect().height;

    if (
      d.x - 40 < width ||
      d.x > window.innerWidth + 10 ||
      d.y < 0 ||
      d.y + height + 40 > window.innerHeight
    ) {
      setShake("ToolbarShake");
    } else {
      setShake("");
    }
  };
  const handleDragStart = (e, d) => {
    setDragging("ToolbarDragging");
  };
 


  return (
    <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100vw",
      height: "100vh",
    }}
  >
    <div className={"ToolbarBounds" + " " + shake}></div>
    <Rnd
    //   default={{
    //     x: 0,
    //     y: 100,
    //   }}
      className={
        "react-draggable" + " " + elastic + " " + shake + " " + dragging
      }
      enableResizing={false}
      dragHandleClassName="drag-area"
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragStop={handleDrop}
      ref={DragRef}
    >
        <div className="App" style={{backgroundColor:'red !important'}} >
     <button onClick={onClickMe}>click me</button>
     <p style={{ width: '160px' }}>Current Page: {currentPage}</p>
 </div>
    </Rnd>
  </div>
  );
};

