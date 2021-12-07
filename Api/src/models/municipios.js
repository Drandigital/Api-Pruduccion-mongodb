const mongoose = require('mongoose');
const schema = mongoose.Schema;

const municipiosSchema = schema({
    IdMunicipio: String
    ,Municipio: String
    ,IdDepartamento: String
    ,Departamento: String
    ,IdPais: String
    ,Pais: { type: schema.Types.ObjectId, ref: 'paises' }
    ,id: String
    ,text: String
});

const municipios = mongoose.model('municipios', municipiosSchema);

module.exports = municipios;
