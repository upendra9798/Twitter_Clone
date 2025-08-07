import { useState } from "react";
import { MdTrendingUp, MdExplore } from "react-icons/md";
import { FaUsers, FaHeart } from "react-icons/fa";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");
	//For seeing your posts or following persons posts

	const feedOptions = [
		{ key: "forYou", label: "For You", icon: MdTrendingUp },
		{ key: "following", label: "Following", icon: FaUsers },
		{ key: "trending", label: "Trending", icon: MdExplore },
		{ key: "popular", label: "Popular", icon: FaHeart },
	];

	return (
		<div className='flex-[4_4_0] mr-auto border-r border-slate-200 dark:border-slate-700 min-h-screen bg-white dark:bg-slate-900'>
			{/* Header */}
			<div className='sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 z-10'>
				<div className='px-4 py-3'>
					<h1 className='text-xl font-bold text-slate-800 dark:text-white mb-4'>Home</h1>
					<div className='flex gap-1 overflow-x-auto'>
						{feedOptions.map(({ key, label, icon: Icon }) => (
							<button
								key={key}
								className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
									feedType === key
										? 'bg-blue-600 text-white shadow-lg'
										: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
								}`}
								onClick={() => setFeedType(key)}
							>
								<Icon className='w-4 h-4' />
								{label}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* CREATE POST INPUT */}
			<div className='border-b border-slate-200 dark:border-slate-700'>
				<CreatePost />
			</div>

			{/* Feed Content */}
			<div className='relative'>
				{feedType === "trending" && (
					<div className='p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-600'>
						<div className='flex items-center gap-2 text-blue-600 dark:text-blue-400'>
							<MdTrendingUp className='w-5 h-5' />
							<span className='font-medium'>Trending topics and popular discussions</span>
						</div>
					</div>
				)}
				
				{feedType === "popular" && (
					<div className='p-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200 dark:border-slate-600'>
						<div className='flex items-center gap-2 text-rose-600 dark:text-rose-400'>
							<FaHeart className='w-5 h-5' />
							<span className='font-medium'>Most liked and engaging content</span>
						</div>
					</div>
				)}

				{/* POSTS */}
				<Posts feedType={feedType} />
			</div>
		</div>
	);
};
export default HomePage;