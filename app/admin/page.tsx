"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUserMd, FaCalendarCheck, FaListUl, FaPlus, FaBars } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';
import AddDoctorForm from '../components/adddoctor/page'; // Adjust the path if necessary

// Sample data
const appointments = [
  { id: 1, doctor: 'Dr. Smith', date: '2024-09-30', status: 'Confirmed' },
  { id: 2, doctor: 'Dr. Johnson', date: '2024-10-01', status: 'Pending' },
  { id: 3, doctor: 'Dr. Williams', date: '2024-10-02', status: 'Cancelled' },
];

const patients = [
  { id: 1, name: 'John Doe', age: 30 },
  { id: 2, name: 'Jane Smith', age: 25 },
  { id: 3, name: 'Alice Johnson', age: 40 },
];

const doctors = [
  { id: 1, name: 'Dr. Smith', specialty: 'Dentist', image: '/assets/assets_frontend/doc1.png', available: true },
  { id: 2, name: 'Dr. Jones', specialty: 'General Physician', image: '/assets/assets_frontend/doc2.png', available: false },
  { id: 3, name: 'Dr. Brown', specialty: 'Dermatologist', image: '/assets/assets_frontend/doc3.png', available: true },
  { id: 4, name: 'Dr. Williams', specialty: 'Pediatrician', image: '/assets/assets_frontend/doc4.png', available: true },
  { id: 5, name: 'Dr. Johnson', specialty: 'Gastroenterologist', image: '/assets/assets_frontend/doc5.png', available: false },
  { id: 6, name: 'Dr. Lee', specialty: 'Neurologist', image: '/assets/assets_frontend/doc6.png', available: true },
  { id: 7, name: 'Dr. Kim', specialty: 'Gynecologist', image: '/assets/assets_frontend/doc7.png', available: true },
  { id: 8, name: 'Dr. Patel', specialty: 'Dentist', image: '/assets/assets_frontend/doc8.png', available: true },
  { id: 9, name: 'Dr. Garcia', specialty: 'Gastroenterologist', image: '/assets/assets_frontend/doc9.png', available: true },
  { id: 10, name: 'Dr. Martinez', specialty: 'Dermatologist', image: '/assets/assets_frontend/doc10.png', available: false },
  { id: 11, name: 'Dr. Robert', specialty: 'Gynecologist', image: '/assets/assets_frontend/doc11.png', available: true },
  { id: 12, name: 'Dr. James', specialty: 'Gastroenterologist', image: '/assets/assets_frontend/doc12.png', available: true },
  { id: 13, name: 'Dr. Mercy', specialty: 'Dentist', image: '/assets/assets_frontend/doc15.png', available: true },
  { id: 14, name: 'Dr. John', specialty: 'Dermatologist', image: '/assets/assets_frontend/doc13.png', available: true },
  { id: 15, name: 'Dr. Erick', specialty: 'Pediatrician', image: '/assets/assets_frontend/doc14.png', available: false },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'patients' | 'doctors' | 'addDoctor'>('appointments');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabChange = (tab: 'appointments' | 'patients' | 'doctors' | 'addDoctor') => {
    setLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setLoading(false);
      setSidebarOpen(false);
    }, 1000); // Simulate a loading delay
  };

  return (
    <div className="flex h-screen ml-0 bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full mt-20 bg-[url('/images/image.jpeg')] bg-cover bg-center bg-white shadow-lg transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:w-64 z-20`}>
  <nav className="flex flex-col p-4">
    <h1 className="text-xl font-bold mt-20 mb-4">👲 Admin Dashboard</h1>
    <button onClick={() => handleTabChange('appointments')} className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded">
      <FaCalendarCheck className="mr-2" /> Appointments
    </button>
    <button onClick={() => handleTabChange('patients')} className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded">
      <FaUserMd className="mr-2" /> Patients
    </button>
    <button onClick={() => handleTabChange('doctors')} className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded">
      <FaListUl className="mr-2" /> Doctors List
    </button>
    <button onClick={() => handleTabChange('addDoctor')} className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded">
      <FaPlus className="mr-2" /> Add Doctor
    </button>
  </nav>
</aside>



      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={() => setSidebarOpen(false)}></div>
      )}

      <main className="flex-1 md:ml-[20%] ml-1 p-6 overflow-y-auto"> {/* Add overflow-y-auto for scrolling */}
        <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>
          <FaBars className="text-2xl" />
        </button>
        <h1 className="text-3xl font-semibold mb-6 mt-20">Welcome to the Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="p-6 bg-blue-100 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">📅 Total Appointments</h3>
            <p className="text-2xl">{appointments.length}</p>
          </div>
          <div className="p-6 bg-green-100 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">👨‍⚕️ Total Doctors</h3>
            <p className="text-2xl">{doctors.length}</p>
          </div>
          <div className="p-6 bg-orange-100 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">🧑‍🍼 Total Patients</h3>
            <p className="text-2xl">{patients.length}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center mt-20  justify-center h-full">
            <CircularProgress size={32}/>
          </div>
        ) : (
          <>
            {/* Conditional Rendering Based on Active Tab */}
            {activeTab === 'appointments' && (
              <>
                <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 border-b">Doctor</th>
                      <th className="py-2 border-b">Appointment Date</th>
                      <th className="py-2 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="py-2 border-b">{appointment.doctor}</td>
                        <td className="py-2 border-b">{appointment.date}</td>
                        <td className="py-2 border-b">{appointment.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeTab === 'patients' && (
              <>
                <h2 className="text-2xl font-semibold mb-4">Patients</h2>
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 border-b">Name</th>
                      <th className="py-2 border-b">Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td className="py-2 border-b">{patient.name}</td>
                        <td className="py-2 border-b">{patient.age}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeTab === 'doctors' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {doctors.map(doctor => (
                  <div key={doctor.id} className="border rounded-lg overflow-hidden shadow-md transition duration-200 hover:outline-1 hover:shadow-lg">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      width={200}
                      height={150}
                      className="object-cover w-full"
                    />
                    <div className="p-4">
                      <h2 className="text-lg font-semibold text-green-700">
                        {doctor.name} {[doctor.specialty] || '❓'}
                      </h2>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      <p className={`mt-2 text-sm font-bold ${doctor.available ? 'text-green-400' : 'text-red-400'}`}>
                        {doctor.available ? 'Available' : 'Not Available'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'addDoctor' && <AddDoctorForm />}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
