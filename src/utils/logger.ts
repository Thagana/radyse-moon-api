import prodLogger from './prodLogger';
import devLogger from './devLogger';

const logger = process.env.NODE_ENV !== 'production' ? devLogger : prodLogger;

export default logger();