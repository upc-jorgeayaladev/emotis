import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/Post/PostCard';
import Loading from '../components/Common/Loading';
import Error from '../components/Common/Error';
import Avatar from '../components/Common/Avatar';
import Button from '../components/UI/Button';

const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/user/me`);
        const foundPost = data.find(p => p._id === id);
        if (foundPost) {
          setPost(foundPost);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar publicación');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const { data } = await api.get(`/comments/${id}`);
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { data } = await api.post(`/comments/${id}`, { content: newComment });
      setComments([data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!post) return <Error message="Publicación no encontrada" />;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <PostCard post={post} />

      <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
        <h3 className="font-semibold text-gray-900 mb-4">
          Comentarios ({comments.length})
        </h3>

        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex space-x-3">
            <Avatar src={post.user?.avatar?.secure_url} size="sm" />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <Button 
                  type="submit" 
                  size="sm" 
                  isLoading={isSubmitting}
                  disabled={!newComment.trim()}
                >
                  Comentar
                </Button>
              </div>
            </div>
          </div>
        </form>

        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment._id} className="flex space-x-3">
              <Avatar src={comment.user?.avatar?.secure_url} size="sm" />
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-gray-900 text-sm">
                    {comment.user?.name}
                  </p>
                  <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(comment.createdAt).toLocaleDateString('es-PE')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
