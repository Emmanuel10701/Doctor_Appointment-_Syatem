"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { z } from 'zod';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
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

const doctorSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email format"),
  specialty: z.string().nonempty("Specialty is required"),
  experience: z.string().nonempty("Experience is required"),
  fees: z.string().nonempty("Fees are required"),
  education: z.string().nonempty("Education level is required"),
  address1: z.string().nonempty("Address 1 is required"),
  address2: z.string().optional(),
  aboutMe: z.string().nonempty("About Me is required"),
  image: z.string().url("Image URL must be a valid URL"),
});

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

  const [doctorName, setDoctorName] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState('');
  const [fees, setFees] = useState('');
  const [education, setEducation] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // New state for userId
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
        alert(`Error fetching users: ${error.message}`);
      }
    };

    fetchUsers();
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEmail = e.target.value;
    const selectedUser = userOptions.find(user => user.email === selectedEmail);
    if (selectedUser) {
      setDoctorName(selectedUser.name);
      setDoctorEmail(selectedEmail);
      setSelectedUserId(selectedUser.id); // Set userId
    } else {
      setDoctorName('');
      setSelectedUserId(null); // Clear userId
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    if (!session || !session.user) {
      alert('Session not found. Please log in.');
      setLoading(false);
      return;
    }
  
    if (!selectedUserId) {
      alert('User ID not found. Please select a valid email.');
      setLoading(false);
      return;
    }
  
    const formData = {
      name: doctorName,
      email: doctorEmail,
      specialty,
      experience,
      fees,
      education,
      address1,
      address2,
      aboutMe,
      userId: selectedUserId,
      image: imageUrl,
    };
  
    console.log("Form Data:", formData); // Log form data for debugging
  
    const validationResult = doctorSchema.safeParse(formData);
    
    if (!validationResult.success) {
      validationResult.error.errors.forEach((error) => {
        alert(error.message);
      });
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post('/api/doctors', formData);
      if (response.status === 201) {
        alert('Doctor added successfully!');
        // Reset form fields...
      } else {
        alert('Failed to add doctor');
      }
    } catch (error: any) {
      console.error("Error adding doctor:", error); // Log the error for debugging
      alert(`Error adding doctor: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col overflow-y-scroll scrollbar-hide overflow-hidden">
      <form onSubmit={handleSubmit} className="flex flex-col p-6 space-y-4 max-w-4xl mx-auto">
        {/* Image URL Input */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Image URL</label>
          <input
            type="text"
            value={imageUrl || ''}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
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

        {/* Address2 and About Me */}
        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <div className="flex flex-col flex-1 mb-4 sm:mb-0">
            <label className="font-semibold mb-1">Address 2</label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-semibold mb-1">About Me</label>
            <textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              required
              className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 text-white py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Adding...' : 'Add Doctor'}
        </button>
      </form>
    </div>
  );
};

export default AddDoctorForm;
