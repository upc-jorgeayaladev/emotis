import { useState } from 'react';
import api from '../../services/api';
import Button from '../UI/Button';

const FollowButton = ({ userId, initialIsFollowing = false }) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await api.delete(`/users/follow/${userId}`);
        setIsFollowing(false);
      } else {
        await api.post(`/users/follow/${userId}`);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'secondary' : 'primary'}
      size="sm"
      onClick={handleFollow}
      isLoading={isLoading}
    >
      {isFollowing ? 'Siguiendo' : 'Seguir'}
    </Button>
  );
};

export default FollowButton;
