'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProfileUpdateForm from '@/components/user-profile';

// Separate component that uses useSearchParams
function ProfileContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  // Optional: Handle case where email is missing (e.g., redirect or show error)
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Invalid access. Please activate your account first.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-6">
      <ProfileUpdateForm email={email} />
    </div>
  );
}

// Main export wrapped in Suspense
export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        Loading profile...
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}