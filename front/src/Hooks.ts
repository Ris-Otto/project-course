//TODO caching strategies
export function wrapPromise<T>(promise: Promise<T>) {
  let status = "pending";
  let result: T;

  const suspender = promise.then(
    (r) => {
      status = "fulfilled";
      result = r;
    },
    (e) => {
      status = "rejected";
      result = e;
    },
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "rejected") {
        throw result;
      } else {
        return result;
      }
    },
    invalidate: false,
  };
}

import { MutableRefObject, useEffect } from "react";

/**
 * @param {*} ref the reffered component
 * @param {*} handler handler function
 */
export const useOnClickOutside = <T>(
  ref: MutableRefObject<T>,
  handler: (event: { target: unknown }) => void,
) => {
  useEffect(() => {
    const listener = (event: { target: unknown }) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
};
