const mongoose = require('mongoose');
const schema = mongoose.Schema;

const corregimientosSchema = schema({
    codigo: String,
    nombre: String,
    idMunicipio: { type: schema.Types.ObjectId, ref: 'municipios' },
    idCorregimiento: { type: schema.Types.ObjectId, ref: 'corregimientos' },
    idPais: { type: schema.Types.ObjectId, ref: 'paises' }
});

const corregimientos = mongoose.model('corregimientos', corregimientosSchema);

module.exports = corregimientos;