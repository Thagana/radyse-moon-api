import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import {firebaseAdmin} from '../configs/firebase';

const tokenRequired = (request: Request, response: Response, next: NextFunction): Response | void => {
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null){
    return response
    .status(401)
    .json({ success: false, 
          message: 'Access denied to resource' 
      });
  }


  firebaseAdmin.auth().verifyIdToken(token).then((decodedToken) => {
    request.user = decodedToken;
    return next();
  }).catch((error) => {
    logger.error(error);
    return response.status(403).json({
      success: false,
      message: 'Access denied to resource'
    })
  })
};

export default tokenRequired;