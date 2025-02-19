import { HonoDiskStorage } from "npm:@hono-storage/node-disk";

export const storage = new HonoDiskStorage({
  dest: "./uploads/",
  filename: (c, file) => `${file.originalname}.${file.extension}`,
});
