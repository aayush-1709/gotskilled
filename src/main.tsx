import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AIAssistantProvider } from './context/AIAssistantContext.tsx';
import { GuidedFlowProvider } from './context/GuidedFlowContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GuidedFlowProvider>
      <AIAssistantProvider>
        <App />
      </AIAssistantProvider>
    </GuidedFlowProvider>
  </StrictMode>,
);
