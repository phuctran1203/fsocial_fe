import API from "./axiosInstance";

export async function getOwnerProfile(controller) {
  try {
    const resp = await API.get(
      `/profile/profile-page`,
      controller && { signal: controller.signal }
    );
    const data = resp.data;
    console.log("Resp getOwnerProfile: ", data);
    return data;
  } catch (error) {
    if (error.name === "CanceledError") return null;
    console.error("Error at getOwnerProfile: ", error);
    return error.response?.data || {};
  }
}

export async function getProfile(userId) {
  try {
    const resp = await API.get(`/profile/profile-page/${userId}/other`);
    const data = resp.data;
    console.log("Resp getProfile: ", data);
    return data;
  } catch (error) {
    console.error("Error at getProfile: ", error);
    return error.response || null;
  }
}

export async function requestFollow(userId) {
  try {
    const resp = await API.get(`/profile/follow/${userId}`);
    const data = resp.data;
    console.log("Resp requestFollow: ", data);
    return data;
  } catch (error) {
    console.error("Error at requestFollow: ", error);
    return error.response || null;
  }
}

export async function unfollow(userId) {
  try {
    const resp = await API.delete(`/profile/follow/${userId}`);
    const data = resp.data;
    console.log("Resp unfollow: ", data);
    return data;
  } catch (error) {
    console.error("Error at unfollow: ", error);
    return error.response || null;
  }
}

export async function getFollowers() {
  try {
    const resp = await API.delete(`/profile/follow/followers`);
    const data = resp.data;
    console.log("Resp getFollowers: ", data);
    return data;
  } catch (error) {
    console.error("Error at getFollowers: ", error);
    return error.response || null;
  }
}
