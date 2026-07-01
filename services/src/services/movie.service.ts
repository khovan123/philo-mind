import { prisma } from "../config/prisma.js";

export class MovieService {
  async getMovie(muc: string) {
    const movie = await prisma.movie.findFirst({
      where: { muc },
    });

    if (!movie) {
      throw new Error("Không tìm thấy phim tương tác cho chương này");
    }

    return movie;
  }

  async submitSession(
    muc: string,
    userId: string,
    thienCam: number,
    uyTin: number,
    correctN: number,
  ) {
    const movie = await prisma.movie.findFirst({
      where: { muc },
    });

    if (!movie) {
      throw new Error("Không tìm thấy phim tương tác cho chương này");
    }

    const session = await prisma.movieSession.create({
      data: {
        userId,
        movieId: movie.id,
        thienCam: thienCam || 0,
        uyTin: uyTin || 0,
        correctN: correctN || 0,
      },
    });

    return session;
  }
}

export const movieService = new MovieService();
