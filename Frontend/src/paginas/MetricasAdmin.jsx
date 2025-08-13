import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const MetricasAdmin = () => {
  const [productores, setProductores] = useState(0);
  const [clientes, setClientes] = useState(0);
  const [topProductores, setTopProductores] = useState([]);
  const [topClientes, setTopClientes] = useState([]);
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchDatosPrincipales = async () => {
      try {
        const resProductores = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/productor/productores`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const resClientes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/cliente/clientes`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const resTopProductores = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/productor/top`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const resTopClientes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/cliente/top`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProductores(resProductores.data.length);
        setClientes(resClientes.data.length);
        setTopProductores(resTopProductores.data);
        setTopClientes(resTopClientes.data);
      } catch (error) {
        console.error('Error al obtener métricas principales:', error);
      }
    };

    const fetchExtras = async () => {
      try {
        const resIngresos = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/productor/ingresos`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const resProductos = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/productor/productos-mas-vendidos`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setIngresosTotales(resIngresos.data.ingresosTotales || 0);
        setProductosMasVendidos(resProductos.data || []);
      } catch (error) {
        console.error('Error al obtener métricas adicionales:', error);
      }
    };

    fetchDatosPrincipales();
    fetchExtras();
  }, []);

  useEffect(() => {
    if (!productores && !clientes) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'pie',
      data: {
        labels: ['Productores', 'Clientes'],
        datasets: [
          {
            data: [productores, clientes],
            backgroundColor: ['#a0f0a0', '#a0c8f0'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }, [productores, clientes]);

  return (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">📊 Métricas Generales</h2>

    {/* Cards de métricas: 1 col en móvil, 2 cols desde sm */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
      <div className="bg-green-100 border border-green-400 rounded-xl p-4 sm:p-5 shadow">
        <p className="text-base sm:text-lg font-semibold text-green-800">👨‍🌾 Productores Registrados</p>
        <p className="text-2xl sm:text-3xl font-bold text-green-900">{productores}</p>
      </div>

      <div className="bg-blue-100 border border-blue-400 rounded-xl p-4 sm:p-5 shadow">
        <p className="text-base sm:text-lg font-semibold text-blue-800">🛒 Clientes Registrados</p>
        <p className="text-2xl sm:text-3xl font-bold text-blue-900">{clientes}</p>
      </div>
    </div>

    {/* Gráfica: ancho fluido y altura adaptativa */}
    <div className="max-w-md w-full mx-auto mb-10 sm:mb-12 bg-white border rounded-xl shadow p-4">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 text-center">Distribución de usuarios</h3>
      <div className="w-full">
        <canvas ref={chartRef} className="block w-full h-48 sm:h-56 md:h-64"></canvas>
      </div>
    </div>

    {/* Listas TOP: 1 col en móvil, 2 cols desde lg */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {/* TOP PRODUCTORES */}
      <div className="bg-white rounded-xl border p-4 sm:p-5 shadow">
        <h3 className="text-base sm:text-lg font-bold mb-2 text-green-700">🧑‍🌾 Productores con más productos vendidos</h3>
        {topProductores.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
            {topProductores.map((prod, index) => (
              <li key={index}>
                {prod.nombre} {prod.apellido} – <strong>{prod.totalVentas}</strong> ventas
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm sm:text-base">Sin datos</p>
        )}
      </div>

      {/* TOP CLIENTES */}
      <div className="bg-white rounded-xl border p-4 sm:p-5 shadow">
        <h3 className="text-base sm:text-lg font-bold mb-2 text-blue-700">🧍 Clientes que más han comprado</h3>
        {topClientes.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
            {topClientes.map((cli, index) => (
              <li key={index}>
                {cli.nombre} {cli.apellido} – <strong>{cli.totalCompras}</strong> compras
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm sm:text-base">Sin datos</p>
        )}
      </div>
    </div>

    {/* Ingresos Totales */}
    <div className="bg-yellow-100 border border-yellow-400 rounded-xl p-4 sm:p-5 shadow mt-8 sm:mt-12">
      <p className="text-base sm:text-lg font-semibold text-yellow-800">💰 Ingresos Totales</p>
      <p className="text-2xl sm:text-3xl font-bold text-yellow-900">${ingresosTotales.toFixed(2)}</p>
    </div>

    {/* Productos Más Vendidos */}
    <div className="bg-white rounded-xl border p-4 sm:p-5 shadow mt-6">
      <h3 className="text-base sm:text-lg font-bold mb-2 text-purple-700">📦 Productos más vendidos</h3>
      {productosMasVendidos.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
          {productosMasVendidos.map((prod, index) => (
            <li key={index}>
              {prod.nombre} – <strong>{prod.totalVendido}</strong> unidades vendidas
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm sm:text-base">Sin datos</p>
      )}
    </div>
  </div>
)

};

export default MetricasAdmin;
