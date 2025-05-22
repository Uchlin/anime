import Link from "next/link";

export function SigninLink() {
  return (
    <Link href="/api/auth/signin" className="btn">
      Войти
    </Link>
  );
}