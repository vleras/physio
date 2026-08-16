import type { CSSProperties, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ion-icon": HTMLAttributes<HTMLElement> & {
        name?: string;
        src?: string;
        size?: "small" | "large";
        class?: string;
        style?: CSSProperties;
      };
    }
  }
}

export {};
