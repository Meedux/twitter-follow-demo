import React from 'react';
import { FollowButton } from './FollowButton';

interface TwitterCardProps {
  username: string;
  profileImage: string;
  bio: string;
  targetUserId: string;
  loggedInUserId: string;
}

export const TwitterCard: React.FC<TwitterCardProps> = ({ username, profileImage, bio, targetUserId, loggedInUserId }) => {
  return (
    <div className="max-w-2xl mx-auto bg-[#1F2937] rounded-xl shadow-md">
      <div className="flex p-4 w-full">
        <img className="h-12 w-12 rounded-full" src={profileImage} alt={username} />
        <div className="ml-4 flex-grow">
          <div className="text-xl font-medium text-white">@{username}</div>
          <p className="text-gray-400">{bio}</p>
        </div>
        <FollowButton targetUserId={targetUserId} loggedInUserId={loggedInUserId} />
      </div>
    </div>
  );
};