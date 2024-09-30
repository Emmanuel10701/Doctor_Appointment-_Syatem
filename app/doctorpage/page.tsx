"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { FaUserMd, FaCalendarCheck, FaBars } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';
import AddDoctorForm from '../components/adddoctor/page'; // Adjust the path if necessary

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
    }, 1000); // Simulate a loading delay
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
        // API call to cancel appointment
        await fetch(`/api/appointments/${confirmCancelId}`, {
          method: 'DELETE',
        });

        // Send email to the patient
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
    // API call to confirm appointment
    const appointmentId = appointments.find(app => app.fee === fee)?.id;
    if (appointmentId) {
      await fetch(`/api/appointments/${appointmentId}/confirm`, {
        method: 'POST',
      });

      // Increase earnings
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
        </div>
      </div>

      <div className="flex h-screen bg-slate-100">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-0 h-full mt-20 border bg-slate-200 shadow-lg transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:w-64 z-20`}>
          <nav className="flex flex-col gap-6 p-4">
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mt-20 mb-4">
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

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={() => setSidebarOpen(false)}></div>
        )}

        <main className="flex-1 md:ml-[20%] ml-1 p-6 overflow-y-auto">
          <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>
            <FaBars className="text-2xl" />
          </button>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mt-20 mb-4">
            Welcome to Dashboard       
          </h1>

          <div className="mb-6">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mt-20 mb-4">
        Doctor's Dashboard       
     </h1>              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center gap-6 mb-6">
                <div className="p-6 hover:shadow-lg bg-white rounded-lg shadow-md">
                  <h3 className="text-md text-center text-slate-600 font-bold">💰 Earnings</h3>
                  <p className="text-2xl font-bold text-center text-purple-700">${/* Earnings Amount */} 0</p>
                </div>
                <div className="p-6 bg-white hover:shadow-lg rounded-lg shadow-md">
                  <h3 className="text-md text-center text-slate-600 font-bold">📅 Appointments</h3>
                  <p className="text-2xl font-bold text-center text-blue-700">{appointments.length}</p>
                </div>
                <div className="p-6 bg-white hover:shadow-lg rounded-lg shadow-md">
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
                  <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 border-b">Doctor</th>
                        <th className="py-2 border-b">Appointment Date</th>
                        <th className="py-2 border-b">Status</th>
                        <th className="py-2 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="py-2 border-b">{appointment.doctor}</td>
                          <td className="py-2 border-b">{appointment.date}</td>
                          <td className="py-2 border-b">{appointment.status}</td>
                          <td className="py-2 border-b">
                            {appointment.status === 'Confirmed' ? (
                              <>
                                <button className="text-red-600" onClick={() => handleCancelAppointment(appointment.id)}>Cancel</button>
                                <button className="text-green-600 ml-2" onClick={() => completeAppointment(appointment.fee)}>Complete</button>
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
                  <h2 className="text-2xl font-semibold mb-4">Profile</h2>
                  {/* Profile update form goes here */}
                  <p>Profile details can be updated here.</p>
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
