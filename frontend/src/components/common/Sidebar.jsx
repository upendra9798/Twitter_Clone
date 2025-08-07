import ConnectLogo from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = ({ authUser }) => {
	//changes:-{ authUser } defined here in place on down and also passed in App.jsx
	const queryClient = useQueryClient();
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
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
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});
	// const { data: authUser } = useQuery({ queryKey: ["authUser"] });//not used(made changes)
	return (
		<div className='md:flex-[2_2_0] w-18 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-slate-200 dark:border-slate-700 w-20 md:w-full bg-white dark:bg-slate-900 shadow-sm'>
				<Link to='/' className='flex justify-center md:justify-start p-4'>
					<div className='flex items-center gap-2'>
						<ConnectLogo className='w-8 h-8 text-blue-600 hover:text-blue-700 transition-colors' />
						<span className='hidden md:block text-xl font-bold text-slate-800 dark:text-white'>Connect</span>
					</div>
				</Link>
				<nav className='flex flex-col gap-2 mt-4 px-2'>
					<Link
						to='/'
						className='flex gap-3 items-center hover:bg-blue-50 dark:hover:bg-slate-800 transition-all rounded-xl duration-300 py-3 px-4 group'
					>
						<MdHomeFilled className='w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-blue-600' />
						<span className='text-base font-medium hidden md:block text-slate-700 dark:text-slate-200 group-hover:text-blue-600'>Home</span>
					</Link>
					<Link
						to='/notifications'
						className='flex gap-3 items-center hover:bg-blue-50 dark:hover:bg-slate-800 transition-all rounded-xl duration-300 py-3 px-4 group'
					>
						<IoNotifications className='w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-blue-600' />
						<span className='text-base font-medium hidden md:block text-slate-700 dark:text-slate-200 group-hover:text-blue-600'>Notifications</span>
					</Link>
					<Link
						to={`/profile/${authUser?.username}`}
						className='flex gap-3 items-center hover:bg-blue-50 dark:hover:bg-slate-800 transition-all rounded-xl duration-300 py-3 px-4 group'
					>
						<FaUser className='w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-blue-600' />
						<span className='text-base font-medium hidden md:block text-slate-700 dark:text-slate-200 group-hover:text-blue-600'>Profile</span>
					</Link>
				</nav>
				{authUser && (
					<div className='mt-auto mb-6 mx-2'>
						<Link
							to={`/profile/${authUser.username}`}
							className='flex gap-3 items-center transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 py-3 px-4 rounded-xl group'
						>
							<div className='avatar'>
								<div className='w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-600'>
									<img src={authUser?.profileImg || "/avatar-placeholder.png"} alt="Profile" className='w-full h-full object-cover' />
								</div>
							</div>
							<div className='flex justify-between flex-1 items-center'>
								<div className='hidden md:block'>
									<p className='text-slate-800 dark:text-white font-semibold text-sm truncate max-w-24'>{authUser?.fullName}</p>
									<p className='text-slate-500 dark:text-slate-400 text-sm'>@{authUser?.username}</p>
								</div>
								<BiLogOut
									className='w-5 h-5 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors'
									onClick={(e) => {
										e.preventDefault();
										logout();
									}}
								/>
							</div>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};
export default Sidebar;