import {format, createLogger, transports} from 'winston';
require('winston-mail');
import {configs} from '../configs/app.configs';

const {timestamp, combine, errors, json} = format;

function buildProdLogger() {
	return createLogger({
		format: combine(timestamp(), errors({stack: true}), json()),
		defaultMeta: {service: 'ultimate_news'},
		transports: [
			// @ts-ignore
			new transports.Mail({
			  to: configs.MAIL_USER_NAME,
			  from: configs.MAIL_USER_NAME,
			  host: 'smtp.gmail.com',
			  post: 587,
			  ssl: true,
			  username: configs.MAIL_USER_NAME,
			  password: configs.MAIL_PASSWORD,
			  level: 'error',
			  authentication: ['PLAIN', 'LOGIN'],
			}),
		  ],
	});
}

export default buildProdLogger;