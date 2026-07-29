const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const kwarcabList = ['Kwarcab Jakarta Selatan', 'Kwarcab Bandung', 'Kwarcab Surabaya', 'Kwarcab Medan'];
const reguList = ['Harimau', 'Garuda', 'Kobra', 'Rajawali', 'Melati', 'Mawar', 'Anggrek'];
const namePrefixes = ['Budi', 'Andi', 'Siti', 'Ani', 'Joko', 'Bambang', 'Ahmad', 'Rina', 'Dewi', 'Putra'];
const nameSuffixes = ['Santoso', 'Wijaya', 'Pratama', 'Sari', 'Kusuma', 'Setiawan', 'Nugroho'];
const sekolahList = ['SMPN 1', 'SMPN 2', 'SMPN 3', 'MTSN 1', 'MTSN 2'];
const alergiList = ['Tidak ada', 'Tidak ada', 'Tidak ada', 'Seafood', 'Kacang', 'Telur'];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log('Generating mock participants and attendances...');
  
  // Clear existing participants (and their attendances via cascade)
  await prisma.participant.deleteMany({});
  console.log('Cleared existing participants.');

  const activities = await prisma.activity.findMany();
  console.log(`Found ${activities.length} activities.`);

  const participantsData = [];
  for (let i = 0; i < 50; i++) {
    const name = `${randomChoice(namePrefixes)} ${randomChoice(nameSuffixes)}`;
    const dob = randomDate(new Date(2005, 0, 1), new Date(2010, 11, 31));
    const ttl = `Kota, ${dob.getDate().toString().padStart(2, '0')}-${(dob.getMonth()+1).toString().padStart(2, '0')}-${dob.getFullYear()}`;
    const noWa = `0812${Math.floor(Math.random() * 90000000 + 10000000)}`;

    participantsData.push({
      name,
      kwarcab: randomChoice(kwarcabList),
      regu: randomChoice(reguList),
      ttl,
      asalSekolah: randomChoice(sekolahList),
      noWa,
      alergiMakanan: randomChoice(alergiList)
    });
  }

  // Insert participants
  console.log('Inserting 50 participants...');
  const createdParticipants = await prisma.participant.createManyAndReturn({
    data: participantsData
  });

  console.log('Generating attendances...');
  const attendancesData = [];
  for (const p of createdParticipants) {
    // Each participant attends ~80% of activities
    for (const act of activities) {
      if (Math.random() < 0.8) {
        attendancesData.push({
          participantId: p.id,
          activityId: act.id,
          timestamp: new Date()
        });
      }
    }
  }

  console.log(`Inserting ${attendancesData.length} attendances...`);
  await prisma.attendance.createMany({
    data: attendancesData
  });

  console.log('Database seeded successfully with mock data!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
