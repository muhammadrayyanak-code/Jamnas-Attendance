import { prisma } from '../prisma';

export class ActivityService {
  /**
   * Get all activities
   */
  static async getAllActivities() {
    return prisma.activity.findMany({
      include: { day: true },
      orderBy: [
        { day: { date: 'asc' } },
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
