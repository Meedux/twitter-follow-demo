import React from 'react';
import { FollowButton } from './FollowButton';

interface TwitterCardProps {
  username: string;
  profileImage: string;
  bio: string;
  targetUserId: string;
  loggedInUserId: string;
  accessToken: string;
}

export const TwitterCard: React.FC<TwitterCardProps> = ({ username, profileImage, bio, targetUserId, loggedInUserId, accessToken }) => {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="flex p-4">
        <img className="h-12 w-12 rounded-full" src={profileImage} alt={username} />
        <div className="ml-4">
          <div className="text-xl font-medium text-black">@{username}</div>
          <p className="text-gray-500">{bio}</p>
        </div>
        <FollowButton targetUserId={targetUserId} loggedInUserId={loggedInUserId} accessToken={accessToken} />
      </div>
    </div>
  );
};