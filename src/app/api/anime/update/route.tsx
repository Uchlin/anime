import { db } from "~/server/db";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const year = Number(formData.get("year"));
    const description = formData.get("description") as string;
    const genreRaw = formData.get("genre") as string;
    const file = formData.get("image") as File | null;

    console.log("Полученные данные:", { id, title, year, description, genreRaw, file });

    if (!id || !title || !year) {
      console.warn("❌ Недостаточно данных");
      return new Response(JSON.stringify({ message: "Недостаточно данных" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const genre = genreRaw.split(",").map(g => g.trim());

    let imageFilename: string | undefined;

    if (file && file.size > 0) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const extension = file.name.split(".").pop() || "jpg";
        imageFilename = `${uuidv4()}.${extension}`;
        const path = join(process.cwd(), "public/images", imageFilename);
        console.log("💾 Сохраняем файл по пути:", path);
        await writeFile(path, buffer);
      } catch (fileError) {
        console.error("❌ Ошибка при сохранении файла:", fileError);
        return new Response(JSON.stringify({ message: "Ошибка загрузки изображения" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    console.log("📦 Обновляем аниме:", { id, title, year, description, genre, imageFilename });

    await db.anime.update({
      where: { id },
      data: {
        title,
        year,
        description,
        genre,
        ...(imageFilename && { image: imageFilename }),
      },
    });

    return new Response(JSON.stringify({ message: "Аниме обновлено" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Общая ошибка обновления:", error);
    return new Response(JSON.stringify({ message: "Ошибка обновления", error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
