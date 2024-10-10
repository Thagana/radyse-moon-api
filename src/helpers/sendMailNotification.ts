import Mail from '../services/mailService';
import logger from '../utils/logger';

import DataFrame from '../interface/data-frame-interface';

const sentMailNotification = async (email: string, data: DataFrame[]) => {
    try {
        const Mailer = await Mail.sendMailNotification(email, data);
        if (Mailer) {
            logger.info('Success');
        } else {
            logger.error('Failed to send mail');
        }
    } catch (error) {
        logger.error(error);
    }
}
export default sentMailNotification