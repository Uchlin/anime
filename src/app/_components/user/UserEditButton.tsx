"use client";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export function UserEditButton({ user }: { user: any }) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleForm = () => {
    const editForm = document.getElementById(`edit-form-${user.id}`);
    const deleteForm = document.getElementById(`delete-form-${user.id}`);
    
    if (editForm) editForm.classList.toggle("hidden");
    if (deleteForm) deleteForm.classList.toggle("hidden");

    setIsVisible((prev) => !prev);
  };

  return (
    <button
      onClick={toggleForm}
      className="btn btn-sm btn-outline"
      title="Редактировать"
    >
      <PencilSquareIcon className="w-5 h-5" />
    </button>
  );
}
