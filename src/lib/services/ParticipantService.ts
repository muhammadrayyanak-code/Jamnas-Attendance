import { prisma } from '../prisma';

function normalize(str: string | undefined) {
  if (!str) return '';
  return str
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export class ParticipantService {
  /**
   * Register a new participant (Full Registration Flow)
   */
  static async registerParticipant(data: {
    nta: string;
    name: string;
    kwarcab: string;
    regu: string;
    agama?: string;
    ttl?: string;
    asalSekolah?: string;
    noWa?: string;
    alergiMakanan?: string;
  }) {
    const normName = normalize(data.name);
    const normKwarcab = normalize(data.kwarcab);
    const normRegu = normalize(data.regu);

    // Check if participant already exists based on NTA
    let participant = await prisma.participant.findUnique({
      where: {
        nta: data.nta
      }
    });

    if (participant) {
      throw new Error('Peserta dengan NTA ini sudah terdaftar.');
    }

    participant = await prisma.participant.create({
      data: {
        ...data,
        name: normName,
        kwarcab: normKwarcab,
        regu: normRegu,
        totalPoints: 0
      }
    });

    return participant;
  }

  /**
   * Find participant for Attendance flow
   */
  static async findForAttendance(nta: string, name: string, kwarcab: string, regu: string) {
    const normName = normalize(name);
    const normKwarcab = normalize(kwarcab);
    const normRegu = normalize(regu);

    let participant = await prisma.participant.findUnique({
      where: { nta }
    });

    if (!participant) {
      // Create on the fly if they haven't registered fully yet, 
      // but without the full registration details.
      participant = await prisma.participant.create({
        data: { nta, name: normName, kwarcab: normKwarcab, regu: normRegu, totalPoints: 0 }
      });
    }

    return participant;
  }

  /**
   * Get attendance history for a participant
   */
  static async getAttendanceHistory(participantId: string) {
    return prisma.attendance.findMany({
      where: { participantId },
      include: {
        activity: {
          include: { day: true }
        }
      },
      orderBy: { timestamp: 'desc' }
    });
  }

  /**
   * Recalculate total points for a participant
   */
  static async calculatePoints(participantId: string) {
    const attendances = await prisma.attendance.findMany({
      where: { participantId },
      include: { activity: true }
    });

    const totalPoints = attendances.reduce((sum, att) => sum + att.activity.pointValue, 0);

    await prisma.participant.update({
      where: { id: participantId },
      data: { totalPoints }
    });

    return totalPoints;
  }

  /**
   * Get all participants for admin dashboard
   */
  static async getAll(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    const where = search ? {
      OR: [
        { name: { contains: search } },
        { kwarcab: { contains: search } },
        { regu: { contains: search } }
      ]
    } : {};

    const [data, total] = await Promise.all([
      prisma.participant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.participant.count({ where })
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }
}
