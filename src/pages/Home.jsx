import React, { useEffect, useState } from 'react';
import PrivateLayout from '../components/PrivateLayout';
import PopUp from '../components/PopUp';
import { jwtDecode } from "jwt-decode";
import { useApi } from '../hooks/useApi';
import { subDays, format, eachDayOfInterval, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement, // Ajout de BarElement
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { differenceInHours } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    ChartDataLabels
);

const Home = () => {
    const { get } = useApi();
    const [firstName, setFirstName] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [crisesData, setCrisesData] = useState([]);
    const [timeRange, setTimeRange] = useState(3);
    const [monthlyCountData, setMonthlyCountData] = useState(null);
    const [intensityEvolutionData, setIntensityEvolutionData] = useState(null);
    const [monthlyDurationData, setMonthlyDurationData] = useState(null);
    const [timeOfDayData, setTimeOfDayData] = useState(null);
    const [triggerData, setTriggerData] = useState(null);

    useEffect(() => {
        const justConnected = sessionStorage.getItem('justConnected');
        const token = sessionStorage.getItem('token');
        if (justConnected && token) {
            const decodedToken = jwtDecode(token);
            setFirstName(decodedToken.firstName);
            setShowPopup(true);
            sessionStorage.removeItem('justConnected');
        }

        const fetchData = async () => {
            try {
                const crises = await get('/crisis');
                if (Array.isArray(crises)) {
                    setCrisesData(crises);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données pour les graphiques:", error);
            }
        };

        fetchData();
    }, [get]);

    useEffect(() => {
        if (crisesData.length > 0) {
            processChartData(crisesData, timeRange);
        }
    }, [crisesData, timeRange]);

    const processChartData = (crises, monthsToShow) => {
        const monthlyData = {};
        const today = new Date();
        for (let i = monthsToShow - 1; i >= 0; i--) {
            const monthDate = subMonths(today, i);
            const monthKey = format(monthDate, 'yyyy-MM');
            monthlyData[monthKey] = { count: 0, totalIntensity: 0, crisesWithIntensity: 0, totalDuration: 0, crisesWithDuration: 0 };
        }

        const timeOfDayCounts = { 'Matin': 0, 'Après-midi': 0, 'Soir': 0, 'Nuit': 0 };
        const triggerCounts = {};

        crises.forEach(crisis => {
            const crisisDate = new Date(crisis.startDate);
            const monthKey = format(crisisDate, 'yyyy-MM');

            // Monthly aggregations only for the last 3 months
            if (monthlyData[monthKey]) {
                const dataForMonth = monthlyData[monthKey];
                dataForMonth.count++;
                const maxIntensity = crisis.intensities.length > 0 ? Math.max(...crisis.intensities.map(i => i.number)) : 0;
                if (maxIntensity > 0) {
                    dataForMonth.totalIntensity += maxIntensity;
                    dataForMonth.crisesWithIntensity++;
                }
                if (crisis.endDate) {
                    const duration = differenceInHours(new Date(crisis.endDate), crisisDate);
                    dataForMonth.totalDuration += duration;
                    dataForMonth.crisesWithDuration++;
                }
            }

            // Other aggregations for all crises
            const hour = crisisDate.getHours();
            if (hour >= 6 && hour < 12) timeOfDayCounts['Matin']++;
            else if (hour >= 12 && hour < 18) timeOfDayCounts['Après-midi']++;
            else if (hour >= 18 && hour < 24) timeOfDayCounts['Soir']++;
            else timeOfDayCounts['Nuit']++;

            (crisis.triggers || []).forEach(trigger => {
                triggerCounts[trigger.name] = (triggerCounts[trigger.name] || 0) + 1;
            });
        });

        const sortedMonths = Object.keys(monthlyData).sort();
        const labels = sortedMonths.map(monthKey => format(new Date(monthKey), 'MMM yyyy', { locale: fr }));

        setMonthlyCountData({ labels, datasets: [{ label: 'Nombre de migraines', data: sortedMonths.map(m => monthlyData[m].count), borderColor: 'rgb(20, 184, 166)', backgroundColor: 'rgba(20, 184, 166, 0.5)', tension: 0.3 }] });
        // Intensity Evolution Chart Data
        const crisesInRange = crises.filter(crisis => {
            const crisisDate = new Date(crisis.startDate);
            return crisisDate >= subMonths(today, monthsToShow);
        });

        const sortedCrises = [...crisesInRange].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        const intensityLabels = [];
        const firstIntensityData = [];
        const lastIntensityData = [];
      
        sortedCrises.forEach(crisis => {
          if (crisis.intensities?.length > 0) {
            const sortedIntensities = [...crisis.intensities].sort((a, b) => new Date(a.date) - new Date(b.date));
            const first = sortedIntensities[0].number;
            const last = sortedIntensities[sortedIntensities.length - 1].number;
      
            intensityLabels.push(format(new Date(crisis.startDate), 'dd/MM/yy'));
            firstIntensityData.push(first);
            lastIntensityData.push(last);
          }
        });
        
      setIntensityEvolutionData({
          labels: intensityLabels,
          datasets: [
              {
                  label: 'Intensité de début',
                  data: firstIntensityData,
                  backgroundColor: 'rgba(20, 184, 166, 0.7)', 
                  borderColor: 'rgb(20, 184, 166)',
                  borderWidth: 1
              },
              {
                  label: 'Intensité de fin',
                  data: lastIntensityData,
                  backgroundColor: 'rgba(59, 130, 246, 0.7)',
                  borderColor: 'rgb(59, 130, 246)',
                  borderWidth: 1
              }
          ]
      });
        setMonthlyDurationData({ labels, datasets: [{ label: 'Durée moyenne (heures)', data: sortedMonths.map(m => {
            const month = monthlyData[m];
            return month.crisesWithDuration > 0 ? (month.totalDuration / month.crisesWithDuration).toFixed(1) : 0;
        }), backgroundColor: 'rgba(59, 130, 246, 0.7)' }] });
        setTimeOfDayData({ labels: Object.keys(timeOfDayCounts), datasets: [{ data: Object.values(timeOfDayCounts), backgroundColor: ['#14b8a6', '#0d9488', '#3b82f6', '#2563eb'], borderColor: '#1f2937', borderWidth: 2 }] });

        const sortedTriggers = Object.entries(triggerCounts).sort(([, a], [, b]) => b - a).slice(0, 3);
        setTriggerData({ 
            labels: sortedTriggers.map(t => t[0]), 
            datasets: [{ 
                label: 'Nombre d\'occurrences', 
                data: sortedTriggers.map(t => t[1]), 
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
            }] 
        });
    };

    const handleClosePopup = () => setShowPopup(false);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, title: { display: false } },
        scales: { x: { ticks: { color: '#9ca3af' }, grid: { display: false } }, y: { ticks: { color: '#9ca3af' }, grid: { display: false }, beginAtZero: true } },
    };

    return (
        <PrivateLayout showPopup={showPopup}>
            <div className="container mx-auto p-4 md:p-8 text-white">
                <h1 className="text-3xl text-center font-bold mb-8">Dashboard</h1>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                    <span className="text-gray-400 font-semibold">Période :</span>
                    {[3, 9, 12].map(months => (
                        <button 
                            key={months}
                            onClick={() => setTimeRange(months)}
                            className={`px-4 py-2 rounded-md font-semibold transition ${timeRange === months ? 'bg-teal-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
                            {months} mois
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Chart 1: Nombre de migraines par mois */}
                    <div className="bg-white/5 p-4 rounded-lg h-[28rem] md:h-96 mb-8 flex flex-col">
                        <h2 className="text-xl font-semibold mb-4 text-center">Nombre de migraines par mois</h2>
                        <div className="relative flex-grow flex items-center justify-center">
                            <div className="w-full h-64 md:h-72">{monthlyCountData ? <Line options={{
                                maintainAspectRatio: false,
                                ...chartOptions,
                                plugins: {
                                    ...chartOptions.plugins,
                                    datalabels: {
                                        anchor: 'end',
                                        align: 'top',
                                        color: '#e5e7eb',
                                        font: {
                                            weight: 'bold',
                                        },
                                        formatter: (value) => {
                                            return value > 0 ? value : '';
                                        }
                                    }
                                }
                            }} data={monthlyCountData} /> : <p>Chargement...</p>}</div>
                        </div>
                    </div>

                    {/* Chart 2: Évolution de l'intensité par crise */}
                    <div className="bg-white/5 p-4 rounded-lg h-[28rem] md:h-96 mb-8 flex flex-col">
                        <h2 className="text-xl font-semibold mb-4 text-center">Évolution de l'intensité par crise</h2>
                        <div className="relative flex-grow flex items-center justify-center">
                            <div className="w-full h-64 md:h-72">{intensityEvolutionData ? <Bar options={{
                                maintainAspectRatio: false,
                                ...chartOptions,
                                plugins: {
                                    legend: { 
                                        display: true,
                                        position: 'top',
                                        labels: {
                                            color: '#e5e7eb'
                                        }
                                     },
                                     datalabels: {
                                        anchor: 'center',
                                        align: 'center',
                                        color: '#e5e7eb',
                                        font: {
                                            weight: 'bold',
                                        },
                                        formatter: (value) => {
                                            return value > 0 ? value : '';
                                        }
                                    }
                                }
                            }} data={intensityEvolutionData} /> : <p>Chargement...</p>}</div>
                        </div>
                    </div>

                    {/* Chart 3: Durée moyenne par mois (en heures) */}
                    <div className="bg-white/5 p-4 rounded-lg h-[28rem] md:h-96 mb-8 flex flex-col">
                        <h2 className="text-xl font-semibold mb-4 text-center">Durée moyenne par mois (en heures)</h2>
                        <div className="relative flex-grow flex items-center justify-center">
                            <div className="w-full h-64 md:h-72">{monthlyDurationData ? <Bar options={{
                                maintainAspectRatio: false,
                                ...chartOptions,
                                plugins: {
                                    ...chartOptions.plugins,
                                    datalabels: {
                                        anchor: 'center',
                                        align: 'center',
                                        color: 'white',
                                        font: {
                                            weight: 'bold'
                                        },
                                        formatter: (value) => {
                                            return value > 0 ? value : '';
                                        }
                                    }
                                }
                            }} data={monthlyDurationData} /> : <p>Chargement...</p>}</div>
                        </div>
                    </div>

                    {/* Chart 4: Répartition par moment de la journée */}
                    <div className="bg-white/5 p-4 rounded-lg h-[28rem] md:h-96 mb-8 flex flex-col">
                        <h2 className="text-xl font-semibold mb-4 text-center">Répartition par moment de la journée</h2>
                        <div className="relative flex-grow flex items-center justify-center">
                            <div className="w-64 h-64 md:w-72 md:h-72">
                                {timeOfDayData ? <Doughnut options={{
                                    ...chartOptions,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { 
                                            position: 'bottom', 
                                            labels: { 
                                                color: '#e5e7eb'
                                            }
                                        },
                                        datalabels: {
                                            color: 'white',
                                            font: {
                                                weight: 'bold'
                                            },
                                            formatter: (value) => {
                                                return value > 0 ? value : '';
                                            }
                                        }
                                    },
                                    scales: {}
                                }} data={timeOfDayData} /> : <p>Chargement...</p>}
                            </div>
                        </div>
                    </div>

                    {/* Chart 5: Top 3 des déclencheurs */}
                    <div className="bg-white/5 p-4 rounded-lg h-[28rem] md:h-96 mb-8 flex flex-col md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4 text-center">Top 3 des déclencheurs</h2>
                        <div className="relative flex-grow flex items-center justify-center">
                            <div className="w-full h-64 md:h-72">{triggerData ? <Bar options={{...chartOptions, maintainAspectRatio: false, indexAxis: 'y' }} data={triggerData} /> : <p>Chargement...</p>}</div>
                        </div>
                    </div>
                </div>

                {showPopup && <PopUp firstName={firstName} onClose={handleClosePopup} />}
            </div>
        </PrivateLayout>
    );
};

export default Home;
