const listar = require('./listar');
const buscar = require('./buscar');
const insertar = require('./insertar');
const actualizar = require('./actualizar');
const eliminar = require('./eliminar');
const validarIngreso = require('./validarIngreso');
const listarPorTipo = require('./listarPorTipo');

module.exports = {
  listar,
  buscar,
  insertar,
  actualizar,
  eliminar,
  validarIngreso,
  listarPorTipo
}
