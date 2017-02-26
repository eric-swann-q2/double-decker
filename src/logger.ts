export interface ILogger {

  log(level: string, ...args: any[]): void;

  error(...args: any[]): void;

  warn(...args: any[]): void;

  info(...args: any[]): void;

  debug(...args: any[]): void;

}

export class ConsoleLogger implements ILogger {

  log(level: string, ...args: any[]): void {
    if (level === "debug" && !console.debug) {
      level = "info";
    }
    console[level](...args);
  }

  error(...args: any[]): void {
    this.log("error", args);
  }

  warn(...args: any[]): void {
    this.log("warn", args);
  }

  info(...args: any[]): void {
    this.log("info", args);
  }

  debug(...args: any[]): void {
    this.log("debug", args);
  }
}
