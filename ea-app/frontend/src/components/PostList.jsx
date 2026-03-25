// components/PostList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token"); // get JWT if logged in

        // Axios config
        const config = {
          headers: { "Content-Type": "application/json" },
        };

        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`; // include token if exists
        }

        // Try to fetch admin posts first
        const res = await axios.get("http://localhost:5000/api/admin/artworks", config);

        setPosts(res.data.posts || []); // backend should return { posts: [...] }
      } catch (err) {
        if (err.response?.status === 401) {
          // fallback: fetch public posts if unauthorized
          try {
            const res = await axios.get("http://localhost:5000/api/posts");
            setPosts(res.data.posts || []);
            setError("Viewing public posts (not logged in as admin)");
          } catch (pubErr) {
            setError("Failed to load posts");
            console.error(pubErr);
          }
        } else {
          setError("Failed to load posts");
          console.error(err);
        }
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            style={{ border: "1px solid #ccc", borderRadius: 8, padding: 8 }}
          >
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                style={{ width: "100%", height: "auto", borderRadius: 4 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;