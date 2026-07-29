import { EventDayService } from './EventDayService';
import { prisma } from '../prisma';

export class SeedService {
  static async seedDaysIfEmpty() {
    const count = await prisma.eventDay.count();
    if (count === 0) {
      await EventDayService.createDay("Rabu, 29 Juli 2026", new Date("2026-07-29T00:00:00Z"));
      await EventDayService.createDay("Kamis, 30 Juli 2026", new Date("2026-07-30T00:00:00Z"));
      await EventDayService.createDay("Jumat, 31 Juli 2026", new Date("2026-07-31T00:00:00Z"));
      await EventDayService.createDay("Sabtu, 1 Agustus 2026", new Date("2026-08-01T00:00:00Z"));
    }
  }

  static async resetAndSeedAll() {
    // Clean up existing data to avoid duplicates
    await prisma.attendance.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.eventDay.deleteMany();

    // Create Days
    const day1 = await EventDayService.createDay("Rabu, 29 Juli 2026", new Date("2026-07-29T00:00:00Z"));
    const day2 = await EventDayService.createDay("Kamis, 30 Juli 2026", new Date("2026-07-30T00:00:00Z"));
    const day3 = await EventDayService.createDay("Jum'at, 31 Juli 2026", new Date("2026-07-31T00:00:00Z"));
    const day4 = await EventDayService.createDay("Sabtu, 1 Agustus 2026", new Date("2026-08-01T00:00:00Z"));

    const activitiesDay1 = [
      { name: "Pendirian Tenda dan Penataan Tapak kemah", time: "14:45:00" },
      { name: "Upacara Pembukaan Pembekalan Jamnas XII Tahun 2026", time: "15:45:00" },
      { name: "Orientasi Kawasan Perkemahan dan Penataan Tapak Kemah", time: "16:30:00" },
      { name: "Apel sore", time: "17:00:00" },
      { name: "Ibadah", time: "17:30:00" },
      { name: "Makan malam", time: "17:30:00" },
      { name: "Ice Breaking, Dinamika Kelompok, Yel-Yel, dan Lagu Kontingen", time: "19:00:00" },
      { name: "Api persaudaraan dan Pentas Perkenalan", time: "20:30:00" },
      { name: "Refleksi Harian dan Informasi Hari kedua", time: "21:30:00" }
    ];

    const activitiesDay2 = [
      { name: "Ibadah Pagi", time: "04:30:00" },
      { name: "Olahraga Pagi dan Kolone Tongkat", time: "05:00:00" },
      { name: "Sarapan Pagi", time: "06:00:00" },
      { name: "Apel Pagi", time: "07:00:00" },
      { name: "Orientasi Pembekalan dan Pengenalan Arsitektur Jamnas XII 2026", time: "07:30:00" },
      { name: "Pembentukan Identitas Kontingen Kwarda DIY", time: "09:15:00" },
      { name: "Latihan Yel-yel, Lagu kontingen, dan Tata Upacara", time: "10:45:00" },
      { name: "Ibadah Siang", time: "12:00:00" },
      { name: "Makan siang dan Pengelolaan Tapak Kemah", time: "12:00:00" },
      { name: "Anjangsana antar kontingan (simulasi jamnas)", time: "13:30:00" },
      { name: "Gladi Penampilan", time: "15:15:00" },
      { name: "Apel sore", time: "17:00:00" },
      { name: "Ibadah Malam", time: "17:30:00" },
      { name: "Makan malam dan Simulasi Pengambilan Logistik", time: "17:30:00" },
      { name: "Malam Budaya", time: "19:00:00" },
      { name: "Refleksi Harian dan Informasi Hari Ketiga", time: "21:00:00" }
    ];

    const activitiesDay3 = [
      { name: "Ibadah Pagi", time: "04:30:00" },
      { name: "Olahraga Pagi dan Kolone Tongkat", time: "05:00:00" },
      { name: "Sarapan Pagi", time: "06:00:00" },
      { name: "Apel Pagi", time: "07:00:00" },
      { name: "Rotasi 1 : Keterampilan Kepramukaan", time: "07:30:00" },
      { name: "Rotasi 2 : Petualangan Kepramukaan", time: "09:15:00" },
      { name: "Rotasi 3 : Kampung Swasembada Pangan", time: "11:00:00" },
      { name: "Ibadah Siang", time: "11:45:00" },
      { name: "Makan Siang dan Pengelolaan Tapak Kemah", time: "11:45:00" },
      { name: "Rotasi 4 : Teknologi, Budaya, dan Kampung Digital", time: "13:30:00" },
      { name: "Rotasi 5 : Character Challenge", time: "15:15:00" },
      { name: "Konsolidasi Regu", time: "16:45:00" },
      { name: "Apel Sore", time: "17:00:00" },
      { name: "Ibadah Malam", time: "17:30:00" },
      { name: "Makan Malam dan Simulasi Pengambilan Logistik", time: "17:30:00" },
      { name: "Forum Penggalang", time: "19:00:00" },
      { name: "Refleksi Harian dan Informasi Hari keempat", time: "21:00:00" },
      { name: "Pengukuhan Kontingen Kwarda DIY ke Jamnas XII Tahun 2026", time: "22:00:00" }
    ];

    const activitiesDay4 = [
      { name: "Ibadah Pagi", time: "04:30:00" },
      { name: "Olahraga Pagi", time: "05:00:00" },
      { name: "Sarapan Pagi", time: "05:30:00" },
      { name: "Apel Pagi", time: "06:30:00" },
      { name: "Simulasi Kehidupan Jamnas", time: "07:00:00" },
      { name: "Simulasi Operasional Kontingen", time: "08:00:00" },
      { name: "Pembongkaran Kemah dan Kebersihan Area", time: "09:00:00" },
      { name: "Refleksi Besar dan Penyampaian Komitmen Kontingen Kwarda DIY", time: "09:00:00" },
      { name: "Upacara Pelepasan Kontingen Kwarda DIY Jamnas XII Tahun 2026 dan Upacara Penutupan Pembekalan", time: "09:45:00" }
    ];

    const insertActivities = async (acts: { name: string, time: string }[], dayId: string, datePrefix: string) => {
      for (const act of acts) {
        // Construct the full datetime string in ISO 8601 with +07:00 (WIB)
        const startTimeString = `${datePrefix}T${act.time}.000+07:00`;
        const startTime = new Date(startTimeString);
        await prisma.activity.create({
          data: { name: act.name, pointValue: 10, dayId, startTime }
        });
      }
    };

    await insertActivities(activitiesDay1, day1.id, "2026-07-29");
    await insertActivities(activitiesDay2, day2.id, "2026-07-30");
    await insertActivities(activitiesDay3, day3.id, "2026-07-31");
    await insertActivities(activitiesDay4, day4.id, "2026-08-01");
  }
}
