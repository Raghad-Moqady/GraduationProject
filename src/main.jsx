import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

  

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
     <QueryClientProvider client={queryClient}>
     <ToastContainer/>
     <App/>
     </QueryClientProvider>
    </>
)
