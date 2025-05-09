
import { Link } from 'react-router-dom';
const PopUp = ({ firstName, setShowPopup }) => {

    const handleClose = () => {
        setShowPopup(false);
    };


    return (
        <div id="popup" className="fixed bottom-0 left-1/2 transform -translate-x-1/2  bg-teal-500 text-gray-300 px-6 py-4 rounded-t-lg shadow-lg transition-all duration-500 z-50 w-[100%] max-w-[1024px] h-[300px]" >
            <p className='text-4xl font-bold'>Bonjour <span className="font-italiana text-3xl font-normal">{firstName}</span></p>
            <p className='mt-5'>Souhaites-tu enregistrer une <br /> crise de migraine ?</p>
            <div className="flex flex-col space-y-4 mt-6 items-center">
                <Link to="/crisis-form" className="no-underline text-white">
                    <button className="border-none hover:border-none bg-gray-800 focus:outline-none w-[70px]" >
                        Oui
                    </button>
                </Link>
                <button className="border-none hover:border-none bg-gray-800 focus:outline-none w-[70px]" onClick={handleClose}>
                    Non
                </button>
            </div>
        </div>
    );
};

export default PopUp;