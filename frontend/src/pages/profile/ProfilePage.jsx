import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";

import useFollow from "../../hooks/useFollow";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import makeRequest from "../../utils/api";

const ProfilePage = () => {
  const { username } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { followMutation } = useFollow();
  const { updateMutation } = useUpdateUserProfile();
  const fileInputRef = useRef(null);

  // ✅ Fetch user via makeRequest instead of raw axios
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      try {
        const res = await makeRequest.get(`/users/profile/${username}`);
        return res.data;
      } catch (error) {
        console.error('Profile fetch error:', error.response?.data || error.message);
        throw error;
      }
    },
  });

  if (isLoading) return <ProfileHeaderSkeleton />;

  return (
    <div className="flex flex-col w-[600px] ml-[275px] border-x border-gray-700 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 p-3 border-b border-gray-700 w-full sticky top-0 z-10 bg-black bg-opacity-75 backdrop-blur-sm">
        <Link to="/" className="rounded-full p-2 hover:bg-gray-900 transition-colors">
          <FaArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-neutral-200">{user.fullName}</h2>
          <p className="text-sm text-neutral-500">{user.tweets?.length || 0} posts</p>
        </div>
      </div>

      {/* Banner & Profile Image */}
      <div className="relative">
        <div className="aspect-[3/1] max-h-[200px]">
          <img
            src={user.bannerImage || "/cover.png"}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <img
          src={user.profileImage || "/avatar-placeholder.png"}
          alt="Profile"
          className="absolute -bottom-16 left-4 w-32 h-32 rounded-full border-4 border-black object-cover"
        />
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="absolute right-4 bottom-4 bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-full flex items-center gap-2"
        >
          <MdEdit /> Edit Profile
        </button>
      </div>

      {/* Profile Details */}
      <div className="mt-20 px-4">
        <h2 className="text-xl font-bold text-neutral-200">{user.fullName}</h2>
        <p className="text-neutral-500">@{user.username}</p>
        {user.bio && <p className="mt-2 text-neutral-200">{user.bio}</p>}

        <div className="flex flex-wrap gap-4 text-neutral-500 mt-3">
          {user.link && (
            <span className="flex items-center gap-1">
              <FaLink className="text-neutral-500" />{" "}
              <a
                href={user.link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                {user.link}
              </a>
            </span>
          )}
          <span className="flex items-center gap-1">
            <IoCalendarOutline /> Joined {formatMemberSinceDate(user.createdAt)}
          </span>
        </div>

        <div className="flex gap-6 mt-3">
          <button className="hover:underline cursor-pointer">
            <span className="text-neutral-200 font-bold">{user.following?.length || 0}</span>{" "}
            <span className="text-neutral-500">Following</span>
          </button>
          <button className="hover:underline cursor-pointer">
            <span className="text-neutral-200 font-bold">{user.followers?.length || 0}</span>{" "}
            <span className="text-neutral-500">Followers</span>
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="border-t border-gray-700 mt-4">
        <Posts posts={POSTS} />
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={updateMutation.mutate}
        />
      )}
    </div>
  );
};

export default ProfilePage;
