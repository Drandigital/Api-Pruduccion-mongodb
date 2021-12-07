const constants = require('../../constants');
const objModel = require('../../models/empresas');
const uuidv1 = require('../../../node_modules/uuid/v1');

const v1options = {
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: new Date().getTime(),
  nsecs: 5678
};

uuidv1(v1options);

const repo = {

  buscar: async ({ findObject }) => {
    try {
      //find query
      let query = {};
      query[findObject.key] = findObject.value;

      console.log("query empresa --> ", query);

      //find object
      let response = await objModel.find(query).sort('Nombre');

      //set values
      let status, failure_code, failure_message;

      status = constants.SUCCEEDED_MESSAGE;

      //return response
      return {
        status: status,
        empresas: response,
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

      objData.IdEmpresa = uuidv1(); //obtener Id 
      objData.id = objData.IdEmpresa; //obtener Id 

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
        empresas: response,
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

  actualizar: async (objData) => {

    let status, failure_code, failure_message, sMensaje, objRespuesta, bError;

    try {

      let objFiltro = { _id: objData.IdEmpresa };

      //find object
      let response = await objModel.update(objFiltro, objData, { returnNewDocument: true });

      //console.log(response);

      if (response && response.ok) {

        if (response.ok > 0) {

          sMensaje = "Registro guardado con éxito."
          bError: false;

        } else {

          sMensaje = "No se guardo."
          bError: true;

        }

      }

      status = constants.SUCCEEDED_MESSAGE;

      objRespuesta = {
        result: response
        , Mensaje: sMensaje
        , Error: false
      }

      //return response
      return {
        status: status,
        empresas: objRespuesta,
        failure_code: failure_code,
        failure_message: failure_message
      };

    } catch (e2) {

      objRespuesta = {
        Mensaje: sMensaje
        , Error: true
      }

      return {
        status: constants.INTERNAL_ERROR_MESSAGE,
        empresas: objRespuesta,
        failure_code: e2.code,
        failure_message: e2.message,
      };
    }
  },

  eliminar: async (objdata) => {
    try {

      let status, failure_code, failure_message;

      let objFiltro = { IdEmpresa: objdata.IdEmpresa };

      //find object
      let response = await objModel.findOneAndRemove(objFiltro, objSede);

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
        empresas: response,
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
