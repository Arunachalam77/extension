import React from 'react';
import '@pages/panel/Panel.css';
// import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

const Panel: React.FC = () => {
  return (
    <div className="container">
      <h1 className="">Dev Tools Panel</h1>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Panel, <div> Loading ... </div>), <div> Error Occur </div>);
