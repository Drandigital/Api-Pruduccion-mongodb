var gObjGrid = null;
var gsIdMunicipio = null;
var gObjEventoImagen = null; 
var gIndicadores = null;
var gIndicadoresAsociados = null;


$(document).ready(function () {
    inicializarVentana();
});

function mostrarFormulario(bMostrar) {
    limipiarFormulario();
    if (bMostrar) {
        $(".btnFormulario").removeClass("cssOcultarObjeto");
        $(".btnLista").addClass("cssOcultarObjeto");
        parent.habilitarBotones(true, "|G|C|E|");
    } else {
        $(".btnFormulario").addClass("cssOcultarObjeto");
        $(".btnLista").removeClass("cssOcultarObjeto");
        parent.habilitarBotones(true, "|N|");
        consultarUsuarios();
    }
}

function nuevo() {
    mostrarFormulario(true);
    parent.habilitarBotones(true, "|G|C|");
}

function cancelar() {
    mostrarFormulario(false);
}

function limipiarFormulario() {
    $("input").val("");
    $("select").val("169").trigger("change");
    gsIdMunicipio = null;
    objImgFoto = "";
    $("#hidden_IdUsuario").val("");
    $("#select_IndicadoresAsociados").val("").trigger("change");
    $("#select_IndicadoresResponde").val("").trigger("change");

    if (document.getElementById("input_Activo") !== null) {
        if (!document.getElementById("input_Activo").checked) {
            document.getElementById("input_Activo").click();
        }
    }

    $(".cssCampoObligatorio").removeClass("cssCampoObligatorio");
    $(".cssCampoObligatorio").removeClass("cssCampoObligatorio");
    document.getElementById("select_IndicadoresResponde").setAttribute('disabled', 'disabled');
    document.getElementById("select_IndicadoresAsociados").setAttribute('disabled', 'disabled');
    
}

function inicializarVentana() {


    consultarPaises();
    consultarRoles();
    crearComboBuscador("select_Rol", null, "Seleccionar rol");
    crearComboBuscador("select_TipoIdentificacion", null, "Seleccionar tipo identificación");
    crearComboBuscador("select_Municipio", [], "Seleccionar municipio");
    armarDataTableLista([]);
    consultarUsuarios();

    parent.habilitarBotones(true, "|N|");

    var elem = document.querySelector('.js-switch');
    var switchery = new Switchery(elem, { color: '#1AB394' });

    marcarCamposRequeridos("#div_Formulario");

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('input_FileImagen').addEventListener('change', handleFileSelect, false);
    } else {
        mostrarAlertas('No es posible subir imagenes usando este navegador web.', "error");
    }


  consultarIndicadores("");
    
}

function consultarTiposIdentificacion() {
    $.ajax({
        type: "GET",
        url: gsUrlApi + "/paises",
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.Error) {
                mostrarAlertas(result.Mensaje, "error");
                return;
            }

            crearComboBuscador("select_Pais", result.paises, "Seleccionar país");
            $("#select_Pais").on("select2:select", consultarMunicipios);

            $("#select_Pais").val("169").trigger("change");
            consultarMunicipios();
        },
        error: function (e) {
            mostrarAlertas("Error en ajax al cargar tipos de identificación.", "error");
        }
    });
}

Array.prototype.unique = function (a) {
    return function () { return this.filter(a) }
}(function (a, b, c) {
    return c.indexOf(a, b + 1) < 0
});



