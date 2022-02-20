import {Request, Response, NextFunction} from 'express';
import Logger from '../utils/logger';

export default (request: Request, response: Response, next: NextFunction) => {
	const startTime = new Date().getTime();

	response.on('finish', () => {
		const endTime = new Date().getTime();

		Logger.info(
			`[METHOD: ${request.method}] - [URL: ${request.protocol}://${request.get(
				'host',
			)}${request.originalUrl}] - [STATUS: ${
				response.statusCode
			}] - [RESPONSE_TIME: ${endTime - startTime}ms] - [IP: ${
				request.socket.remoteAddress
			}]`,
		);
	});

	next();
};