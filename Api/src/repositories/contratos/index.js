const constants = require('../../constants');
const objModel = require('../../models/contratos');
const mongo = require('mongodb');

const repo = {

    listar: async(idEmpresa) => {
        try {
            //find query
            let query = { "Empresa": new mongo.ObjectID(idEmpresa) };
            //let query = { "Codigo": "001" };

            //find object
            let response = await objModel.find(query).sort('Nombre');

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

    buscar: async({ findObject }) => {
        try {
            //find query
            let query = {};
            query[findObject.key] = findObject.value;

            //find object
            let response = await objModel.find(query).sort('Nombre');

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

    insertar: async(objData) => {
        try {

            let status, failure_code, failure_message;

            //insert object
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

    actualizar: async(objData) => {
        try {

            let status, failure_code, failure_message;

            let objFiltro = { _id: objData._id };

            //update object
            let response = await objModel.findOneAndUpdate(objFiltro, objData);

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

    eliminar: async(objdata) => {
        try {

            let status, failure_code, failure_message;

            let objFiltro = { _id: objdata._id };

            //find object
            let response = await objModel.findOneAndRemove(objFiltro, objdata);

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
    }

};
module.exports = repo;