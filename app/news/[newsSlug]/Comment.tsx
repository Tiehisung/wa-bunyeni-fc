"use client";

import { Button } from "@/components/buttons/Button";
import QuillEditor from "@/components/editor/Quill";
import { fireEscape } from "@/hooks/Esc";
import { markupToPlainText, toggleClick } from "@/lib/dom";
import {
  useAddNewsCommentMutation,
  useEditNewsCommentMutation,
} from "@/services/news.endpoints";
import { IComment } from "@/types/news.interface";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";

interface Props {
  newsId: string;
  existingComment?: IComment;
}

const CommentForm = ({ newsId, existingComment }: Props) => {

  console.log(existingComment);
  const [comment, setComment] = useState(existingComment?.comment || "");

  const [addComment, { isLoading: isCommenting }] =
    useAddNewsCommentMutation();

  const [editComment, { isLoading: editing }] = useEditNewsCommentMutation();

  const maxLength = 3500;

  const handleAddComment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (existingComment) {
      const result = await editComment({
        newsId: newsId as string,
        comment,
        commentId: existingComment?._id,
      }).unwrap();

      if (result.success) {
        fireEscape();
        toggleClick(`edit-${existingComment?._id}`);
      }
    } else {
      const result = await addComment({
        newsId: newsId as string,
        comment,
      }).unwrap();

      if (result.success) {
        fireEscape();
        setComment("");
      }
    }
  };

  return (
    <div className="border-t-2 pt-6 mt-6">
      <header className="flex justify-between items-center gap-3 mb-6">
        <span>Comment</span>
      </header>
      <form onSubmit={handleAddComment} className="relative">
        <QuillEditor
          value={comment}
          onChange={(val) => {
            if (val.length <= maxLength) setComment(val);
          }}
          className="w-full grow"
          placeholder="Type comment ..."
        />

        <div className="flex items-center gap-5 justify-between">
          <Button
            type="submit"
            className="backdrop-blur-2xl w-fit mt-2 justify-center"
            waiting={isCommenting || editing}
            waitingText=""
            primaryText=""
            size="sm"
            disabled={!comment}
          >
            {existingComment ? "Save" : "Send"} <SendHorizontal size={20} />
          </Button>
          <span className="text-xs text-muted-foreground">
            {`${markupToPlainText(comment)?.length}/${maxLength}`}
          </span>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
