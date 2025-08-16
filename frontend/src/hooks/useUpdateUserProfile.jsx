import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

const useUpdateUserProfile = () => {
	const queryClient = useQueryClient();

    //used mutateAsync instead of mytate so that update btn not shows after updating and appear for a update
	const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationFn: async (formData) => {
			try {
				const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/update`, formData, { withCredentials: true });
				const data = res.data;
				return data;
			} catch (error) {
				throw new Error(error.response?.data?.error || "Something went wrong");
			}
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
				queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
			]);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;