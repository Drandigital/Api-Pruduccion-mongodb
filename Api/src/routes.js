const express = require("express");
const router = express.Router();

module.exports = () => {
  //index
  const indexRouter = express.Router();
  indexRouter.get("/", (req, res) => {
    res.status(200).json({ response: "Mongo API is working properly." });
  });

  const requestsRouter = express.Router();
  const divisionPoliticaController = require("./controllers/divisionPolitica");
  // const sedesController = require("./controllers/sedes");
  const empresasController = require("./controllers/empresas");
  const usuariosController = require("./controllers/usuarios");
  const rolesController = require("./controllers/roles");
  const eventosController = require("./controllers/eventos");
  const encuestasController = require("./controllers/encuestas");
  const interfacesController = require("./controllers/interfaces");
  const contratosController = require('./controllers/contratos');
  const forosController = require('./controllers/foros');
  const residentesController = require('./controllers/residentes');

  //divisionPolitica
  requestsRouter.get('/municipios/:key/:value', divisionPoliticaController.findMunicipios);
  requestsRouter.get('/paises/:key/:value', divisionPoliticaController.findPaises);
  requestsRouter.get('/paises/', divisionPoliticaController.searchPaises);
  requestsRouter.get('/corregimientos/:key/:value', divisionPoliticaController.findCorregimientos);
  requestsRouter.get('/corregimientos/', divisionPoliticaController.searchCorregimientos);
  requestsRouter.get('/localidades/:key/:value', divisionPoliticaController.findLocalidades);
  requestsRouter.get('/localidades/', divisionPoliticaController.searchLocalidades);
  requestsRouter.get('/barrios/:key/:value', divisionPoliticaController.findBarrios);
  requestsRouter.get('/barrios/', divisionPoliticaController.searchBarrios);

  //empresas
  requestsRouter.get("/empresas/:key/:value", empresasController.buscar);
  requestsRouter.post("/empresas/actualizar", empresasController.actualizar);

  //usuarios
  requestsRouter.get("/usuarios/listar/:value", usuariosController.listar);
  requestsRouter.get("/usuarios/:key/:value", usuariosController.buscar);
  requestsRouter.post("/usuarios/insertar", usuariosController.insertar);
  requestsRouter.post("/usuarios/eliminar", usuariosController.eliminar);
  requestsRouter.post("/usuarios/actualizar", usuariosController.actualizar);
  requestsRouter.post("/usuarios/validarIngreso", usuariosController.validarIngreso);
  requestsRouter.post("/usuarios/validarIngreso2",usuariosController.validarIngreso);
  requestsRouter.post("/usuarios/listarPorTipo",usuariosController.listarPorTipo);

  //roles
  requestsRouter.get("/roles/listar/:value", rolesController.listar);
  requestsRouter.get("/roles/:key/:value", rolesController.buscar);
  requestsRouter.post("/roles/insertar", rolesController.insertar);
  requestsRouter.post("/roles/eliminar", rolesController.eliminar);
  requestsRouter.post("/roles/actualizar", rolesController.actualizar);

  //interfaces
  requestsRouter.get("/interfaces/", interfacesController.buscar);


  //contratos
  requestsRouter.get('/contratos/listar/:value', contratosController.listar);
  requestsRouter.get('/contratos/:key/:value', contratosController.buscar);
  requestsRouter.post('/contratos/insertar', contratosController.insertar);
  requestsRouter.post('/contratos/eliminar', contratosController.eliminar);
  requestsRouter.post('/contratos/actualizar', contratosController.actualizar);

  //Residentes
  requestsRouter.get('/residentes/listar/:value', residentesController.listar);
  requestsRouter.get('/residentes/:key/:value', residentesController.buscar);
  requestsRouter.post('/residentes/insertar', residentesController.insertar);
  requestsRouter.post('/residentes/eliminar', residentesController.eliminar);
  requestsRouter.post('/residentes/actualizar', residentesController.actualizar);
  
//foros  
requestsRouter.get('/foros/listar/:value', forosController.listar);
requestsRouter.get('/foros/:key/:value', forosController.buscar);
requestsRouter.post('/foros/insertar', forosController.insertar);
requestsRouter.post('/foros/eliminar', forosController.eliminar);
requestsRouter.post('/foros/actualizar', forosController.actualizar);

//encuestas  
requestsRouter.get('/encuestas/listar/:value', encuestasController.listar);
requestsRouter.get('/encuestas/:key/:value', encuestasController.buscar);
requestsRouter.post('/encuestas/insertar', encuestasController.insertar);
requestsRouter.post('/encuestas/eliminar', encuestasController.eliminar);
requestsRouter.post('/encuestas/actualizar', encuestasController.actualizar);

//eventos  
requestsRouter.get('/eventos/listar/:value', eventosController.listar);
requestsRouter.get('/eventos/:key/:value', eventosController.buscar);
requestsRouter.post('/eventos/insertar', eventosController.insertar);
requestsRouter.post('/eventos/eliminar', eventosController.eliminar);
requestsRouter.post('/eventos/actualizar', eventosController.actualizar);

  //request
  router.use("/", indexRouter);
  router.use("/", requestsRouter);

  return router;
};
