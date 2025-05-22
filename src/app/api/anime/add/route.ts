import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const yearStr = formData.get("year") as string | null;
    const genreStr = formData.get("genre") as string | null;
    const description = formData.get("description") as string | null;
    const imageFile = formData.get("image") as File | null;

    if (!title || !yearStr || !genreStr) {
      return NextResponse.json({ message: "Обязательные поля отсутствуют" }, { status: 400 });
    }

    const year = Number(yearStr);
    const genre = genreStr.split(",").map((g) => g.trim());
    let imageFilename = null;
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const ext = imageFile.name.split(".").pop();
      imageFilename = `${uuidv4()}.${ext}`;
      const filePath = join(process.cwd(), "public/images", imageFilename);
      await writeFile(filePath, buffer);
    }

    const newAnime = await db.anime.create({
      data: {
        title,
        year,
        genre,
        description,
        image: imageFilename,
      },
    });

    return NextResponse.json(newAnime);
  } catch (error) {
    console.error("Ошибка при добавлении аниме:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
