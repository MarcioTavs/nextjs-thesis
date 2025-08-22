

import Navbar from '@/components/navbarhome';
import Image from 'next/image';
import React from 'react';

export default function AboutPage() {
  return (
    <div className='m'>
    <Navbar />
    <section className="p-8 pt-32 bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen">
        
      <div className="about-intro text-center mb-12 font-bold">
        <h2 className="text-4xl mb-4 text-white font-bold">About OnTrack</h2>
        <p className="text-2xl text-gray-200">OnTrack empowers businesses with seamless time-tracking solutions, ensuring accurate work hour management and improved team productivity.</p>
      </div>
      <div className="max-w-6xl mx-auto flex flex-col">
        <div className="flex items-center mb-16 flex-col md:flex-row">
          <div className="flex-1 max-w-[50%] flex justify-center items-center h-[300px] mb-4 md:mb-0">
            <Image
              src="/aboutimg1.svg" 
              alt="About Image 1"
              width={300}
              height={300}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex-1 p-8">
            <h2 className="text-3xl mb-2 text-white font-bold">OnTrack makes it easy.</h2>
            <p className="text-xl mb-4 text-orange-500 font-bold">Track time efficiently.</p>
            <p className="text-lg text-gray-200 leading-relaxed font-bold">By automating the timekeeping process, it ensures accurate, real-time recording of clock-ins and clock-outs, eliminating the need for manual entry.</p>
          </div>
        </div>
        <div className="flex items-center mb-16 flex-col md:flex-row-reverse">
          <div className="flex-1 max-w-[50%] flex justify-center items-center h-[300px] mb-4 md:mb-0">
            <Image
              src="/aboutimg2.svg" 
              alt="About Image 2"
              width={300}
              height={300}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex-1 p-8">
            <h2 className="text-3xl mb-2 text-white font-bold">Achieve your goal faster.</h2>
            <p className="text-xl mb-4 text-orange-500 font-bold">Simplifies the process of managing teams, ensuring smooth workflows and improved productivity.</p>
            <p className="text-lg text-gray-200 leading-relaxed font-bold">By streamlining communication, task allocation, and performance tracking.</p>
          </div>
        </div>
        <div className="flex items-center mb-16 flex-col md:flex-row">
          <div className="flex-1 max-w-[50%] flex justify-center items-center h-[300px] mb-4 md:mb-0">
            <Image
              src="/aboutimg3.svg" 
              alt="About Image 3"
              width={300}
              height={300}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex-1 p-8">
            <h2 className="text-3xl mb-2 text-white font-bold">Achieve your business with OnTrack.</h2>
            <p className="text-xl mb-4 text-orange-500 font-bold">Empowering businesses.</p>
            <p className="text-lg text-gray-200 leading-relaxed font-bold">OnTrack empowers businesses with seamless time-tracking solutions, ensuring accurate work hour management and improved team productivity.</p>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
