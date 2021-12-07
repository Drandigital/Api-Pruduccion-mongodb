const mongoose = require('mongoose');
const schema = mongoose.Schema;

const corregimientosSchema = schema({
    codigo: String,
    nombre: String,
    idMunicipio: { type: schema.Types.ObjectId, ref: 'municipios' },
    idPais: { type: schema.Types.ObjectId, ref: 'paises' }
});

const corregimientos = mongoose.model('localidades', corregimientosSchema);

module.exports = corregimientos;