/**
 * Lightweight Structured Logging Subsystem
 * Enforces structured metadata and clinical audit trails
 */

export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "CLINICAL_AUDIT";

export interface LogEntry {
  level: LogLevel;
  timestamp: string;
  context: string;
  message: string;
  metadata?: Record<string, unknown>;
}

class ClinicalLogger {
  private formatLog(level: LogLevel, context: string, message: string, metadata?: Record<string, unknown>): LogEntry {
    return {
      level,
      timestamp: new Date().toISOString(),
      context,
      message,
      metadata,
    };
  }

  private output(entry: LogEntry): void {
    const formatted = `[${entry.timestamp}] [${entry.level}] [${entry.context}]: ${entry.message}`;
    if (entry.level === "ERROR") {
      console.error(formatted, entry.metadata || "");
    } else if (entry.level === "WARN") {
      console.warn(formatted, entry.metadata || "");
    } else if (entry.level === "CLINICAL_AUDIT") {
      // Clinical audit log with special highlight
      console.info(`%c${formatted}`, "color: #0284c7; font-weight: bold;", entry.metadata || "");
    } else {
      console.log(formatted, entry.metadata || "");
    }
  }

  debug(context: string, message: string, metadata?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== "production") {
      this.output(this.formatLog("DEBUG", context, message, metadata));
    }
  }

  info(context: string, message: string, metadata?: Record<string, unknown>): void {
    this.output(this.formatLog("INFO", context, message, metadata));
  }

  warn(context: string, message: string, metadata?: Record<string, unknown>): void {
    this.output(this.formatLog("WARN", context, message, metadata));
  }

  error(context: string, message: string, metadata?: Record<string, unknown>): void {
    this.output(this.formatLog("ERROR", context, message, metadata));
  }

  /**
   * Dedicated audit logger for doctor verification, edits, rejections, and consent events
   */
  clinicalAudit(context: string, message: string, metadata?: Record<string, unknown>): void {
    this.output(this.formatLog("CLINICAL_AUDIT", context, message, metadata));
  }
}

export const logger = new ClinicalLogger();
