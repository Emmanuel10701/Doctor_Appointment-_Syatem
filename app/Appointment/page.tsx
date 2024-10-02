"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { CircularProgress } from '@mui/material';

const AppointmentDetail: React.FC = () => {
  const { data: session } = useSession() as { data: { user: { id: string } } | null };
  const [appointment, setAppointment] = useState<{ id: number; date: string; time: string; fee: number } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid'>('pending');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const doctor = {
    name: 'Dr. Smith',
    specialty: 'Dentist 🦷',
    degree: 'DDS (Doctor of Dental Surgery)',
    description: 'Dr. Smith has over 10 years of experience in providing dental care.',
    image: '/assets/assets_frontend/doc1.png',
  };

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!session) return;

      try {
        const response = await fetch(`/api/appointments?userId=${session.user.id}`);
        const data = await response.json();
        if (data) {
          setAppointment(data);
        }
      } catch (error) {
        console.error('Error fetching appointment:', error);
      }
    };

    fetchAppointment();
  }, [session]);

  const handlePayment = async (method: 'stripe' | 'paypal', cardDetails: any) => {
    const url = method === 'stripe' ? '/api/payments/stripe' : '/api/payments/paypal';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: appointment?.id,
          fee: appointment?.fee,
          cardDetails,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const data = await response.json();
      console.log('Payment successful:', data);
      setPaymentStatus('paid');
      setPaymentModalOpen(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment.');
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row p-8 mt-32 mx-auto max-w-6xl">
        <div className="w-full md:w-2/6 mb-4 md:mb-0">
          <Image
            src={doctor.image}
            alt={doctor.name}
            width={300}
            height={300}
            className="object-cover bg-blue-500 rounded-md shadow-lg"
          />
        </div>

        <div className="w-full md:w-4/6 md:pl-4">
          <div className='border p-4 rounded-lg shadow-md bg-white mb-4'>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              {doctor.name}
              <Image
                src="/images/verify.png"
                alt="verify"
                width={24}
                height={24}
                className="object-cover bg-slate-50 ml-4 rounded-full"
              />
            </h1>
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">{doctor.specialty}</h2>
            <p className="text-md font-bold text-green-600 mb-1">Degree: {doctor.degree}</p>
            <p className="text-sm text-slate-500 mb-4">{doctor.description}</p>
          </div>

          <div className="border p-4 rounded-lg shadow-md bg-white">
            <h3 className='text-start my-2 text-indigo-600 text-lg font-bold'>
              Appointment Details
            </h3>
            {appointment ? (
              <div className="flex justify-between items-center">
                <div>
                  <p>Date: {appointment.date}</p>
                  <p>Time: {appointment.time}</p>
                  <p>Fee: <span className='font-extrabold text-green-700'>${appointment.fee}</span></p>
                </div>
                <div className="flex flex-col mb-20 ml-10">
                  {paymentStatus === 'pending' ? (
                    <button
                      onClick={() => {
                        if (session) {
                          setPaymentModalOpen(true);
                        } else {
                          setLoginModalOpen(true);
                        }
                      }}
                      className="bg-blue-500 rounded-full text-white py-2 px-4 hover:bg-blue-600 transition duration-200"
                    >
                      Pay Appointment
                    </button>
                  ) : (
                    <button className="bg-green-500 text-white py-2 rounded-full px-4" disabled>
                      Paid
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p>No appointment details available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Simple Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl mb-4">Payment Details</h2>
            <form>
              <div className="mb-4">
                <label className="block mb-1">Card Number</label>
                <input type="text" className="border p-2 rounded w-full" required />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Expiry Date (MM/YY)</label>
                <input type="text" className="border p-2 rounded w-full" required />
              </div>
              <div className="mb-4">
                <label className="block mb-1">CVC</label>
                <input type="text" className="border p-2 rounded w-full" required />
              </div>
              <button
                type="button"
                onClick={() => handlePayment('stripe', { cardNumber: '', expiryDate: '', cvc: '' })} // Adjust to capture card details
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Pay Now
              </button>
            </form>
            <button onClick={() => setPaymentModalOpen(false)} className="mt-4 text-red-500">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-2xl">
            <h3 className="text-lg font-semibold">Login Required</h3>
            <p className="mt-2">Please log in to confirm your appointment.</p>
            <div className="flex justify-center mt-4">
              <button onClick={() => window.location.href = "http://localhost:3000/login"} className="bg-transparent border border-blue-500 text-blue-500 py-3 px-6 rounded-full shadow hover:bg-blue-500 hover:text-white transition duration-200">
                Login
              </button>
              <button onClick={() => setLoginModalOpen(false)} className="bg-transparent border border-red-500 text-red-500 py-3 px-6 rounded-full shadow hover:bg-red-500 hover:text-white transition duration-200 ml-2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentDetail;
