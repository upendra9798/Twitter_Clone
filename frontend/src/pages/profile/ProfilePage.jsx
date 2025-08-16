import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";
import { Camera, MapPin, CalendarDays } from "lucide-react";
import { FaLink } from "react-icons/fa";
import ProfileHeaderSkeleton from "../components/skeletons/ProfileHeaderSkeleton";
import Posts from "../components/Posts";
import makeRequest from "../utils/makeRequest"; // ✅ import your helper

const ProfilePage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();
  const { authUser } = useAuthContext();
  const [showEditProfile, setShowEditProfile] = useState(false);

  // ✅ Fetch user profile using makeRequest
  const { data: user, isLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const res = await makeRequest(`/users/profile/${username}`, {
        method: "GET",
      });
      return res;
    },
  });

  const isMyProfile = authUser?._id === user?._id;
  const amIFollowing = authUser?.following?.includes(user?._id);

  // ✅ Follow / Unfollow mutation with makeRequest
  const followMutation = useMutation({
    mutationFn: async () => {
      if (amIFollowing) {
        return makeRequest(`/users/unfollow/${user._id}`, {
          method: "POST",
        });
      } else {
        return makeRequest(`/users/follow/${user._id}`, {
          method: "POST",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err?.message || "Action failed");
    },
  });

  if (isLoading) return <ProfileHeaderSkeleton />;

  return (
    <div className="flex flex-col border-r border-gray-200 w-full">
      {/* Cover Image */}
      <div className="relative w-full h-44 bg-gray-300">
        {user?.coverImg ? (
          <img
            src={user.coverImg}
            alt="cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        {isMyProfile && (
          <button className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full">
            <Camera className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Profile section */}
      <div className="px-4">
        <div className="flex justify-between">
          <div className="relative -mt-16">
            {user?.profileImg ? (
              <img
                src={user.profileImg}
                alt="profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300" />
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-2">
            {isMyProfile ? (
              <button
                className="px-4 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-100"
                onClick={() => setShowEditProfile(true)}
              >
                Edit Profile
              </button>
            ) : (
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  amIFollowing
                    ? "bg-white border border-gray-300 hover:bg-gray-100"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
                onClick={() => followMutation.mutate()}
                disabled={followMutation.isLoading}
              >
                {amIFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="mt-2">
          <h1 className="text-lg font-bold">{user?.fullName}</h1>
          <p className="text-sm text-gray-500">@{user?.username}</p>
          <p className="mt-2 text-sm">{user?.bio}</p>

          {/* Links & info */}
          <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
            {user?.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {user.location}
              </span>
            )}

            {user?.link && (
              <span className="flex items-center gap-1">
                <FaLink className="w-3 h-3 text-slate-500" />
                <a
                  href={user.link}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-blue-500"
                >
                  {user.link}
                </a>
              </span>
            )}

            <span className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" /> Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Followers / Following */}
          <div className="flex gap-4 mt-3 text-sm">
            <span>
              <b>{user?.following?.length || 0}</b> Following
            </span>
            <span>
              <b>{user?.followers?.length || 0}</b> Followers
            </span>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-4">
        <Posts userId={user?._id} />
      </div>
    </div>
  );
};

export default ProfilePage;
