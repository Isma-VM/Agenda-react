import { useState, useEffect } from 'react';
import AddContact  from './AddContact';
import ContactList from './ContactList';
import './App.css';

const API_URL = 'http://www.raydelto.org/agenda.php';

/**
 * App  — Componente padre
 * -----------------------
 * Orquesta el estado global (lista de contactos, carga y error)
 * y lo pasa como props a los componentes hijos:
 *
 *   ┌─────────────────── App ───────────────────┐
 *   │                                           │
 *   │   ┌─────────────┐   ┌─────────────────┐  │
 *   │   │  AddContact │   │  ContactList    │  │
 *   │   │  (formulario│   │  (listado +     │  │
 *   │   │   POST)     │   │   buscador)     │  │
 *   │   └─────────────┘   └─────────────────┘  │
 *   └───────────────────────────────────────────┘
 */
function App() {
  const [contactos, setContactos] = useState([]);
  const [cargando,  setCargando]  = useState(false);
  const [error,     setError]     = useState(null);

  /* ── Obtener contactos (GET) ── */
  const cargarContactos = async () => {
    setCargando(true);
    setError(null);

    try {
      const respuesta = await fetch(API_URL, { method: 'GET' });

      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

      const datos = await respuesta.json();
      setContactos(Array.isArray(datos) ? datos : []);

    } catch (err) {
      console.error('Error al cargar contactos:', err);
      setError('No se pudo conectar con la agenda. Verifica tu conexión.');
    } finally {
      setCargando(false);
    }
  };

  /* ── Cargar al montar el componente ── */
  useEffect(() => {
    cargarContactos();
  }, []);

  /* ── Render ── */
  return (
    <div className="container">

      {/* Encabezado */}
      <div className="page-header">
        <div className="icon">📒</div>
        <div>
          <h1>Mi Agenda</h1>
          <p>Gestiona tus contactos fácilmente</p>
        </div>
      </div>

      {/* Hijo 1: Formulario para agregar contacto */}
      <AddContact onContactoAgregado={cargarContactos} />

      {/* Hijo 2: Listado de contactos */}
      <ContactList
        contactos={contactos}
        cargando={cargando}
        error={error}
        onRecargar={cargarContactos}
      />

    </div>
  );
}

export default App;
