// components/Contact.tsx

import Image from 'next/image';

export default function Contact() {
  return (
    <section className="p-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen text-center">
      <h2 className="text-3xl mb-2 text-white">OnTrack</h2>
      <p className="text-lg text-gray-300 mb-8">Your Business, Our Priority</p>
      <div className="flex justify-between items-center flex-wrap gap-4 max-w-6xl mx-auto">
        <div className="flex flex-col items-center p-4 gap-2 flex-1 min-w-[200px]">
          <Image
            src="/mail.png"
            alt="Email"
            width={40}
            height={40}
            className="invert" // Inverts color for visibility on dark background
          />
          <h3 className="text-xl text-white mb-2">Email</h3>
          <p className="text-base text-gray-400">info@ontrack.com</p>
        </div>
        <div className="flex flex-col items-center p-4 gap-2 flex-1 min-w-[200px]">
          <Image
            src="/address.png"
            alt="Address"
            width={40}
            height={40}
            className="invert" // Inverts color for visibility on dark background
          />
          <h3 className="text-xl text-white mb-2">Find</h3>
          <p className="text-base text-gray-400">Lisboa, Pombal do Marques, 4032</p>
        </div>
        <div className="flex flex-col items-center p-4 gap-2 flex-1 min-w-[200px]">
          <Image
            src="/call.png"
            alt="Call"
            width={40}
            height={40}
            className="invert" // Inverts color for visibility on dark background
          />
          <h3 className="text-xl text-white mb-2">Call</h3>
          <p className="text-base text-gray-400">(06 52) 422 800</p>
        </div>
      </div>
      <p className="mt-8 text-sm text-gray-300">Copyright © 2025 OnTrack</p>
    </section>
  );
}
