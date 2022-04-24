import { Router, Request, Response } from "express";

const router = Router();

const welcome = async (request: Request, response: Response) => {
  try {
    response.send("<html><head><title>The Ultimate News</title></head><body><div>Welcome</div></body></html>");
  } catch (error) {
    response.send("Error");
  }
};

router.get("/", welcome);

export default router;
