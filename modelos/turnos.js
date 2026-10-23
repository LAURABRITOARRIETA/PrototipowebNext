/**
 * @file turno.js
 * @description Modelo que representa la estructura de un turno en el sistema.
 */

class Turno {
  constructor(id, nombre, cedula, tramite, estaado) {
    this.id = id;
    this.nombre = nombre;
    this.cedula = cedula;
    this.tramite = tramite;
    this.estaado = estaado; 
  }
}

module.exports = Turno;
