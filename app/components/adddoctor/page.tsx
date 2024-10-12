"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
}

interface SessionUser {
  id: string;
  name?: string;
  email?: string;
}

interface Session {
  user?: SessionUser;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; 
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const specialties = {
  'Dentist': '🦷',
  'General Physician': '👨‍⚕️',
  'Dermatologist': '🧴',
  'Pediatrician': '👶',
  'Gastroenterologist': '🍽️',
  'Neurologist': '🧠',
  'Gynecologist': '👩‍⚕️',
};

const educationLevels = ['Associate', 'Bachelor', 'Master', 'PhD'];
const feesOptions = Array.from({ length: 10 }, (_, i) => (50 + i * 50).toString());

const AddDoctorForm: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [doctorName, setDoctorName] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState('');
  const [fees, setFees] = useState('');
  const [education, setEducation] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/register');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const users = await response.json();
        setUserOptions(users);
      } catch (error: any) {
        toast.error(`Error fetching users: ${error.message}`);
      }
    };

    fetchUsers();
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEmail = e.target.value;
    const selectedUser = userOptions.find(user => user.email === selectedEmail);
    setDoctorName(selectedUser ? selectedUser.name : '');
    setDoctorEmail(selectedEmail);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Check if session is available
    if (!session) {
      toast.error('Session not found. Please log in.');
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append('name', doctorName);
    formData.append('email', doctorEmail);
    formData.append('specialty', specialty);
    formData.append('experience', experience);
    formData.append('fees', fees);
    formData.append('education', education);
    formData.append('address1', address1);
    formData.append('address2', address2);
    formData.append('aboutMe', aboutMe);
    formData.append('userId', session.user.id);
  
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post('/api/doctors', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast.success('Doctor added successfully!');
        setDoctorName('');
        setDoctorEmail('');
        setSpecialty('');
        setExperience('');
        setFees('');
        setEducation('');
        setAddress1('');
        setAddress2('');
        setAboutMe('');
        setImage(null);
      } else {
        throw new Error('Failed to add doctor');
        
      }
    } catch (error: any) {
      console.error('Error:', error.response?.data || error.message);
      toast.error('Error adding doctor. Please try again.');
      console.log({
        name: doctorName,
        email: doctorEmail,
        specialty,
        experience,
        fees,
        education,
        address1,
        address2,
        aboutMe,
        userId: session.user.id,
        image: image 
      });
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden overflow-y-hidden">
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 p-6 space-y-4 max-w-4xl mx-auto">
        {/* Image Upload */}
        <div className="flex justify-center mb-4">
          <label className="flex flex-col items-center">
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Doctor" className="w-full h-full rounded-full object-cover" />
              ) : (
                <Image src="/images/default.png" alt="default" width={100} height={100} className="object-cover bg-slate-300 rounded-full w-full h-full" />
              )}
            </div>
            <span className="text-slate-500 text-sm mt-2">Upload Image</span>
          </label>
        </div>

        {/* Doctor Email and Name */}
        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <div className="flex flex-col flex-1 mb-4 sm:mb-0">
            <label className="font-semibold mb-1">Doctor Email</label>
            <select
              value={doctorEmail}
              onChange={handleEmailChange}
              required
              className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="" disabled>Select User Email</option>
              {userOptions.map(user => (
                <option key={user.id} value={user.email}>{user.email}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-semibold mb-1">Doctor Name</label>
            <input
              type="text"
              value={doctorName}
              readOnly
              className="p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Specialty */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Specialty</label>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            required
            className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
          >
            <option value="" disabled>Select Specialty</option>
            {Object.entries(specialties).map(([key, value]) => (
              <option key={key} value={key}>{value} {key}</option>
            ))}
          </select>
        </div>

        {/* Experience and Fees */}
        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <div className="flex flex-col flex-1 mb-4 sm:mb-0">
            <label className="font-semibold mb-1">Experience</label>
            <input
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
              className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-semibold mb-1">Fees</label>
            <select
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              required
              className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="" disabled>Select Fees</option>
              {feesOptions.map(fee => (
                <option key={fee} value={fee}>${fee}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Education and Address1 */}
        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <div className="flex flex-col flex-1 mb-4 sm:mb-0">
            <label className="font-semibold mb-1">Education</label>
            <select
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              required
              className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="" disabled>Select Education Level</option>
              {educationLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-semibold mb-1">Address 1</label>
            <input
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              required
              className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Address2 */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Address 2</label>
          <input
            type="text"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* About Me */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">About Me</label>
          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            required
            className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className={`mt-4 w-32 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md 
                      hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 
                      flex items-center justify-center space-x-2 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>

      <ToastContainer />

      <footer className="mt-auto p-4 bg-gray-800 text-white text-center">
        © 2024 Your Company. All rights reserved.
      </footer>
    </div>
  );
};

export default AddDoctorForm;
