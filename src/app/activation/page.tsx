'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

export default function ActivationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';

  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; success: boolean }>({
    text: '',
    success: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ text: '', success: false });
    setLoading(true);

    try {
      await axios.post('http://localhost:8080/api/employee/activate-account', {
        email,
        apiKey,
      });

      setMsg({ text: 'Account activated successfully!', success: true });
      setTimeout(() => {
        router.push(`/profile?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (error: any) {
      setMsg({
        text:
          (error.response && error.response.data) ||
          'Activation failed. Please try again.',
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-10 max-w-md w-full text-white flex flex-col gap-6 items-center">
        <Image
          src="/logo.png"
          alt="Company Logo"
          width={120}
          height={120}
          className="mb-4 invert"
        />
        <h2 className="text-3xl font-extrabold">Activate Your Account</h2>
        <p className="text-gray-300 text-center">
          Please enter the API key sent to your email to activate your account.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API Key"
            required
            className="p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-gray-400"
          />
          <button
            type="submit"
            disabled={loading || !apiKey.trim()}
            className="bg-[#f06e04] hover:bg-[#d65f03] active:bg-[#c05403] text-white font-bold py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Activating...' : 'Activate Account'}
          </button>
        </form>

        {msg.text && (
          <div
            className={`text-center ${
              msg.success ? 'text-green-400' : 'text-red-500'
            }`}
          >
            {msg.text}
          </div>
        )}
      </div>
    </div>
  );
}
