import React, { useEffect, useState, useRef } from 'react';
import PrivateLayout from '../components/PrivateLayout';
import PopUp from '../components/PopUp';
import { jwtDecode } from "jwt-decode";
import { useApi } from '../hooks/useApi';
import { format, subMonths } from 'date-fns';
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    const { get, loading } = useApi();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userId, setUserId] = useState('');
    const [doctor, setDoctor] = useState('');
    const [neurologist, setNeurologist] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [crisesData, setCrisesData] = useState([]);
    const [timeRange, setTimeRange] = useState(3);
    const [monthlyCountData, setMonthlyCountData] = useState(null);
    const [intensityEvolutionData, setIntensityEvolutionData] = useState(null);
    const [monthlyDurationData, setMonthlyDurationData] = useState(null);
    const [timeOfDayData, setTimeOfDayData] = useState(null);
    const [triggerData, setTriggerData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // Tableau de refs pour tous les graphiques
    const chartRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]; // Ajout d'un ref pour le graphique traitements
    const [treatmentUsageData, setTreatmentUsageData] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setFirstName(decodedToken.firstName);
            setLastName(decodedToken.lastName);
            setUserId(decodedToken.userId || decodedToken.id);
        }

        const justConnected = sessionStorage.getItem('justConnected');
        if (justConnected) {
            setShowPopup(true);
            sessionStorage.removeItem('justConnected');
        }

        const fetchData = async () => {
            if (!userId) return; // Ne rien faire si userId n'est pas encore défini

            // Fetch crisis data
            try {
                const crisesData = await get('/crisis');
                if (Array.isArray(crisesData)) {
                    setCrisesData(crisesData);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des crises:", error);
            }

            // Fetch user data
            try {
                const userData = await get(`/user/${userId}`);
                if (userData) {
                    setDoctor(userData.doctor ? userData.doctor : 'Non renseigné');
                    setNeurologist(userData.neurologist ? userData.neurologist : 'Non renseigné');
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des informations de l'utilisateur:", error);
            }
        };

        fetchData();
    }, [userId, get]);

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
        const treatmentCounts = {};

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
            (crisis.crisisMedication || []).forEach(med => {
                const medName = med && med.medication && med.medication.name;
                if (medName) {
                    treatmentCounts[medName] = (treatmentCounts[medName] || 0) + 1;
                }
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
        setMonthlyDurationData({
            labels, datasets: [{
                label: 'Durée moyenne (jours)', data: sortedMonths.map(m => {
                    const month = monthlyData[m];
                    // Conversion heures → jours (1 jour = 24h)
                    return month.crisesWithDuration > 0 ? (month.totalDuration / month.crisesWithDuration / 24).toFixed(1) : 0;
                }), backgroundColor: 'rgba(59, 130, 246, 0.7)'
            }]
        });
        setTimeOfDayData({ labels: Object.keys(timeOfDayCounts), datasets: [{ data: Object.values(timeOfDayCounts), backgroundColor: ['#14b8a6', '#0d9488', '#3b82f6', '#2563eb'], borderColor: '#1f2937', borderWidth: 2 }] });

        const sortedTriggers = Object.entries(triggerCounts).sort(([, a], [, b]) => b - a).slice(0, 3);
        setTriggerData({
            labels: sortedTriggers.map(t => t[0]),
            datasets: [{
                label: "Nombre d'occurrences",
                data: sortedTriggers.map(t => t[1]),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
            }]
        });

        // Médicaments : histogramme groupé par mois
        // 2. On construit { medName: [cptMois1, cptMois2, ...] }
        const medMonthCounts = {};
        crises.forEach(crisis => {
            const crisisDate = new Date(crisis.startDate);
            const monthKey = format(crisisDate, 'yyyy-MM');
            (crisis.crisisMedication || []).forEach(med => {
                const medName = med && med.medication && med.medication.name;
                if (medName && monthlyData[monthKey]) {
                    if (!medMonthCounts[medName]) medMonthCounts[medName] = Array(sortedMonths.length).fill(0);
                    const monthIdx = sortedMonths.indexOf(monthKey);
                    if (monthIdx !== -1) medMonthCounts[medName][monthIdx]++;
                }
            });
        });
        // 3. On limite aux 6 médicaments les plus utilisés sur la période
        const topMeds = Object.entries(medMonthCounts)
            .map(([name, arr]) => [name, arr.reduce((a, b) => a + b, 0)])
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name]) => name);
        // 4. Palette de couleurs
        const palette = [
            'rgba(59,130,246,0.8)',   // bleu (site)
            'rgba(20,184,166,0.8)',   // turquoise (site)
            'rgba(16,185,129,0.8)',   // vert (site)
            'rgba(139,92,246,0.8)',   // violet (site)
            'rgba(107,114,128,0.8)',  // gris (site)
            'rgba(244,63,94,0.8)'     // rose (site)
        ];
        setTreatmentUsageData({
            labels: sortedMonths.map(monthKey => format(new Date(monthKey), 'MMM yyyy', { locale: fr })),
            datasets: topMeds.map((medName, i) => ({
                label: medName,
                data: medMonthCounts[medName],
                backgroundColor: palette[i % palette.length],
            }))
        });
    };

    const handleClosePopup = () => setShowPopup(false);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, title: { display: false } },
        scales: { x: { ticks: { color: '#9ca3af' }, grid: { display: false } }, y: { ticks: { color: '#9ca3af' }, grid: { display: false }, beginAtZero: true } },
    };

    // PDF EXPORT LOGIC
    const handleExportPdf = async () => {
        setIsLoading(true);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const today =  new Date().toLocaleDateString('fr-FR');
        const periodeText = timeRange === 3 ? '3 derniers mois' : timeRange === 9 ? '9 derniers mois' : '12 derniers mois';
        // HEADER
        pdf.setFontSize(18);
        pdf.text('Rapport des crises de migraine', 105, 20, { align: 'center' });
        pdf.setFontSize(14);
        pdf.text(`de ${firstName} ${lastName}`, 105, 30, { align: 'center' });
        pdf.setFontSize(11);
        pdf.text(`Généré le : ${today}`, 105, 40, { align: 'center' });
        pdf.text(`Médecin traitant : ${doctor}`, 105, 48, { align: 'center' });
        pdf.text(`Neurologue : ${neurologist}`, 105, 56, { align: 'center' });
        pdf.text(`Données basées sur les ${periodeText}`, 105, 64, { align: 'center' });
        let yPos = 76;
        // Liste des titres des graphiques (dans l'ordre du dashboard)
        const chartTitles = [
            'Nombre de migraines par mois',
            "Évolution de l'intensité par crise",
            'Durée moyenne par mois (en heures)',
            'Répartition par moment de la journée',
            'Top 3 des déclencheurs',
            'Nombre de prises par médicament'
        ];
        pdf.setFontSize(13);
        // Pour chaque graphique, on vérifie la place restante avant d'ajouter le suivant
        const pageHeight = pdf.internal.pageSize.getHeight();
        for (let i = 0; i < chartRefs.length; i++) {
            // Mesure la hauteur prévue pour ce graphique (titre + image + espace)
            const chartNode = chartRefs[i].current;
            let imgHeight = 60, imgWidth = 100; // valeurs par défaut au cas où
            if (chartNode) {
                const canvas = await html2canvas(chartNode, { scale: 2, backgroundColor: '#1f2937' });
                const imgData = canvas.toDataURL('image/png');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                imgWidth = pdfWidth - 120; // Réduit la largeur pour réduire la taille globale
                imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                // Si on dépasse la page, saut de page
                if (yPos + imgHeight + 24 > pageHeight) {
                    pdf.addPage();
                    yPos = 20;
                }
                pdf.text(chartTitles[i], 105, yPos, { align: 'center' });
                yPos += 6;
                const x = (pdfWidth - imgWidth) / 2;
                pdf.addImage(imgData, 'PNG', x, yPos, imgWidth, imgHeight);
                yPos += imgHeight + 18;
            }
        }
        pdf.save(`rapport-migraines-${lastName}-${today}.pdf`);
        setIsLoading(false);
    };


    return (
        <PrivateLayout showPopup={showPopup}>
            <div className="container mx-auto p-4 md:p-8 text-white">
                <h1 className="text-3xl text-center font-bold mb-8">Dashboard</h1>

                <div className="flex justify-end mb-8 gap-2">
                    <div className="relative">
                        <select id="time-range-select" value={timeRange} onChange={(e) => setTimeRange(Number(e.target.value))} className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full pl-3 pr-10 py-2.5 transition-all duration-300 ease-in-out appearance-none cursor-pointer hover:bg-gray-700">
                            <option className="bg-gray-800 text-white" value={3}>3 derniers mois</option>
                            <option className="bg-gray-800 text-white" value={9}>9 derniers mois</option>
                            <option className="bg-gray-800 text-white" value={12}>12 derniers mois</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.516 7.548c.436-.446 1.043-.481 1.576 0L10 10.405l2.908-2.857c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615l-3.712 3.648a1.103 1.103 0 01-1.56 0L5.516 9.163c-.408-.418-.436-1.17 0-1.615z" /></svg></div>
                    </div>
                    <button
                        onClick={handleExportPdf}
                        disabled={isLoading}
                        className="ml-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Exportation...' : 'Exporter'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Chart 1: Nombre de migraines par mois */}
                    <div
                        className="bg-white/5 p-4 rounded-lg h-[28rem] md:h-96 mb-8 flex flex-col"
                        ref={chartRefs[0]}
                    >
                        <h2 className="text-xl font-semibold mb-4 text-center">
                            Nombre de migraines par mois
                        </h2>

                        <div className="relative flex-grow flex items-center justify-center">
                            <div className="w-full h-64 md:h-72">
                                {loading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                                    </div>
                                ) : monthlyCountData ? (
                                    <Line
                                        options={{
                                            maintainAspectRatio: false,
                                            ...chartOptions,
                                            plugins: {
                                                ...chartOptions.plugins,
                                                datalabels: {
                                                    anchor: 'end',
                                                    align: 'top',
                                                    color: '#e5e7eb',
                                                    font: { weight: 'bold' },
                                                    formatter: (value) => (value > 0 ? value : ''),
                                                },
                                            },
                                        }}
                                        data={monthlyCountData}
                                    />
                                ) : (
                                    <div className="text-gray-400 text-center h-full flex items-center justify-center">
                                        Pas de données
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* Chart 2: Évolution de l'intensité par crise */}
                    <div
                        className="bg-white/5 p-4 rounded-lg h-[28rem] md:h-96 mb-8 flex flex-col"
                        ref={chartRefs[1]}
                    >
                        <h2 className="text-xl font-semibold mb-4 text-center">
                            Évolution de l'intensité par crise
                        </h2>

                        <div className="relative flex-grow flex items-center justify-center">
                            <div className="w-full h-64 md:h-72">
                                {loading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                                    </div>
                                ) : intensityEvolutionData ? (
                                    <Bar
                                        options={{
                                            maintainAspectRatio: false,
                                            ...chartOptions,
                                            plugins: {
                                                legend: {
                                                    display: true,
                                                    position: 'top',
                                                    labels: { color: '#e5e7eb' },
                                                },
                                                datalabels: {
                                                    anchor: 'center',
                                                    align: 'center',
                                                    color: '#e5e7eb',
                                                    font: { weight: 'bold' },
                                                    formatter: (value) => (value > 0 ? value : ''),
                                                },
                                            },
                                        }}
                                        data={intensityEvolutionData}
                                    />
                                ) : (
                                    <div className="text-gray-400 text-center h-full flex items-center justify-center">
                                        Pas de données
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chart 3: Nombre de prises par médicament */}
                    <div className="bg-white/5 p-4 rounded-lg h-[28rem] md:h-96 mb-8 flex flex-col md:col-span-2" ref={chartRefs[5]}>
                        <h2 className="text-xl font-semibold mb-4 text-center">Nombre de prises par médicament</h2>
                        <div className="relative flex-grow flex items-center justify-center">
                            <div className="w-full h-64 md:h-72">
                                {loading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                                    </div>
                                ) :treatmentUsageData && treatmentUsageData.labels.length > 0 ? (
                                    <Bar
                                        data={treatmentUsageData}
                                        options={{
                                            ...chartOptions,
                                            maintainAspectRatio: false,
                                            indexAxis: 'y', // barres horizontales
                                            plugins: {
                                                ...chartOptions.plugins,
                                                legend: {
                                                    display: timeRange === 9 || timeRange === 12,
                                                    position: 'top',
                                                    labels: {
                                                        color: '#e5e7eb',
                                                        font: { weight: 'bold' }
                                                    }
                                                },
                                                datalabels: {
                                                    anchor: 'center',
                                                    align: 'center',
                                                    color: '#fff',
                                                    font: { weight: 'bold', size: 13 },
                                                    formatter: function (value, context) {
                                                        if (value > 0) {
                                                            if (timeRange === 9 || timeRange === 12) {
                                                                return value;
                                                            }
                                                            return `${context.dataset.label} (${value})`;
                                                        }
                                                        return '';
                                                    }
                                                }
                                            },
                                            scales: {
                                                x: { ...chartOptions.scales.x, grid: { display: false } },
                                                y: {
                                                    ...chartOptions.scales.y,
                                                    grid: { display: false },
                                                    beginAtZero: true,
                                                    precision: 0,
                                                    barThickness: (timeRange === 12) ? 60 : (timeRange === 9 ? 36 : 20), // très épais pour 12 mois, épais pour 9
                                                    barPercentage: 0.4,
                                                    categoryPercentage: 0.5
                                                }
                                            }
                                        }}
                                        plugins={[ChartDataLabels]}
                                    />
                                ) : (
                                    <div className="text-gray-400 text-center">Pas de données</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chart 5: Durée moyenne par mois (en jours) */}
                    <div className="bg-white/5 p-4 rounded-lg h-[28rem] md:h-96 mb-8 flex flex-col" ref={chartRefs[2]}>
                        <h2 className="text-xl font-semibold mb-4 text-center">Durée moyenne par mois (en jours)</h2>
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
                            }} data={monthlyDurationData} /> : (
                                <div className="text-gray-400 text-center">Pas de données</div>
                            )}</div>
                        </div>
                    </div>

                    {/* Chart 6: Répartition par moment de la journée */}
                    <div className="bg-white/5 p-4 rounded-lg h-[28rem] md:h-96 mb-8 flex flex-col" ref={chartRefs[3]}>
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
                                }} data={timeOfDayData} /> : (
                                    <div className="text-gray-400 text-center">Pas de données</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chart 7: Top 3 des déclencheurs */}
                    <div className="bg-white/5 p-4 rounded-lg h-[28rem] md:h-96 mb-8 flex flex-col md:col-span-2" ref={chartRefs[4]}>
                        <h2 className="text-xl font-semibold mb-4 text-center">Top 3 des déclencheurs</h2>
                        <div className="relative flex-grow flex items-center justify-center">
                            <div className="w-full h-64 md:h-72">{triggerData ? <Bar
                                options={{
                                    ...chartOptions,
                                    maintainAspectRatio: false,
                                    indexAxis: 'y',
                                    plugins: {
                                        ...chartOptions.plugins,
                                        datalabels: {
                                            color: '#fff',
                                            anchor: 'center',
                                            align: 'center',
                                            font: { weight: 'bold' },
                                            formatter: (value) => value > 0 ? value : ''
                                        }
                                    }
                                }}
                                data={triggerData}
                                plugins={[ChartDataLabels]}
                            /> : (
                                <div className="text-gray-400 text-center">Pas de données</div>
                            )}</div>
                        </div>
                    </div>

                </div>

                {showPopup && <PopUp firstName={firstName} onClose={handleClosePopup} />}
            </div>
        </PrivateLayout>
    );
};

export default Home;
