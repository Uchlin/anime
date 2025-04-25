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
  voteCount: number;
  userVote?: number;
  parentId?: string | null;
  replies?: AnimeComment[];
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

  // Рекурсивная функция для добавления ответа в нужный комментарий
  function addReply(comments: AnimeComment[], reply: AnimeComment): AnimeComment[] {
    return comments.map(comment => {
      if (comment.id === reply.parentId) {
        return {
          ...comment,
          replies: comment.replies ? [...comment.replies, reply] : [reply],
        };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: addReply(comment.replies, reply),
        };
      }
      return comment;
    });
  }

  const addNewComment = (comment: AnimeComment) => {
    setComments(prev => {
      if (comment.parentId) {
        return addReply(prev, comment);
      }
      return [comment, ...prev];
    });
  };

  return (
    <>
      <CommentForm animeId={animeId} onAddComment={addNewComment} />
      <CommentList comments={comments} setComments={setComments} animeId={animeId} />
    </>
  );
}

