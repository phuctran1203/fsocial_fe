import axios from "axios";

export async function getUserInfoByGoole(access_token) {
  const endpoint = "https://www.googleapis.com/oauth2/v3/userinfo";
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  try {
    const resp = await axios.get(endpoint, { headers: headers });
    console.log("Resp from getUserInfoByGoole: ", resp);
    return resp.data;
  } catch (error) {
    console.error("Error at getUserInfoByGoole: ", error);
    return null;
  }
}

export async function getUserDOBByGoogle(access_token) {
  const endpoint =
    "https://people.googleapis.com/v1/people/me?personFields=birthdays";
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  try {
    const resp = await axios.get(endpoint, { headers: headers });
    console.log("Resp from getUserDOBByGoogle: ", resp);
    return resp.data;
  } catch (error) {
    console.error("Error at getUserDOBByGoogle: ", error);
    return null;
  }
}
