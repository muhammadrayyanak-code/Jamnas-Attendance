import { prisma } from '../prisma';

export class ActivityService {
  /**
   * Get all activities
   * @param filterUpcoming If true, only returns activities that have already started
   */
  static async getAllActivities(filterUpcoming: boolean = false) {
    const whereClause = filterUpcoming ? {
      startTime: { lte: new Date() }
    } : {};

    return prisma.activity.findMany({
      where: whereClause,
      include: { day: true },
      orderBy: [
        { day: { date: 'asc' } },
        { startTime: 'asc' },
        { name: 'asc' }
      ]
    });
  }

  /**
   * Create a new activity
   */
  static async createActivity(name: string, pointValue: number, dayId: string) {
    return prisma.activity.create({
      data: { name, pointValue, dayId }
    });
  }

  /**
   * Update an existing activity
   */
  static async updateActivity(id: string, name: string, pointValue: number) {
    return prisma.activity.update({
      where: { id },
      data: { name, pointValue }
    });
  }

  /**
   * Delete an activity
   */
  static async deleteActivity(id: string) {
    return prisma.activity.delete({
      where: { id }
    });
  }
}
