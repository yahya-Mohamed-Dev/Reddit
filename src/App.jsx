import { useMemo, useState } from 'react';
import PostCard from './components/PostCard';
import { communities, seedPosts } from './data/feedData';
import '../styles.css';

function App() {
  const [posts, setPosts] = useState(seedPosts);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('Best');
  const [joined, setJoined] = useState({});
  const [dark, setDark] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const [login, setLogin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSub, setNewSub] = useState('myCommunity');
  const [newText, setNewText] = useState('');
  const [toast, setToast] = useState('');

  function notify(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }

  function vote(id, delta) {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== id) return post;
        return { ...post, score: post.score + delta };
      })
    );
  }

  function toggleJoin(name) {
    const nextValue = !joined[name];
    setJoined((currentJoined) => ({ ...currentJoined, [name]: nextValue }));
    notify(nextValue ? `Joined r/${name}` : `Left r/${name}`);
  }

  function addComment(id, text) {
    if (!text.trim()) return;
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === id ? { ...post, comments: [...post.comments, { u: 'you', t: text }] } : post
      )
    );
    notify('Comment added');
  }

  function createPost() {
    if (!newTitle.trim()) return;
    setPosts((currentPosts) => [
      {
        id: Date.now(),
        sub: newSub,
        user: 'you',
        time: 'now',
        title: newTitle,
        text: newText,
        img: null,
        score: 1,
        comments: [],
      },
      ...currentPosts,
    ]);
    setNewTitle('');
    setNewText('');
    setShowCreate(false);
    notify('Post published');
  }

  const visiblePosts = useMemo(() => {
    let filteredPosts = posts.filter(
      (post) => (post.title + ' ' + post.text + ' ' + post.sub).toLowerCase().includes(query.toLowerCase())
    );

    if (sort === 'New') {
      filteredPosts = [...filteredPosts].sort((a, b) => b.id - a.id);
    }

    if (sort === 'Top') {
      filteredPosts = [...filteredPosts].sort((a, b) => b.score - a.score);
    }

    if (sort === 'Hot') {
      const hotness = (post) => post.score / Math.pow((Number.parseFloat(post.time) || 0) + 2, 1.5);
      filteredPosts = [...filteredPosts].sort((a, b) => hotness(b) - hotness(a));
    }

    return filteredPosts;
  }, [posts, query, sort]);

  return (
    <div className={'app-shell' + (dark ? ' theme-dark' : '')}>
      <nav className="topbar">
        <div className="container-fluid d-flex align-items-center gap-3 h-100 px-3">
          <a
            className="brand"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setQuery('');
            }}
          >
            <span className="brand-dot">r/</span>
            <span className="brand-text">Reddit</span>
          </a>

          <div className="flex-grow-1">
            <input
              className="form-control search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Reddit"
              aria-label="Search communities and posts"
            />
          </div>

          <button className="btn login-btn px-3" onClick={() => setLogin(true)}>Log In</button>
          <button className="btn signup-btn px-3 d-none d-sm-block" onClick={() => setLogin(true)}>Sign Up</button>
          <button className="theme-toggle" onClick={() => setDark(!dark)} title={dark ? 'Switch to light theme' : 'Switch to dark theme'} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
            <i className={'bi ' + (dark ? 'bi-sun' : 'bi-moon')}></i>
          </button>
        </div>
      </nav>

      <div className="layout">
        <aside className="side">
          <div className="side-section">
            {['Home', 'Popular', 'All', 'News', 'Explore'].map((item, index) => (
              <button
                key={item}
                className={'side-btn ' + (activeNav === item ? 'active' : '')}
                onClick={() => {
                  setActiveNav(item);
                  if (item === 'Home' || item === 'All') setQuery('');
                }}
              >
                <i className={'bi ' + ['bi-house', 'bi-fire', 'bi-globe2', 'bi-newspaper', 'bi-compass'][index] + ' me-2'}></i>
                {item}
              </button>
            ))}
          </div>

          <div className="side-section">
            <div className="text-uppercase small text-secondary fw-bold px-2 py-2">Communities</div>
            {communities.slice(0, 4).map((community) => (
              <button className="side-btn" key={community[0]} onClick={() => setQuery(community[0])}>
                r/{community[0]}
              </button>
            ))}
          </div>
        </aside>

        <main>
          <div className="feed-head">
            <div>
              <h1 className="feed-title">{query ? `Results for "${query}"` : activeNav}</h1>
              <p className="feed-subtitle">{query ? 'The best conversations matching your search.' : 'A little inspiration from your communities.'}</p>
            </div>
            <label className="sort-control">
              <i className="bi bi-sliders2" aria-hidden="true"></i>
              <select className="sort-btn" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort posts">
              <option>Best</option>
              <option>Hot</option>
              <option>New</option>
              <option>Top</option>
              </select>
            </label>
          </div>

          {visiblePosts.length === 0 ? (
            <div className="empty">No posts found.</div>
          ) : (
            visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} onVote={vote} onAddComment={addComment} onNotify={notify} />
            ))
          )}
        </main>

        <aside className="right">
          <div className="right-card">
            <h6>Home</h6>
            <p className="small text-secondary">
              Your personal Reddit-style feed. Vote, comment, share, save, and create posts.
            </p>
            <button className="btn signup-btn w-100" onClick={() => setShowCreate(true)}>
              Create Post
            </button>
          </div>

          <div className="right-card">
            <h6>Popular Communities</h6>
            {communities.map((community) => (
              <div className="community" key={community[0]}>
                <div className="avatar">{community[0][0].toUpperCase()}</div>
                <div>
                  <b>r/{community[0]}</b>
                  <div className="small text-secondary">{community[1]} members</div>
                </div>
                <button className={'join ' + (joined[community[0]] ? 'joined' : '')} onClick={() => toggleJoin(community[0])}>
                  {joined[community[0]] ? 'Joined' : 'Join'}
                </button>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <button className="fab" onClick={() => setShowCreate(true)} title="Create post">
        <i className="bi bi-plus-lg"></i>
      </button>

      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        ref={(el) => {
          if (el && login && !el.classList.contains('show')) new bootstrap.Modal(el).show();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Welcome back</h5>
              <button className="btn-close" data-bs-dismiss="modal" onClick={() => setLogin(false)}></button>
            </div>
            <div className="modal-body">
              <input className="form-control mb-3" placeholder="Email or username" />
              <input className="form-control mb-3" type="password" placeholder="Password" />
              <button
                className="btn signup-btn w-100"
                onClick={() => {
                  setLogin(false);
                  notify('Demo login successful');
                }}
              >
                Continue
              </button>
              <p className="small text-secondary mt-3 mb-0">
                This is a local demo; no credentials are sent anywhere.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="createModal"
        tabIndex="-1"
        ref={(el) => {
          if (el && showCreate && !el.classList.contains('show')) new bootstrap.Modal(el).show();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create a post</h5>
              <button className="btn-close" data-bs-dismiss="modal" onClick={() => setShowCreate(false)}></button>
            </div>
            <div className="modal-body">
              <input
                className="form-control mb-3"
                value={newSub}
                onChange={(e) => setNewSub(e.target.value)}
                placeholder="Community"
              />
              <input
                className="form-control mb-3"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title"
              />
              <textarea
                className="form-control mb-3"
                rows="5"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Text (optional)"
              ></textarea>
              <button className="btn signup-btn w-100" onClick={createPost}>Post</button>
            </div>
          </div>
        </div>
      </div>

      <div className="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3">
        {toast && (
          <div className="toast show bg-dark text-white">
            <div className="toast-body">{toast}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
