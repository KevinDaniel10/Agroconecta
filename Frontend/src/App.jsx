import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import Auth from "./layout/Auth";
import Dashboard from "./layout/Dashboard";
import AdminDashboard from "./layout/AdminDashboard";

// Páginas públicas
import { LandinPage } from "./paginas/LandinPage";
import Login from "./paginas/Login";
import LoginAdmin from "./paginas/LoginAdmin";
import { Register } from "./paginas/Register";
import { Forgot } from "./paginas/Forgot";
import { NotFound } from "./paginas/NotFound";
import { Confirmar } from "./paginas/Confirmar";
import Restablecer from "./paginas/Restablecer";

// Páginas privadas (cliente/productor)
import Perfil from "./paginas/Perfil";
import Listar from "./paginas/Listar";
import Visualizar from "./paginas/Visualizar";
import Crear from "./paginas/Crear";
import Actualizar from "./paginas/Actualizar";
import Comprar from "./paginas/Comprar";
import MisCompras from "./paginas/MisCompras";
import Soporte from "./paginas/Soporte";
import HistorialCompras from "./paginas/HistorialCompras";
import HistorialVentas from "./paginas/HistorialVentas";

// Páginas privadas admin
import VistaUsuarios from "./paginas/VistaUsuarios";
import MetricasAdmin from "./paginas/MetricasAdmin";
import SoporteAdmin from "./paginas/SoporteAdmin";

// Contextos y rutas protegidas
import { AuthProvider } from "./context/AuthProvider";
import { TratamientosProvider } from "./context/ProductoProvider";
import { CartProvider } from "./context/CartProvider";
import { PrivateRoute } from "./routes/PrivateRoutes";
import PrivateRouteWithRole from "./routes/PrivateRouteWithRole";
import PrivateRouteAdmin from "./context/PrivateRouteAdmin";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TratamientosProvider>
          <CartProvider>
            <Routes>
              {/* Ruta raíz */}
              <Route index element={<LandinPage />} />

              {/* Layout público */}
              <Route path="/" element={<Auth />}>
                <Route path="login" element={<Login />} />
                <Route path="admin" element={<LoginAdmin />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot/:id" element={<Forgot />} />
                <Route path="confirmar/:token" element={<Confirmar />} />
                <Route path=":rol/recuperar-password/:token" element={<Restablecer />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* 🛡️ Rutas protegidas para cliente/productor */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
                <Route index element={<Perfil />} />
                <Route path="listar" element={<Listar />} />
                <Route path="visualizar/:id" element={<Visualizar />} />
                <Route path="crear" element={
                  <PrivateRouteWithRole>
                    <Crear />
                  </PrivateRouteWithRole>
                } />
                <Route path="actualizar/:id" element={<Actualizar />} />
                <Route path="comprar" element={<Comprar />} />
                <Route path="mis-compras" element={<MisCompras />} />
                <Route path="soporte" element={<Soporte />} />
                <Route path="HistorialCompras" element={<HistorialCompras />} />
                <Route path="HistorialVentas" element={<HistorialVentas />} />
              </Route>

              {/* 🛡️ Rutas protegidas para ADMIN */}
              <Route path="/admin/dashboard" element={
                <PrivateRouteAdmin>
                  <AdminDashboard />
                </PrivateRouteAdmin>
              }>
                <Route index element={<Navigate to="usuarios" replace />} />
                <Route path="usuarios" element={<VistaUsuarios />} />
                <Route path="metricas" element={<MetricasAdmin />} />
                <Route path="soporte" element={<SoporteAdmin />} />
              </Route>
            </Routes>
          </CartProvider>
        </TratamientosProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
