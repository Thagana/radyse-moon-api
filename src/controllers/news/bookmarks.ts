// import { Request, Response } from "express";
// import BookMarkModel from "../../data/infrastructure/db/entities/Mongodb/Bookmarks";
// import logger from "../../utils/logger";

// const bookmarks = async (request: Request, response: Response) => {
//   try {
//     const { articleId,  } = request.body;

//     // @ts-ignore
//     const id = request?.user?.id;
    
//     if (!id) {
//       return response.status(400).json({
//         success: false,
//         message: "Access denied",
//       });
//     }

//     await BookMarkModel.create({
//         user_id: id,
//         article_id: articleId,
//         date_saved: new Date()
//     })
//     return response.status(200).json({
//         success: true,
//         message: 'Successfully bookmarked an article'
//     })
//   } catch (error) {
//     logger.error((error as Error).stack || error);
//     return response.status(400).json({
//       success: false,
//       message: "Something went wrong, please try again",
//     });
//   }
// };

// export default bookmarks;