"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { openCollaborationRequest } from "@/lib/collaborationRequest";

type CollaborationRequestLauncherProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  children: ReactNode;
};

/** Opens the shared collaboration dialog from a page-level call to action. */
export function CollaborationRequestLauncher({ children, onClick, ...props }: CollaborationRequestLauncherProps) {
  return (
    <button
      {...props}
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) openCollaborationRequest();
      }}
    >
      {children}
    </button>
  );
}
