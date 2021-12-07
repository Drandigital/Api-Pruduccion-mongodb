const mongoose = require('mongoose');
const schema = mongoose.Schema;

const eventosSchema = schema({
    Codigo: String,
    Nombre: String,
    Descripcion: String,
    Empresa: { type: schema.Types.ObjectId, ref: 'empresas' }
});

const eventos = mongoose.model('eventos', eventosSchema);

module.exports = eventos;