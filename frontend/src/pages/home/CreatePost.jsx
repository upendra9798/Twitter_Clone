import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { MdPublic } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const imgRef = useRef(null);

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const {
		mutate: createPost,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ text, img }) => {
			try {
				const res = await fetch("/api/posts/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text, img }),
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
			setText("");
			setImg(null);
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!text.trim() && !img) {
			toast.error("Please add some content to your post");
			return;
		}
		createPost({ text, img });
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) { // 5MB limit
				toast.error("Image size should be less than 5MB");
				return;
			}
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const isPostDisabled = !text.trim() && !img;
	const charCount = text.length;
	const maxChars = 280;

	return (
		<div className='p-6 bg-white dark:bg-slate-900'>
			<div className='flex gap-4'>
				<div className='flex-shrink-0'>
					<div className='w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-600'>
						<img 
							src={authUser?.profileImg || "/avatar-placeholder.png"} 
							alt="Your avatar"
							className='w-full h-full object-cover'
						/>
					</div>
				</div>
				<form className='flex-1 space-y-4' onSubmit={handleSubmit}>
					<div className='relative'>
						<textarea
							className='w-full min-h-[120px] p-4 text-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 transition-all'
							placeholder="What's on your mind? Share something interesting..."
							value={text}
							onChange={(e) => setText(e.target.value)}
							maxLength={maxChars}
						/>
						<div className={`absolute bottom-3 right-3 text-sm ${
							charCount > maxChars * 0.8 ? 'text-red-500' : 'text-slate-400'
						}`}>
							{charCount}/{maxChars}
						</div>
					</div>
					
					{img && (
						<div className='relative max-w-md'>
							<button
								type="button"
								className='absolute top-2 right-2 p-1 bg-slate-900/70 text-white rounded-full hover:bg-slate-900/90 transition-colors z-10'
								onClick={() => {
									setImg(null);
									imgRef.current.value = null;
								}}
							>
								<IoCloseSharp className='w-4 h-4' />
							</button>
							<img 
								src={img} 
								className='w-full rounded-xl object-cover max-h-80' 
								alt="Upload preview"
							/>
						</div>
					)}

					<div className='flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700'>
						<div className='flex items-center gap-4'>
							<button
								type="button"
								className='flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors'
								onClick={() => imgRef.current.click()}
							>
								<CiImageOn className='w-5 h-5' />
								<span className='text-sm font-medium'>Photo</span>
							</button>
							<button
								type="button"
								className='flex items-center gap-2 px-3 py-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors'
							>
								<BsEmojiSmileFill className='w-4 h-4' />
								<span className='text-sm font-medium'>Emoji</span>
							</button>
							<div className='flex items-center gap-2 px-3 py-2 text-slate-500 text-sm'>
								<MdPublic className='w-4 h-4' />
								<span>Public</span>
							</div>
						</div>
						
						<input type='file' accept='image/*' hidden ref={imgRef} onChange={handleImgChange} />
						
						<button 
							type="submit"
							disabled={isPostDisabled || isPending}
							className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
								isPostDisabled || isPending
									? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
									: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
							}`}
						>
							{isPending ? (
								<span className='flex items-center gap-2'>
									<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
									Posting...
								</span>
							) : (
								'Share Post'
							)}
						</button>
					</div>
					
					{isError && (
						<div className='p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm'>
							{error.message}
						</div>
					)}
				</form>
			</div>
		</div>
	);
};
export default CreatePost;