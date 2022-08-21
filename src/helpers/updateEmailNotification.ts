import NewsSettings from "../data/infrastructure/db/entities/Mongodb/NewsSettings";
import logger from "../utils/logger";
const updateEmailNotification = async (id: string, state: boolean) => {
    try {
        const update = state ? 1 : 0
        await NewsSettings.findOne({
            user_id: id
        }).update({
            email_notification: update
        })
        return true;
    } catch (error) {
        logger.error(error);
        return false;
    }
}

export default updateEmailNotification;