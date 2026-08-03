import { format, addDays, subDays, isBefore, isAfter, isSameDay, startOfDay, endOfDay } from "date-fns";

/**
 * Date utility functions
 */

export const dateUtils = {
  /**
   * Format date to specified format
   */
  format(date: Date | string, formatStr: string = "MMM d, yyyy"): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, formatStr);
  },

  /**
   * Add days to date
   */
  addDays(date: Date | string, days: number): Date {
    const d = typeof date === "string" ? new Date(date) : date;
    return addDays(d, days);
  },

  /**
   * Subtract days from date
   */
  subDays(date: Date | string, days: number): Date {
    const d = typeof date === "string" ? new Date(date) : date;
    return subDays(d, days);
  },

  /**
   * Check if date is before another date
   */
  isBefore(date: Date | string, compareDate: Date | string): boolean {
    const d = typeof date === "string" ? new Date(date) : date;
    const compare = typeof compareDate === "string" ? new Date(compareDate) : compareDate;
    return isBefore(d, compare);
  },

  /**
   * Check if date is after another date
   */
  isAfter(date: Date | string, compareDate: Date | string): boolean {
    const d = typeof date === "string" ? new Date(date) : date;
    const compare = typeof compareDate === "string" ? new Date(compareDate) : compareDate;
    return isAfter(d, compare);
  },

  /**
   * Check if two dates are the same day
   */
  isSameDay(date1: Date | string, date2: Date | string): boolean {
    const d1 = typeof date1 === "string" ? new Date(date1) : date1;
    const d2 = typeof date2 === "string" ? new Date(date2) : date2;
    return isSameDay(d1, d2);
  },

  /**
   * Get start of day
   */
  startOfDay(date: Date | string): Date {
    const d = typeof date === "string" ? new Date(date) : date;
    return startOfDay(d);
  },

  /**
   * Get end of day
   */
  endOfDay(date: Date | string): Date {
    const d = typeof date === "string" ? new Date(date) : date;
    return endOfDay(d);
  },

  /**
   * Get today's date
   */
  today(): Date {
    return new Date();
  },

  /**
   * Check if date is in the past
   */
  isPast(date: Date | string): boolean {
    return this.isBefore(date, this.today());
  },

  /**
   * Check if date is in the future
   */
  isFuture(date: Date | string): boolean {
    return this.isAfter(date, this.today());
  },
};
