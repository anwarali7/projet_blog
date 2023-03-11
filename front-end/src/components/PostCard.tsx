import "./PostCard.css";
import LikeIcon from "../assets/LikeIcon";
import ShareIcon from "../assets/ShareIcon";
import CommentsIcon from "../assets/CommentsIcon";
import { likePost, unlikePost } from "../services/likePost";
import { useState } from "react";

export default function PostCard({ postData }: { postData: any }) {
  const [likeCount, setLikeCount] = useState<number>(postData.likeCount);

  // Show month and day from date.
  // Show "aujourd'hui" or "hier" for today or yesterday.
  let dateString = "";
  const postDate = new Date(postData.date);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  dateString = postDate.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });

  // If same year and month
  if (
    postDate.getMonth() === now.getMonth() &&
    postDate.getFullYear() === now.getFullYear()
  ) {
    if (postDate.getDate() === now.getDate()) {
      dateString = "Aujourd'hui";
    } else if (postDate.getDate() === yesterday.getDate()) {
      dateString = "Hier";
    }
  }

  // Like or unlike post, toggle "active" class to button.
  const handleLikeBtnClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const likebtn = event.currentTarget;
    if (likebtn.classList.contains("active")) {
      unlikePost(postData.id)
        .then(() => {
          likebtn.classList.remove("active");
          setLikeCount(l => l - 1);
        })
        .catch(err => console.error(err));
    } else {
      likePost(postData.id)
        .then(() => {
          likebtn.classList.add("active");
          setLikeCount(l => l + 1);
        })
        .catch(err => console.error(err));
    }
  }

  return (
    <div className="post-card">
      <h5 className="post-card-title">
        {postData.title}
      </h5>

      <p className="post-card-date">
        {dateString}
      </p>

      <img
        src={postData.image}
        className="post-card-image"
      />

      <div className="btn-container">
        <div className="btn-content">
          <button
            className={`post-card-btn like-btn ${postData.likedByUser ? "active" : ""}`}
            onClick={handleLikeBtnClick}>
            <LikeIcon />
          </button>
          {likeCount}
        </div>
        <div className="btn-content">
          <button className="post-card-btn comments-btn">
            <CommentsIcon />
          </button>
          {postData.commentsCount}
        </div>
        <div className="btn-content">
          <button className="post-card-btn share-btn">
            <ShareIcon />
          </button>
        </div>
      </div>
    </div>
  );
}