"use server";
 
 import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
 import { z } from "zod";
 import { db } from "~/server/db";
 
 export async function createUser(formData: FormData) {
     const fd = z
       .object({
         email: z.string().email(),
         name: z.string(),
       })
       .parse({
         email: formData.get("email"),
         name: formData.get("name"),
       });
     await db.user.create({ data: fd });
     revalidatePath("/user");
   }
   
   export async function deleteUser(formData: FormData) {
    const fd = z
      .object({
        id: z.string(),
      })
      .parse({
        id: formData.get("id"),
      });
    await db.user.delete({ where: { id: fd.id } });
    redirect("/user");
  }

  export async function updateUser(formData: FormData) {
    const fd = z
      .object({
        id: z.string(),      
        name: z.string(),
        email: z.string().email(),
      })
      .parse({
        id: formData.get("id"),      
        name: formData.get("name"),
        email: formData.get("email")?.toString(),
      });
    await db.user.update({ where: { id: fd.id }, data: fd });
    revalidatePath("/user/"+fd.id);
  }