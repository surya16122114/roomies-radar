import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import * as serviceWorkerRegistration from './serviceworkerregistration';



createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
    </StrictMode>
    
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
