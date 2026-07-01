import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response.js";
import { movieService } from "../services/movie.service.js";

export class MovieController {
  async getMovie(req: Request, res: Response) {
    try {
      const muc = String(req.params.muc);
      const movie = await movieService.getMovie(muc);
      return sendSuccess(res, movie);
    } catch (err) {
      const error = err as Error;
      if (error.message === "Không tìm thấy phim tương tác cho chương này") {
        return sendError(res, "MOVIE_NOT_FOUND", error.message, 404);
      }
      return sendError(res, "MOVIE_FETCH_ERROR", error.message, 500);
    }
  }

  async submitSession(req: Request, res: Response) {
    try {
      const muc = String(req.params.muc);
      const { thienCam, uyTin, correctN } = req.body;

      const user = (req as any).user;
      if (!user) {
        return sendError(res, "UNAUTHORIZED", "Bạn chưa đăng nhập", 401);
      }

      const session = await movieService.submitSession(muc, user.id, thienCam, uyTin, correctN);
      return sendSuccess(res, session);
    } catch (err) {
      const error = err as Error;
      if (error.message === "Không tìm thấy phim tương tác cho chương này") {
        return sendError(res, "MOVIE_NOT_FOUND", error.message, 404);
      }
      return sendError(res, "MOVIE_SUBMIT_ERROR", error.message, 500);
    }
  }
}
