import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DoctorDetails {
  name: string;
  email: string;
  specialty: string;
  password: string;
  experience: string;
  fees: string;
  education: string;
  address1: string;
  address2: string;
  aboutMe: string;
  image: string | File; // Keep it as string | File for input handling
}

const randomDoctorDetails: DoctorDetails = {
  name: 'Dr. John Doe',
  email: 'dr.johndoe@example.com',
  specialty: 'Dentist',
  password: 'securepassword',
  experience: '12 years',
  fees: '150',
  education: 'DDS, University of Dental Science',
  address1: '456 Elm St',
  address2: 'Suite 200',
  aboutMe: 'Dedicated to providing the best dental care.',
  image: '/assets/assets_frontend/doc7.png',
};

const DoctorProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails>(randomDoctorDetails);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDoctorDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setDoctorDetails((prev) => ({ ...prev, image: files[0] }));
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    const formData = new FormData();
    Object.entries(doctorDetails).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as any);
      }
    });

    try {
      const response = await fetch('/api/doctor/update', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update profile');
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(`Error updating profile: ${error.message}`);
    } finally {
      setIsEditing(false);
    }
  };

  const imageUrl = typeof doctorDetails.image === 'string' 
    ? doctorDetails.image 
    : URL.createObjectURL(doctorDetails.image);

  return (
    <div className="flex flex-col justify-center items-center mt-20 h-screen">
      <ToastContainer />
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl">

        <div className="flex flex-col md:flex-row  md:space-x-6">
          {/* First Part: Basic Information */}
          <div className="flex-1 mb-6">
            <h3 className="text-lg font-bold mb-2">Basic Information</h3>
            {['name', 'email', 'specialty', 'password', 'experience', 'fees'].map((key) => (
              <div key={key} className="mb-4">
                <label className="block text-gray-700 font-bold">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                {isEditing ? (
                  <input
                    type={key === 'password' ? 'password' : 'text'}
                    name={key}
                    value={doctorDetails[key as keyof DoctorDetails] as string}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                ) : (
                  <span className="font-semibold text-gray-800">
                    {doctorDetails[key as keyof DoctorDetails] || 'N/A'}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Second Part: Additional Information */}
          <div className="flex-1 mb-6">
            <h3 className="text-lg font-bold mb-2">Additional Information</h3>
            {['education', 'address1', 'address2', 'aboutMe'].map((key) => (
              <div key={key} className="mb-4">
                <label className="block text-gray-700 font-bold">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={doctorDetails[key as keyof DoctorDetails] as string}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                ) : (
                  <span className="font-semibold text-gray-800">
                    {doctorDetails[key as keyof DoctorDetails] || 'N/A'}
                  </span>
                )}
              </div>
            ))}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Profile Image</label>
              <label className="cursor-pointer">
                <img
                  src={imageUrl}
                  alt="Doctor"
                  className="h-20 w-20 rounded-full"
                />
                {isEditing && (
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Edit and Save Buttons */}
        <div className="flex justify-between mt-6">
          {isEditing ? (
            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
              Save Profile
            </button>
          ) : (
            <button onClick={handleEdit} className="bg-green-500 text-white px-4 py-2 rounded">
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
