import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

interface DoctorProfileData {
    name: string;
    email: string;
    specialty: string;
    experience: string;
    fees: string;
    education: string;
    address1: string;
    address2: string;
    aboutMe: string;
    profileImage: File | null;
}

const DoctorProfile: React.FC = () => {
    const [formData, setFormData] = useState<DoctorProfileData>({
        name: '',
        email: '',
        specialty: '',
        experience: '',
        fees: '',
        education: '',
        address1: '',
        address2: '',
        aboutMe: '',
        profileImage: null,
    });
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(true);

    useEffect(() => {
        const storedData = localStorage.getItem('doctorProfile');
        if (storedData) {
            setFormData(JSON.parse(storedData));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'file') {
            const files = (e.target as HTMLInputElement).files;
            setFormData({
                ...formData,
                [name]: files && files.length > 0 ? files[0] : null,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            localStorage.setItem('doctorProfile', JSON.stringify(formData));
            toast.success("Doctor profile saved successfully!");
            setIsEditing(false);
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="flex items-center mt-[100%] md:mt-[30%] justify-center w-full h-screen bg-slate-100 p-4">
            <div className=" w-full md:w-[90%] bg-white p-8 rounded-lg shadow-lg">
                {/* Profile Image */}
                <div className="flex justify-center mb-6">
                    <Image
                        src={formData.profileImage ? URL.createObjectURL(formData.profileImage) : '/images/default.png'}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="rounded-full shadow-md border-2 border-indigo-500 object-cover"
                    />
                </div>
                <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    {isEditing ? 'Edit Doctor Profile' : 'Doctor Profile'}
                </h1>

                <form onSubmit={handleSubmit} className='w-full md:w-[80%]'>
                    {/* Form Fields */}
                    {[
                        { label: 'Name', name: 'name', type: 'text' },
                        { label: 'Email', name: 'email', type: 'email' },
                        { label: 'Specialty', name: 'specialty', type: 'text' },
                        { label: 'Experience', name: 'experience', type: 'text' },
                        { label: 'Fees', name: 'fees', type: 'text' },
                        { label: 'Education', name: 'education', type: 'text' },
                        { label: 'Address 1', name: 'address1', type: 'text' },
                        { label: 'Address 2', name: 'address2', type: 'text' },
                        { label: 'About Me', name: 'aboutMe', type: 'text' },
                    ].map(({ label, name, type }) => (
                        <div className="mb-4" key={name}>
                            <label className="block text-lg font-semibold text-indigo-600 mb-1">{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name as keyof DoctorProfileData] as string} // Ensure it is a string
                                onChange={handleChange}
                                required
                                disabled={!isEditing}
                                className="p-3 border border-gray-300 rounded-lg shadow-inner w-[80%] focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                    ))}
                    <div className="mb-4">
                        <label className="block text-lg font-semibold my-6 text-indigo-600 mb-1">Upload Profile Image</label>
                        <input
                            type="file"
                            name="profileImage"
                            accept="image/*"
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="border border-gray-300 rounded p-2 shadow-inner w-[80%]"
                        />
                    </div>
                    {/* Submit and Edit Buttons */}
                    <div className="flex justify-between mb-4">
                        <button
                            type="submit"
                            className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-full hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
                        >
                            {loading ? 'Loading...' : 'Save Profile'}
                        </button>
                        <button
                            type="button"
                            onClick={handleEditToggle}
                            className={`w-full border border-${isEditing ? 'red' : 'green'}-600 text-${isEditing ? 'red' : 'green'}-600 py-2 rounded-full hover:bg-${isEditing ? 'red' : 'green'}-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-${isEditing ? 'red' : 'green'}-500 focus:ring-opacity-50 transition duration-200 ml-2`}
                        >
                            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                        </button>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default DoctorProfile;
