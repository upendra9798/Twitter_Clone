import { useState } from "react";
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
    <main className="flex-1 border-x border-neutral-800">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-neutral-800 sticky top-0 z-10 bg-black/80 backdrop-blur">
        <Link to="/" className="rounded-full p-2 hover:bg-neutral-800/70 transition-colors">
          <FaArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-white">{user.fullName}</h2>
          <p className="text-sm text-neutral-600">{user.tweets?.length || 0} posts</p>
        </div>
      </div>

      {/* Banner & Profile Image */}
      <div className="relative">
        <div className="h-[200px] bg-neutral-800">
          {user.bannerImage ? (
            <img
              src={user.bannerImage}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
        <div className="absolute -bottom-16 left-4">
          <img
            src={user.profileImage || "/avatar-placeholder.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-black bg-neutral-800 object-cover"
          />
        </div>
        <div className="absolute right-4 bottom-4">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-1.5 rounded-full border border-neutral-700 font-medium bg-transparent hover:bg-neutral-900 transition-colors"
          >
            Edit profile
          </button>
        </div>
      </div>

      {/* Profile Details */}
      <div className="mt-20 px-4">
        <h2 className="text-xl font-bold text-white">{user.fullName}</h2>
        <p className="text-neutral-600">@{user.username}</p>
        {user.bio && <p className="mt-3 text-white whitespace-pre-wrap">{user.bio}</p>}

        <div className="flex flex-wrap gap-4 text-neutral-600 mt-3">
          {user.link && (
            <a
              href={user.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <FaLink className="w-4 h-4" />
              {user.link.replace(/(^\w+:|^)\/\//, '')}
            </a>
          )}
          <span className="flex items-center gap-1">
            <IoCalendarOutline className="w-4 h-4" /> 
            Joined {formatMemberSinceDate(user.createdAt)}
          </span>
        </div>

        <div className="flex gap-6 mt-3 text-neutral-600">
          <button className="hover:underline">
            <span className="text-white font-medium">{user.following?.length || 0}</span>{" "}
            Following
          </button>
          <button className="hover:underline">
            <span className="text-white font-medium">{user.followers?.length || 0}</span>{" "}
            Followers
          </button>
        </div>
      </div>

      {/* Posts */}
      <nav className="border-b border-neutral-800">
        <button className="px-4 py-4 text-[15px] text-white font-medium border-b-4 border-blue-500">
          Posts
        </button>
      </nav>
      <div className="pb-4">
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
    </main>
    // </div>
  );
};

export default ProfilePage;
