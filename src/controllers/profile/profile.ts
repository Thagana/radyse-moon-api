import { Request, Response } from 'express';
import NewsSettings from '../../models/NewsSettings';

const getSettings = async (request: Request | any, response: Response) => {
    try {
        const id = request?.user?.id
        if (!id) {
            return response.status(400).json({
                success: false,
                message: 'Access denied'
            })
        }
        const userId = Number(id);

        const settings = await NewsSettings.findOne({
            where: {
                user_id: userId
            }
        });

        if (!settings) {
            return response.status(200).json({
                success: false,
                message: 'could not find settings'
            })    
        }
        return response.status(200).json({
            success: true,
            data: {
                location: settings.location,
                language: settings.language,
                frequency: settings.frequency
            }
        })
    } catch (error) {
        return response.status(400).json({
            success: false,
            message: "Something went wrong, please try again",
          });
    }
}

export default { getSettings };