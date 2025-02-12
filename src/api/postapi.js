import { DOMAIN } from "."
import axios from 'axios';
const uri = "/post/create"
export const getPosts = async () => {
    try {
        const response = await axios.get(DOMAIN + uri);
        return response;
    } catch (error) {
        throw error;
    }
}