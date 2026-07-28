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
      "Pendirian Tenda dan Penataan Tapak kemah",
      "Upacara Pembukaan Pembekalan Jamnas XII Tahun 2026",
      "Orientasi Kawasan Perkemahan dan Penataan Tapak Kemah",
      "Apel sore",
      "Ibadah",
      "Makan malam",
      "Ice Breaking, Dinamika Kelompok, Yel-Yel, dan Lagu Kontingen",
      "Api persaudaraan dan Pentas Perkenalan",
      "Refleksi Harian dan Informasi Hari kedua"
    ];

    const activitiesDay2 = [
      "Ibadah Pagi",
      "Olahraga Pagi dan Kolone Tongkat",
      "Sarapan Pagi",
      "Apel Pagi",
      "Orientasi Pembekalan dan Pengenalan Arsitektur Jamnas XII 2026",
      "Pembentukan Identitas Kontingen Kwarda DIY",
      "Latihan Yel-yel, Lagu kontingen, dan Tata Upacara",
      "Ibadah Siang",
      "Makan siang dan Pengelolaan Tapak Kemah",
      "Anjangsana antar kontingan (simulasi jamnas)",
      "Gladi Penampilan",
      "Apel sore",
      "Ibadah Malam",
      "Makan malam dan Simulasi Pengambilan Logistik",
      "Malam Budaya",
      "Refleksi Harian dan Informasi Hari Ketiga"
    ];

    const activitiesDay3 = [
      "Ibadah Pagi",
      "Olahraga Pagi dan Kolone Tongkat",
      "Sarapan Pagi",
      "Apel Pagi",
      "Rotasi 1 : Keterampilan Kepramukaan",
      "Rotasi 2 : Petualangan Kepramukaan",
      "Rotasi 3 : Kampung Swasembada Pangan",
      "Ibadah Siang",
      "Makan Siang dan Pengelolaan Tapak Kemah",
      "Rotasi 4 : Teknologi, Budaya, dan Kampung Digital",
      "Rotasi 5 : Character Challenge",
      "Konsolidasi Regu",
      "Apel Sore",
      "Ibadah Malam",
      "Makan Malam dan Simulasi Pengambilan Logistik",
      "Forum Penggalang",
      "Refleksi Harian dan Informasi Hari keempat",
      "Pengukuhan Kontingen Kwarda DIY ke Jamnas XII Tahun 2026"
    ];

    const activitiesDay4 = [
      "Ibadah Pagi",
      "Olahraga Pagi",
      "Sarapan Pagi",
      "Apel Pagi",
      "Simulasi Kehidupan Jamnas",
      "Simulasi Operasional Kontingen",
      "Pembongkaran Kemah dan Kebersihan Area",
      "Refleksi Besar dan Penyampaian Komitmen Kontingen Kwarda DIY",
      "Upacara Pelepasan Kontingen Kwarda DIY Jamnas XII Tahun 2026 dan Upacara Penutupan Pembekalan"
    ];

    const insertActivities = async (acts: string[], dayId: string) => {
      for (const name of acts) {
        await prisma.activity.create({
          data: { name, pointValue: 10, dayId }
        });
      }
    };

    await insertActivities(activitiesDay1, day1.id);
    await insertActivities(activitiesDay2, day2.id);
    await insertActivities(activitiesDay3, day3.id);
    await insertActivities(activitiesDay4, day4.id);
  }
}
