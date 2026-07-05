import { useState } from 'react';
import api from '../../services/api';

const reactions = [
  { key: 'emotion', emoji: '❤️', label: 'Me emocionó' },
  { key: 'inspire', emoji: '🎁', label: 'Me inspira' },
  { key: 'cry', emoji: '🥹', label: 'Me hizo llorar' },
  { key: 'want', emoji: '😍', label: 'Lo quiero' },
  { key: 'perfect', emoji: '👏', label: 'Excelente idea' }
];

const ReactionBar = ({ post }) => {
  const [localPost, setLocalPost] = useState(post);
  const [showReactions, setShowReactions] = useState(false);

  const handleReaction = async (reactionKey) => {
    try {
      const { data } = await api.post(`/posts/${post._id}/react`, { reaction: reactionKey });
      setLocalPost(data);
    } catch (error) {
      console.error('Error reacting to post:', error);
    }
  };

  const getReactionCount = (reactionKey) => {
    return localPost.reactions?.[reactionKey]?.length || 0;
  };

  const hasUserReacted = (reactionKey) => {
    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    return localPost.reactions?.[reactionKey]?.includes(userId) || false;
  };

  return (
    <div className="flex items-center justify-between">
      <div 
        className="relative"
        onMouseEnter={() => setShowReactions(true)}
        onMouseLeave={() => setShowReactions(false)}
      >
        <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <span>Reacciones</span>
          <svg 
            className={`w-4 h-4 transition-transform ${showReactions ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showReactions && (
          <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border p-2 flex space-x-1">
            {reactions.map((reaction) => (
              <button
                key={reaction.key}
                onClick={() => handleReaction(reaction.key)}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                  hasUserReacted(reaction.key) ? 'bg-indigo-100' : ''
                }`}
                title={reaction.label}
              >
                <span className="text-xl">{reaction.emoji}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {reactions.map((reaction) => {
          const count = getReactionCount(reaction.key);
          if (count === 0) return null;
          return (
            <div 
              key={reaction.key} 
              className={`flex items-center space-x-1 text-sm ${
                hasUserReacted(reaction.key) ? 'text-indigo-600' : 'text-gray-500'
              }`}
            >
              <span>{reaction.emoji}</span>
              <span>{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReactionBar;
