'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

interface ProfileUpdateFormProps {
  email: string;
}

export default function ProfileUpdateForm({ email }: ProfileUpdateFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; success: boolean }>({
    text: '',
    success: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ text: '', success: false });
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setMsg({ text: 'Passwords do not match.', success: false });
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/employee/Profile/confirm?employeeEmail=${encodeURIComponent(email)}`,
        formData
      );

      setMsg({ text: 'Profile updated successfully!', success: true });
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error: any) {
      setMsg({
        text:
          (error.response && error.response.data) ||
          'Update failed. Please try again.',
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-10 max-w-md w-full text-white flex flex-col gap-6 items-center">
      <Image
        src="/logo.png" // Replace with your actual logo path
        alt="Company Logo"
        width={120}
        height={120}
        className="mb-4 invert"
      />
      <h2 className="text-3xl font-extrabold">Complete Your Profile</h2>
      <p className="text-gray-300 text-center">
        Please fill in your details to set up your account.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
          className="p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-gray-400"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
          className="p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-gray-400"
        />
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          className="p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-gray-400"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-gray-400"
        />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
          className="p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-gray-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#f06e04] hover:bg-[#d65f03] active:bg-[#c05403] text-white font-bold py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Update Profile'}
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
  );
}
