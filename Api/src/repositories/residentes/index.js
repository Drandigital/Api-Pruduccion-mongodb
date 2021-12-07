const constants = require('../../constants');
const objModel = require('../../models/usuarios');
const mongo = require('mongodb');
var sanitize = require('mongo-sanitize');

const repo = {

  listar: async (idEmpresa) => {
    try {
      //find query
      let query = {"Empresa": new mongo.ObjectID(idEmpresa), $or : [ { "TipoResidente" : "RE" }, { "TipoResidente" : "CP" } ]};
     
      //find object
      let response = await objModel.find(query).sort('PrimerNombre');

      //set values
      let status, failure_code, failure_message;

      status = constants.SUCCEEDED_MESSAGE;

      //return response
      return {
        status: status,
        datos: response,
        failure_code: failure_code,
        failure_message: failure_message,
      };

    } catch (e2) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: e2.code,
        failure_message: e2.message,
      };
    }
  },

  buscar: async ({ findObject }) => {
    try {
      //find query
      let query = {};
      query[findObject.key] = findObject.value;

      //find object
      let response = await objModel.find(query).populate('Rol').populate('Empresa').sort('PrimerNombre');
      
      //set values
      let status, failure_code, failure_message;

      status = constants.SUCCEEDED_MESSAGE;

      //return response
      return {
        status: status,
        datos: response,
        failure_code: failure_code,
        failure_message: failure_message,
      };

    } catch (e2) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: e2.code,
        failure_message: e2.message,
      };
    }
  },

  insertar: async (objData) => {
    try {

      let status, failure_code, failure_message;

      //find object
      let response = await objModel.insertMany([objData]);

      //set values
      if (response != null && response.length > 0) {
        //Set status
        status = constants.SUCCEEDED_MESSAGE;
      } else {
        //Set status
        status = constants.SUCCEEDED_MESSAGE;
      }

      //return response
      return {
        status: status,
        datos: response,
        failure_code: failure_code,
        failure_message: failure_message
      };

    } catch (e2) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: e2.code,
        failure_message: e2.message,
      };
    }
  },

  actualizar: async (objData) => {
    try {

      let status, failure_code, failure_message;

      let objFiltro = { _id: objData._id };

      //find object
      response = await objModel.findOneAndUpdate(objFiltro, objData, { new: true }) // { new: true } para que retorne la data actualizada 

      //set values
      if (response != null && response.length > 0) {
        //Set status
        status = constants.SUCCEEDED_MESSAGE;
      } else {
        //Set status
        status = constants.SUCCEEDED_MESSAGE;
      }

      //return response
      return {
        status: status,
        datos: response,
        failure_code: failure_code,
        failure_message: failure_message,
      };

    } catch (e2) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: e2.code,
        failure_message: e2.message,
      };
    }
  },

  eliminar: async (objdata) => {
    try {

      let status, failure_code, failure_message;
        
      let objFiltro = { _id: objdata._id };

      //find object
      let response = await objModel.findOneAndRemove(objFiltro, objdata);

      console.log("Respuesta eliminación de usuario: ", response);

      //set values
      if (response != null && response.length > 0) {
        //Set status
        status = constants.SUCCEEDED_MESSAGE;
      } else {
        //Set status
        status = constants.SUCCEEDED_MESSAGE;
      }

      //return response
      return {
        status: status,
        datos: response,
        failure_code: failure_code,
        failure_message: failure_message,
      };

    } catch (e2) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: e2.code,
        failure_message: e2.message,
      };
    }
  },

  validarIngreso: async (findObject) => {

    
    try {

      //find object
      let response = await objModel.find(findObject).populate('Empresa').sort('PrimerNombre').populate('Rol');

      //set values
      let status, failure_code, failure_message;

      status = constants.SUCCEEDED_MESSAGE;

      //return response
      return {
        status: status,
        residentes: response,
        failure_code: failure_code,
        failure_message: failure_message,
      };

    } catch (e2) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: e2.code,
        failure_message: e2.message,
      };
    }
  },

  validarIngreso2: async (findObject) => {
    
    try {

      for (const prop in findObject) {
        findObject[prop] = sanitize(findObject[prop]);
        
      }
      
      //find object
      let response = await objModel.find(findObject).populate('Rol');

      //set values
      let status, failure_code, failure_message;

      status = constants.SUCCEEDED_MESSAGE;

      //return response
      return {
        status: status,
        residentes: response,
        failure_code: failure_code,
        failure_message: failure_message,
      };

    } catch (e2) {
      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        failure_code: e2.code,
        failure_message: e2.message,
      };
    }
  }

}; module.exports = repo;
