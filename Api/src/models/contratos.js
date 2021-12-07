const mongoose = require('mongoose');
const schema = mongoose.Schema;

const contratosSchema = schema({
    Codigo: String,
    Nombre: String,
    Homologo: String,
    Descripcion: String,
    Alcance: String,
    Activo: Boolean,
    IdCliente: { type: schema.Types.ObjectId, ref: 'clientes' },
    Poblacion: Number,
    FechaInicioContrato: String,
    FechaFinContrato: String,
    ValorContrato: Number,
    Empresa: { type: schema.Types.ObjectId, ref: 'empresas' },
    IdUsuarioRegistro: String,
    FechaRegistro: Date,
    IdUsuarioActualizacion: String,
    FechaActualizacion: Date,
    IdPais: { type: schema.Types.ObjectId, ref: 'paises' }, 
    NombrePais: String,
    Pais: Object,
    Municipio: { type: schema.Types.ObjectId, ref: 'municipios' },
    idMunicipio: { type: schema.Types.ObjectId, ref: 'municipios' },
    NombreMunicipio: String,
    id: String
});

const contratos = mongoose.model('contratos', contratosSchema);

module.exports = contratos;