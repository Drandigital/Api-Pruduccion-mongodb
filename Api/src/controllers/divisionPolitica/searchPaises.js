const inputValidation = require('../../middlewares/inputValidation');
const schema = require('./find.schema');
const divisionPoliticaRepository = require('../../repositories/divisionPolitica');
const constants = require('../../constants');

const validate = inputValidation.validate(schema);

async function handler(req, res, next) {
  try {

    //find
    let response = await divisionPoliticaRepository.searchPaises();

    //set status code
    let statusCode;
    switch (response.status) {
      case constants.NOT_FOUND_ERROR_MESSAGE:
        statusCode = 404;
        break;
      case constants.INTERNAL_ERROR_MESSAGE:
        statusCode = 500;
        break;
      default:
        statusCode = 200;
    }
    //Response Object
    let oResponse = {
      paises: response.paises
    }

    //return response
    if (statusCode !== 200) {
      oResponse.status = response.status;
      oResponse.error = {
        code: response.failure_code,
        message: response.failure_message
      }
    }

    res.status(statusCode).send(oResponse);

  } catch (error) {
    next(error);
  }
}

module.exports = [validate, handler];