function consultarIndicadores(user) {

    var sIdEmpresa = obtenerQueryString("IdEmpresa");
    
   
        $.ajax({
            type: "GET",
            url: gsUrlApi + "/indicadores/listarUsuarios/empresa/" + sIdEmpresa,
            headers: gsAutenticacion,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.Error) {
                    mostrarAlertas(result.Mensaje, "error");
                    return;
                }
                gIndicadores = result.datos;

                crearComboBuscador(
                    "select_IndicadoresResponde",
                    result.datos,
                    "Responsable",
                    null,
                    "_id",
                    "Nombre"
                );

                crearComboBuscador(
                    "select_IndicadoresAsociados",
                    result.datos,
                    "Usuarios",
                    null,
                    "_id",
                    "Nombre"
                );

                //Responsables
                var arrayIndicadores = [];
                for (let i = 0; i < result.datos.length; i++) {
                    const Indicadores = result.datos[i];
                    if (Indicadores.ResponsableDeIndicador) {
                        if (Indicadores.ResponsableDeIndicador._id == user) {
                            arrayIndicadores.push(Indicadores._id);

                        }

                    }


                }
                $("#select_IndicadoresResponde").val(arrayIndicadores).trigger("change");

                //asociados

                var arrayIndicadores = [];
                for (let i = 0; i < result.datos.length; i++) {
                    const Indicadores = result.datos[i];
                    if (Indicadores.Usuarios) {

                        for (let i = 0; i < Indicadores.Usuarios.length; i++) {
                            const usuario = Indicadores.Usuarios[i];
                            if (usuario._id == user) {
                                arrayIndicadores.push(Indicadores._id);

                            }

                        }

                    }


                }
                gIndicadoresAsociados = arrayIndicadores.unique();
                document.getElementById("select_IndicadoresAsociados").removeAttribute("disabled");
                document.getElementById("select_IndicadoresResponde").removeAttribute("disabled");

                $("#select_IndicadoresAsociados").val(arrayIndicadores.unique()).trigger("change");

            },
            error: function (e) {
                mostrarAlertas("Error en ajax al cargar usuarios.", "error");
            }
        });
        
    
    

}



function consultarRoles() {
    var sIdEmpresa = obtenerQueryString("IdEmpresa");

    $.ajax({
        type: "GET",
        url: gsUrlApi + "/roles/listar/" + sIdEmpresa,
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.Error) {
                mostrarAlertas(result.Mensaje, "error");
                return;
            }

            crearComboBuscador("select_Rol", result.datos, "Seleccionar rol",null,
                "_id",
                "Nombre");
        },
        error: function (e) {
            mostrarAlertas("Error en ajax al cargar los roles.", "error");
        }
    });
}

function consultarPaises() {
    $.ajax({
        type: "GET",
        url: gsUrlApi + "/paises",
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.Error) {
                mostrarAlertas(result.Mensaje, "error");
                return;
            }

            crearComboBuscador("select_Pais", result.paises, "Seleccionar país");
            $("#select_Pais").on("select2:select", consultarMunicipios);
            $("#select_Pais").val("169").trigger("change");
            try {
                consultarMunicipios();
            } catch (error) {
                
            }
            
        },
        error: function (e) {
            mostrarAlertas("Error en ajax al cargar paises.", "error");
        }
    });
}

function consultarUsuarios() {

    var sIdEmpresa = obtenerQueryString("IdEmpresa");

    $.ajax({
        type: "GET",
        url: gsUrlApi + "/usuarios/listar/" + sIdEmpresa,
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.Error) {
                mostrarAlertas(result.Mensaje, "error");
                return;
            }
            $("#table_Lista").dataTable().fnDestroy();
            armarDataTableLista(result.datos === null ? [] : result.datos);
            
        },
        error: function (e) {
            mostrarAlertas("Error en ajax al cargar usuarios.", "error");
        }
    });

}

function consultarMunicipios() {
    var sPais = document.getElementById("select_Pais").value;

    $.ajax({
        type: "GET",
        url: gsUrlApi + "/municipios/IdPais/" + sPais,
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.Error) {
                mostrarAlertas(result.Mensaje, "error");
                return;
            }

            var lstData = result.municipios;
            crearComboBuscador("select_Municipio", lstData, "Seleccionar municipio");

            if (lstData.length > 0) {
                $("#select_Municipio").prop("disabled", false);
                if (gsIdMunicipio !== null) {
                    $("#select_Municipio").val(gsIdMunicipio).trigger("change");
                }
            } else {
                $("#select_Municipio").prop("disabled", true);
            }
        },
        error: function (e) {
            mostrarAlertas("Error en ajax en consultarMunicipios().", "error");
        }
    });

}

function actualizarIndicadoresResponsable(IndicadoresResponsable) {

    var usuario = $("#hidden_IdUsuario").val();

    $.ajax({
        type: "GET",
        url: gsUrlApi + "/indicadores/ResponsableDeIndicadorUpdate/" + IndicadoresResponsable+"/"+usuario+"/",
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.Error) {
                mostrarAlertas(result.Mensaje, "error");
                return;
            }

        },
        error: function (e) {
            mostrarAlertas("Error en ajax al cargar tipos de identificación.", "error");
        }
    });

    
}
function actualizarIndicadoresAsociados(arrUsuarios,IdIndicador) {

    var sIdEmpresa = "5d827056789be822b4085b68";

    var usuario = $("#hidden_IdUsuario").val();

    var objUsuario = arrUsuarios;

    sDataUsuario = JSON.stringify(objUsuario);

    $.ajax({
        type: "POST",
        url: gsUrlApi + "/indicadores/AsociadosIndicadorUpdate/" + IdIndicador+"/",
        data: sDataUsuario,
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.Error) {
                mostrarAlertas(result.Mensaje, "error");
                return;
            }

            
        },
        error: function (e) {
            mostrarAlertas("Error en ajax al gestionar el guardado del usuario. " + e.responseJSON.error.message, "error");
            parent.habilitarBotones(true, "|G|C|E|");

        }
    });


}



