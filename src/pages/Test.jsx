import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Test = () => {
  const token = sessionStorage.getItem("token");


  return (
    <div className="h-screen w-screen bg-gradient-to-b from-[#368A7B] to-black flex flex-col items-center p-6">
      <div className="w-[90%] max-w-[600px] mt-8 text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Page de Test</h1>
        
        <div className="bg-white/10 rounded-lg p-6">
          <h2 className="text-xl mb-4">Informations de connexion</h2>
          <div className="space-y-2">
            <p className="text-white/80">
              <span className="font-semibold">Token d'authentification :</span>
            </p>
            <p className="bg-black/30 p-3 rounded break-all">
              {token} {/* Affichage du token récupéré */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
