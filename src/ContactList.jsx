import { useState } from 'react';

/**
 * Devuelve las dos primeras iniciales de un contacto en mayúsculas.
 * @param {string} nombre
 * @param {string} apellido
 * @returns {string}
 */
function obtenerIniciales(nombre, apellido) {
  const i1 = (nombre   || '')[0] || '';
  const i2 = (apellido || '')[0] || '';
  return (i1 + i2).toUpperCase() || '?';
}

/**
 * ContactList
 * -----------
 * Componente hijo encargado de mostrar el listado de contactos
 * y el buscador local.
 *
 * Props:
 *   contactos {Array}    — lista completa recibida del padre.
 *   cargando  {boolean}  — indica si hay una petición en curso.
 *   error     {string|null} — mensaje de error si la petición falló.
 *   onRecargar {Function} — callback para pedir al padre que recargue.
 */
function ContactList({ contactos, cargando, error, onRecargar }) {
  const [busqueda, setBusqueda] = useState('');

  /* ── Filtrar lista localmente ── */
  const contactosFiltrados = busqueda.trim()
    ? contactos.filter(c =>
        (c.nombre   || '').toLowerCase().includes(busqueda.toLowerCase()) ||
        (c.apellido || '').toLowerCase().includes(busqueda.toLowerCase())
      )
    : contactos;

  /* ── Badge con total ── */
  const textoBadge = cargando
    ? '...'
    : error
      ? 'Error'
      : `${contactos.length} ${contactos.length === 1 ? 'contacto' : 'contactos'}`;

  /* ── Contenido de la lista ── */
  const renderContenido = () => {
    if (cargando) {
      return (
        <div className="state-msg">
          <span className="big-icon">⏳</span>
          Cargando contactos...
        </div>
      );
    }

    if (error) {
      return (
        <div className="state-msg error">
          <span className="big-icon">⚠️</span>
          {error}
        </div>
      );
    }

    if (contactosFiltrados.length === 0) {
      return (
        <div className="state-msg">
          <span className="big-icon">👤</span>
          No hay contactos para mostrar.
        </div>
      );
    }

    return contactosFiltrados.map((contacto, index) => (
      <div className="contact-item" key={index}>
        <div className="avatar">
          {obtenerIniciales(contacto.nombre, contacto.apellido)}
        </div>
        <div>
          <div className="contact-name">
            {contacto.nombre} {contacto.apellido}
          </div>
          <div className="contact-phone">
            📞 {contacto.telefono || '—'}
          </div>
        </div>
      </div>
    ));
  };

  /* ── Render ── */
  return (
    <div className="card">
      {/* Barra superior */}
      <div className="list-toolbar">
        <div className="card-title" style={{ margin: 0 }}>Contactos</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge">{textoBadge}</span>
          <button className="btn-secondary" onClick={onRecargar}>
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Buscar por nombre o apellido..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Lista de contactos */}
      <div className="contact-list">
        {renderContenido()}
      </div>
    </div>
  );
}

export default ContactList;
