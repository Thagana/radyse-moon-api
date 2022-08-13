import { Request, Response } from 'express';
import logger from '../../utils/logger';
import Mail from '../../services/mailService';

const contact = async (request: Request, response: Response) => {
    try {
        const { name, email, message } = request.body;

        const send =  await Mail.sendContactInformation(email, name, message);
        if (!send) {
            return response.status(400).json({
                success: false,
                message: 'Could not send mail, internal error'
            })
        }
        return response.status(200).json({
            success: true,
            message: 'Form send successfully'
        })
    } catch (error) {
        logger.error((error as Error).stack || error);
        return response.status(400).json({
          success: false,
          message: "Something went wrong, please try again",
        });
    }
}

const mailing = async (request: Request, response: Response) => {
    try {
        const { email } = request.body;

        const send =  await Mail.sendMailingUpdate(email);
        if (!send) {
            return response.status(400).json({
                success: false,
                message: 'Could not send mail, internal error'
            })
        }
        return response.status(200).json({
            success: true,
            message: 'Form send successfully'
        })
    } catch (error) {
        logger.error((error as Error).stack || error);
        return response.status(400).json({
          success: false,
          message: "Something went wrong, please try again",
        });
    }
}

export default { contact, mailing }