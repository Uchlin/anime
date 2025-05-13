import { type Session } from "next-auth";
import { LogOut } from "lucide-react";
import Link from "next/link";

export async function Navbar({ session }: { session: Session }) {
  return (
    <div className="navbar bg-base-100">
      <Link href="/api/auth/signout" className="btn flex items-center gap-2">
        <span>{session.user?.name}</span>
        <LogOut size={18} />
      </Link>
      <Link href="/" className="btn">
        Домой
      </Link>
      <Link href="/user" className="btn">
        Пользователи
      </Link>
      <Link href="/catalog" className="btn">
        Каталог
      </Link>
      <Link href="/plan" className="btn">
        В планах
      </Link>
      <Link href="/watching" className="btn">
        Смотрю
      </Link>
      <Link href="/watched" className="btn">
        Просмотрено
      </Link>
    </div>
  );
}