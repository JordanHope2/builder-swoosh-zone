import { createClient } from '@supabase/supabase-js';
if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to seed in production'); process.exit(1);
}
const supa = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
await supa.from('jobs').insert([{ title: 'Seed role', description: 'Hello CH', created_by: null }]);
console.log('Seeded');