function guardar() {

    var objUsuario = new Object();
    var sDataUsuario = "";
    var sAccion = "";

    try {

        parent.habilitarBotones()

        if (ValidarCamposJson("#div_Formulario")) {

            objUsuario.Login = $("#input_Login").val();
            objUsuario.Clave = $("#input_Clave").val();
            objUsuario.TipoIdentificacion = $("#select_TipoIdentificacion").val();
            objUsuario.Identificacion = $("#input_Identificacion").val();
            objUsuario.PrimerNombre = $("#input_PrimerNombre").val();
            objUsuario.SegundoNombre = $("#input_SegundoNombre").val();
            objUsuario.PrimerApellido = $("#input_PrimerApellido").val();
            objUsuario.SegundoApellido = $("#input_SegundoApellido").val();
            objUsuario.NombreCompleto = objUsuario.PrimerNombre + ' ' + objUsuario.SegundoNombre + ' ' + objUsuario.PrimerApellido + ' ' + objUsuario.SegundoApellido;
            objUsuario.FechaNacimiento = $("#input_FechaNacimiento").val();
            objUsuario.Email = $("#input_Email").val();
            objUsuario.Telefono = $("#input_Telefono").val();
            objUsuario.Celular = $("#input_Celular").val();
            objUsuario.IdPais = $("#select_Pais").val();
            objUsuario.IdRol = $("#select_Rol").val();
            objUsuario.Rol = $("#select_Rol").val();
            objUsuario.IdMunicipio = $("#select_Municipio").val();
            objUsuario.Direccion = $("#input_Direccion").val();
            objUsuario.Activo = document.getElementById("input_Activo").checked;
            objUsuario.Empresa = obtenerQueryString("IdEmpresa");
            objUsuario.IdUsuarioRegistro = obtenerQueryString("IdUsuario");
            objUsuario.FechaRegistro = new Date();
            objUsuario.IdUsuarioActualizacion = obtenerQueryString("IdUsuario");
            objUsuario.FechaActualizacion = new Date();

            var objImgFoto = document.getElementById("img_Foto");
            if (objImgFoto) {
                objUsuario.Foto = objImgFoto.src.split('base64,')[1];
            }

            var usuario = $("#hidden_IdUsuario").val();


            var IndicadoresResponsable = $("#select_IndicadoresResponde").val();

            for (let i = 0; i < IndicadoresResponsable.length; i++) {
                const indicador = IndicadoresResponsable[i];
                actualizarIndicadoresResponsable(indicador);
                
            }

            var IndicadoresAsociados = $("#select_IndicadoresAsociados").val();

            console.log(IndicadoresAsociados);

            var IndicadoresDesasociados = gIndicadoresAsociados;


            
            //asociar 

            var gIndicadores_ = gIndicadores;
            
            for (let i = 0; i < IndicadoresAsociados.length; i++) {

                for (let z = 0; z < gIndicadores.length; z++) {

                    if (IndicadoresAsociados[i] == gIndicadores[z]._id) {

                        var agregar = true;

                        for (let k = 0; k < gIndicadores[z].Usuarios.length; k++) {
                            const UsuariosDeIndicadores = gIndicadores[z].Usuarios[k];
                            if (UsuariosDeIndicadores._id == usuario) {
                                agregar = false;
                            }

                        }
                        if (agregar) {
                            gIndicadores[z].Usuarios.push(usuario);
                        }

                        actualizarIndicadoresAsociados(gIndicadores[z].Usuarios, IndicadoresAsociados[i]);

                    }
                   

                }
                
            }

            
            //desasociar

            IndicadoresAsociados = [];
            IndicadoresAsociados = $("#select_IndicadoresAsociados").val();
            gIndicadores_ = [];
             gIndicadores_ = gIndicadores;
            console.log(IndicadoresDesasociados);
            var IndicadoresDesasociados_ = IndicadoresDesasociados;

            for (let i = 0; i < IndicadoresDesasociados.length; i++) {
                for (let j = 0; j < IndicadoresAsociados.length; j++) {
                    if (IndicadoresDesasociados[i] == IndicadoresAsociados[j]) {
                        IndicadoresDesasociados_.splice(i, 1);
                        
                    }
                    
                }
                
            }

            for (let i = 0; i < IndicadoresDesasociados_.length; i++) {

                for (let z = 0; z < gIndicadores.length; z++) {

                    if (IndicadoresDesasociados_[i] == gIndicadores[z]._id) {

                        for (let k = 0; k < gIndicadores[z].Usuarios.length; k++) {
                            const UsuariosDeIndicadores = gIndicadores[z].Usuarios[k];
                            if (UsuariosDeIndicadores._id == usuario) {
                                gIndicadores_[z].Usuarios.splice(k, 1);
                            }

                        }

                        console.log();
                        
                        actualizarIndicadoresAsociados(gIndicadores_[z].Usuarios, IndicadoresDesasociados_[i]);

                    }
                }
            }
            
            console.log(IndicadoresDesasociados_);

            
            if ($("#hidden_IdUsuario").val()) {
                sAccion = "actualizar";
                objUsuario._id = $("#hidden_IdUsuario").val();
            } else {
                sAccion = "insertar";
            }

            sDataUsuario = JSON.stringify(objUsuario);

            $.ajax({
                type: "POST",
                url: gsUrlApi + "/usuarios/" + sAccion,
                data: sDataUsuario,
                headers: gsAutenticacion,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    if (result.Error) {
                        mostrarAlertas(result.Mensaje, "error");
                        return;
                    }

                    mostrarAlertas("Registro guardado con éxito.", "success");
                    mostrarFormulario(false);

                    parent.actualizarDataUsuario(result.datos);

                    consultarUsuarios();
                },
                error: function (e) {
                    mostrarAlertas("Error en ajax al gestionar el guardado del usuario. " + e.responseJSON.error.message, "error");
                    parent.habilitarBotones(true, "|G|C|E|");

                }
            });

        } else {
            parent.habilitarBotones(true, "|G|C|E|");
        }

    } catch (e) {
        mostrarAlertas("Error al guardar:\n" + e.message, "error");
        parent.habilitarBotones(true, "|G|C|E|");
    }
}

