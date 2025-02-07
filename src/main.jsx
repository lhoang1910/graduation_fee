import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux';
import {store} from './redux/store';
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>

    <Provider store={store}>
        <QueryClientProvider client={queryClient}>

        <App/>
        <ReactQueryDevtools initialIsOpen />
        </QueryClientProvider>
        </Provider>
    // </React.StrictMode>
)
