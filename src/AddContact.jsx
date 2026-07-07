import { useState } from 'react';

const API_URL = 'http://www.raydelto.org/agenda.php';

/**
 * AddContact
 * ----------
 * Componente hijo encargado del formulario para agregar un nuevo contacto.
 *
 * Props:
 *   onContactoAgregado {Function} — callback que invoca el padre
 *                                   para recargar la lista tras un POST exitoso.
 */
function AddContact({ onContactoAgregado }) {
  /* ── Estado del formulario ── */
  const [nombre,   setNombre]   = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');

  /* ── Estado de la petición ── */
  const [cargando, setCargando] = useState(false);
  const [estado,   setEstado]   = useState(null); // { mensaje, tipo: 'ok'|'err' }

  /* ── Mostrar mensaje temporal ── */
  const mostrarEstado = (mensaje, tipo) => {
    setEstado({ mensaje, tipo });
    setTimeout(() => setEstado(null), 4000);
  };

  /* ── Enviar formulario (POST) ── */
  const handleGuardar = async () => {
    if (!nombre.trim() || !apellido.trim() || !telefono.trim()) {
      mostrarEstado('Por favor completa todos los campos.', 'err');
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nombre, apellido, telefono }),
      });

      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

      // Limpiar campos y notificar al padre
      setNombre('');
      setApellido('');
      setTelefono('');
      mostrarEstado('¡Contacto guardado exitosamente!', 'ok');
      onContactoAgregado();

    } catch (error) {
      console.error('Error al guardar contacto:', error);
      mostrarEstado('No se pudo guardar el contacto. Intenta de nuevo.', 'err');
    } finally {
      setCargando(false);
    }
  };

  /* ── Render ── */
  return (
    <div className="card">
      <div className="card-title">Nuevo contacto</div>

      {/* Campos del formulario */}
      <div className="form-grid">
        <div className="field">
          <label htmlFor="inp-nombre">Nombre</label>
          <input
            id="inp-nombre"
            type="text"
            placeholder="Ej. María"
            autoComplete="off"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="inp-apellido">Apellido</label>
          <input
            id="inp-apellido"
            type="text"
            placeholder="Ej. González"
            autoComplete="off"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="inp-telefono">Teléfono</label>
          <input
            id="inp-telefono"
            type="tel"
            placeholder="Ej. 809-555-1234"
            autoComplete="off"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
      </div>

      {/* Botón guardar */}
      <button
        className="btn-primary"
        onClick={handleGuardar}
        disabled={cargando}
      >
        {cargando ? '⏳ Guardando...' : '➕ Guardar contacto'}
      </button>

      {/* Mensaje de estado */}
      {estado && (
        <div className={`status ${estado.tipo}`}>
          {estado.mensaje}
        </div>
      )}
    </div>
  );
}

export default AddContact;
