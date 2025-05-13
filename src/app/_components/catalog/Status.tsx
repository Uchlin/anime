"use client";
import { useState } from "react";

interface StatusButtonsProps {
  animeId: string;
  currentStatus: string;
}

export function Status({ animeId, currentStatus }: StatusButtonsProps) {
  const [status, setStatus] = useState(currentStatus);

  const statuses = [
    { label: "В планы", value: "PLAN_TO_WATCH" },
    { label: "Смотрю", value: "WATCHING" },
    { label: "Просмотрено", value: "WATCHED" },
  ];

  const handleStatusChange = async (newStatus: string) => {
    const method = status === newStatus ? "DELETE" : "POST";  // Используем DELETE для удаления, POST для обновления
  
    const data = {
      animeId: animeId,
      status: newStatus
    };
  
    try {
      const response = await fetch(`/api/collection/updateStatus`, {
        method, // Отправляем запрос с нужным методом
        headers: {
          "Content-Type": "application/json" // Указываем, что данные будут в формате JSON
        },
        body: JSON.stringify(data), // Отправляем данные как JSON
      });
  
      if (response.ok) {
        let responseData;
        try {
          responseData = await response.json();
        } catch (error) {
          console.error("Ошибка при парсинге JSON", error);
          alert("Ошибка при получении данных");
          return;
        }
  
        if (method === "DELETE") {
          setStatus(""); // При удалении сбрасываем статус
        } else {
          setStatus(newStatus); // При изменении статуса обновляем его
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Ошибка при изменении статуса");
      }
    } catch (error) {
      alert("Ошибка при изменении статуса");
      console.error(error);
    }
  };
  

  return (
    <div className="mt-6 flex gap-4">
      {statuses.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => handleStatusChange(value)}
          className={`px-4 py-2 rounded-lg text-white font-medium transition ${
            status === value ? "bg-blue-600" : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          {label} {/* Оставляем только текст статуса без изменения на "Удалить статус" */}
        </button>
      ))}
    </div>
  );
}
