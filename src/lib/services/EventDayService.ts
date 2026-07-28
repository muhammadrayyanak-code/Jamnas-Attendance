import { prisma } from '../prisma';

export class EventDayService {
  /**
   * Get all event days, ordered by date
   */
  static async getAllDays() {
    return prisma.eventDay.findMany({
      orderBy: { date: 'asc' }
    });
  }

  /**
   * Get activities for a specific day
   */
  static async getActivitiesByDay(dayId: string) {
    return prisma.activity.findMany({
      where: { dayId },
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Create a new event day
   */
  static async createDay(name: string, date: Date) {
    return prisma.eventDay.create({
      data: { name, date }
    });
  }
}
