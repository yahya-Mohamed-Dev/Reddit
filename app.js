const { useState, useMemo } = React;

const seedPosts = [
  {
    id: 1,
    sub: "technology",
    user: "techExplorer",
    time: "2h",
    title: "What technology are you most excited about this year?",
    text: "A place to share ideas, discoveries, and useful projects.",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1100&q=80",
    score: 1284,
    comments: [{ u: "pixelFox", t: "There are so many interesting directions right now." }],
  },
  {
    id: 2,
    sub: "gaming",
    user: "BlockMaster",
    time: "4h",
    title: "I finally finished my biggest build",
    text: "After weeks of building, the result is finally ready.",
    img: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=1100&q=80",
    score: 947,
    comments: [],
  },
  {
    id: 3,
    sub: "AskReddit",
    user: "curious_mind",
    time: "6h",
    title: "What is one small thing that instantly improves your day?",
    text: "Let's hear your best answers.",
    img: null,
    score: 642,
    comments: [
      { u: "northstar", t: "A walk outside and some music." },
      { u: "coffee_addict", t: "Definitely a good breakfast." },
    ],
  },
  {
    id: 4,
    sub: "interestingasfuck",
    user: "orbitWatcher",
    time: "8h",
    title: "A strange view from above the clouds",
    text: "Sometimes the world looks completely different from up there.",
    img: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1100&q=80",
    score: 2105,
    comments: [],
  },
];

const communities = [
  ["AskReddit", "59.8M"],
  ["technology", "18.4M"],
  ["gaming", "38.1M"],
  ["Minecraft", "9.2M"],
  ["interestingasfuck", "12.7M"],
];

