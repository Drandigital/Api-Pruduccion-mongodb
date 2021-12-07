const mongoose = require('mongoose');
const schema = mongoose.Schema;

const forosSchema = schema({
    Codigo: String,
    Nombre: String,
    Descripcion: String,
    Empresa: { type: schema.Types.ObjectId, ref: 'empresas' }
});

const foros = mongoose.model('foros', forosSchema);

module.exports = foros;