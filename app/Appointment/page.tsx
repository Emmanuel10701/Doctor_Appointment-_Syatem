"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const AppointmentDetail: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid'>( 'pending' ); // Track payment status
  const modalRef = useRef<HTMLDivElement>(null);

  const doctor = {
    name: 'Dr. Smith',
    specialty: 'Dentist 🦷',
    degree: 'DDS (Doctor of Dental Surgery)',
    description: 'Dr. Smith has over 10 years of experience in providing dental care and is committed to ensuring the best outcomes for his patients. He believes in a patient-centered approach, focusing on education and preventive care to empower patients to take charge of their oral health.',
    image: '/assets/assets_frontend/doc1.png',
  };

  const appointmentFee = 50; // Define appointment fee
  const appointment = { id: 1, date: '2024-10-01', time: '10:00 AM', fee: appointmentFee }; // Single appointment

  const handleBookAppointment = () => {
    if (selectedDate && selectedTime) {
      setModalOpen(true);
    } else {
      alert('Please select both date and time.');
    }
  };

  const confirmAppointment = () => {
    setAppointmentConfirmed(true);
    setModalOpen(false);
    console.log({
      doctor: doctor.name,
      date: selectedDate,
      time: selectedTime,
      fee: appointmentFee,
    });
  };

  const handleCancelAppointment = () => {
    // Mock API call to cancel the appointment
    console.log(`Cancelling appointment ID: ${appointment.id}`);
    alert('Appointment has been cancelled.');
  };

  const handlePayment = async (method: 'stripe' | 'paypal') => {
    // Mock API call for payment
    console.log(`Processing payment through ${method}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // Set payment status to paid
    setPaymentStatus('paid');
    setPaymentDropdownOpen(false); // Close dropdown after payment

    // Call the API to save payment details (mock)
    console.log('Payment completed:', {
      method,
      appointmentId: appointment.id,
      userDetails: {
        doctor: doctor.name,
        date: appointment.date,
        time: appointment.time,
        fee: appointment.fee,
      },
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paymentDropdownOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setPaymentDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [paymentDropdownOpen]);

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
            <div className="flex justify-between items-center">
              <div>
                <p>Date: {appointment.date}</p>
                <p>Time: {appointment.time}</p>
                <p>Fee: <span className='font-extrabold text-green-700'>${appointment.fee}</span></p>
              </div>
               <div className="flex flex-col mb-20 ml-10"> {/* Flex container for buttons */}
                <button
                    onClick={handleCancelAppointment}
                    className="text-red-500 outline-black hover:bg-red-400 rounded-full py-2 px-4 hover:text-white transition duration-200 mb-2"
                >
                    Cancel Appointment
                </button>
                {paymentStatus === 'pending' ? (
                    <div className="relative"> {/* Relative positioning for dropdown */}
                    <button
                        onClick={() => setPaymentDropdownOpen(!paymentDropdownOpen)}
                        className="bg-blue-500 rounded-full text-white py-2 px-4 hover:bg-blue-600 transition duration-200"
                    >
                        Pay Appoinemt
                    </button>
                    {paymentDropdownOpen && (
                        <div className="absolute mt-2 p-2 border rounded bg-white shadow-lg z-50"> {/* Dropdown styling */}
                        <button onClick={() => handlePayment('stripe')} className="flex bg-slate-300 hover:bg-slate-400 px-4 py-2 rounded-md hover:outline-1 items-center text-blue-600 mb-2">
                            <Image src="/assets/assets_frontend/stripe_logo.png" alt="Stripe" width={50} height={30} />
                            <span className="ml-2"></span>
                        </button>
                        <button onClick={() => handlePayment('paypal')} className="flex items-center bg-slate-300 px-4 py-2 rounded-md  hover:bg-slate-400 hover:outline-1 text-blue-600">
                            <Image src="/assets/assets_frontend/payapal.png" alt="PayPal" width={50} height={30} />
                            <span className="ml-2"></span>
                        </button>
                        </div>
                    )}
                    </div>
                ) : (
                    <button className="bg-green-500 text-white py-2 rounded-full px-4 " disabled>
                    Paid
                    </button>
                )}
                </div>


            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentDetail;
