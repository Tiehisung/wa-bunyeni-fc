"use client";

import { Button } from "@/components/buttons/Button";
import { IComment, INewsProps } from "@/types/news.interface";
import { ThumbsDown, Trash } from "lucide-react";
import { POPOVER } from "@/components/ui/popover";
import SocialShare, { ResourceShare } from "@/components/SocialShare";
import { useEffect, useState } from "react";
import { LiaCommentSolid } from "react-icons/lia";
import { IoShareSocial } from "react-icons/io5";
import { AVATAR } from "@/components/ui/avatar";
import { getTimeLeftOrAgo } from "@/lib/timeAndDate";
import { shortText } from "@/lib";
import { BsDot, BsEye, BsFillHandThumbsUpFill } from "react-icons/bs";
import { DIALOG } from "@/components/Dialog";
import { getDeviceId } from "@/lib/device";
 
import {
  useDeleteNewsCommentMutation,
  useGetNewsStatsQuery,
  useUpdateNewsSharesMutation,
  useUpdateNewsViewsMutation,
  useUpdateNewsLikesMutation,
} from "@/services/news.endpoints";
import { toggleClick } from "@/lib/dom";
import CommentForm from "./Comment";
import { useSession } from "next-auth/react";
import LoginModal from "@/components/auth/Login";

export function NewsReactions({ newsItem }: { newsItem?: INewsProps }) {
const { data: session,   } = useSession();
   const user=session?.user

  const [updateViews] = useUpdateNewsViewsMutation();

  const [updateLikes, { isLoading: isLiking }] = useUpdateNewsLikesMutation();

  const [updateShares] = useUpdateNewsSharesMutation();

  const { data: stats, refetch: refetchStats } = useGetNewsStatsQuery(
    newsItem?._id as string,
  );
  console.log(stats?.data?.likes);

  // Record view on mount
  useEffect(() => {
    updateViews({
      newsId: newsItem?._id as string,
      deviceId: getDeviceId(),
      userId: user?.id as string,
    });
  }, []);

  const [localLiked, setLocalLiked] = useState(
    newsItem?.likes?.find((l) => l.device == getDeviceId()) ? true : false,
  );

  const handleLike = async () => {
    const result = await updateLikes({
      newsId: newsItem?._id as string,
      deviceId: getDeviceId(),
      userId: user?.id,
      isLike: !localLiked,
    }).unwrap();

    if (result.success) {
      setLocalLiked(result?.data?.liked as boolean);
    }
  };

  const handleShare = async () => {
    const result = await updateShares({
      newsId: newsItem?._id as string,
      deviceId: getDeviceId(),
      userId: user?.id as string,
    }).unwrap();

    if (result.success) {
      refetchStats();
    }
  };

  return (
    <div>
      <ul className="flex items-center flex-wrap">
        <li>
          <Button
            onClick={handleLike}
            className={`p-1.5 _shrink rounded-none  ${
              localLiked ? "text-primary " : ""
            }`}
            variant="ghost"
            waiting={isLiking}
          >
            {localLiked ? (
              <BsFillHandThumbsUpFill size={24} />
            ) : (
              <ThumbsDown size={24} />
            )}
            <span
              className="font-light text-xs text-foreground"
              onClick={() => toggleClick("likes-trigger")}
            >
              {newsItem?.likes?.length ?? ""}
            </span>
          </Button>
        </li>
        <li>
          <POPOVER
            trigger={
              <div className="flex items-center gap-2 font-light text-xs">
                <IoShareSocial size={32} /> {newsItem?.shares?.length ?? ""}
              </div>
            }
            variant="ghost"
            triggerClassNames="rounded-none"
            id="shares-trigger"
            size={"default"}
          >
            <SocialShare
              onShare={handleShare}
              className=""
              text={newsItem?.headline.text}
            />
          </POPOVER>
        </li>
        <li>
          {!user ? (
            <LoginModal
              trigger={
                <div className="font-light text-xs flex items-center gap-2">
                  <LiaCommentSolid
                    size={24}
                    onClick={() => document.getElementById("comment")?.focus()}
                  />
                  {newsItem?.comments?.length ?? ""}
                </div>
              }
              description={
                <p className="italic font-light text-center">
                  Login to comment on our news article. Thank you!
                </p>
              }
            />
          ) : (
            <DIALOG
              trigger={
                <div className="font-light text-xs flex items-center gap-2">
                  <LiaCommentSolid
                    size={24}
                    onClick={() => document.getElementById("comment")?.focus()}
                  />
                  {newsItem?.comments?.length ?? ""}
                </div>
              }
              triggerStyles="rounded-none"
              variant="ghost"
              title="Comment on this news article"
              id="comments-trigger"
            >
              <CommentForm newsId={newsItem?._id as string} />
            </DIALOG>
          )}
        </li>

        <li>
          <div className="flex items-center justify-center gap-2">
            {<BsEye className="opacity-65" />}
            <span className="font-light text-xs">
              {newsItem?.views?.length}{" "}
            </span>
          </div>
        </li>
      </ul>

      <br />

      <div>
        <p className="text-primary text-sm">Share this article</p>
        <ResourceShare
          className="rounded-full bg-primary/90"
          text={newsItem?.headline.text}
        />
      </div>

      <br />
      <hr />
      <br />

      {/* Comments */}
      <ul className="grid gap-6 ">
        {newsItem?.comments?.map((com, i) => (
          <CommentRow comment={com} newsItem={newsItem} key={i} />
        ))}
      </ul>

      <CommentForm newsId={newsItem?._id as string} />
    </div>
  );
}

const CommentRow = ({
  comment: com,
  newsItem,
}: {
  comment: IComment;
  newsItem?: INewsProps;
}) => {
const { data: session,   } = useSession();
   const user=session?.user
  const [deleteComment, { isLoading: isDeleting }] =
    useDeleteNewsCommentMutation();

  const handleDeleteComment = async (commentId: string) => {
    const result = await deleteComment({
      newsId: newsItem?._id as string,
      commentId,
      userId: user?.id,
      isAdmin: user?.role?.includes("admin"),
    }).unwrap();

    if (result.success) {
    }
  };
  return (
    <li className="flex items-start gap-5 pb-6  ">
      <AVATAR src={com?.user?.avatar as string} alt={com?.user?.name} />
      <section>
        <header className="flex items-start gap-6 ">
          <div className="flex items-baseline gap-0.5">
            <h1 className="_subtitle">{com?.user?.name ?? "Anonymous"}</h1>
            <span>
              <BsDot size={15} className="text-muted-foreground" />
            </span>
            <span className="text-sm mt-2.5 font-light">
              {getTimeLeftOrAgo(com?.date).formatted}
            </span>
          </div>
        </header>

        <div className="relative">
          <div
            dangerouslySetInnerHTML={{
              __html: shortText(com?.comment, 3500) || "",
            }}
            className="border border-border rounded-2xl p-3 -ml-6 mt-4 _p text-wrap wrap-break-word max-sm:max-w-60 max-w-3/4 overflow-x-auto"
          />

          {(user?.id == com.user || user?.role?.includes("admin")) && (
            <Button
              onClick={() => handleDeleteComment(com._id as string)}
              className="absolute right-2 top-1 p-0.5 _hover _shrink"
              variant="ghost"
              waiting={isDeleting}
            >
              <Trash size={24} />
            </Button>
          )}
        </div>
      </section>
    </li>
  );
};
