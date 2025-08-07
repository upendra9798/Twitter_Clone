import { useState } from "react";
import { Link } from "react-router-dom";

import ConnectLogo from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const queryClient = useQueryClient();//a hook
	//It take u to home page on login(see onSuccess)

	const {
		mutate: loginMutation,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});

				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			// refetch the authUser
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
			toast.success("Welcome back!");
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.username.trim() || !formData.password.trim()) {
			toast.error("Please fill in all fields");
			return;
		}
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'>
			<div className='max-w-6xl mx-auto flex min-h-screen'>
				{/* Left Side - Branding */}
				<div className='flex-1 hidden lg:flex items-center justify-center p-12'>
					<div className='text-center space-y-8'>
						<div className='flex items-center justify-center gap-4 mb-8'>
							<ConnectLogo className='w-16 h-16 text-blue-600' />
							<h1 className='text-5xl font-bold text-slate-800 dark:text-white'>Connect</h1>
						</div>
						<div className='space-y-6'>
							<h2 className='text-3xl font-semibold text-slate-700 dark:text-slate-200'>
								Welcome back to your community
							</h2>
							<p className='text-xl text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed'>
								Connect with friends, share your thoughts, and discover amazing content from people around the world.
							</p>
						</div>
						<div className='grid grid-cols-2 gap-6 mt-12 max-w-md mx-auto'>
							<div className='text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm'>
								<div className='text-2xl font-bold text-blue-600'>2.5K+</div>
								<div className='text-sm text-slate-600 dark:text-slate-400'>Active Users</div>
							</div>
							<div className='text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm'>
								<div className='text-2xl font-bold text-green-600'>156</div>
								<div className='text-sm text-slate-600 dark:text-slate-400'>Posts Today</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right Side - Login Form */}
				<div className='flex-1 flex flex-col justify-center items-center p-8'>
					<div className='w-full max-w-md'>
						{/* Mobile Logo */}
						<div className='lg:hidden flex items-center justify-center gap-3 mb-8'>
							<ConnectLogo className='w-10 h-10 text-blue-600' />
							<h1 className='text-3xl font-bold text-slate-800 dark:text-white'>Connect</h1>
						</div>

						<div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8'>
							<div className='text-center mb-8'>
								<h2 className='text-2xl font-bold text-slate-800 dark:text-white mb-2'>Welcome back</h2>
								<p className='text-slate-600 dark:text-slate-400'>Sign in to your account to continue</p>
							</div>

							<form className='space-y-6' onSubmit={handleSubmit}>
								<div className='space-y-4'>
									<div>
										<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
											Username or Email
										</label>
										<div className='relative'>
											<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
												<MdOutlineMail className='h-5 w-5 text-slate-400' />
											</div>
											<input
												type='text'
												name='username'
												className='w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all'
												placeholder='Enter your username or email'
												value={formData.username}
												onChange={handleInputChange}
												required
											/>
										</div>
									</div>

									<div>
										<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
											Password
										</label>
										<div className='relative'>
											<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
												<MdPassword className='h-5 w-5 text-slate-400' />
											</div>
											<input
												type={showPassword ? 'text' : 'password'}
												name='password'
												className='w-full pl-10 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all'
												placeholder='Enter your password'
												value={formData.password}
												onChange={handleInputChange}
												required
											/>
											<button
												type="button"
												className='absolute inset-y-0 right-0 pr-3 flex items-center'
												onClick={() => setShowPassword(!showPassword)}
											>
												{showPassword ? (
													<FaEyeSlash className='h-4 w-4 text-slate-400 hover:text-slate-600' />
												) : (
													<FaEye className='h-4 w-4 text-slate-400 hover:text-slate-600' />
												)}
											</button>
										</div>
									</div>
								</div>

								<button
									type="submit"
									disabled={isPending}
									className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2'
								>
									{isPending ? (
										<>
											<div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
											Signing in...
										</>
									) : (
										'Sign In'
									)}
								</button>
							</form>

							<div className='mt-8 text-center'>
								<p className='text-slate-600 dark:text-slate-400'>
									Don't have an account?{' '}
									<Link 
										to='/signup' 
										className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover:underline transition-colors'
									>
										Sign up for free
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;