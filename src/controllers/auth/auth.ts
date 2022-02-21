import { Request, Response } from 'express';
import logger from '../../utils/logger';
import axios from 'axios';

const login = async (request: Request, response: Response) => {
    try {
        const {token} = request.body;
        if (!token) {
            return response.status(400).json({
                success: false,
                message: 'Token is missing from the request'
            })
        }
        const verify = await axios.get(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`);
        
        if (verify.status !== 200) {
            return response.status(400).json({
                success: false,
                message: 'Unable to verify token'
            })
        }

		const email = verify.data.email;

        console.log(email);
        
        return response.status(200).json({
            success: true,
            message: 'Successfully logged in'
        })
    } catch (error) {
        logger.error((error as Error).stack || error);
        return response.status(400).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

export default {login};