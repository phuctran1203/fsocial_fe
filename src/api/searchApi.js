import { ownerAccountStore } from "@/store/ownerAccountStore";
import API from "./axiosInstance";

export const searchUsers = (keyword) =>
  API.get(`/profile/actions/find?find_name=${keyword}`)
    .then((resp) => {
      const data = resp.data;
      console.log("Resp searchUsers: ", resp);
      return data;
    })
    .catch((error) => {
      console.error(`Error at searchUsers for keyword ${keyword}: `, error);
      return error.response?.data || null;
    });

export const searchPosts = (keyword) =>
  API.get(
    `/timeline/post/find?user_id=${
      ownerAccountStore.getState().user.userId
    }&find_post=${keyword}`
  )
    .then((resp) => {
      const data = resp.data;
      console.log("Resp searchPosts: ", resp);
      return data;
    })
    .catch((error) => {
      console.error(`Error at searchPosts for keyword ${keyword}: `, error);
      return error.response?.data || null;
    });
