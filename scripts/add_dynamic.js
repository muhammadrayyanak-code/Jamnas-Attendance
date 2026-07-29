const fs = require('fs');
const paths = [
  'src/app/api/admin/dashboard/route.ts',
  'src/app/api/admin/peserta/route.ts',
  'src/app/api/admin/activities/route.ts',
  'src/app/api/admin/export/route.ts'
];
paths.forEach(p => {
  const content = fs.readFileSync(p, 'utf8');
  if (!content.includes('force-dynamic')) {
    fs.writeFileSync(p, "export const dynamic = 'force-dynamic';\n" + content);
  }
});
