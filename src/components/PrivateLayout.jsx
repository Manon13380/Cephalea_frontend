import React from 'react';
import { FiSettings, FiZap } from 'react-icons/fi';
import { FaHome, FaPills, FaCalendarAlt, FaBars } from 'react-icons/fa';
import LogoCephalea from '../assets/images/Logo_cephalea.png';
import { Link, useLocation } from 'react-router-dom';

const PrivateLayout = ({ children, showPopup}) => {
    const location = useLocation();
    
    return (
        <div className="min-h-screen w-screen bg-gradient-to-b from-[#368A7B] to-black flex flex-col">
            {/* Overlay */}
            {showPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-[#4A4A4A] opacity-50 z-40" />
            )}
            
            {/* Header - Fixed height */}
            <header className="h-24 px-4">
                <div className="w-[90%] max-w-[1024px] mx-auto flex justify-between items-center h-full">
                    <img src={LogoCephalea} alt="Céphaléa" className="h-16" />
                    <button className="bg-transparent border-none outline-none text-gray-400 hover:text-gray-200 focus:outline-none">
                        <FiSettings size={24} />
                    </button>
                </div>
            </header>

            {/* Main content - Flexible height */}
            <main className="flex-1 px-4 overflow-y-auto pb-24">
                <div className="w-[90%] max-w-[1024px] mx-auto">
                    {children}
                </div>
            </main>

            <footer className='w-full pt-10 pb-4 mt-auto'>
                <div className="flex justify-between items-center max-w-6xl mx-auto cursor-pointer fixed bottom-0 left-1/2 transform -translate-x-1/2 sm:gap-10">
                    {/* Icônes de gauche */}
                    <div className="flex sm:gap-10">
                        <Link to="/home">
                            <button className={`bg-transparent border-none outline-none ${location.pathname === '/home' ? 'text-white' : 'text-teal-400'} hover:text-teal-300 cursor-pointer focus:outline-none`}>
                                <FaHome size={24} />
                            </button>
                        </Link>
                        <button className="bg-transparent border-none outline-none text-teal-400 hover:text-teal-300 cursor-pointer focus:outline-none">
                            <FaPills size={24} />
                        </button>
                    </div>

                    {/* Icône centrale */}
                    <div className="flex justify-center items-center flex-grow">
                        <Link to="/crisis-form">
                            <button className={`bg-gradient-to-r from-teal-400 rounded-full p-3 hover:border-none border-none focus:outline-none ${location.pathname === '/crisis-form' ? 'ring-2 ring-white' : ''}`}>
                                <FiZap size={32} color="white" />
                            </button>
                        </Link>
                    </div>

                    {/* Icônes de droite */}
                    <div className="flex sm:gap-10">
                        <button className="bg-transparent border-none outline-none text-teal-400 hover:text-teal-300 cursor-pointer focus:outline-none">
                            <FaCalendarAlt size={24} />
                        </button>
                        <Link to="/crisis-list">
                            <button className={`bg-transparent border-none outline-none ${location.pathname === '/crisis-list' ? 'text-white' : 'text-teal-400'} hover:text-teal-300 cursor-pointer focus:outline-none`}>
                                <FaBars size={24} />
                            </button>
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PrivateLayout;
