import { useCallback, useEffect, useState } from "react";
import fetchPosts from "../services/fetchPosts";
import PostCard from "../components/PostCard";
import "./PostsPage.css";

export default function PostsPage() {
  // All posts data in state.
  const [posts, setPosts] = useState<{ id: number }[]>([]);

  // Fetch posts data once.
  useEffect(() => {
    fetchPosts().then(res => setPosts(res.data.posts));
  }, []);

  // Fetch posts data with or without a tag.
  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    fetchPosts(event.currentTarget.value).then(res => setPosts(res.data.posts));
  }

  // Render post cards each time state changes.
  const makePostCards = useCallback(() => {
    const postCards: JSX.Element[] = [];
    for (const postData of posts) {
      postCards.push(<PostCard key={postData.id} postData={postData} />);
    }
    return postCards;
  }, [posts]);

  return (
    <div id="posts-page">
      <div className="search-bar">
        <label htmlFor="search">Rechercher :{" "}</label>
        <input onChange={handleSearch} type="search" name="search" id="search" placeholder="node, php, mongodb" />
      </div>
      <div className="results">
        {makePostCards()}
      </div>
    </div>
  );
}