import { prisma } from '../prisma';
import { ParticipantService } from './ParticipantService';

export class AttendanceService {
  /**
   * Record attendance for a participant at an activity.
   * Includes duplicate validation.
   */
  static async recordAttendance(participantId: string, activityId: string) {
    // 1. Validate if activity exists
    const activity = await prisma.activity.findUnique({ where: { id: activityId } });
    if (!activity) {
      throw new Error('Activity not found');
    }

    // 2. Validate duplicate
    const existing = await prisma.attendance.findUnique({
      where: {
        participantId_activityId: { participantId, activityId }
      }
    });

    if (existing) {
      throw new Error('Attendance already recorded for this activity');
    }

    // 3. Record attendance
    const attendance = await prisma.attendance.create({
      data: { participantId, activityId }
    });

    // 4. Recalculate participant points
    await ParticipantService.calculatePoints(participantId);

    return { attendance, pointsAwarded: activity.pointValue };
  }

  /**
   * Get today's total check-ins
   */
  static async getTodayCheckInsCount() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.attendance.count({
      where: {
        timestamp: { gte: today }
      }
    });
  }
}