function armarDataTableLista(lstData) {

    if (lstData !== null && lstData !== undefined) {
        //
        gObjGrid = $('#table_Lista').DataTable({
            data: lstData,
            //pageLength: 25,
            responsive: true,
            columns: [
                {
                    title: 'Tipo Identificación',
                    data: 'TipoIdentificacion',
                    render: function (data, type, row) {
                        var sResult = "";
                        if (row.Codigo !== "") {
                            sResult = '<label>' + data + '</label>';
                        }
                        return sResult;
                    },
                    orderable: false,
                    className: 'text-center',
                    width: '15%'
                }
                , {
                    title: 'Identificación',
                    data: 'Identificacion',
                    render: function (data, type, row) {
                        var sResult = "";
                        if (row.Codigo !== "") {
                            sResult = '<label>' + data + '</label>';
                        }
                        return sResult;
                    },
                    orderable: false,
                    className: 'text-center',
                    width: '15%'
                }
                , {
                    title: 'Nombre',
                    data: 'NombreCompleto',
                    render: function (data, type, row) {
                        var sResult = "";
                        sResult = '<label>' + data + '</label>';
                        return sResult;
                    },
                    orderable: false,
                    className: 'text-center',
                    width: '25%'
                }
                , {
                    title: 'Email',
                    data: 'Email',
                    render: function (data, type, row) {
                        var sResult = "";
                        sResult = '<label>' + data + '</label>';
                        return sResult;
                    },
                    orderable: false,
                    className: 'text-center',
                    width: '15%'
                }
                , {
                    title: 'Celular',
                    data: 'Celular',
                    render: function (data, type, row) {
                        var sResult = "";
                        sResult = '<label>' + data + '</label>';
                        return sResult;
                    },
                    orderable: false,
                    className: 'text-center',
                    width: '15%'
                }
                , {
                    title: 'Activo',
                    data: 'Activo',
                    render: function (data, type, row) {
                        var sResult = "";
                        if (data === true) {
                            sResult = '<label>SI</label>';
                        } else {
                            sResult = '<label>NO</label>';
                        }
                        return sResult;
                    },
                    orderable: false,
                    className: 'text-center',
                    width: '5%'
                }

            ],
            language: {
                sProcessing: "Procesando...",
                sLengthMenu: "Mostrar _MENU_ registros",
                sZeroRecords: "No se encontraron resultados",
                sEmptyTable: "Ningún dato disponible en esta tabla",
                sInfo: "Del _START_ al _END_ total ( _TOTAL_ ) registros",
                sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
                sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                sInfoPostFix: "",
                sSearch: "Buscar:",
                sUrl: "",
                sInfoThousands: ",",
                sLoadingRecords: "Cargando...",
                oPaginate: {
                    sFirst: "Primero",
                    sLast: "Último",
                    sNext: "Siguiente",
                    sPrevious: "Anterior"
                },
                oAria: {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            },
            autoWidth: false,
            lengthMenu: [[10, 25, 50], [10, 25, 50]],
            select: {
                style: 'single'
            }
        });



        $('#table_Lista').on('click', 'tbody tr', function () {
            if (gObjGrid.row(this).data() !== undefined && gObjGrid.row(this).data() !== null) {
                var objData = gObjGrid.row(this).data();
                mostrarFormulario(true);
                cargarDataUsuario(objData);
            }
        });

        $('#table_Lista').find('tbody tr').attr("title", "Dar click para editar");

    } else {
        limipiarFormulario();
    }
}

function eliminar() {

    var sIdRegistro = $("#hidden_IdUsuario").val();

    if (sIdRegistro) {
        mostrarAlertas("¿Desea eliminar el registro seleccionado?", "confirm", undefined, "Si", "No", "quitarRegistro", sIdRegistro)
    } else {
        mostrarAlertas("Error al obtener dato para eliminar el usuario.", "error");
    }
}

function quitarRegistro(sKey) {

    var objUsuario = new Object();
    objUsuario._id = sKey;
    var sDataUsuario = JSON.stringify(objUsuario);

    $.ajax({
        type: "POST",
        url: gsUrlApi + "/usuarios/eliminar",
        data: sDataUsuario,
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.Error) {
                mostrarAlertas(result.Mensaje, "error");
                return;
            }
            mostrarAlertas("Registro eliminado con éxito.", "success");
            cancelar();
        },
        error: function (e) {
            mostrarAlertas("Error en ajax al quitar registro. " + e.responseJSON.error.message, "error");
        }
    });
}

