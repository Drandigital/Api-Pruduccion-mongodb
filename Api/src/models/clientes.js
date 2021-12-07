const mongoose = require('mongoose');
const schema = mongoose.Schema;

const clienteSchema = schema({
    empresa: { type: schema.Types.ObjectId, ref: 'empresas' },
    razonSocial: String,
    nit: String,
    codigoHabilitacion: String,
    idMunicipio: { type: schema.Types.ObjectId, ref: 'municipios' },
    idPais: { type: schema.Types.ObjectId, ref: 'paises' },
    responsable: String,
    telefono: String,
    correo: String,
    Homologo: String,
    direccion: String,
    Empresa: { type: schema.Types.ObjectId, ref: 'empresas' },
});

const cliente = mongoose.model('clientes', clienteSchema);
module.exports = cliente;