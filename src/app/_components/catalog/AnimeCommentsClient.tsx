"use client";

import { useState } from "react";
import { CommentForm } from "../../ui/commentForm";
import CommentList from "./CommentList";

interface User {
  id: string;
  name?: string | null;
  image?: string | null;
}

interface AnimeComment {
  id: string;
  text: string;
  createdAt: Date;
  user: User;
}

interface AnimeCommentsClientProps {
  animeId: string;
  initialComments: AnimeComment[];
}

export default function AnimeCommentsClient({
  animeId,
  initialComments,
}: AnimeCommentsClientProps) {
  const [comments, setComments] = useState<AnimeComment[]>(initialComments);

  const addNewComment = (comment: AnimeComment) => {
    setComments((prev: AnimeComment[]) => [comment, ...prev]);
  };


  return (
    <>
      <CommentForm animeId={animeId} onAddComment={addNewComment} />
      <CommentList comments={comments} setComments={setComments} />
    </>
  );
}
