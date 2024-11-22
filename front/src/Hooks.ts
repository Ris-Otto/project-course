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
  };
}
