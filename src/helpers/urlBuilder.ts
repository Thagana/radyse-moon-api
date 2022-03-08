import { configs } from "../configs/app.configs"
import NewsSettings from "../models/SQL/NewsSettings";
import logger from "../utils/logger";

const urlBuilder = async (location: string, category: string): Promise<{ success: true, url: string } | { success: false, url?: string }> => {
    try {
        const url = `https://newsapi.org/v2/top-headlines?country=${location}&category=${category}&apiKey=${configs.NEW_ENDPOINT}`;
        return {
            success: true,
            url: url
        };
    } catch (error) {
        logger.error(error);
        return {
            success: false
        }
    }
}

export default urlBuilder