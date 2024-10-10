import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';

export default function logger(
	request: Request,
	response: Response,
	next: NextFunction
) {
	const startTime = new Date().getTime();

	response.on('finish', () => {
		const endTime = new Date().getTime();

		const url = `${request.protocol}://${request.get('host')}${
			request.originalUrl
		}`;
		const ms = endTime - startTime;

		Logger.info(
			`[METHOD: ${request.method}] - [URL: ${url}] - [STATUS: ${response.statusCode}] - [RESPONSE_TIME - ${ms}ms] - [IP: ${request.socket.remoteAddress}]`
		);
	});

	return next();
}