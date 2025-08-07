import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const Post = ({ post,authUser }) => {
	const [comment, setComment] = useState("");
	// const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();
	const postOwner = post.user;

	// post.likes.includes(authUser._id) //not working
	//So:-
	const isLiked = Array.isArray(post.likes) &&
	post.likes.some((like) => like === authUser._id || like?._id === authUser._id);


	const isMyPost = authUser._id === post.user._id;

	const formattedDate = formatPostDate(post.createdAt);

	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/${post._id}`, {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Post deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const { mutate: likePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/like/${post._id}`, {
					method: "POST",
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: (updatedLikes) => {
			// this is not working
			// queryClient.setQueryData(["posts"], (oldData) => {
			// 	return oldData.map((p) => {
			// 		if (p._id === post._id) {
			// 			return { ...p, likes: updatedLikes };
			// 		}
			// 		return p;
			// 	});
			// });
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/comment/${post._id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text: comment }),
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Comment posted successfully");
			setComment("");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleDeletePost = () => {
		deletePost();
	};

	const handlePostComment = (e) => {
		e.preventDefault();
		if (isCommenting) return;
		commentPost();
	};

	const handleLikePost = () => {
		if (isLiking) return;
		likePost();
	};

	return (
		<div className='bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'>
			<div className='flex gap-4 p-6'>
				<div className='flex-shrink-0'>
					<Link to={`/profile/${postOwner.username}`} className='block'>
						<div className='w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors'>
							<img 
								src={postOwner.profileImg || "/avatar-placeholder.png"} 
								alt={postOwner.fullName}
								className='w-full h-full object-cover'
							/>
						</div>
					</Link>
				</div>
				<div className='flex-1 min-w-0'>
					<div className='flex items-center gap-2 mb-2'>
						<Link 
							to={`/profile/${postOwner.username}`} 
							className='font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
						>
							{postOwner.fullName}
						</Link>
						<Link 
							to={`/profile/${postOwner.username}`} 
							className='text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'
						>
							@{postOwner.username}
						</Link>
						<span className='text-slate-400 dark:text-slate-500'>·</span>
						<span className='text-slate-500 dark:text-slate-400 text-sm'>{formattedDate}</span>
						{isMyPost && (
							<div className='ml-auto'>
								{!isDeleting ? (
									<button
										onClick={handleDeletePost}
										className='p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors'
									>
										<FaTrash className='w-4 h-4' />
									</button>
								) : (
									<div className='p-2'>
										<LoadingSpinner size='sm' />
									</div>
								)}
							</div>
						)}
					</div>
					
					<div className='space-y-3 mb-4'>
						{post.text && (
							<p className='text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-wrap'>
								{post.text}
							</p>
						)}
						{post.img && (
							<div className='rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700'>
								<img
									src={post.img}
									className='w-full max-h-96 object-cover'
									alt='Post image'
								/>
							</div>
						)}
					</div>
					
					<div className='flex items-center gap-6'>
						<button
							className='flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all group'
							onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
						>
							<FaRegComment className='w-4 h-4 group-hover:scale-110 transition-transform' />
							<span className='text-sm font-medium'>{post.comments.length}</span>
						</button>
						
						<button className='flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-all group'>
							<BiRepost className='w-4 h-4 group-hover:scale-110 transition-transform' />
							<span className='text-sm font-medium'>0</span>
						</button>
						
						<button
							onClick={handleLikePost}
							disabled={isLiking}
							className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all group ${
								isLiked
									? 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
									: 'text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
							}`}
						>
							{isLiked ? (
								<FaHeart className='w-4 h-4 group-hover:scale-110 transition-transform' />
							) : (
								<FaRegHeart className='w-4 h-4 group-hover:scale-110 transition-transform' />
							)}
							<span className='text-sm font-medium'>{post.likes.length}</span>
						</button>
						
						<button className='flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all group'>
							<FaRegBookmark className='w-4 h-4 group-hover:scale-110 transition-transform' />
						</button>
					</div>

					{/* Comments Modal */}
					<dialog id={`comments_modal${post._id}`} className='modal'>
						<div className='modal-box bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl max-w-2xl'>
							<div className='flex items-center justify-between mb-6'>
								<h3 className='text-xl font-bold text-slate-900 dark:text-white'>Comments</h3>
								<form method='dialog'>
									<button className='p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors'>
										<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
											<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
										</svg>
									</button>
								</form>
							</div>
							
							<div className='max-h-80 overflow-y-auto space-y-4 mb-6'>
								{post.comments.length === 0 && (
									<div className='text-center py-8'>
										<p className='text-slate-500 dark:text-slate-400'>
											No comments yet. Be the first to share your thoughts! 💭
										</p>
									</div>
								)}
								{post.comments.map((comment) => (
									<div key={comment._id} className='flex gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg'>
										<div className='w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600 flex-shrink-0'>
											<img
												src={comment.user.profileImg || "/avatar-placeholder.png"}
												alt={comment.user.fullName}
												className='w-full h-full object-cover'
											/>
										</div>
										<div className='flex-1 min-w-0'>
											<div className='flex items-center gap-2 mb-1'>
												<span className='font-semibold text-slate-900 dark:text-white text-sm'>
													{comment.user.fullName}
												</span>
												<span className='text-slate-500 dark:text-slate-400 text-sm'>
													@{comment.user.username}
												</span>
											</div>
											<p className='text-slate-800 dark:text-slate-200 text-sm leading-relaxed'>
												{comment.text}
											</p>
										</div>
									</div>
								))}
							</div>
							
							<form onSubmit={handlePostComment} className='flex gap-3'>
								<div className='w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600 flex-shrink-0'>
									<img
										src={authUser?.profileImg || "/avatar-placeholder.png"}
										alt="Your avatar"
										className='w-full h-full object-cover'
									/>
								</div>
								<div className='flex-1 flex gap-2'>
									<input
										className='flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400'
										placeholder='Write a comment...'
										value={comment}
										onChange={(e) => setComment(e.target.value)}
									/>
									<button
										type='submit'
										disabled={!comment.trim() || isCommenting}
										className='px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-full font-medium text-sm transition-colors disabled:cursor-not-allowed'
									>
										{isCommenting ? "Posting..." : "Post"}
									</button>
								</div>
							</form>
						</div>
						<form method='dialog' className='modal-backdrop'>
							<button>close</button>
						</form>
					</dialog>
				</div>
			</div>
		</div>
	);
};

export default Post;