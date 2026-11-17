type UserAvatarProps = {
  firstName: string;
  lastName: string;
  className?: string;
};

export function UserAvatar({
  firstName,
  lastName,
  className,
}: UserAvatarProps) {
  const seed = encodeURIComponent(`${firstName} ${lastName}`);
  return (
    // biome-ignore lint/performance/noImgElement: SVG remoto do DiceBear; next/image bloqueia SVG
    <img
      src={`https://api.dicebear.com/9.x/initials/svg?seed=${seed}`}
      alt=""
      width={40}
      height={40}
      className={`size-10 rounded-full bg-muted ${className ?? ""}`}
    />
  );
}
