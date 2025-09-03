

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="w-full px-3 antialiased bg-gradient-to-br from-gray-900 via-black to-gray-800 lg:px-6 mt-[70px] min-h-[calc(100vh-70px)] flex items-center">
      <div className="mx-auto max-w-7xl w-full">
        <div className="container px-6 py-32 mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 md:pr-8">
            <h1 className="text-4xl font-extrabold leading-none tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
              <span className="block">Streamlined & Powerful</span>
              <span className="relative inline-block mt-3 text-white">Time Tracking</span>
            </h1>
            <p className="mx-auto mt-6 text-sm text-left text-gray-200 md:text-center md:mt-12 sm:text-base md:max-w-xl md:text-lg xl:text-xl">
              The ultimate time tracking solution for businesses. Forever FREE for unlimited users.
            </p>
            <div className="relative flex items-center mx-auto mt-12 overflow-hidden text-left border border-gray-700 rounded-md md:max-w-md md:text-center">
              <span className="relative top-0 right-0 block">
                <Link href="/register">
                  <button className="inline-flex items-center justify-center w-32 h-12 px-8 text-base font-bold leading-6 text-white transition duration-150 ease-in-out bg-gray-800 border border-transparent hover:bg-gray-700 focus:outline-none active:bg-gray-700">
                    Sign Up
                  </button>
                </Link>
              </span>
            </div>
            <div className="mt-8 text-sm text-gray-300">By signing up, you agree to our terms and services.</div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
            <Image src="/heroimg.svg" alt="Hero Image" width={600} height={400} className="max-w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
