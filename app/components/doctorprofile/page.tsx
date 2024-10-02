import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

interface DoctorDetails {
  name: string;
  email: string;
  specialty: string;
  experience: string;
  fees: string;
  education: string;
  address1: string;
  address2: string;
  aboutMe: string;
  image: string | File;
}

const randomDoctorDetails: DoctorDetails = {
  name: 'Dr. John Doe',
  email: 'dr.johndoe@example.com',
  specialty: 'Dentist',
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
  const [isSaving, setIsSaving] = useState<boolean>(false);
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
    if (!doctorDetails.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    const formData = new FormData();
    Object.entries(doctorDetails).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as any);
      }
    });

    setIsSaving(true);

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
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const imageUrl = typeof doctorDetails.image === 'string' 
    ? doctorDetails.image 
    : URL.createObjectURL(doctorDetails.image);

  return (
    <div className="flex flex-col justify-center w-[80%] mx-auto mt-[5%] items-center h-screen">
      <ToastContainer />
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-6xl">
        <div className="flex flex-col items-center mb-6">
          <img src={imageUrl} alt="Doctor" className="h-32 w-32 rounded-full mb-4" />
          <h3 className="text-xl font-bold mb-2">{doctorDetails.name}</h3>
        </div>

        {isEditing ? (
          <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
            <div className="flex-1 pr-2">
              {['name', 'email', 'specialty', 'experience', 'fees'].map((key) => (
                <div key={key}>
                  <label className="block text-gray-700 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                  <input
                    type="text"
                    name={key}
                    value={doctorDetails[key as keyof DoctorDetails] as string}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              ))}
            </div>
            <div className="flex-1 pl-2">
              {['education', 'address1', 'address2', 'aboutMe'].map((key) => (
                <div key={key}>
                  <label className="block text-gray-700 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                  <input
                    type="text"
                    name={key}
                    value={doctorDetails[key as keyof DoctorDetails] as string}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-700 font-semibold">Profile Image:</label>
                <label className="cursor-pointer">
                  <img src={imageUrl} alt="Doctor" className="h-24 w-24 rounded-full mb-2" />
                  <input type="file" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
            <div className="flex-1 pr-2">
              {['name', 'email', 'specialty', 'experience', 'fees'].map((key) => (
                <div key={key}>
                  <label className="block text-gray-700 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                  <span className="text-gray-800 font-medium">{doctorDetails[key as keyof DoctorDetails]}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 pl-2">
              {['education', 'address1', 'address2', 'aboutMe'].map((key) => (
                <div key={key}>
                  <label className="block text-gray-700 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                  <span className="text-gray-800 font-medium">{doctorDetails[key as keyof DoctorDetails]}</span>
                </div>
              ))}
              <div>
                <label className="block text-gray-700 font-semibold">Profile Image:</label>
                <img src={imageUrl} alt="Doctor" className="h-24 w-24 rounded-full mb-2" />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6">
          {isEditing ? (
            <Button
              onClick={handleSave}
              variant="outlined"
              className="flex items-center rounded-full border-transparent text-blue-500 hover:bg-blue-100 transition duration-300 mt-4 p-2"
              disabled={isSaving}
            >
              {isSaving ? <CircularProgress size={24} className="mr-2" /> : null}
              {isSaving ? 'Submitting...' : 'Save Profile'}
            </Button>
          ) : (
            <Button
              onClick={handleEdit}
              variant="outlined"
              className="flex items-center rounded-full border-transparent text-green-500 hover:bg-green-100 transition duration-300 mt-4 p-2"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
