const mongoose = require('mongoose');
const schema = mongoose.Schema;

const empresaSchema = schema({

    IdEmpresa: String
    ,Identificacion: String
    ,IdTipoIdentificacion: String
    ,TipoIdentificacion: String
    ,DigitoVerificacion: String
    ,Nombre: String
    ,Direccion: String
    ,Telefono1: String
    ,Telefono2: String
    ,Celular: String
    ,Correo: String
    ,IdPais : String
    ,Pais : String
    ,IdMunicipio : String
    ,Municipio: Object
    ,Logo: String
    ,LogoInicioSesion: String
    ,LogoImpresion: String
    ,FechaActualizacion: Date
    ,UsuarioActualizacion: String
    ,PaginaWeb: String
    ,Activo: Boolean

});

const empresa = mongoose.model('empresas', empresaSchema);
module.exports = empresa;