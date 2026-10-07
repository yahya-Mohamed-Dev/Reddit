import { useState } from 'react';

function PostCard({ post, onVote, onAddComment, onNotify }) {
  const [voteState, setVoteState] = useState(0);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  function doVote(dir) {
    if ((dir === 'up' && voteState === 1) || (dir === 'down' && voteState === -1)) {
      setVoteState(0);
      onVote(post.id, dir === 'up' ? 'down' : 'up');
      return;
    }

    setVoteState(dir === 'up' ? 1 : -1);
    onVote(post.id, dir);
  }

  function share() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(post.title);
    }
    setShared(true);
    onNotify('Post title copied');
    setTimeout(() => setShared(false), 1000);
  }

  return (
    <article className="post">
      <div className="post-inner">
        <div className="vote">
          <button className={'up ' + (voteState === 1 ? 'active' : '')} onClick={() => doVote('up')}>
            <i className="bi bi-arrow-up"></i>
          </button>
          <div className="score">{post.score}</div>
          <button className={'down ' + (voteState === -1 ? 'active' : '')} onClick={() => doVote('down')}>
            <i className="bi bi-arrow-down"></i>
          </button>
        </div>

        <div className="content">
          <div className="meta">
            <b>r/{post.sub}</b> • Posted by u/{post.user} • {post.time} ago
          </div>

          <h2 className="title">
            <a href="#" onClick={(e) => e.preventDefault()}>{post.title}</a>
          </h2>

          {post.text && <p className="small mb-2">{post.text}</p>}
          {post.img && <img className="post-img" src={post.img} alt="" loading="lazy" />}

          <div className="actions">
            <button className="action" onClick={() => setCommentOpen(!commentOpen)}>
              <i className="bi bi-chat-left-text me-1"></i>
              {post.comments.length} Comments
            </button>
            <button className="action" onClick={share}>
              <i className="bi bi-share me-1"></i>
              {shared ? 'Copied' : 'Share'}
            </button>
            <button
              className={'action ' + (saved ? 'text-warning' : '')}
              onClick={() => {
                setSaved(!saved);
                onNotify(saved ? 'Removed from saved' : 'Saved');
              }}
            >
              <i className="bi bi-bookmark me-1"></i>
              {saved ? 'Saved' : 'Save'}
            </button>
            <button className="action" onClick={() => onNotify('More options opened')}>
              <i className="bi bi-three-dots"></i>
            </button>
          </div>
        </div>
      </div>

      <div className={'comment-box ' + (commentOpen ? 'show' : '')}>
        <textarea
          className="form-control mb-2"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What are your thoughts?"
        ></textarea>
        <button
          className="btn btn-sm signup-btn"
          onClick={() => {
            onAddComment(post.id, comment);
            setComment('');
          }}
        >
          Comment
        </button>
      </div>

      <div className={'comment-list ' + (commentOpen && post.comments.length ? 'show' : '')}>
        {post.comments.map((commentItem, i) => (
          <div className="comment" key={i}>
            <b>u/{commentItem.u}</b>
            <div>{commentItem.t}</div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default PostCard;
