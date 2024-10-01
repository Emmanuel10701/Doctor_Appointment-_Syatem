"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'next/navigation';
import { doctorsData } from '../../components/data/page'; // Adjust the path as needed

const AppointmentDetail: React.FC = () => {
  const { id } = useParams(); // Get the doctor id from the URL
  const [doctor, setDoctor] = useState<any>(null);
  
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const selectedDoctor = doctorsData.find((doc) => doc.id === Number(id));
      setDoctor(selectedDoctor);
      setLoading(false); // Set loading to false after doctor is found
    }
  }, [id]);

  const appointmentFee = 50; // Define appointment fee
  const times = ['6:00 AM', '8:00 AM', '10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

  const relatedDoctors = [
    { name: 'Dr. Johnson', specialty: 'Dentist 🦷', image: '/assets/assets_frontend/doc2.png' },
    { name: 'Dr. Lee', specialty: 'Dentist 🦷', image: '/assets/assets_frontend/doc3.png' },
    { name: 'Dr. Brown', specialty: 'Dentist 🦷', image: '/assets/assets_frontend/doc4.png' },
    { name: 'Dr. Garcia', specialty: 'Dentist 🦷', image: '/assets/assets_frontend/doc5.png' },
  ];

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
      doctor: doctor?.name,
      specialty: doctor?.specialty,
      date: selectedDate,
      time: selectedTime,
      fee: appointmentFee,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalOpen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div> {/* Add your loading spinner here */}
        <style jsx>{`
          .loader {
            border: 8px solid #f3f3f3; /* Light grey */
            border-top: 8px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    ); // Loading spinner while fetching doctor data
  }

  if (!doctor) {
    return <div>Doctor not found.</div>; // Handle case where doctor is not found
  }

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
          <div className='border p-4 rounded-lg shadow-md bg-white'>
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
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">{doctor.specialty}<span className='text-slate-500'>(2 years)</span></h2>
            <p className="text-md font-bold text-green-600 mb-1">
              Degree: <span className='font-semibold'>{doctor.degree}</span> 
            </p>
            <h3 className='text-center my-2 text-orange-600 text-lg font-bold'>About 🤵</h3>
            <p className="text-sm text-slate-500 mb-4">{doctor.description}</p>
            <h3 className='text-start my-2 text-indigo-600 text-lg font-bold'>Appointment fee <span className='font-extrabold text-green-700'>${appointmentFee}</span></h3>
          </div>

          <h3 className="text-lg font-semibold mb-2 mt-4">Select Date:</h3>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            className="border border-indigo-600 rounded p-2 mb-4 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            dateFormat="MMMM d, yyyy"
            placeholderText='select date'
          />

          <h3 className="text-lg font-semibold mb-2">Select Time:</h3>
          <div className="flex flex-wrap mb-4">
            {times.map((time, index) => (
              <button
                key={index}
                onClick={() => setSelectedTime(time)}
                className={`m-1 py-2 px-4 rounded transition duration-200 
                  ${selectedTime === time ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
              >
                {time}
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button onClick={handleBookAppointment} className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-6 rounded shadow-lg hover:shadow-xl transition duration-200">
              Book Appointment
            </button>
          </div>

          {appointmentConfirmed && (
            <div className="mt-4 text-green-600">
              <p>Appointment booked successfully for {doctor.name}!</p>
              <p>Date: {selectedDate?.toLocaleDateString()}</p>
              <p>Time: {selectedTime}</p>
            </div>
          )}

          {modalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold">Confirm Appointment</h3>
                <p className="mt-2">Doctor: {doctor.name}</p>
                <p>Date: {selectedDate?.toLocaleDateString()}</p>
                <p>Time: {selectedTime}</p>
                <p>Appointment Fee: <span className='font-extrabold text-green-700'>${appointmentFee}</span></p>
                <div className="flex justify-between mt-4">
                  <button onClick={confirmAppointment} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200">
                    Confirm
                  </button>
                  <button onClick={() => setModalOpen(false)} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Doctors Section */}
      </div>
      <div className="mt-4 w-full mx-auto items-center">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-5">
          Related doctors
        </h1>
        <div className="flex flex-wrap gap-2 text-center justify-center items-center">
          {relatedDoctors.map((relatedDoctor, index) => (
            <div key={index} className="border rounded-lg overflow-hidden shadow-md w-1/7">
              <Image
                src={relatedDoctor.image}
                alt={relatedDoctor.name}
                width={80}
                height={80}
                className="object-cover w-[80%] h-30"
              />
              <div className="p-4">
                <h2 className="mt-2 text-lg font-semibold">{relatedDoctor.name}</h2>
                <p className="text-sm text-slate-500">{relatedDoctor.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AppointmentDetail;
