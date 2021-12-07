const mongoose = require('mongoose');
const schema = mongoose.Schema;

const paisesSchema = schema({
    Codigo: String
    ,NombreEspañol: String
    ,NombreIngles: String
    ,NombreFrances: String
    ,CodIso2: String
    ,CodIso3: String
    ,CodPhone: String
    ,id: String
    ,text: String
});

const paises = mongoose.model('paises', paisesSchema);

module.exports = paises;