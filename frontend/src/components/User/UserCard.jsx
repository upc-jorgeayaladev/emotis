import { Link } from 'react-router-dom';
import Avatar from '../Common/Avatar';
import FollowButton from './FollowButton';

const UserCard = ({ user, showFollowButton = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
      <Link to={`/profile/${user.username}`} className="flex items-center space-x-3">
        <Avatar src={user.avatar?.secure_url} size="md" />
        <div>
          <p className="font-semibold text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">@{user.username}</p>
          {user.bio && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-1">{user.bio}</p>
          )}
        </div>
      </Link>
      
      {showFollowButton && (
        <FollowButton userId={user._id} />
      )}
    </div>
  );
};

export default UserCard;
