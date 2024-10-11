import App from './App.tsx'
import { createRoot } from 'react-dom/client';
import { Provider } from "jotai";
import {store} from "./store.ts";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