function App() {
  const [posts, setPosts] = useState(seedPosts);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Best");
  const [joined, setJoined] = useState({});
  const [dark, setDark] = useState(false);
  const [login, setLogin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSub, setNewSub] = useState("myCommunity");
  const [newText, setNewText] = useState("");
  const [toast, setToast] = useState("");

  function notify(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }

  function vote(id, dir) {
    setPosts((p) =>
      p.map((x) => {
        if (x.id !== id) return x;
        const delta = dir === "up" ? 1 : -1;
        return { ...x, score: x.score + delta };
      })
    );
  }

  function toggleJoin(name) {
    const nextValue = !joined[name];
    setJoined((j) => ({ ...j, [name]: nextValue }));
    notify(nextValue ? `Joined r/${name}` : `Left r/${name}`);
  }

  function addComment(id, text) {
    if (!text.trim()) return;
    setPosts((p) =>
      p.map((x) =>
        x.id === id ? { ...x, comments: [...x.comments, { u: "you", t: text }] } : x
      )
    );
    notify("Comment added");
  }

  function createPost() {
    if (!newTitle.trim()) return;
    setPosts((p) => [
      {
        id: Date.now(),
        sub: newSub,
        user: "you",
        time: "now",
        title: newTitle,
        text: newText,
        img: null,
        score: 1,
        comments: [],
      },
      ...p,
    ]);
    setNewTitle("");
    setNewText("");
    setShowCreate(false);
    notify("Post published");
  }

  const visible = useMemo(() => {
    let a = posts.filter(
      (p) => (p.title + " " + p.text + " " + p.sub).toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "New") a = [...a].sort((a, b) => b.id - a.id);
    if (sort === "Top") a = [...a].sort((a, b) => b.score - a.score);
    return a;
  }, [posts, query, sort]);

  return (
    <div className={dark ? "bg-dark text-light min-vh-100" : ""}>
      <nav className="topbar">
        <div className="container-fluid d-flex align-items-center gap-3 h-100 px-3">
          <a
            className="brand"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setQuery("");
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
            />
          </div>
          <button className="btn login-btn px-3" onClick={() => setLogin(true)}>
            Log In
          </button>
          <button className="btn signup-btn px-3 d-none d-sm-block" onClick={() => setLogin(true)}>
            Sign Up
          </button>
          <button className="btn btn-light rounded-circle" onClick={() => setDark(!dark)} title="Toggle theme">
            <i className={"bi " + (dark ? "bi-sun" : "bi-moon")}></i>
          </button>
        </div>
      </nav>

      <div className="layout">
        <aside className="side">
          <div className="side-section">
            {["Home", "Popular", "All", "News", "Explore"].map((x, i) => (
              <button
                key={x}
                className={"side-btn " + (i === 0 ? "active" : "")}
                onClick={() => notify(x + " feed selected")}
              >
                <i className={"bi " + ["bi-house", "bi-fire", "bi-globe2", "bi-newspaper", "bi-compass"][i] + " me-2"}></i>
                {x}
              </button>
            ))}
          </div>
          <div className="side-section">
            <div className="text-uppercase small text-secondary fw-bold px-2 py-2">Communities</div>
            {communities.slice(0, 4).map((c) => (
              <button className="side-btn" key={c[0]} onClick={() => setQuery(c[0])}>
                r/{c[0]}
              </button>
            ))}
          </div>
        </aside>

        <main>
          <div className="feed-head">
            <h5 className="mb-0 fw-bold">{query ? `Results for "${query}"` : "Home"}</h5>
            <select className="sort-btn" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option>Best</option>
              <option>Hot</option>
              <option>New</option>
              <option>Top</option>
            </select>
          </div>

          {visible.length === 0 ? (
            <div className="empty">No posts found.</div>
          ) : (
            visible.map((post) => (
              <Post key={post.id} post={post} vote={vote} addComment={addComment} notify={notify} />
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
            {communities.map((c) => (
              <div className="community" key={c[0]}>
                <div className="avatar">{c[0][0].toUpperCase()}</div>
                <div>
                  <b>r/{c[0]}</b>
                  <div className="small text-secondary">{c[1]} members</div>
                </div>
                <button className={"join " + (joined[c[0]] ? "joined" : "")} onClick={() => toggleJoin(c[0])}>
                  {joined[c[0]] ? "Joined" : "Join"}
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
          if (el && login && !el.classList.contains("show")) new bootstrap.Modal(el).show();
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
              <button className="btn signup-btn w-100" onClick={() => { setLogin(false); notify("Demo login successful"); }}>
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
          if (el && showCreate && !el.classList.contains("show")) new bootstrap.Modal(el).show();
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
              <button className="btn signup-btn w-100" onClick={createPost}>
                Post
              </button>
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

function Post({ post, vote, addComment, notify }) {
  const [v, setV] = useState(0);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  function doVote(dir) {
    if ((dir === "up" && v === 1) || (dir === "down" && v === -1)) {
      setV(0);
      vote(post.id, dir === "up" ? "down" : "up");
    } else {
      setV(dir === "up" ? 1 : -1);
      vote(post.id, dir);
    }
  }

  function share() {
    const text = post.title;
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    setShared(true);
    notify("Post title copied");
    setTimeout(() => setShared(false), 1000);
  }

  return (
    <article className="post">
      <div className="post-inner">
        <div className="vote">
          <button className={"up " + (v === 1 ? "active" : "")} onClick={() => doVote("up")}>
            <i className="bi bi-arrow-up"></i>
          </button>
          <div className="score">{post.score}</div>
          <button className={"down " + (v === -1 ? "active" : "")} onClick={() => doVote("down")}>
            <i className="bi bi-arrow-down"></i>
          </button>
        </div>
        <div className="content">
          <div className="meta">
            <b>r/{post.sub}</b> • Posted by u/{post.user} • {post.time} ago
          </div>
          <h2 className="title">
            <a href="#" onClick={(e) => e.preventDefault()}>
              {post.title}
            </a>
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
              {shared ? "Copied" : "Share"}
            </button>
            <button
              className={"action " + (saved ? "text-warning" : "")}
              onClick={() => {
                setSaved(!saved);
                notify(saved ? "Removed from saved" : "Saved");
              }}
            >
              <i className="bi bi-bookmark me-1"></i>
              {saved ? "Saved" : "Save"}
            </button>
            <button className="action" onClick={() => notify("More options opened")}>
              <i className="bi bi-three-dots"></i>
            </button>
          </div>
        </div>
      </div>
      <div className={"comment-box " + (commentOpen ? "show" : "")}>
        <textarea
          className="form-control mb-2"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What are your thoughts?"
        ></textarea>
        <button
          className="btn btn-sm signup-btn"
          onClick={() => {
            addComment(post.id, comment);
            setComment("");
          }}
        >
          Comment
        </button>
      </div>
      <div className={"comment-list " + (commentOpen && post.comments.length ? "show" : "")}>
        {post.comments.map((c, i) => (
          <div className="comment" key={i}>
            <b>u/{c.u}</b>
            <div>{c.t}</div>
          </div>
        ))}
      </div>
    </article>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
