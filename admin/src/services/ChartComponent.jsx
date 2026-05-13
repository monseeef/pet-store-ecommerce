    import React, { useEffect, useRef } from 'react';
    import Chart from 'chart.js';

    const ChartComponent = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef && chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
            labels: data.map(item => item.name),
            datasets: [{
                label: 'Total Products',
                data: data.map(item => item.totalProducts),
                backgroundColor: 'rgba(75, 192, 192, 0.5)', // Couleur adaptée au thème
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 9
            }]
            },
            options: {
            scales: {
                yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: '#555', // Couleur de la police adaptée au thème
                },
                gridLines: {
                    color: 'rgba(0, 0, 0, 0.1)' // Couleur des lignes de la grille adaptée au thème
                }
                }],
                xAxes: [{
                ticks: {
                    fontColor: '#555' // Couleur de la police adaptée au thème
                },
                gridLines: {
                    display: false // Désactiver les lignes de la grille verticale
                }
                }]
            },
            legend: {
                display: false // Désactiver la légende
            }
            }
        });
        }
    }, [data]);

    return (
        <div className="col-span-full xl:col-span-5 bg-white light:bg-slate-800 shadow-lg rounded-sm border border-slate-200 light:border-slate-700 ">
        <header className="px-5 py-4 border-b border-slate-100 light:border-slate-700">
            <h2 className="font-semibold text-slate-800 light:text-slate-100">Customers</h2>
        </header>
        <div className="p-3">           
            <canvas ref={chartRef} />
        </div>
        </div>
    );
    };

    export default ChartComponent;
