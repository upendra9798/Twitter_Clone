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
import { makeRequest } from "../../utils/api";

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
      const res = await makeRequest.get(`/users/${username}`);
      return res.data; // axios responses always have .data
    },
  });

  if (isLoading) return <ProfileHeaderSkeleton />;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-3 border-b border-gray-700">
        <Link to="/">
          <FaArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h2 className="text-xl font-bold">{user.fullName}</h2>
          <p className="text-sm text-gray-400">@{user.username}</p>
        </div>
      </div>

      {/* Banner & Profile Image */}
      <div className="relative">
        <img
          src={user.bannerImage || "/default-banner.jpg"}
          alt="Banner"
          className="w-full h-48 object-cover"
        />
        <img
          src={user.profileImage || "/default-avatar.png"}
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
        <h2 className="text-2xl font-bold">{user.fullName}</h2>
        <p className="text-gray-400">@{user.username}</p>
        <p className="mt-2">{user.bio}</p>

        <div className="flex flex-wrap gap-4 text-gray-400 mt-3">
          {user.link && (
            <span className="flex items-center gap-1">
              <FaLink />{" "}
              <a
                href={user.link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500"
              >
                {user.link}
              </a>
            </span>
          )}
          <span className="flex items-center gap-1">
            <IoCalendarOutline /> Joined {formatMemberSinceDate(user.createdAt)}
          </span>
        </div>

        <div className="flex gap-6 mt-3 text-gray-400">
          <span>
            <b>{user.following?.length || 0}</b> Following
          </span>
          <span>
            <b>{user.followers?.length || 0}</b> Followers
          </span>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-4">
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
