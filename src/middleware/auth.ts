import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const tokenRequired = (request: Request, response: Response, next: NextFunction): Response | void => {
  const authHeader = request.headers.authorization;
  const secret: string  = process.env.TOKEN_SECRET || "";
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null){
    return response
    .status(401)
    .json({ success: false, 
          message: 'Access denied to resource' 
      });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err){
      console.log(err)
      return response
        .status(403)  
        .json({ success: false, message: 'Access denied' });
    }
    // @ts-ignore
    request.user = user;
    return next();
  });
};

export default tokenRequired;