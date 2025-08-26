'use client';




/// in this component , i have to make sure the admin is logged in before allowing access to the organization creation form.
/// if the user is not an admin, redirect them to the login page or an access denied page.
/// this is done using a useEffect hook that checks the user's role stored in localStorage.
/// if the role is not 'ADMIN', redirect to '/login' or '/access-denied

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Organization() {
  const [departmentId, setDepartmentId] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Run only on client to prevent SSR hydration issues
    if (typeof window === 'undefined') return;

    const role = localStorage.getItem('role');
    console.log('User role:', role); //
    // Redirect if not admin (including employee, null/undefined, or visitor)
    if (role !== 'ADMIN') {
      router.replace('/login'); // or '/access-denied' as you prefer
    } else {
      setReady(true);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      await axios.post(
        'http://localhost:8080/api/admin/add-department',
        { departmentId, departmentName },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data || 'Failed to create department. Ensure ID is unique and name is valid.');
    } finally {
      setLoading(false);
    }
  };

  if (!ready) return null; // Don't render anything until checked

  return (
    <section className="p-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen flex items-center justify-center">
      <div className="signup-container flex max-w-6xl w-full bg-gray-900 shadow-lg rounded-lg overflow-hidden">
        <div className="illustration-section flex-1 p-8 bg-gray-800 flex flex-col items-center justify-center">
          <div className="logo-container mb-10">
            <Image src="/logo.png" alt="Logo" width={150} height={50} className="invert" />
          </div>
          <div className="illustration-container">
            <Image
              src="/organization.svg"
              alt="Organization Illustration"
              width={400}
              height={400}
              className="max-w-full h-auto"
              style={{ filter: 'hue-rotate(340deg) saturate(2) brightness(1.1)' }}
            />
          </div>
        </div>
        <div className="form-section flex-1 p-12 flex flex-col justify-center">
          <div className="form-header mb-10">
            <h1 className="text-4xl font-bold text-white mb-4">Create Your Department</h1>
            <p className="text-lg text-gray-300">Provide details to set up your department.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-5">
              <input
                type="text"
                placeholder="Department ID (unique)"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded placeholder-gray-400"
                required
              />
            </div>
            <div className="form-group mb-5">
              <input
                type="text"
                placeholder="Department Name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded placeholder-gray-400"
                required
              />
            </div>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="continue-button w-full p-3 bg-orange-500 text-white rounded font-semibold hover:bg-orange-600 transition-colors"
            >
              {loading ? 'Submitting...' : 'Create Department'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
