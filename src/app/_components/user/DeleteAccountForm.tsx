"use client";

import { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation";

export function DeleteAccountForm({ userId }: { userId: string }): JSX.Element {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("/");
  const router = useRouter();

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmed = window.confirm("Вы уверены, что хотите удалить аккаунт?");
    if (!confirmed) return;

    setIsConfirmed(true);

    const formData = new FormData();
    formData.append("id", userId);

    try {
      const response = await fetch("/api/action/deleteUser", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push(currentPath === "/user" ? "/user" : "/");
      } else {
        alert("Произошла ошибка при удалении.");
      }
    } catch (error) {
      alert("Ошибка сети.");
    }
  };
  const buttonMarginTop = currentPath === "/user" ? "mt-11" : "mt-6";
  return (
    <form onSubmit={handleSubmit} className="form-control h-fit">
      <input type="hidden" name="id" value={userId} />
      <button type="submit" className={`btn btn-error w-20 h-16 ${buttonMarginTop}`}>
        Удалить <br />аккаунт
      </button>
    </form>
  );
}
