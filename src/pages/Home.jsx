import React, { useEffect, useState } from 'react';
import PrivateLayout from '../components/PrivateLayout';
import { jwtDecode } from "jwt-decode";

const Home = () => {
  const token = sessionStorage.getItem("token");
  const [firstName, setFirstName] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const justConnected = sessionStorage.getItem('justConnected');
    const token = sessionStorage.getItem('token');

    if (justConnected && token) {
      const decodedToken = jwtDecode(token);
      const userFirstName = decodedToken.firstName;

      setFirstName(userFirstName);

      setShowPopup(true);
      sessionStorage.removeItem('justConnected');


    }
  }, []);

  const handleClose = () => {
    setShowPopup(false); 
  };

  return (
    <PrivateLayout  showPopup={showPopup}>
      <div className="text-center"> {/* Contenu supplémentaire pour simuler une page longue */}
        <h1>Test du footer avec du contenu supplémentaire</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
          Curabitur et euismod erat. Suspendisse potenti. <br />
          In sed fermentum libero, a tincidunt neque. <br />
          Donec venenatis consequat ante, non tincidunt nisi sollicitudin a. <br />
          Integer at odio at velit elementum egestas. <br />
          Fusce ullamcorper ipsum non nisi placerat, nec volutpat urna tempor. <br />
          Aenean cursus vestibulum odio non interdum. <br />
          Cras feugiat justo ut ex porttitor, eu maximus magna efficitur. <br />
          Donec pharetra gravida eros, id tristique nisi aliquam sit amet. <br />
          Ut vehicula gravida augue, id laoreet elit tempus ac. <br />

          Aliquam lobortis leo vitae velit cursus, sed auctor erat consequat. <br />
          Maecenas in orci eget elit maximus volutpat ut in magna. <br />
          Curabitur vitae vestibulum libero, ut dapibus ligula. <br />
          Ut a orci nec nisl dignissim interdum id ac lorem. <br />
          Sed et gravida neque. <br />
          Pellentesque tristique lorem sit amet metus fermentum, ac sollicitudin risus cursus. <br />
          Sed sed volutpat purus. <br />
          Mauris vitae consectetur lorem. <br />
          Aenean pharetra felis ut risus laoreet, sit amet rutrum elit tristique. <br />

          Praesent ut quam vitae sapien tincidunt tincidunt ut non libero. <br />
          Sed euismod magna sit amet fringilla volutpat. <br />
          In id nulla ex. <br />
          Curabitur scelerisque velit eu sem vulputate, vitae maximus nunc malesuada. <br />
          Morbi mollis mauris vitae ligula euismod, eu dignissim risus lacinia. <br />
          Vivamus vitae nunc sit amet arcu dictum tempus ut non risus. <br />
          Proin volutpat sapien vel nulla consequat, nec vestibulum libero elementum. <br />
          Aliquam quis felis ac elit tincidunt vehicula. <br />
          Aenean sed tristique arcu, ut tempor nisi. <br />
          Curabitur sit amet ante non metus pharetra gravida. <br />
          Nulla facilisi. <br />
          In egestas volutpat enim ac molestie. <br />

          Duis convallis, urna in lacinia vehicula, eros elit feugiat nisl, eget posuere odio felis id dui. <br />
          Fusce ac lorem non eros dignissim elementum. <br />
          Cras et sollicitudin orci, sed varius ante. <br />
          Aenean malesuada erat et ex blandit, ac rutrum nisi ullamcorper. <br />
          Integer euismod augue vel nisl scelerisque, eget cursus ante pharetra. <br />
          Ut finibus risus at nulla gravida interdum. <br />
          Etiam ut magna ut purus varius tempor. <br />
          In faucibus elit lorem, id consequat tortor maximus nec. <br />
          Morbi tincidunt vitae nunc vel luctus. <br />
          Maecenas euismod orci nec dui dictum, vel vehicula odio viverra. <br />
          In egestas convallis quam, et tincidunt leo eleifend sit amet. <br />
          Proin tristique scelerisque felis, ac suscipit magna laoreet eu. <br />

          Fusce ut libero ac neque pretium sodales eget et mi. <br />
          Etiam congue viverra dui, at convallis lorem elementum id. <br />
          Morbi iaculis venenatis auctor. <br />
          Curabitur vulputate libero ut sem placerat, at tincidunt tortor interdum. <br />
          Cras vulputate, lorem ac mollis efficitur, mauris ligula cursus enim, in laoreet eros orci at mauris. <br />
          Nunc fermentum ligula est, at pretium dolor laoreet a. <br />
          Phasellus in nisi ipsum. <br />
          Ut vel nisl vitae nisi sodales sollicitudin. <br />
          Etiam id nisi sed mauris rut
        </p>
        {showPopup && (
          <div id="popup" className="fixed bottom-0 left-1/2 transform -translate-x-1/2  bg-teal-500 text-gray-300 px-6 py-4 rounded-t-lg shadow-lg transition-all duration-500 z-50 w-[100%] max-w-[1024px] h-[300px]" >
            <p className='text-4xl font-bold'>Bonjour <span className="font-italiana text-3xl font-normal">{firstName}</span></p>
            <p className='mt-5'>Souhaites-tu enregistrer une <br /> crise de migraine ?</p>
            <div className="flex flex-col space-y-4 mt-6 items-center">
              <button className="border-none hover:border-none bg-gray-800 focus:outline-none w-[70px]">
                Oui
              </button>
              <button className="border-none hover:border-none bg-gray-800 focus:outline-none w-[70px]" onClick={handleClose}>
                Non
              </button>
            </div>
          </div>
        )}
      </div>
    </PrivateLayout>
  );
};

export default Home;
