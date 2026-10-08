import { useState, useEffect } from 'react';

// Uses Vercel environment variable in production, falls back to localhost locally
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  // Form state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postUserId, setPostUserId] = useState('');

  // Data & status state
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');

  // 1. Fetch Posts with populated user details
  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error('Unexpected response:', data);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 2. Submit: Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, email: userEmail }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`User created! Copy ID: ${data._id}`);
        setPostUserId(data._id); // Auto-fills the user ID in the post form
        setUserName('');
        setUserEmail('');
      } else {
        setMessage(`Error: ${data.error || 'Failed to create user'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to connect to backend.');
    }
  };

  // 3. Submit: Create Post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postTitle,
          content: postContent,
          userId: postUserId,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('Post created successfully!');
        setPostTitle('');
        setPostContent('');
        fetchPosts(); // Refresh posts list immediately
      } else {
        setMessage(`Error: ${data.error || 'Failed to create post'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to connect to backend.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h2>MERN Referencing & Populate Demo</h2>

      {message && (
        <div style={{ background: '#eef', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
          {message}
        </div>
      )}

      {/* --- FORM 1: Create User --- */}
      <section style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
        <h3>1. Create User</h3>
        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="User Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
          <button type="submit">Add User</button>
        </form>
      </section>

      {/* --- FORM 2: Create Post --- */}
      <section style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
        <h3>2. Create Post</h3>
        <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="Post Title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Post Content"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="User ID (paste or auto-filled)"
            value={postUserId}
            onChange={(e) => setPostUserId(e.target.value)}
            required
          />
          <button type="submit">Add Post</button>
        </form>
      </section>

      {/* --- DISPLAY: Populated Posts --- */}
      <section>
        <h3>3. All Posts (Populated)</h3>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '10px',
                backgroundColor: '#fafafa'
              }}
            >
              <h4 style={{ margin: '0 0 5px 0' }}>{post.title}</h4>
              <p style={{ margin: '0 0 10px 0' }}>{post.content}</p>
              <small style={{ color: '#555' }}>
                <strong>Author:</strong> {post.user ? `${post.user.name} (${post.user.email})` : 'Unknown'}
              </small>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default App;