const constants = require('../../constants');
const municipiosModel = require('../../models/municipios');
const paisesModel = require('../../models/paises');
const corregimientosModel = require('../../models/corregimientos');
const localidadesModel = require('../../models/localidades');
const barriosModel = require('../../models/barrios');

const repo = {

    findMunicipios: async ({ findObject }) => {
        try {
            //find query
            let query = {};
            query[findObject.key] = (findObject.value);

            //find object
            let response = await municipiosModel.find(query).sort('text');

            //set values
            let status, failure_code, failure_message;
            //Set status
            status = constants.SUCCEEDED_MESSAGE;

            //return response
            return {
                status: status,
                municipios: response,
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

    findPaises: async ({ findObject }) => {
        try {
            //find query
            let query = {};
            query[findObject.key] = (findObject.value);

            //find object
            let response = await paisesModel.find(query).sort('text');

            //set values
            let status, failure_code, failure_message;
            //Set status
            status = constants.SUCCEEDED_MESSAGE;

            //return response
            return {
                status: status,
                paises: response,
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

    searchPaises: async () => {
        try {
            //find object
            let response = await paisesModel.find().sort('text');

            //return response
            return {
                status: constants.SUCCEEDED_MESSAGE,
                paises: response,
                failure_code: null,
                failure_message: null,
            };

        } catch (e2) {
            return {
                status: constants.INTERNAL_ERROR_MESSAGE,
                failure_code: e2.code,
                failure_message: e2.message,
            };
        }
    },

    searchCorregimientos: async () => {
        try {

            //find object
            let response = await corregimientosModel.find().populate('idPais').populate('idMunicipio').sort('text');

            //return response
            return {
                status: constants.SUCCEEDED_MESSAGE,
                datos: response,
                failure_code: null,
                failure_message: null,
            };

        } catch (e2) {
            return {
                status: constants.INTERNAL_ERROR_MESSAGE,
                failure_code: e2.code,
                failure_message: e2.message,
            };
        }
    },

    findCorregimientos: async ({ findObject }) => {
        try {
            //find query
            let query = {};

            query[findObject.key] = (findObject.value);

            //find object
            let response = await corregimientosModel.find(query).sort('text');

            //set values
            let status, failure_code, failure_message;
            //Set status
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

    searchLocalidades: async () => {
        try {

            //find object
            let response = await localidadesModel.find().populate('idPais').populate('idMunicipio').sort('text');

            //return response
            return {
                status: constants.SUCCEEDED_MESSAGE,
                datos: response,
                failure_code: null,
                failure_message: null,
            };

        } catch (e2) {
            return {
                status: constants.INTERNAL_ERROR_MESSAGE,
                failure_code: e2.code,
                failure_message: e2.message,
            };
        }
    },

    findLocalidades: async ({ findObject }) => {
        try {
            //find query
            let query = {};

            query[findObject.key] = (findObject.value);

            //find object
            let response = await localidadesModel.find(query).sort('text');

            //set values
            let status, failure_code, failure_message;
            //Set status
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

    searchBarrios: async () => {
        try {

            //find object
            let response = await barriosModel.find().populate('idPais').populate('idMunicipio').populate('idCorregimiento').sort('text');

            //return response
            return {
                status: constants.SUCCEEDED_MESSAGE,
                datos: response,
                failure_code: null,
                failure_message: null,
            };

        } catch (e2) {
            return {
                status: constants.INTERNAL_ERROR_MESSAGE,
                failure_code: e2.code,
                failure_message: e2.message,
            };
        }
    },

    findBarrios: async ({ findObject }) => {
        try {
            //find query
            let query = {};

            query[findObject.key] = (findObject.value);

            //find object
            let response = await barriosModel.find(query).sort('text');

            //set values
            let status, failure_code, failure_message;
            //Set status
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
    }



}; module.exports = repo;
