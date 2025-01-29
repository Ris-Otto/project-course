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

// @deno-types="@types/react"
import { MutableRefObject, useEffect, useState } from "react";

export function useWrapPromise(promise: Promise<T>) {
  const [ret, setRet] = useState<{
    read(): T;
    invalidate: boolean;
  }>();
  useEffect(() => {
    console.log("hej");
    setRet(wrapPromise(promise));
    return () => (ret.invalidate = true);
  }, [globalThis.location.pathname]);

  return { ret };
}

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

export function useImageDimensions(maxHeight?: number) {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const handleImageLoad = (e) => {
    const { naturalHeight, naturalWidth } = e.target;
    const ratio = naturalWidth / naturalHeight;
    const height = maxHeight ? maxHeight : globalThis.innerHeight / 8;
    setDimensions({ height: height, width: height * ratio });
  };

  return { dimensions, handleImageLoad };
}
