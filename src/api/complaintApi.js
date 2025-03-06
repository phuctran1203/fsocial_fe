import API from "./axiosInstance";

export const complaint = async (complaint)=>{
    try {
        const res = await API.post("/post/complaint",complaint)
        return res.data
    } catch (error) {
        console.error("Error at add complaint: ", error);
		return error.response?.data || {};
    }
} 

export const getComplaint = async () =>{
    try {
        const res = await API.get("/timeline/complaint")
        return res.data
    } catch (error) {
        console.log("Error at get complaint", error);
    }
}