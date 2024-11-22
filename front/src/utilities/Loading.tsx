import { SpinnerCircularSplit } from "spinners-react";
// @deno-types="npm:@types/react"
import { ReactNode, Suspense } from "react";

export function Loading() {
  return <SpinnerCircularSplit style={{ top: "50%", bottom: "50%" }} />;
}

export function Suspended({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
