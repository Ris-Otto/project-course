import {
  ConsoleHandler,
  getLogger,
  LogRecord,
  RotatingFileHandler,
  setup as loggerSetup,
} from "https://deno.land/std/log/mod.ts";
import { stripColor } from "https://deno.land/std@0.77.0/fmt/colors.ts";

const rotatingFileHandler = new RotatingFileHandler("DEBUG", {
  formatter: (record: LogRecord) => {
    return `${record.datetime.toISOString()} [${record.level}] ${
      stripColor(record.msg)
    } ${record.args.length > 0 ? JSON.stringify(record.args) : ""}`;
  },
  filename: "out.log",
  maxBackupCount: 10,
  maxBytes: 10_000_000,
});

await loggerSetup({
  //define handlers
  handlers: {
    console: new ConsoleHandler("DEBUG", {
      formatter: (record: LogRecord) => {
        return `${record.datetime.toISOString()} [${record.level}] ${(record
          .msg)}`;
      },
    }),
    file: rotatingFileHandler,
  },
  //assign handlers to loggers
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console", "file"],
    },
  },
});

getLogger().info("Start-up");
rotatingFileHandler.flush();

export const dl = getLogger();

export function flushLogger() {
  rotatingFileHandler.flush();
}
