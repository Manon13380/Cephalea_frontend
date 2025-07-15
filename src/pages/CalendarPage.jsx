import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Calendar.css'; // Import custom styles
import { useApi } from '../hooks/useApi';
import PrivateLayout from '../components/PrivateLayout';
import toastr from 'toastr';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const getIntensityHexColor = (intensity) => {
    if (!intensity) return '#14b8a6'; // Default teal
    if (intensity <= 3) return '#22c55e'; // Green
    if (intensity <= 6) return '#f97316'; // Orange
    return '#ef4444'; // Red
};

const CustomToolbar = ({ label, onNavigate }) => {
    return (
        <div className="custom-toolbar">
            <div className="toolbar-left">
                <button type="button" className="rbc-btn" onClick={() => onNavigate('TODAY')}>
                    Aujourd'hui
                </button>
            </div>
            <div className="toolbar-center">
                <button type="button" className="nav-arrow" onClick={() => onNavigate('PREV')}>
                    <FaChevronLeft />
                </button>
                <span className="rbc-toolbar-label">{label}</span>
                <button type="button" className="nav-arrow" onClick={() => onNavigate('NEXT')}>
                    <FaChevronRight />
                </button>
            </div>
            <div className="toolbar-right">{/* Spacer */}</div>
        </div>
    );
};

const locales = {
    'fr': fr,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const CalendarPage = () => {
        const [events, setEvents] = useState([]);
    const [date, setDate] = useState(new Date());
    const { get } = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCrises = async () => {
            try {
                const crises = await get('/crisis');
                if (Array.isArray(crises)) {
                                        const formattedEvents = crises.map(crisis => {
                        const maxIntensity = crisis.intensities.length > 0 ? Math.max(...crisis.intensities.map(i => i.number)) : null;
                        return {
                            id: crisis.id,
                            title: `Crise (Int. max: ${maxIntensity || 'N/A'})`,
                            start: new Date(crisis.startDate),
                            end: crisis.endDate ? new Date(crisis.endDate) : new Date(crisis.startDate),
                            allDay: !crisis.endDate, // Consider as all-day if it's ongoing
                            resource: {
                                maxIntensity: maxIntensity
                            }
                        };
                    });
                    setEvents(formattedEvents);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des crises:", error);
                toastr.error("Impossible de charger les données pour le calendrier.");
            }
        };

        fetchCrises();
    }, [get]);

    const handleSelectEvent = (event) => {
                navigate(`/crisis/${event.id}`);
    };

    return (
        <PrivateLayout>
            <div className="container mx-auto p-4 md:p-8 text-white">
                <h1 className="text-3xl font-bold mb-6 text-center">Calendrier des crises</h1>
                <div className="bg-white/5 p-4 rounded-lg" style={{ height: '75vh' }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        culture='fr'
                                                onSelectEvent={handleSelectEvent}
                        onNavigate={setDate}
                                                date={date}
                                                views={['month']}
                        components={{ toolbar: CustomToolbar }}
                        messages={{
                            noEventsInRange: 'Aucun événement dans cette période.',
                            event: "Événement",
                        }}
                                                eventPropGetter={(event, start, end, isSelected) => {
                            const backgroundColor = getIntensityHexColor(event.resource?.maxIntensity);
                            const style = {
                                backgroundColor,
                                borderRadius: '5px',
                                opacity: isSelected ? 1 : 0.8,
                                color: 'white',
                                border: '0px',
                                display: 'block',
                                boxShadow: isSelected ? '0 0 0 2px white' : 'none'
                            };
                            return {
                                style: style
                            };
                        }}
                    />
                </div>
            </div>
        </PrivateLayout>
    );
};

export default CalendarPage;
