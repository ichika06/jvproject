"use client";

import { Spinner } from "@fluentui/react-components";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );
}
