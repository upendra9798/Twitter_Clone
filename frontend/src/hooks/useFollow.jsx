//creating this as hook because we need it in home page and other tabs like profile
//So to not write code in defferent places we made a hook

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

const useFollow = () => {
	const queryClient = useQueryClient();

	const { mutate: follow, isPending } = useMutation({
		mutationFn: async (userId) => {
			try {
				const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/follow/${userId}`, {}, { withCredentials: true });
				const data = res.data;

				return;
			} catch (error) {
				throw new Error(error.response?.data?.error || "Something went wrong!");
			}
		},
		onSuccess: () => {
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
			]);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { follow, isPending };
};

export default useFollow;