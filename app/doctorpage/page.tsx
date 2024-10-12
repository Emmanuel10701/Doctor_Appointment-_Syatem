"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { FaUserMd, FaCalendarCheck, FaBars } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';
import DoctorProfile from '../components/doctorprofile/page';

const appointments = [
  { id: 1, doctor: 'Dr. Smith', date: '2024-09-30', status: 'Confirmed', fee: 100, patientEmail: 'patient1@example.com' },
  { id: 2, doctor: 'Dr. Johnson', date: '2024-10-01', status: 'Pending', fee: 150, patientEmail: 'patient2@example.com' },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'profile'>('appointments');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);
  const [earnings, setEarnings] = useState(0);
  const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(false);

  const handleTabChange = (tab: 'appointments' | 'profile') => {
    setLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setLoading(false);
      setSidebarOpen(false);
    }, 1000);
  };

  const handleCancelAppointment = (id: number) => {
    setConfirmCancelId(id);
  };

  const confirmCancellation = async () => {
    if (confirmButtonDisabled) return;

    setConfirmButtonDisabled(true);
    try {
      const appointment = appointments.find(app => app.id === confirmCancelId);
      if (appointment) {
        await fetch(`/api/appointments/${confirmCancelId}`, { method: 'DELETE' });
        await fetch('/api/sendEmail', {
          method: 'POST',
          body: JSON.stringify({ email: appointment.patientEmail, message: 'Your appointment has been canceled.' }),
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('Cancelled appointment:', confirmCancelId);
        setConfirmCancelId(null);
      }
    } catch (error) {
      console.error('Error canceling appointment:', error);
    } finally {
      setConfirmButtonDisabled(false);
    }
  };

  const completeAppointment = async (fee: number) => {
    const appointmentId = appointments.find(app => app.fee === fee)?.id;
    if (appointmentId) {
      await fetch(`/api/appointments/${appointmentId}/confirm`, { method: 'POST' });
      setEarnings(prev => prev + fee);
    }
  };

  const closeModal = () => {
    setConfirmCancelId(null);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white border-b border-blue-300 py-4 z-50 flex items-center justify-between">
        <div className="container mx-auto flex items-center px-4 md:px-8">
          <div className="w-44 cursor-pointer flex items-center">
            <Image src="/assets/assets_frontend/logo.svg" alt="Logo" width={176} height={50} />
            <span className="ml-3 bg-white rounded-full text-blue-600 px-4 py-1 shadow-md">Doctor</span>
          </div>
          <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="flex h-screen bg-slate-100">
        <aside className={`fixed top-20 left-0 h-full w-64 border bg-slate-200 shadow-lg z-20 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <nav className="flex flex-col gap-6 p-4">
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
              Doctor Dashboard
            </h1>
            <button onClick={() => handleTabChange('appointments')} className={`flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded ${activeTab === 'appointments' ? 'font-bold text-indigo-600' : ''}`}>
              <FaCalendarCheck className="mr-2 text-indigo-600" /> Appointments
            </button>
            <button onClick={() => handleTabChange('profile')} className={`flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded ${activeTab === 'profile' ? 'font-bold text-indigo-600' : ''}`}>
              <FaUserMd className="mr-2 text-indigo-600" /> Profile
            </button>
          </nav>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={() => setSidebarOpen(false)}></div>
        )}

        <main className="flex-1 md:ml-[20%] ml-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mt-20 mb-4">
              Doctor's Dashboard       
            </h1>
            <div className="flex flex-wrap gap-4 my-5 justify-center">
              <div className="w-full sm:w-1/3 lg:w-1/4 p-4 hover:shadow-lg bg-white rounded-lg shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105">
                <h3 className="text-md text-center text-slate-600 font-bold">💰 Earnings</h3>
                <p className="text-2xl font-bold text-center text-purple-700">${earnings}</p>
              </div>
              <div className="w-full sm:w-1/3 lg:w-1/4 p-4 hover:shadow-lg bg-white rounded-lg shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105">
                <h3 className="text-md text-center text-slate-600 font-bold">📅 Appointments</h3>
                <p className="text-2xl font-bold text-center text-blue-700">{appointments.length}</p>
              </div>
              <div className="w-full sm:w-1/3 lg:w-1/4 p-4 hover:shadow-lg bg-white rounded-lg shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105">
                <h3 className="text-md text-center text-slate-600 font-bold">🧑‍🍼 Patients</h3>
                <p className="text-2xl text-center font-bold text-green-700">{appointments.length}</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center mt-20 justify-center h-full">
              <CircularProgress size={32} />
            </div>
          ) : (
            <>
              {activeTab === 'appointments' && (
                <>
                  <h2 className="text-3xl font-bold my-6 text-gray-800 shadow-lg shadow-gray-300">
                    Appointments
                  </h2>
                  <table className="min-w-full bg-white border border-gray-300 shadow-lg">
                    <thead>
                      <tr className="bg-gray-100 text-purple-700 font-semibold shadow-md shadow-gray-200">
                        <th className="py-3 px-4 border-b">Doctor</th>
                        <th className="py-3 px-4 border-b">Appointment Date</th>
                        <th className="py-3 px-4 border-b">Status</th>
                        <th className="py-3 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment, index) => (
                        <tr key={appointment.id} className={index % 2 === 0 ? 'bg-purple-50' : 'bg-green-50'}>
                          <td className="py-3 px-4 border-b text-gray-700 font-medium">{appointment.doctor}</td>
                          <td className="py-3 px-4 border-b text-gray-700 font-medium">{appointment.date}</td>
                          <td className={`py-3 px-4 border-b font-semibold ${appointment.status === 'Confirmed' ? 'text-green-600' : 'text-red-600'}`}>
                            {appointment.status}
                          </td>
                          <td className="py-3 px-4 border-b">
                            {appointment.status === 'Confirmed' ? (
                              <>
                                <button className="text-red-600 font-semibold hover:underline" onClick={() => handleCancelAppointment(appointment.id)}>Cancel</button>
                                <button className="text-green-600 font-semibold ml-4 hover:underline" onClick={() => completeAppointment(appointment.fee)}>Complete</button>
                              </>
                            ) : (
                              <span>{appointment.status}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h1 className="text-2xl text-center font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mt-4 mb-4">
                    Profile           
                  </h1>
                  <div className='w-full flex '>
                    <DoctorProfile />
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Confirmation Modal */}
        {confirmCancelId !== null && (
          <div className="fixed inset-0 flex items-center justify-center z-30 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Confirm Cancellation</h2>
              <p>Are you sure you want to cancel this appointment?</p>
              <div className="mt-4 flex justify-end">
                <button className={`bg-red-600 text-white px-4 py-2 rounded mr-2 ${confirmButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={confirmCancellation} disabled={confirmButtonDisabled}>Confirm</button>
                <button className="bg-gray-300 px-4 py-2 rounded" onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
