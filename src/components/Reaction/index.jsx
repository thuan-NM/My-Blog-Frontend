import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import reactionServices from '../../services/reaction.services';

const ReactionItem = ({ postId }) => {
  const { user } = useAuth();
  const [reactionStats, setReactionStats] = useState({
    totalReactions: 0,
    reactionCounts: {},
  });

  useEffect(() => {
    const fetchReactionStats = async () => {
      try {
        const reactionStatsResponse = await reactionServices.getReactionsWithPostId(postId)
        setReactionStats(reactionStatsResponse.data);
      } catch (error) {
        console.error('Error fetching reaction stats:', error);
      }
    };

    fetchReactionStats();
  }, [reactionStats]);

  const handleReaction = async (reactionType) => {
    try {
      await reactionServices.postReaction({
        userId: user._id,
        reactionType,
      })
    } catch (error) {
      console.error('Error handling reaction:', error);
      message.error('Failed');
    }
  };

  return (
    <div className="reactions-container">
      <div className="reactions-item-container">
        <div className="reactions-item me-3">
          <Button className="reactions-button" onClick={() => handleReaction('like')} title="Like">
            <i className="bi bi-hand-thumbs-up"></i>
          </Button>
          <div className="reaction-content">{reactionStats.reactionCounts.like}</div>
        </div>
        <div className="reactions-item me-3">
          <Button className="reactions-button" onClick={() => handleReaction('heart')} title="Heart">
            <i className="bi bi-heart"></i>
          </Button>
          <div className="reaction-content">{reactionStats.reactionCounts.heart}</div>
        </div>
        <div className="reactions-item me-3">
          <Button className="reactions-button" onClick={() => handleReaction('sad')} title="Sad">
            <i className="bi bi-emoji-frown"></i>
          </Button>
          <div className="reaction-content">{reactionStats.reactionCounts.sad}</div>
        </div>
        <div className="reactions-item me-3">
          <Button className="reactions-button" onClick={() => handleReaction('angry')} title="Angry">
            <i className="bi bi-emoji-angry"></i>
          </Button>
          <div className="reaction-content">{reactionStats.reactionCounts.angry}</div>
        </div>
        <div className="reactions-item me-3">
          <Button className="reactions-button" onClick={() => handleReaction('X')} title="Cancel">
            <i className="bi bi-x-circle"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReactionItem;
