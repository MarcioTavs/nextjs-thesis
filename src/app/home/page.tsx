// app/page.tsx (Home page in Next.js App Router)

import Navbar from '@/components/navbarhome';
import Hero from '@/components/hero';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
    </main>
  );
}
