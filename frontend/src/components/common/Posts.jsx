import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import axios from "axios";

const Posts = ({ feedType, username, userId }) => {
	const { data: authUser } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, { withCredentials: true });
			return res.data;
		},
	});

	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return import.meta.env.VITE_BACKEND_URL+"/posts/all";
			case "following":
				return import.meta.env.VITE_BACKEND_URL+"/posts/following";
			case "posts":
				return `import.meta.env.VITE_BACKEND_URL/posts/user/${username}`;
			case "likes":
				return `import.meta.env.VITE_BACKEND_URL/posts/likes/${userId}`;
			default:
				return import.meta.env.VITE_BACKEND_URL+"/posts/all";
		}
	};

	const POST_ENDPOINT = getPostEndpoint();

	const {
		data: posts,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await axios.get(POST_ENDPOINT, { withCredentials: true });
				const data = res.data;

				return data;
			} catch (error) {
				throw new Error(error.response?.data?.error || "Something went wrong");
			}
		},
	});

	useEffect(() => { //fro refetching when clicked on other user profile
		refetch();
	}, [feedType, refetch, username]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && (
				<p className='text-center my-4'>No posts in this tab. Switch 👻</p>
			)}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} authUser={authUser} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;