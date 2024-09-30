import React, { useState } from 'react';
import Image from "next/image"
const specialties = {
  'Dentist': '🦷',
  'General Physician': '👨‍⚕️',
  'Dermatologist': '🧴',
  'Pediatrician': '👶',
  'Gastroenterologist': '🍽️',
  'Neurologist': '🧠',
  'Gynecologist': '👩‍⚕️',
};

const educationLevels = [
  'Associate',
  'Bachelor',
  'Master',
  'PhD'
];

const feesOptions = Array.from({ length: 10 }, (_, i) => (50 + i * 50).toString());

const AddDoctorForm: React.FC = () => {
  const [doctorName, setDoctorName] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('');
  const [fees, setFees] = useState('');
  const [education, setEducation] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', doctorName);
    formData.append('email', doctorEmail);
    formData.append('specialty', specialty);
    formData.append('password', password);
    formData.append('experience', experience);
    formData.append('fees', fees);
    formData.append('education', education);
    formData.append('address1', address1);
    formData.append('address2', address2);
    formData.append('aboutMe', aboutMe);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('YOUR_API_ENDPOINT_HERE', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log('Success:', result);
      // Reset the form or handle success
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 p-6 space-y-4">
        <div className="flex justify-center mb-4">
          <label className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Doctor" className="w-full h-full rounded-full object-cover" />
              ) : (
                <Image
                src="/images/default.png"
                alt="default"
                width={100}
                height={100}
                className="object-cover rounded-full w-full"
              />
              
              )}
             
            </div>
            <span className=" text-slate-500 text-xl text-semibold">
                upload image
             </span>
            
          </label>
        </div>

        <div className="flex space-x-6">
          <div className="flex flex-col flex-1">
            <label className="font-semibold mb-1">Doctor Name</label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              required
              className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-semibold mb-1">Doctor Email</label>
            <input
              type="email"
              value={doctorEmail}
              onChange={(e) => setDoctorEmail(e.target.value)}
              required
              className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex flex-col flex-1">
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
          <div className="flex flex-col flex-1">
            <label className="font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex flex-col flex-1">
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

        <div className="flex space-x-6">
          <div className="flex flex-col flex-1">
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

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Address 2</label>
          <input
            type="text"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">About Me</label>
          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            required
            className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded w-32 self-center">
          Submit
        </button>
      </form>

      <footer className="mt-auto p-4 bg-gray-800 text-white text-center">
        © 2024 Your Company. All rights reserved.
      </footer>
    </div>
  );
};

export default AddDoctorForm;
