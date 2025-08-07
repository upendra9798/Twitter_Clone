import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MdTrendingUp, MdPeople } from "react-icons/md";
import { FaHashtag } from "react-icons/fa";

import useFollow from "../../hooks/useFollow";

import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
	const { data: suggestedUsers, isLoading } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/users/suggested");
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong!");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
	});

	const { follow, isPending } = useFollow(); //Can use this hook everywhere by this

	// Mock trending data - in a real app, this would come from an API
	const trendingTopics = [
		{ tag: "technology", posts: "15.2K posts" },
		{ tag: "design", posts: "8.7K posts" },
		{ tag: "programming", posts: "12.1K posts" },
		{ tag: "ai", posts: "25.6K posts" },
	];

	if (suggestedUsers?.length === 0) return <div className='md:w-64 w-0'></div>;

	return (
		<div className='hidden lg:block w-80 p-4 space-y-6'>
			{/* Trending Topics */}
			<div className='bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm'>
				<div className='flex items-center gap-2 mb-4'>
					<MdTrendingUp className='w-5 h-5 text-blue-600' />
					<h2 className='text-lg font-bold text-slate-900 dark:text-white'>Trending Topics</h2>
				</div>
				<div className='space-y-3'>
					{trendingTopics.map((topic, index) => (
						<div key={topic.tag} className='group cursor-pointer'>
							<div className='flex items-center gap-2 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors'>
								<FaHashtag className='w-4 h-4 text-slate-400 group-hover:text-blue-500' />
								<div className='flex-1'>
									<p className='font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
										{topic.tag}
									</p>
									<p className='text-sm text-slate-500 dark:text-slate-400'>{topic.posts}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Suggested Users */}
			<div className='bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm'>
				<div className='flex items-center gap-2 mb-4'>
					<MdPeople className='w-5 h-5 text-green-600' />
					<h2 className='text-lg font-bold text-slate-900 dark:text-white'>People to Follow</h2>
				</div>
				<div className='space-y-4'>
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedUsers?.map((user) => (
							<div
								key={user._id}
								className='flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors'
							>
								<Link to={`/profile/${user.username}`} className='flex-shrink-0'>
									<div className='w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors'>
										<img 
											src={user.profileImg || "/avatar-placeholder.png"} 
											alt={user.fullName}
											className='w-full h-full object-cover'
										/>
									</div>
								</Link>
								<div className='flex-1 min-w-0'>
									<Link to={`/profile/${user.username}`}>
										<h3 className='font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate'>
											{user.fullName}
										</h3>
										<p className='text-sm text-slate-500 dark:text-slate-400 truncate'>
											@{user.username}
										</p>
									</Link>
								</div>
								<button
									className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0'
									onClick={(e) => {
										e.preventDefault();
										follow(user._id);
									}}
									disabled={isPending}
								>
									{isPending ? <LoadingSpinner size='sm' /> : "Follow"}
								</button>
							</div>
						))}
				</div>
				{suggestedUsers && suggestedUsers.length > 0 && (
					<Link 
						to="/explore" 
						className='block mt-4 text-center py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors'
					>
						Show more people
					</Link>
				)}
			</div>

			{/* Community Stats */}
			<div className='bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-blue-200 dark:border-slate-600 p-6'>
				<h3 className='text-lg font-bold text-slate-900 dark:text-white mb-3'>Community</h3>
				<div className='space-y-3'>
					<div className='flex justify-between items-center'>
						<span className='text-slate-600 dark:text-slate-300'>Active Users</span>
						<span className='font-semibold text-blue-600 dark:text-blue-400'>2.5K</span>
					</div>
					<div className='flex justify-between items-center'>
						<span className='text-slate-600 dark:text-slate-300'>Posts Today</span>
						<span className='font-semibold text-green-600 dark:text-green-400'>156</span>
					</div>
					<div className='flex justify-between items-center'>
						<span className='text-slate-600 dark:text-slate-300'>New Members</span>
						<span className='font-semibold text-purple-600 dark:text-purple-400'>23</span>
					</div>
				</div>
			</div>
		</div>
	);
};
export default RightPanel;