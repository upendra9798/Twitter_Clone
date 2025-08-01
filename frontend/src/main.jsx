import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
      //so that it doesn't refetch on every reload
      // App.jsx:21  GET http://localhost:3000/api/auth/me 401 (Unauthorized)
		},
	},
});
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <QueryClientProvider client={queryClient}>
      <App />
      </QueryClientProvider>
   </BrowserRouter>,
  </StrictMode>,
)
