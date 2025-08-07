import "./App.css";
import {Navigate, Route,Routes} from 'react-router-dom'
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import HomePage from "./pages/home/HomePage";
import NotificationPage from "./pages/notification/Notification";
import ProfilePage from "./pages/Profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
	const { data: authUser, isLoading } = useQuery({
		// we use queryKey to give a unique name to our query and refer to it later
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				console.log("authUser is here:", data);
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false,
	});

	if (isLoading) {
		return (
			<div className='min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-900'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}

  return (
   <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
		<div className='flex max-w-7xl mx-auto'>
			{/* Common component, bc it's not wrapped with Routes */}
			{authUser && <Sidebar authUser={authUser} />}
			{/* authUser={authUser} :- made changes (without it logout fn not show) */}
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
			</Routes>
			{authUser && <RightPanel />}
		</div>
		<Toaster 
			position="top-right"
			toastOptions={{
				duration: 4000,
				style: {
					background: '#1f2937',
					color: '#f9fafb',
					borderRadius: '12px',
					padding: '12px 16px',
				},
			}}
		/>
	</div>
  );
}

export default App;
