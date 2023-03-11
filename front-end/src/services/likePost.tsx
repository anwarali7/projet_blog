import axios from "axios";

export async function likePost(id: number) {
  const token = sessionStorage.getItem('token');
  const data = await axios.post("http://localhost:8000/posts/" + id + "/like", {}, {
    headers: {
      Authorization: "Bearer " + token
    }
  });
  return data;
}

export async function unlikePost(id: number) {
  const token = sessionStorage.getItem('token');
  const data = await axios.post("http://localhost:8000/posts/" + id + "/unlike", {}, {
    headers: {
      Authorization: "Bearer " + token
    }
  });
  return data;
}