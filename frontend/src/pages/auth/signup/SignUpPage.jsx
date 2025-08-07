import { Link } from "react-router-dom";
import { useState } from "react";

import ConnectLogo from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const queryClient = useQueryClient();

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullName, password }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullName, password }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to create account");
				console.log(data);
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully! Welcome to Connect!");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		
		// Validation
		if (!formData.email.trim() || !formData.username.trim() || !formData.fullName.trim() || !formData.password.trim()) {
			toast.error("Please fill in all fields");
			return;
		}
		
		if (formData.password.length < 6) {
			toast.error("Password must be at least 6 characters long");
			return;
		}
		
		if (!formData.email.includes('@')) {
			toast.error("Please enter a valid email address");
			return;
		}
		
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'>
			<div className='max-w-6xl mx-auto flex min-h-screen'>
				{/* Left Side - Branding */}
				<div className='flex-1 hidden lg:flex items-center justify-center p-12'>
					<div className='text-center space-y-8'>
						<div className='flex items-center justify-center gap-4 mb-8'>
							<ConnectLogo className='w-16 h-16 text-indigo-600' />
							<h1 className='text-5xl font-bold text-slate-800 dark:text-white'>Connect</h1>
						</div>
						<div className='space-y-6'>
							<h2 className='text-3xl font-semibold text-slate-700 dark:text-slate-200'>
								Join our growing community
							</h2>
							<p className='text-xl text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed'>
								Share your thoughts, connect with like-minded people, and discover amazing content every day.
							</p>
						</div>
						<div className='grid grid-cols-3 gap-4 mt-12 max-w-lg mx-auto'>
							<div className='text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm'>
								<div className='text-xl font-bold text-indigo-600'>Free</div>
								<div className='text-xs text-slate-600 dark:text-slate-400'>Forever</div>
							</div>
							<div className='text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm'>
								<div className='text-xl font-bold text-purple-600'>Safe</div>
								<div className='text-xs text-slate-600 dark:text-slate-400'>& Secure</div>
							</div>
							<div className='text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm'>
								<div className='text-xl font-bold text-green-600'>Easy</div>
								<div className='text-xs text-slate-600 dark:text-slate-400'>to Use</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right Side - Signup Form */}
				<div className='flex-1 flex flex-col justify-center items-center p-8'>
					<div className='w-full max-w-md'>
						{/* Mobile Logo */}
						<div className='lg:hidden flex items-center justify-center gap-3 mb-8'>
							<ConnectLogo className='w-10 h-10 text-indigo-600' />
							<h1 className='text-3xl font-bold text-slate-800 dark:text-white'>Connect</h1>
						</div>

						<div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8'>
							<div className='text-center mb-8'>
								<h2 className='text-2xl font-bold text-slate-800 dark:text-white mb-2'>Create your account</h2>
								<p className='text-slate-600 dark:text-slate-400'>Join thousands of users sharing their stories</p>
							</div>

							<form className='space-y-5' onSubmit={handleSubmit}>
								<div className='grid grid-cols-1 gap-4'>
									<div>
										<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
											Full Name
										</label>
										<div className='relative'>
											<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
												<MdDriveFileRenameOutline className='h-5 w-5 text-slate-400' />
											</div>
											<input
												type='text'
												name='fullName'
												className='w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all'
												placeholder='Enter your full name'
												value={formData.fullName}
												onChange={handleInputChange}
												required
											/>
										</div>
									</div>

									<div>
										<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
											Username
										</label>
										<div className='relative'>
											<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
												<FaUser className='h-4 w-4 text-slate-400' />
											</div>
											<input
												type='text'
												name='username'
												className='w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all'
												placeholder='Choose a username'
												value={formData.username}
												onChange={handleInputChange}
												required
											/>
										</div>
									</div>

									<div>
										<label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
											Email Address
										</label>
										<div className='relative'>
											<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
												<MdOutlineMail className='h-5 w-5 text-slate-400' />
											</div>
											<input
												type='email'
												name='email'
												className='w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all'
												placeholder='Enter your email'
												value={formData.email}
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
												className='w-full pl-10 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all'
												placeholder='Create a password (min. 6 characters)'
												value={formData.password}
												onChange={handleInputChange}
												required
												minLength={6}
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
									className='w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2'
								>
									{isPending ? (
										<>
											<div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
											Creating account...
										</>
									) : (
										'Create Account'
									)}
								</button>
							</form>

							<div className='mt-8 text-center'>
								<p className='text-slate-600 dark:text-slate-400'>
									Already have an account?{' '}
									<Link 
										to='/login' 
										className='text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold hover:underline transition-colors'
									>
										Sign in
									</Link>
								</p>
							</div>

							<div className='mt-6 text-center'>
								<p className='text-xs text-slate-500 dark:text-slate-400'>
									By creating an account, you agree to our{' '}
									<a href="#" className='text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline'>
										Terms of Service
									</a>{' '}
									and{' '}
									<a href="#" className='text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline'>
										Privacy Policy
									</a>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;