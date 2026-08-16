"use client";

type IonIconProps = {
  name: string;
  className?: string;
  size?: number | string;
  color?: string;
};

export default function IonIcon({
  name,
  className,
  size = 18,
  color = "currentColor",
}: IonIconProps) {
  const px = typeof size === "number" ? `${size}px` : size;

  return (
    <ion-icon
      name={name}
      class={className}
      className={className}
      style={{
        width: px,
        height: px,
        color,
        flexShrink: 0,
        display: "inline-block",
        verticalAlign: "middle",
      }}
    />
  );
}
