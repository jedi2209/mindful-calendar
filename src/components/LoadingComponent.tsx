import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingComponentProps {
  loadingText: string | null;
}

export const LoadingComponent: React.FC<LoadingComponentProps> = ({ loadingText }) => (
  <div className='loader' data-testid='loader'>
    <CircularProgress style={{ margin: 'auto' }} />
    {loadingText && (
      <div className='loadingText'>
        <span>{loadingText}</span>
      </div>
    )}
  </div>
); 