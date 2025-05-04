import API from "./axiosInstance";

export async function changePassword(sendingData) {
  try {
    const resp = await API.put(`/account/change-password`, sendingData);
    const data = resp.data;
    console.log("Resp changePassword: ", data);
    return data;
  } catch (error) {
    console.error("Error at changePassword:", error);
    return error.response?.data || null;
  }
}
