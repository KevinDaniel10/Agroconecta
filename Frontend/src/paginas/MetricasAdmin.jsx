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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📊 Métricas Generales</h2>

      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="bg-green-100 border border-green-400 rounded-xl p-4 shadow">
          <p className="text-lg font-semibold text-green-800">👨‍🌾 Productores Registrados</p>
          <p className="text-3xl font-bold text-green-900">{productores}</p>
        </div>

        <div className="bg-blue-100 border border-blue-400 rounded-xl p-4 shadow">
          <p className="text-lg font-semibold text-blue-800">🛒 Clientes Registrados</p>
          <p className="text-3xl font-bold text-blue-900">{clientes}</p>
        </div>
      </div>

      <div className="max-w-md mx-auto mb-12">
        <h3 className="text-xl font-semibold mb-4 text-center">Distribución de usuarios</h3>
        <canvas ref={chartRef}></canvas>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* TOP PRODUCTORES */}
        <div className="bg-white rounded-xl border p-4 shadow">
          <h3 className="text-lg font-bold mb-2 text-green-700">🧑‍🌾 Productores con más productos vendidos</h3>
          <ul className="list-disc pl-4">
            {topProductores.length > 0 ? (
              topProductores.map((prod, index) => (
                <li key={index}>
                  {prod.nombre} {prod.apellido} – <strong>{prod.totalVentas}</strong> ventas
                </li>
              ))
            ) : (
              <p className="text-gray-500">Sin datos</p>
            )}
          </ul>
        </div>

        {/* TOP CLIENTES */}
        <div className="bg-white rounded-xl border p-4 shadow">
          <h3 className="text-lg font-bold mb-2 text-blue-700">🧍 Clientes que más han comprado</h3>
          <ul className="list-disc pl-4">
            {topClientes.length > 0 ? (
              topClientes.map((cli, index) => (
                <li key={index}>
                  {cli.nombre} {cli.apellido} – <strong>{cli.totalCompras}</strong> compras
                </li>
              ))
            ) : (
              <p className="text-gray-500">Sin datos</p>
            )}
          </ul>
        </div>
      </div>

      {/* Ingresos Totales */}
      <div className="bg-yellow-100 border border-yellow-400 rounded-xl p-4 shadow mt-12">
        <p className="text-lg font-semibold text-yellow-800">💰 Ingresos Totales</p>
        <p className="text-3xl font-bold text-yellow-900">${ingresosTotales.toFixed(2)}</p>
      </div>

      {/* Productos Más Vendidos */}
      <div className="bg-white rounded-xl border p-4 shadow mt-6">
        <h3 className="text-lg font-bold mb-2 text-purple-700">📦 Productos más vendidos</h3>
        <ul className="list-disc pl-4">
          {productosMasVendidos.length > 0 ? (
            productosMasVendidos.map((prod, index) => (
              <li key={index}>
                {prod.nombre} – <strong>{prod.totalVendido}</strong> unidades vendidas
              </li>
            ))
          ) : (
            <p className="text-gray-500">Sin datos</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MetricasAdmin;
