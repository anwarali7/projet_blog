import axios from "axios";

/**
 * Fetch 6 most recent posts.
 * @param tag Optional tag to search for.
 * @returns 
 */
export default async function fetchPosts(tag: string = "") {
  const token = sessionStorage.getItem('token');

  const data = await axios.get("http://localhost:8000/posts/" + tag, {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  return data;
}