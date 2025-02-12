// @deno-types="@types/react"
import { MutableRefObject, useEffect, useState } from "react";
import { getRequest } from "./api/APITemplate.ts";

/**
 * @param {*} ref the reffered component
 * @param {*} handler handler function
 */
export const useOnClickOutside = (
  ref: MutableRefObject<HTMLDivElement>,
  handler: (event: { target: HTMLDivElement }) => void,
) => {
  useEffect(() => {
    const listener = (event: { target: any }) => {
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

  const handleImageLoad = (e: any) => {
    const { naturalHeight, naturalWidth } = e.target;
    const ratio = naturalWidth / naturalHeight;
    const height = maxHeight ? maxHeight : globalThis.innerHeight / 8;
    setDimensions({ height: height, width: height * ratio });
  };

  return { dimensions, handleImageLoad };
}

export function useRequest<T>(path: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<string | null>(null);
  const [response, setResponse] = useState<T | null>(null);
  useEffect(() => {
    async function getData() {
      const res = await getRequest<T>(path);
      if (res.isSuccess()) {
        setResponse(res.response);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setIsError(res.message);
      }
    }
    getData();
  }, []);

  return { response, isLoading, isError };
}