function cargarDataUsuario(objUsuario) {



    $("#hidden_IdUsuario").val(objUsuario._id);
    $("#input_Login").val(objUsuario.Login);
    $("#input_Clave").val(objUsuario.Clave);
    $("#select_TipoIdentificacion").val(objUsuario.TipoIdentificacion).trigger("change");
    $("#input_Identificacion").val(objUsuario.Identificacion);
    $("#input_PrimerNombre").val(objUsuario.PrimerNombre);
    $("#input_SegundoNombre").val(objUsuario.SegundoNombre);
    $("#input_PrimerApellido").val(objUsuario.PrimerApellido);
    $("#input_SegundoApellido").val(objUsuario.SegundoApellido);
    var dFecha = new Date(objUsuario.FechaNacimiento);
    $("#input_FechaNacimiento").val("2019-03-04");
    $("#input_Email").val(objUsuario.Email);
    $("#input_Telefono").val(objUsuario.Telefono);
    $("#input_Celular").val(objUsuario.Celular);
    //$("#select_Pais").val(objUsuario.Pais.id).trigger("change");
    $("#select_Pais").val(objUsuario.IdPais).trigger("change");
    //gsIdMunicipio = objUsuario.Municipio.id;
    gsIdMunicipio = objUsuario.IdMunicipio;
    consultarMunicipios();
    $("#input_Direccion").val(objUsuario.Direccion);
    $("#select_Rol").val(objUsuario.IdRol).trigger("change");

    if (document.getElementById("input_Activo") !== null) {
        if (document.getElementById("input_Activo").checked && !objUsuario.Activo) {
            document.getElementById("input_Activo").click();
        } else if (!document.getElementById("input_Activo").checked && objUsuario.Activo) {
            document.getElementById("input_Activo").click();
        }
    }

    

    var objImgFoto = document.getElementById("img_Foto");
    if (objImgFoto && objUsuario.Foto) {
        objImgFoto.src = "data:image/jpeg;base64," + objUsuario.Foto;
    }
    consultarIndicadores(objUsuario._id);


}

