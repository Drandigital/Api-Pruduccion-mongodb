const mongoose = require('mongoose');
const schema = mongoose.Schema;

const encuestasSchema = schema({
    Codigo: String,
    Nombre: String,
    Descripcion: String,
    Empresa: { type: schema.Types.ObjectId, ref: 'empresas' }
});

const encuestas = mongoose.model('encuestas', encuestasSchema);

module.exports = encuestas;