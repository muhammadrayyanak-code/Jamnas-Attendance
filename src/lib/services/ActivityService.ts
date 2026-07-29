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
    const activity = await prisma.activity.update({
      where: { id },
      data: { name, pointValue }
    });

    // Recalculate points for all participants who attended this activity
    const attendances = await prisma.attendance.findMany({
      where: { activityId: id },
      select: { participantId: true }
    });
    
    // Using dynamic import or require to avoid circular dependencies if ParticipantService is imported
    const { ParticipantService } = require('./ParticipantService');
    for (const att of attendances) {
      await ParticipantService.calculatePoints(att.participantId);
    }

    return activity;
  }

  /**
   * Delete an activity
   */
  static async deleteActivity(id: string) {
    // Get attendees before deletion
    const attendances = await prisma.attendance.findMany({
      where: { activityId: id },
      select: { participantId: true }
    });

    const deleted = await prisma.activity.delete({
      where: { id }
    });

    // Recalculate points after deletion
    const { ParticipantService } = require('./ParticipantService');
    for (const att of attendances) {
      await ParticipantService.calculatePoints(att.participantId);
    }

    return deleted;
  }
}
