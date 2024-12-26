import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient()
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

