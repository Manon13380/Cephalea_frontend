import { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import toastr from 'toastr';
import PrivateLayout from '../components/PrivateLayout';
import api from "../api/axios";
import { getLocalDateTimeString } from '../utils/dateTimeUtils';
import { useNavigate } from 'react-router-dom';



const CrisisForm = () => {
    const [startDate, setStartDate] = useState(getLocalDateTimeString());
    const [painIntensity, setPainIntensity] = useState('');
    const token = sessionStorage.getItem("token");
     const navigate = useNavigate(); 

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/crisis?painIntensity=${painIntensity}`, {
                startDate
              }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

            toastr.success('Crise enregistrée avec succès!');
            navigate("/home");
          } catch (error) {
            if (error.response) {
                  console.error("Erreur API :", error.response.data);
                  toastr.error("Une erreur s'est produite. Veuillez réessayer.", "Erreur", {
                    timeOut: 5000,
                  });
            } else {
              console.error("Erreur :", error.message);
              toastr.error("Une erreur est survenue. Veuillez réessayer.");
            }
          }
        
    };

    return (
        <PrivateLayout>
            <div className="w-[90%] max-w-[400px] mx-auto mt-8 flex flex-col h-full justify-center ">
                <h2 className="text-white text-xl mb-4 text-center">Enregistrer une nouvelle crise</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Date de début"
                        required
                        max={getLocalDateTimeString()}
                    />
                    <label htmlFor="painIntensity" className='block text-center '>Intensité actuelle <br /> de la douleur (0-10) :</label>
                    <select
                        id='painIntensity'
                        value={painIntensity}
                        onChange={(e) => setPainIntensity(e.target.value)}
                        required
                        size={2}
                        className='w-full py-2 px-3 rounded bg-transparent border border-white/30 text-white placeholder-white/60 text-center'
                    >
                        {[...Array(11)].map((_, index) => (
                            <option key={index} value={index} className='bg-transparent'>{index}</option>
                        ))}
                    </select>
                    <Button type="submit">Enregistrer</Button>
                </form>
            </div>
        </PrivateLayout>
    );
};

export default CrisisForm;