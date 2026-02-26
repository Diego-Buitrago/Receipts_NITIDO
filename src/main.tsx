import { StrictMode, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';

// Importar los estilos de PrimeReact
import './index.css';
import 'primereact/resources/themes/saga-green/theme.css'; // O el tema que estés usando
import 'primereact/resources/primereact.min.css';
import { addLocale, PrimeReactProvider } from 'primereact/api';

import { TanStackProvider } from './plugins/TanStackProvider.tsx';
import { AuthProvider } from './context/index.ts';
import { router } from './router/router.tsx';
import { Toast } from 'primereact/toast';
import ToastService from './plugins/ToastService.ts';

// Configurar localización en español
addLocale('es', {
  firstDayOfWeek: 1, // Lunes como primer día de la semana
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ],
  monthNamesShort: [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
  ],
  today: 'Hoy',
  clear: 'Limpiar'
});

const App = () => {
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    if (toastRef.current) {
      ToastService.setToast(toastRef.current);
    }
  }, []);

  return (
    <>
      <Toast ref={toastRef} position="top-right" />
      <TanStackProvider>
        <PrimeReactProvider value={{ locale: 'es' }}>
          {/* <AuthProvider> */}
            <RouterProvider router={router} />
          {/* </AuthProvider> */}
        </PrimeReactProvider>
      </TanStackProvider>
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
