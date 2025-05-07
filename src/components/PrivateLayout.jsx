import React from 'react';
import { FiSettings, FiZap } from 'react-icons/fi';
import { FaHome, FaPills, FaCalendarAlt, FaBars } from 'react-icons/fa';
import LogoCephalea from '../assets/images/Logo_cephalea.png';

const PrivateLayout = ({ children }) => {
    return (
        <div className="min-h-screen w-screen bg-gradient-to-b from-[#368A7B] to-black flex flex-col items-center  overflow-y-auto">
            <div className="w-[90%] max-w-[320px] my-4 flex flex-col h-full"> 

                <header className="flex justify-between items-center mb-6">
                    <img src={LogoCephalea} alt="Céphaléa" className="h-16" />

                    <button className="bg-transparent border-none outline-none text-gray-400 hover:text-gray-200">
                        <FiSettings size={24} />
                    </button>
                </header>

                <main className='flex-grow'>{children}</main>

                <footer className='w-full pt-4 pb-4 mt-auto'>
                    <div className="flex justify-between items-center max-w-6xl mx-auto cursor-pointer ">
                        {/* Icônes de gauche */}
                        <div className="flex">
                        <button className="bg-transparent border-none outline-none text-teal-400 hover:text-teal-300 cursor-pointer">
                            <FaHome size={24} />
                        </button>
                        <button className="bg-transparent border-none outline-none text-teal-400 hover:text-teal-300 cursor-pointer">
                            <FaPills size={24} />
                        </button>
                    </div>

                        {/* Icône centrale */}
                        <div className="flex justify-center items-center flex-grow"> 
                        <button className="bg-gradient-to-r from-teal-400 rounded-full p-3 hover:border-none border-none">
                            <FiZap size={32} color="white" />
                        </button>
                    </div>

                        {/* Icônes de droite */}
                        <div className="flex">
                        <button className="bg-transparent border-none outline-none text-teal-400 hover:text-teal-300 cursor-pointer">
                            <FaCalendarAlt size={24} />
                        </button>
                        <button className="bg-transparent border-none outline-none text-teal-400 hover:text-teal-300 cursor-pointer">
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
