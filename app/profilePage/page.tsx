"use client";

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { CircularProgress } from '@mui/material';

interface PatientDetails {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  address: string;
  aboutMe: string;
  image: string | File;
}

const PatientProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    address: '',
    aboutMe: '',
    image: '/images/default.png',
  });

  const [isDataSubmitted, setIsDataSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPatientDetails((prev) => ({ ...prev, image: files[0] }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(patientDetails).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as any);
      }
    });

    try {
      const url = patientDetails.name ? '/api/patient/update' : '/api/patient/create';
      const method = patientDetails.name ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to save profile');
      toast.success('Profile saved successfully');
      setIsDataSubmitted(true);
    } catch (error: any) {
      toast.error(`Error saving profile: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
  };

  const imageUrl = typeof patientDetails.image === 'string'
    ? patientDetails.image
    : URL.createObjectURL(patientDetails.image);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col justify-center items-center mt-20 h-screen">
      <ToastContainer />
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl flex flex-col items-center">
        {/* Image Section */}
        <div className="flex-none mb-6">
          <label className="cursor-pointer bg-slate-500 rounded-full">
            <Image
              src={imageUrl}
              alt="Patient"
              width={100}
              height={100}
              className="h-36 w-36  bg-slate-300 rounded-full object-cover mx-auto"
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Form Section */}
        <div className="flex w-full">
          {/* Left Column */}
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-bold mb-2">Patient Information</h3>
            <h4 className="text-md font-semibold mb-2">Contact Information</h4>
            {['name', 'email', 'phone'].map((key) => (
              <div key={key} className="mb-4">
                <label className="block text-gray-700 font-bold">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  name={key}
                  value={patientDetails[key as keyof PatientDetails] as string}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  disabled={!isEditing} // Disable if not editing
                />
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex-1 pl-4">
            <h4 className="text-md font-semibold mb-2">Additional Information</h4>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Birth Date</label>
              <input
                type="date"
                name="birthDate"
                value={patientDetails.birthDate}
                onChange={handleChange}
                max={today}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                disabled={!isEditing} // Disable if not editing
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Gender</label>
              <select
                name="gender"
                value={patientDetails.gender}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                disabled={!isEditing} // Disable if not editing
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {['address', 'aboutMe'].map((key) => (
              <div key={key} className="mb-4">
                <label className="block text-gray-700 font-bold">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  name={key}
                  value={patientDetails[key as keyof PatientDetails] as string}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  disabled={!isEditing} // Disable if not editing
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-around items-center mt-6 w-full">
          {!isDataSubmitted && !isSubmitting && (
            <button 
              onClick={handleSave} 
              className="bg-transparent text-blue-500 border border-blue-500 px-4 py-2 rounded-full"
            >
              Submit
            </button>
          )}
          {isSubmitting && (
            <div className="flex  rounded-full px-4 py-3 border items-center">
              <CircularProgress size={24} className="mr-2" />
              <span>Submitting...</span>
            </div>
          )}
          {isDataSubmitted && !isSubmitting && (
            <button 
              onClick={handleEdit} 
              className="bg-transparent text-green-500 border border-green-500 px-4 py-2 rounded-full"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
