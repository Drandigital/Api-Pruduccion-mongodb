const mongoose = require('mongoose');
const schema = mongoose.Schema;

const barriosSchema = schema({
    codigo: String,
    nombre: String,
    idMunicipio: { type: schema.Types.ObjectId, ref: 'municipios' },
    idCorregimiento: { type: schema.Types.ObjectId, ref: 'corregimientos' },
    idPais: { type: schema.Types.ObjectId, ref: 'paises' },
    idLocalidad: { type: schema.Types.ObjectId, ref: 'localidades' }
});

const barrios = mongoose.model('barrios', barriosSchema);

module.exports = barrios;