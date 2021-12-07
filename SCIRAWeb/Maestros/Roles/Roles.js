var gObjGrid = null;
//var gsIdMunicipio = null;
var gObjEventoImagen = null;
var glstPermisos = null;

$(document).ready(function () {
    inicializarVentana();
});

function mostrarFormulario(bMostrar) {
    limpiarFormulario();

    if (bMostrar) {

        $(".btnFormulario").removeClass("cssOcultarObjeto");
        $(".btnLista").addClass("cssOcultarObjeto");
        parent.habilitarBotones(true, "|G|C|");

    } else {

        $(".btnFormulario").addClass("cssOcultarObjeto");
        $(".btnLista").removeClass("cssOcultarObjeto");
        parent.habilitarBotones(true, "|N|");
        consultarRoles();

    }
}

function nuevo() {

    mostrarFormulario(true);
    parent.habilitarBotones(true, "|G|C|");
    consultarPermisos();

}

function cancelar() {
    mostrarFormulario(false);
}

function limpiarFormulario() {
    $("input").val("");
    $("#hidden_IdRol").val("");
    $(".cssCampoObligatorio").removeClass("cssCampoObligatorio");
    $(".cssCampoObligatorio").removeClass("cssCampoObligatorio");
    glstPermisos = null;
    //$("#treeView_Permisos").jstree('destroy');
    //$("treeView_Permisos").remove();
}

function inicializarVentana() {

    armarDataTableLista([]);
    consultarRoles();
    parent.habilitarBotones(true, "|N|");
    marcarCamposRequeridos("#div_Formulario");

}

function consultarPermisos() {

    $.ajax({
        type: "GET",
        url: gsUrlApi + "/interfaces",
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (result) {
            if (result.Error) {
                mostrarAlertas(result.Mensaje, "error");
                return;
            }


            if (result.interfaces !== null && result.interfaces) {

                lstData = result.interfaces;

                if (glstPermisos !== null) {

                    for (let i = 0; i < lstData.length; i++) {

                        lstData[i].state = {
                            opened: true
                            , selected: (glstPermisos.indexOf(lstData[i].id) !== -1)
                        };

                    }

                } else {

                    for (let i = 0; i < lstData.length; i++) {

                        lstData[i].state = {
                            opened: true
                        };

                    }

                }

                inicializarTreePermisos(lstData);

            }

        },
        error: function (e) {
            mostrarAlertas("Error en ajax al cargar los permisos.", "error");
        }
    });

}

function seleccionarTodos(objEvento) {

    if (objEvento.checked) {

        $('#jstree').jstree(true).select_all();

    } else {

        $('#jstree').jstree(true).deselect_all();

    }

}

function inicializarTreePermisos(lstData) {

    $("#jstree").jstree('destroy');
    $('#jstree').jstree(
        {
            'core': {
                'data': lstData
            }
            , 'plugins': ['checkbox']

        }
    );

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
            $("#table_Lista").dataTable().fnDestroy();
            armarDataTableLista(result.datos === null ? [] : result.datos);
        },
        error: function (e) {
            mostrarAlertas("Error en ajax al cargar roles.", "error");
        }
    });

}

function guardar() {

    var objRol = new Object();
    var sDataRol = "";
    var sAccion = "";

    try {
        parent.habilitarBotones();

        if (ValidarCamposJson("#div_Formulario")) {

            objRol.Codigo = $("#input_Codigo").val();
            objRol.Nombre = $("#input_Nombre").val();
            objRol.id = $("#input_Codigo").val();
            objRol.text = $("#input_Nombre").val();
            objRol.IdUsuarioActualizacion = obtenerQueryString("IdUsuario");
            objRol.FechaActualizacion = new Date();
            objRol.Empresa = obtenerQueryString("IdEmpresa");
            objRol.Permisos = obtenerPermisosTree();

            if ($("#hidden_IdRol").val()) {
                sAccion = "actualizar";
                objRol._id = $("#hidden_IdRol").val();
            } else {
                sAccion = "insertar";
                objRol.IdUsuarioRegistro = obtenerQueryString("IdUsuario");
                objRol.FechaRegistro = new Date();
            }

            sDataRol = JSON.stringify(objRol);

            $.ajax({
                type: "POST",
                url: gsUrlApi + "/roles/" + sAccion,
                data: sDataRol,
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

                },
                error: function (e) {
                    mostrarAlertas("Error en ajax al gestionar el guardado del rol. " + e.responseJSON.error.message, "error");
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

function obtenerPermisosTree() {
    var lstPermisos = $('#jstree').jstree(true).get_json();
    var lstPermisosResult = [];

    for (var i = 0; i < lstPermisos.length; i++) {

        var objMenu = lstPermisos[i];

        for (var j = 0; j < objMenu.children.length; j++) {

            var objSubMenu = objMenu.children[j];

            for (var k = 0; k < objSubMenu.children.length; k++) {

                var objOpcion = objSubMenu.children[k];

                if (objOpcion.state.selected) {

                    lstPermisosResult.push(objOpcion.id); //opciones de cada ventana los que despliegan las ventanas de los formularios

                }

            }

        }

    }

    return lstPermisosResult;

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
                    title: 'Código',
                    data: 'Codigo',
                    render: function (data, type, row) {
                        var sResult = "";
                        if (row.Codigo !== "") {
                            sResult = '<label>' + data + '</label>';
                        }
                        return sResult;
                    },
                    orderable: false,
                    className: 'text-center',
                    width: '20%'
                }
                , {
                    title: 'Nombre',
                    data: 'Nombre',
                    render: function (data, type, row) {
                        var sResult = "";
                        if (row.Codigo !== "") {
                            sResult = '<label>' + data + '</label>';
                        }
                        return sResult;
                    },
                    orderable: false,
                    className: 'text-center',
                    width: '80%'
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

        $('#table_Lista').find('tbody tr').attr("title", "Dar click para editar");

    } else {
        limpiarFormulario();
    }
}

$('#table_Lista').on('click', 'tbody tr', function () {
    if (gObjGrid.row(this).data() !== undefined && gObjGrid.row(this).data() !== null) {
        mostrarFormulario(true);
        var objData = gObjGrid.row(this).data();
        cargarDataRol(objData);
    }
});

function eliminar() {

    var sIdRegistro = $("#hidden_IdRol").val();

    if (sIdRegistro) {
        mostrarAlertas("¿Desea eliminar el registro seleccionado?", "confirm", undefined, "Si", "No", "quitarRegistro", sIdRegistro);
    } else {
        mostrarAlertas("Error al obtener dato para eliminar el rol.", "error");
    }
}

function quitarRegistro(sKey) {

    var objRol = new Object();
    objRol._id = sKey;
    var sDataRol = JSON.stringify(objRol);

    $.ajax({
        type: "POST",
        url: gsUrlApi + "/roles/eliminar",
        data: sDataRol,
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

function cargarDataRol(objRol) {

    $("#hidden_IdRol").val(objRol._id);
    $("#input_Codigo").val(objRol.Codigo);
    $("#input_Nombre").val(objRol.Nombre);
    glstPermisos = objRol.Permisos;
    consultarPermisos();

    parent.habilitarBotones(true, "|G|C|E|");

}

