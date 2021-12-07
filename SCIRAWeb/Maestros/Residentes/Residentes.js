var gObjGrid = null;
var gsIdMunicipio = null;
var gObjEventoImagen = null; 
var sIdEmpresa = obtenerQueryString("IdEmpresa");

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
        ConsultarResidente();
    }
}

function nuevo() {
    mostrarFormulario(true);
    parent.habilitarBotones(true, "|G|C|");
}

function cancelar() {
    mostrarFormulario(false);
}


function inicializarVentana() {

    consultarPaises();
    consultarRoles();
    armarDataTableLista([]);
    ConsultarResidente();
    marcarCamposRequeridos("#div_Formulario");

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('input_FileImagen').addEventListener('change', handleFileSelect, false);
    } else {
        mostrarAlertas('No es posible subir imagenes usando este navegador web.', "error");
    }

    parent.habilitarBotones(true, "|N|");


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
                    title: 'Foto',
                    data: 'Foto',
                    render: function (data, type, row) {
                        var sResult = "";

                        sResult = '<img class="previewGrid" onerror="this.src=\'../../img/sin-imagen.png\'" /*src="' + (gsUrlApi + "/Imagenes/obtenerImagen?sImagen=" + data + "&sMaestro=Servicio&IdEmpresa=" + sIdEmpresa) + '" alt="Img" *//>';

                        return sResult;
                    },
                    orderable: false,
                    className: 'text-center',
                    width: '5%'
                },
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
                cargarDataResidente(objData);
            }
        });

        $('#table_Lista').find('tbody tr').attr("title", "Dar click para editar");

    } else {
        limipiarFormulario();
    }
}

function limipiarFormulario() {
    $("input").val("");
    $("select").val("169").trigger("change");
    gsIdMunicipio = null;
    objImgFoto = "";
    $("#hidden_IdResidentes").val("");


    if (document.getElementById("input_Activo") !== null) {
        if (!document.getElementById("input_Activo").checked) {
            document.getElementById("input_Activo").click();
        }
    }

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


function ConsultarResidente() {

    var sIdEmpresa = obtenerQueryString("IdEmpresa");

    $.ajax({
        type: "GET",
        url: gsUrlApi + "/residentes/listar/" + sIdEmpresa,
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
            mostrarAlertas("Error en ajax al cargar los Residentes.", "error");
        }
    });

}



function cargarDataResidente(objResidentes) {



    $("#hidden_IdResidentes").val(objResidentes._id);
    $("#input_Login").val(objResidentes.Login);
    $("#input_Clave").val(objResidentes.Clave);
    $("#select_TipoIdentificacion").val(objResidentes.TipoIdentificacion).trigger("change");
    $("#input_Identificacion").val(objResidentes.Identificacion);
    $("#input_PrimerNombre").val(objResidentes.PrimerNombre);
    $("#input_SegundoNombre").val(objResidentes.SegundoNombre);
    $("#input_PrimerApellido").val(objResidentes.PrimerApellido);
    $("#input_SegundoApellido").val(objResidentes.SegundoApellido);
    var dFecha = new Date(objResidentes.FechaNacimiento);
    $("#input_FechaNacimiento").val("2019-03-04");
    $("#input_Email").val(objResidentes.Email);
    $("#input_Telefono").val(objResidentes.Telefono);
    $("#input_Celular").val(objResidentes.Celular);
   // $("#select_Pais").val(objResidentes.Pais.id).trigger("change");
    $("#select_Pais").val(objResidentes.IdPais).trigger("change");
   // gsIdMunicipio = objResidentes.Municipio.id;
    gsIdMunicipio = objResidentes.IdMunicipio;
    consultarMunicipios();
    $("#input_Direccion").val(objResidentes.Direccion);
    $("#select_Rol").val(objResidentes.IdRol).trigger("change");

    if (document.getElementById("input_Activo") !== null) {
        if (document.getElementById("input_Activo").checked && !objResidentes.Activo) {
            document.getElementById("input_Activo").click();
        } else if (!document.getElementById("input_Activo").checked && objResidentes.Activo) {
            document.getElementById("input_Activo").click();
        }
    }



    var objImgFoto = document.getElementById("img_Foto");
    if (objImgFoto && objResidentes.Foto) {
        objImgFoto.src = "data:image/jpeg;base64," + objResidentes.Foto;
    }



}




function guardar() {

    var objResidentes = new Object();
    var sDataUsuario = "";
    var sAccion = "";

    try {

        parent.habilitarBotones()

        if (ValidarCamposJson("#div_Formulario")) {

            objResidentes.Login = $("#input_Login").val();
            objResidentes.Clave = $("#input_Clave").val();
            objResidentes.TipoIdentificacion = $("#select_TipoIdentificacion").val();
            objResidentes.Identificacion = $("#input_Identificacion").val();
            objResidentes.PrimerNombre = $("#input_PrimerNombre").val();
            objResidentes.SegundoNombre = $("#input_SegundoNombre").val();
            objResidentes.PrimerApellido = $("#input_PrimerApellido").val();
            objResidentes.SegundoApellido = $("#input_SegundoApellido").val();
            objResidentes.NombreCompleto = objResidentes.PrimerNombre + ' ' + objResidentes.SegundoNombre + ' ' + objResidentes.PrimerApellido + ' ' + objResidentes.SegundoApellido;
            objResidentes.FechaNacimiento = $("#input_FechaNacimiento").val();
            objResidentes.Email = $("#input_Email").val();
            objResidentes.Telefono = $("#input_Telefono").val();
            objResidentes.Celular = $("#input_Celular").val();
            objResidentes.IdPais = $("#select_Pais").val();
            objResidentes.IdRol = $("#select_Rol").val();
            objResidentes.Rol = $("#select_Rol").val();
            objResidentes.TipoResidente = $("#select_TipoResidente").val();
            objResidentes.IdMunicipio = $("#select_Municipio").val();
            objResidentes.NumeroApartamento = $("#select_NumeroApartamento").val();
            objResidentes.Direccion = $("#input_Direccion").val();
            objResidentes.Activo = document.getElementById("input_Activo").checked;
            objResidentes.Empresa = obtenerQueryString("IdEmpresa");
            objResidentes.IdUsuarioRegistro = obtenerQueryString("IdUsuario");
            objResidentes.FechaRegistro = new Date();
            objResidentes.IdUsuarioActualizacion = obtenerQueryString("IdUsuario");
            objResidentes.FechaActualizacion = new Date();

            var objImgFoto = document.getElementById("img_Foto");
            if (objImgFoto) {
                objResidentes.Foto = objImgFoto.src.split('base64,')[1];
            }

            var residentes = $("#hidden_IdResidentes").val();


            


            if ($("#hidden_IdResidentes").val()) {
                sAccion = "actualizar";
                objResidentes._id = $("#hidden_IdResidentes").val();
            } else {
                sAccion = "insertar";
            }

            sDataUsuario = JSON.stringify(objResidentes);

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

                    ConsultarResidente();
                },
                error: function (e) {
                    mostrarAlertas("Error en ajax al gestionar el guardado del usuario. " , "error");
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

            crearComboBuscador("select_Rol", result.datos, "Seleccionar rol", null,
                "_id",
                "Nombre");
        },
        error: function (e) {
            mostrarAlertas("Error en ajax al cargar los roles.", "error");
        }
    });
}



function eliminar() {

    var sIdRegistro = $("#hidden_IdResidentes").val();

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
