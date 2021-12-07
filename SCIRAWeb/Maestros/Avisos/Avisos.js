var gObjGrid = null;
var gObjforosImagen = null;


$(document).ready(function() {
    inicializarVentana();
});

function inicializarVentana() {
    armarDataTableLista([]);
    listar();
    parent.habilitarBotones(true, "|N|");
    marcarCamposRequeridos("#div_Formulario");


}

function mostrarFormulario(bMostrar) {
    limpiarFormulario();
    if (bMostrar) {
        $(".btnFormulario").removeClass("cssOcultarObjeto");
        $(".btnLista").addClass("cssOcultarObjeto");
        parent.habilitarBotones(true, "|G|C|E|");
    } else {
        $(".btnFormulario").addClass("cssOcultarObjeto");
        $(".btnLista").removeClass("cssOcultarObjeto");
        parent.habilitarBotones(true, "|N|");
        listar();
    }
}

function nuevo() {
    mostrarFormulario(true);
    parent.habilitarBotones(true, "|G|C|");
}

function cancelar() {
    mostrarFormulario(false);
}

function limpiarFormulario() {
    $("input").val("");
    $("textarea").val("");
    $("#hidden_Idforos").val("");
    $(".cssCampoObligatorio").removeClass("cssCampoObligatorio");
    $(".cssCampoObligatorio").removeClass("cssCampoObligatorio");
}

function listar() {

    var sIdEmpresa = obtenerQueryString("IdEmpresa");

    $.ajax({
        type: "GET",
        url: gsUrlApi + "/foros/listar/" + sIdEmpresa,
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(result) {
            if (result.Error) {
                mostrarAlertas(result.Mensaje, "error");
                return;
            }
            $("#table_Lista").dataTable().fnDestroy();
            armarDataTableLista(result.datos === null ? [] : result.datos);
        },
        error: function(e) {
            mostrarAlertas("Error en ajax al cargar Tipo De Contratos.", "error");
        }
    });

}

function guardar() {

    var objforos = new Object();
    var sDataRol = "";
    var sAccion = "";

    try {
        parent.habilitarBotones()

        if (ValidarCamposJson("#div_Formulario")) {

            objforos.Nombre = $("#input_Nombre").val();
            objforos.Descripcion = $("#input_Descripcion").val();
            objforos.Codigo = $("#input_Codigo").val();
            objforos.Empresa = obtenerQueryString("IdEmpresa");


            if ($("#hidden_Idforos").val()) {
                sAccion = "actualizar";
                objforos._id = $("#hidden_Idforos").val();
            } else {
                sAccion = "insertar";
              
            }

            sDataRol = JSON.stringify(objforos);

            $.ajax({
                type: "POST",
                url: gsUrlApi + "/foros/" + sAccion,
                data: sDataRol,
                headers: gsAutenticacion,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(result) {
                    if (result.Error) {
                        mostrarAlertas(result.Mensaje, "error");
                        return;
                    }


                    gObjGrid.rows().every(function() { console.log(this.data()); });

                    mostrarAlertas("Registro guardado con éxito.", "success");
                    mostrarFormulario(false);

                    listar();



                },
                error: function(e) {
                    mostrarAlertas("Error en ajax al gestionar el guardado de tipo de Contratos. " + e.responseJSON.Mensaje, "error");
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
            columns: [{
                title: 'Código',
                data: 'Codigo',
                render: function(data, type, row) {
                    var sResult = "";
                    if (row.Codigo !== "") {
                        sResult = '<label>' + data + '</label>';
                    }
                    return sResult;
                },
                orderable: false,
                className: 'text-center',
                width: '20%'
            }, {
                title: 'Nombre',
                data: 'Nombre',
                render: function(data, type, row) {
                    var sResult = "";
                    if (row.Codigo !== "") {
                        sResult = '<label>' + data + '</label>';
                    }
                    return sResult;
                },
                orderable: false,
                className: 'text-center',
                width: '20%'
            }, {
                title: 'Descripción',
                data: 'Descripcion',
                render: function(data, type, row) {
                    var sResult = "";
                    if (row.Codigo !== "") {
                        sResult = '<label>' + data + '</label>';
                    }
                    return sResult;
                },
                orderable: false,
                className: 'text-center',
                width: '20%'
            }],
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
            lengthMenu: [
                [10, 25, 50],
                [10, 25, 50]
            ],
            "filter": false,
            "Next": false,
            select: {
                style: 'single'
            }
        });

        $('#table_Lista').on('click', 'tbody tr', function() {
            if (gObjGrid.row(this).data() !== undefined && gObjGrid.row(this).data() !== null) {
                var objData = gObjGrid.row(this).data();
                mostrarFormulario(true);
                cargarData(objData);
            }
        });

        $('#table_Lista').find('tbody tr').attr("title", "Dar click para editar");

    } else {
        limpiarFormulario();
    }
}

function eliminar() {

    var sIdRegistro = $("#hidden_Idforos").val();

    if (sIdRegistro) {
        mostrarAlertas("¿Desea eliminar el registro seleccionado?", "confirm", undefined, "Si", "No", "quitarRegistro", sIdRegistro)
    } else {
        mostrarAlertas("Error al obtener dato para eliminar la finalidad.", "error");
    }
}

function quitarRegistro(sKey) {

    var objforos = new Object();
    objforos._id = sKey;
    var sDataRol = JSON.stringify(objforos);

    $.ajax({
        type: "POST",
        url: gsUrlApi + "/foros/eliminar",
        data: sDataRol,
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(result) {
            if (result.Error) {
                mostrarAlertas(result.Mensaje, "error");
                return;
            }
            mostrarAlertas("Registro eliminado con éxito.", "success");
            cancelar();
        },
        error: function(e) {
            mostrarAlertas("Error en ajax al quitar registro. " + e.responseJSON.Mensaje, "error");
        }
    });
}

function cargarData(objData) {
    $("#hidden_Idforos").val(objData._id);
    $("#input_Nombre").val(objData.Nombre);
    $("#input_Codigo").val(objData.Codigo);
    $("#input_Descripcion").val(objData.Descripcion);

}

function ConsultarPrivacidad(params) {
    if ($("#select_TipodeEvento").val() == "Privado") {
        $("#TipoPrivacidad").removeClass("cssOcultarObjeto");
        $("#TipoForo").removeClass("col-lg-12");
    }else{
        $("#TipoPrivacidad").addClass("cssOcultarObjeto");
        $("#DivTorres").addClass("cssOcultarObjeto");
        $("#DivResisdentes").addClass("cssOcultarObjeto");
    }
    if ($("#select_TipoPrivacidad").val() == "Torre") {
        $("#DivTorres").removeClass("cssOcultarObjeto");
        $("#DivResisdentes").addClass("cssOcultarObjeto");
    }else{
        $("#DivResisdentes").removeClass("cssOcultarObjeto");
        $("#DivTorres").addClass("cssOcultarObjeto");
    }
} 