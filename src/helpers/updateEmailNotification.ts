import NewsSettings from "../models/Mongodb/NewsSettings";
const updateEmailNotification = async (id: string, state: boolean) => {
    try {
        const update = state ? 1 : 0
        await NewsSettings.findOne({
            _id: id
        }).update({
            email_notification: update
        })
        return true;
    } catch (error) {
        return false;
    }
}

export default updateEmailNotification;