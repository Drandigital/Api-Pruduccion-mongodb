const mongoose = require('mongoose');
const schema = mongoose.Schema;

const residenteSchema = schema({
    IdResidentes: String,
    TipoIdentificacion: String,
    Identificacion: String,
    PrimerNombre: String,
    SegundoNombre: String,
    PrimerApellido: String,
    SegundoApellido: String,
    NombreCompleto: String,
    IdEmpresa: String,
    Empresa: { type: schema.Types.ObjectId, ref: 'empresas' },
    Login: String,
    Clave: String,
    FechaNacimiento: Date,
    IdPais: String,
    NombrePais: String,
    Pais: Object,
    Municipio: Object,
    IdMunicipio: String,
    NombreMunicipio: String,
    Email: String,
    Direccion: String,
    Celular: String,
    Telefono: String,
    Foto: String,
    Activo: Boolean,
    IdUsuarioRegistro: String,
    FechaRegistro: Date,
    IdUsuarioActualizacion: String,
    FechaActualizacion: Date,
    IdRol: String,
    Rol: { type: schema.Types.ObjectId, ref: 'roles' }
});

const residentes = mongoose.model('residentes', residenteSchema);
module.exports = residentes;