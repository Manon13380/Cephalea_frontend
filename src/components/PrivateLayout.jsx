import React from 'react';
import { FiSettings, FiZap } from 'react-icons/fi';
import { FaHome, FaPills, FaCalendarAlt, FaBars } from 'react-icons/fa';
import LogoCephalea from '../assets/images/Logo_cephalea.png';

const PrivateLayout = ({ children, showPopup}) => {
    return (
        <div className="min-h-screen w-screen bg-gradient-to-b from-[#368A7B] to-black flex flex-col items-center  overflow-y-auto">
             {/* Overlay */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#4A4A4A] opacity-50 z-40" />
      )}
            <div className="w-[90%] max-w-[1024px] my-4 flex flex-col h-full">
                <div className='fixed w-[90%] max-w-[1024px] b'>
                    <header className="flex justify-between items-center  mb-6 z-50">
                        <img src={LogoCephalea} alt="Céphaléa" className="h-16" />

                        <button className="bg-transparent border-none outline-none text-gray-400 hover:text-gray-200 focus:outline-none">
                            <FiSettings size={24} />
                        </button>
                    </header>
                </div>

                <main className='flex-grow  pt-20 pb-20 '>{children}</main>

                <footer className='w-full pt-4 pb-4 mt-auto '>
                    <div className="flex justify-between items-center max-w-6xl mx-auto cursor-pointer fixed bottom-0 left-1/2 transform -translate-x-1/2 sm:gap-10">
                        {/* Icônes de gauche */}
                        <div className="flex sm:gap-10">
                            <button className="bg-transparent border-none outline-none text-teal-400 hover:text-teal-300 cursor-pointer focus:outline-none">
                                <FaHome size={24} />
                            </button>
                            <button className="bg-transparent border-none outline-none text-teal-400 hover:text-teal-300 cursor-pointer focus:outline-none">
                                <FaPills size={24} />
                            </button>
                        </div>

                        {/* Icône centrale */}
                        <div className="flex justify-center items-center flex-grow">
                            <button className="bg-gradient-to-r from-teal-400 rounded-full p-3 hover:border-none border-none focus:outline-none">
                                <FiZap size={32} color="white" />
                            </button>
                        </div>

                        {/* Icônes de droite */}
                        <div className="flex sm:gap-10">
                            <button className="bg-transparent border-none outline-none text-teal-400 hover:text-teal-300 cursor-pointer focus:outline-none">
                                <FaCalendarAlt size={24} />
                            </button>
                            <button className="bg-transparent border-none outline-none text-teal-400 hover:text-teal-300 cursor -pointer focus:outline-none">
                                <FaBars size={24} />
                            </button>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PrivateLayout;
