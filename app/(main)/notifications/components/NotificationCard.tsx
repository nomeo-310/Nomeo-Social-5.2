import React from "react";
import AnimationWrapper from "@/components/common/AnimationWrapper";
import { notificationProps, userProps } from "@/types/types";
import { IconType } from "react-icons/lib";
import {
  HiOutlineChatBubbleLeft,
  HiOutlineExclamationTriangle,
  HiOutlineHeart,
  HiOutlineUser,
} from "react-icons/hi2";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ImageAvatar from "../../components/ImageAvatar";

type notificationCardProps = {
  notification: notificationProps;
  index?: number;
  currentUser: userProps;
};

const NotificationCard = ({
  notification,
  index,
  currentUser,
}: notificationCardProps) => {
  const notificationTypeMap: Record<
    string,
    { message: string; icon: React.ReactNode; href: string }
  > = {
    "like-post": {
      icon: <HiOutlineHeart className="size-7 text-primary fill-primary" />,
      message: `${notification.issuer.displayName} liked your post.`,
      href: `/posts/${notification.post && notification.post._id}`,
    },
    "report-post": {
      message: "Your post has been reported. If it persists it will be barred.",
      icon: <HiOutlineExclamationTriangle className="size-7 text-primary" />,
      href: `/posts/${notification.post && notification?.post._id}`,
    },
    "barred-post": {
      message:
        "Your post has been barred. It will no longer be seen in public feed.",
      icon: <HiOutlineExclamationTriangle className="size-7 text-primary" />,
      href: `/posts/${notification.post && notification.post._id}`,
    },
    "comment-post": {
      message: `${notification.issuer.displayName} comment your post.`,
      icon: <HiOutlineChatBubbleLeft className="size-7 text-primary" />,
      href: `/posts/${notification.post && notification.post._id}`,
    },
    "user-followed": {
      message: `${notification.issuer.displayName} started following you.`,
      icon: <HiOutlineUser className="size-7 text-primary" />,
      href: `/users/${notification.issuer?.username}`,
    },
  };

  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    <AnimationWrapper
      key={index}
      transition={{ duration: 1, delay: index && index * 0 }}
      keyValue={`${index}`}
    >
      <Link href={href}>
        <article
          className={cn(
            "flex gap-3 rounded-md bg-card p-4 shadow-sm transition-colors hover:bg-card/70",
            !notification.read && "bg-primary/10"
          )}
        >
          <div className="my-1">{icon}</div>
          <div className="space-y-3">
            {notification.type === "report-post" ? (
              ""
            ) : notification.type === "barred-post" ? (
              ""
            ) : (
              <ImageAvatar imgSrc={notification.issuer?.image} />
            )}
            <div>
              <span className="font-bold">
                {notification.issuer.displayName}
              </span>{" "}
              <span className="sm:text-base">{message}</span>
            </div>
            {notification.post && (
              <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
                {notification.post.content}
              </div>
            )}
          </div>
        </article>
      </Link>
    </AnimationWrapper>
  );
};

export default NotificationCard;
