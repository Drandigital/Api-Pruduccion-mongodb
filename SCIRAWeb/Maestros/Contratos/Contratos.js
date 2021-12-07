var gObjGrid = null;
var gObjContratosImagen = null;
var gsIdMunicipio = null;
var gIdEmpresa = obtenerQueryString("IdEmpresa");
var gObjRangoCurso = null;
var gObjGridvisualizacion = null;
var limitechecked = 0;
var gFrecuencias=[];
var gFrecuenciasGuardar = {};

$(document).ready(function() {
    inicializarVentana();
    inicializarCheckboxes();
   
});

function inicializarCheckboxes() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });


}

function inicializarVentana() {
  
    consultarClientes();
    consultarPasis();
    crearComboBuscador("select_Cliente", null, "Seleccionar Constratista");
    armarDataTableLista([]);
    listar();
    parent.habilitarBotones(true, "|N|");

    var elem = document.querySelector('.js-switch');
    var switchery = new Switchery(elem, { color: '#1AB394' });

    marcarCamposRequeridos("#div_Formulario");
    $("textarea").autosize();

    
}
function consultarPasis() {
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

            crearComboBuscador("select_Pais", result.paises, "Seleccionar país", null, "_id", "NombreEspañol");
            $("#select_Pais").on("select2:select", consultarMunicipios);

            $("#select_Pais").val("169").trigger("change");
            consultarMunicipios();

        },
        error: function (e) {
            mostrarAlertas("Error en ajax al cargar paises.", "error");
        }
    });
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
    limitechecked= 0;

}

function cancelar() {
    mostrarFormulario(false);
    limitechecked=0;

}

function limpiarFormulario() {
    $("input").val("");
    $("textarea").val("");
    $("#hidden_IdContratos").val("");
    $("#select_Cliente").val("").trigger("change");
    $("#select_Municipio").val("").trigger("change");
    $(".cssCampoObligatorio").removeClass("cssCampoObligatorio");
    $(".cssCampoObligatorio").removeClass("cssCampoObligatorio");
    $('#accordion').text("");

    $(".ListaEventos").empty();

    if (document.getElementById("input_Activo") !== null) {
        if (!document.getElementById("input_Activo").checked) {
            document.getElementById("input_Activo").click();
        }
    }
    gsIdMunicipio = 0;
}



function listar() {

    var sIdEmpresa = obtenerQueryString("IdEmpresa");

    $.ajax({
        type: "GET",
        url: gsUrlApi + "/contratos/listar/" + sIdEmpresa,
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
            mostrarAlertas("Error en ajax al cargar  Contratos.", "error");
        }
    });

}


function consultarFrecuencias() {

    var sIdEmpresa = obtenerQueryString("IdEmpresa");

    $.ajax({
        type: "GET",
        url: gsUrlApi + "/frecuencias/Contrato/" + $("#hidden_IdContratos").val(),
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.Error) {
                mostrarAlertas(result.Mensaje, "error");
                return;
            }
            // $("#table_Lista").dataTable().fnDestroy();
            // armarDataTableLista(result.datos === null ? [] : result.datos);

            console.log(result.datos);

            var dataFrecuencia = result.datos;

            var reformattedArray = dataFrecuencia.map(function (obj) {
                var rObj = obj;

                var UnidadFuncionalCentral = rObj._id.UnidadFuncional;

                
                var objetoUnidadFuncionalCentral = rObj.UnidadFuncional_doc.filter(function (objUnidadFuncionalCentral) {
                return (objUnidadFuncionalCentral._id === UnidadFuncionalCentral);
                }
                );
                rObj._id.UnidadFuncional = objetoUnidadFuncionalCentral[0];


                for (let i = 0; i < rObj.Frecuencias.length; i++) {
                    var Tecnologia = rObj.Frecuencias[i].Tecnologia;
                    var Contrato = rObj.Frecuencias[i].Contrato;
                    var UnidadFuncional = rObj.Frecuencias[i].UnidadFuncional;

                    //Tecnologias
                    var objetoTecnologia = rObj.Tecnologia_doc.filter(function (objTecno) {
                        return (objTecno._id === Tecnologia);
                    }
                    );
                    rObj.Frecuencias[i].Tecnologia = objetoTecnologia[0];

                    //Contrato
                    var objetoContrato = rObj.Contrato_doc.filter(function (objContrato) {
                        return (objContrato._id === Contrato);
                    }
                    );
                    rObj.Frecuencias[i].Contrato = objetoContrato[0];

                    //UnidadFuncional
                    var objetoUnidadFuncional = rObj.UnidadFuncional_doc.filter(function (objUnidadFuncional) {
                        return (objUnidadFuncional._id === UnidadFuncional);
                    }
                    );
                    rObj.Frecuencias[i].UnidadFuncional = objetoUnidadFuncional[0];

                }
                
                return rObj;
            });

            console.log(reformattedArray);

            for (let i = 0; i < reformattedArray.length; i++) {
                var sRiesgos = "";
                openDefaul = "show";
                sRiesgos += '<div class="panel panel-default tablaRecoleccion" > <div class="panel-heading in " data-toggle="collapse" data-parent="#accordion" href="#' + reformattedArray[i]._id.UnidadFuncional._id + '" aria-expanded="true"><h5 class="panel-title"><a >' + reformattedArray[i]._id.UnidadFuncional.Nombre + '</a></h5></div><div id="' + reformattedArray[i]._id.UnidadFuncional._id + '" class="panel-collapse in collapse ' + openDefaul + '"><div class="panel-body">';
                sRiesgos += '<div class="table-responsive"><table id="table-' + reformattedArray[i]._id.UnidadFuncional._id + '" class="table table-bordered ' + reformattedArray[i]._id.UnidadFuncional._id + '" style="width:100%;"></table></div>';
                sRiesgos += '</div></div ></div >';

                $(".ListaEventos").append(sRiesgos);


                var elementoDiv = "#table-" + reformattedArray[i]._id.UnidadFuncional._id;

                gFrecuencias = reformattedArray;

                armarDataTableConfiguracion(reformattedArray[i].Frecuencias, elementoDiv);



            }
            gFrecuencias = reformattedArray;



            
        },
        error: function (e) {
            mostrarAlertas("Error en ajax al cargar  Contratos.", "error");
        }
    });

}



function armarDataTableConfiguracion(lstData, div2) {
    console.log(div2);
    var aux3 = 0; 
    
    gObjGrid = $(div2).DataTable({
        data: lstData,
        paging: true,
        ordering: true,
        order: [
            [0, "desc"]
        ],
        info: false,
        searching: true,
        columns: [{
            title: 'Cups',
            data: 'Tecnologia',
            render: function (data, type, row) {
                var sResult = "";

                if (row.Codigo !== "") {


                    sResult = '<label>' + data.Cups + '</label>';

                }
                return sResult;
            },
            orderable: false,
            className: 'text-center',
            width: '5%',
            background: "blue"


        }, {
            title: 'Indicador',
            data: 'Indicador',
            render: function (data, type, row) {
                var sResult = "";

                if (row.Codigo !== "") {

                    sResult = '<label>' + data + '</label>';

                }
                return sResult;
            },
            orderable: false,
            className: 'text-center',
            width: '15%',
            background: "blue",
            visible: false,


        }, {
            title: 'Sede',
            data: 'Sede',
            render: function (data, type, row) {
                var sResult = "";

                if (row.Codigo !== "") {

                    sResult = '<label>' + data + '</label>';

                }
                return sResult;
            },
            orderable: false,
            className: 'text-center',
            width: '15%',
            background: "blue",
            visible: false,
        }, {
            title: '_id',
            data: '_id',
            render: function (data, type, row) {
                var sResult = "";

                if (row.Codigo !== "") {

                    sResult = '<label>' + data + '</label>';

                }
                return sResult;
            },
            orderable: false,
            className: 'text-center',
            width: '15%',
            background: "blue",
            visible: false,
        }, {
            title: 'Nombre Tecnología',
            data: 'Tecnologia',
            render: function (data, type, row) {
                var sResult = "";

                if (row.Codigo !== "") {

                    sResult = '<label>' + data.Nombre + '</label>';

                }
                return sResult;
            },
            orderable: false,
            className: 'text-center',
            width: '25%',
            background: "blue"


        },
        {
            title: 'Frecuencia Mensual',
            data: 'FrecuenciaMes',
            render: function (data, type, row) {
                var sResult = "";

                if (row.Codigo !== "") {


                    var FrecuenciaMesValue = parseFloat(data);
                    var FrecuenciaMesValueTrunc = FrecuenciaMesValue.toFixed(1);

                    sResult = ' <input type="number" class="form-control"  datajson="FrecuenciaMes" id="input_Numerador-' + row._id + '"  denominador="' + FrecuenciaMesValueTrunc + '" maxlength="20" onchange="cambiarValorData(this,\'' + row._id + '\',\'' + div2 + '\')" mensaje="Descripción" requerido="false" validacion="texto" value="' + FrecuenciaMesValueTrunc + '" />';


                }
                return sResult;
            },
            orderable: false,
            className: 'text-center',
            width: '7%'
        }, {
            title: 'Frecuencia Anual',
            data: 'FrecuenciaAnual',
            render: function (data, type, row) {
                var sResult = "";

                if (row.Codigo !== "") {

                    var FrecuenciaAnualValue = parseFloat(data);
                    var FrecuenciaAnualValueTrunc = FrecuenciaAnualValue.toFixed(1);

                    sResult = ' <input type="number" class="form-control" datajson="FrecuenciaAnual" onchange="cambiarValorData(this,\'' + row._id + '\',\'' + div2 + '\')" id="input_Denominador-' + row._id + '"  numerador="' + FrecuenciaAnualValueTrunc + '" maxlength="20" mensaje="Descripción" requerido="false" validacion="texto" value="' + FrecuenciaAnualValueTrunc + '" />';

                }
                return sResult;
            },
            orderable: false,
            className: 'text-center',
            width: '7%'
        },
         {
            title: 'empresa',
            data: 'empresa',
            render: function (data, type, row) {
                var sResult = "";

                if (row.Codigo !== "") {

                    sResult = '<label>' + data + '</label>';

                }
                return sResult;
            },
            orderable: false,
            className: 'text-center',
            width: '20%',
            visible: false,
        }, {
            title: 'IdUsuarioActualizacion',
            data: 'IdUsuarioActualizacion',
            render: function (data, type, row) {
                var sResult = "";

                if (row.Codigo !== "") {

                    sResult = '<label>' + data + '</label>';

                }
                return sResult;
            },
            orderable: false,
            className: 'text-center',
            width: '20%',
            visible: false,
        }, {
            title: 'FechaActualizacion',
            data: 'FechaActualizacion',
            render: function (data, type, row) {
                var sResult = "";

                if (row.Codigo !== "") {

                    sResult = '<label>' + data + '</label>';

                }
                return sResult;
            },
            orderable: false,
            className: 'text-center',
            width: '20%',
            visible: false,
        },


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
        autoWidth: false
    });

}

function guardarFrecuencias() {


    var arrayFrecuencias = [];
    for (const prop in gFrecuenciasGuardar) {
        arrayFrecuencias.push(gFrecuenciasGuardar[prop]);
    }

    console.log(gFrecuenciasGuardar);
    var sDataRol = "";
    var sAccion = "";
    limitechecked = 0;

    for (let i = 0; i < arrayFrecuencias.length; i++) {

        try {
            parent.habilitarBotones()

            sAccion = "actualizar";
            sDataRol = JSON.stringify(arrayFrecuencias[i]);

            $.ajax({
                type: "POST",
                url: gsUrlApi + "/frecuencias/" + sAccion,
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
                },
                error: function (e) {
                    mostrarAlertas("Error en ajax al gestionar el guardado de  Contratos. " + e.responseJSON.Mensaje, "error");
                    

                }
            });

        } catch (e) {
            mostrarAlertas("Error al guardar:\n" + e.message, "error");
            
        }
        
        
    }

   

}

function cambiarValorData(objEvento, sId, idDiv) {

    var objGrid = $(idDiv).DataTable();
    var objData = null;
    var objTr = $(objEvento).closest("tr");
    var objData = objGrid.row(objTr).data();

    if (objData !== null) {
        objData[$(objEvento).attr("datajson")] = parseFloat(objEvento.value);
    }

    gFrecuenciasGuardar[objData._id] = {
         _id: objData._id,
        FrecuenciaMes: objData.FrecuenciaMes,
        FrecuenciaAnual: objData.FrecuenciaAnual,
        Tecnologia: objData.Tecnologia._id,
        UnidadFuncional: objData.UnidadFuncional._id,
        Contrato: objData.Contrato._id
    }

}

function guardar() {


    
    $("input_Numerador-5df7f5abcb3b5d0424ba46c6").val(000000000);

    var objContratos = new Object();
    var sDataRol = "";
    var sAccion = "";
    contRuta = 0;

    limitechecked = 0;
    try {
        parent.habilitarBotones()

        if (ValidarCamposJson("#div_Formulario")) {

            objContratos.Nombre = $("#input_Nombre").val();
            objContratos.Descripcion = $("#input_Descripcion").val();
            objContratos.Homologo = $("#input_Homologo").val();
            objContratos.Codigo = $("#input_Codigo").val();
            objContratos.id = $("#input_Codigo").val();
            objContratos.ValorContrato = $("#input_ValorContrato").val();
            objContratos.Poblacion = $("#input_Poblacion").val();
            objContratos.FechaInicioContrato = $("#input_FechaInicioContrato").val();
            objContratos.FechaFinContrato = $("#input_FechaFinContrato").val();
            objContratos.text = $("#input_Nombre").val();
            objContratos.IdUsuarioActualizacion = obtenerQueryString("IdUsuario");
            objContratos.FechaActualizacion = new Date();
            objContratos.Empresa = obtenerQueryString("IdEmpresa");
            objContratos.Municipio = $("#select_Municipio").val();
            objContratos.IdPais = $("#select_Pais").val();
            objContratos.IdCliente = $("#select_Cliente").val();
            objContratos.Alcance = $("#input_Alcance").val();
            objContratos.Activo = document.getElementById("input_Activo").checked;
            
            

            if ($("#hidden_IdContratos").val()) {
                sAccion = "actualizar";
                objContratos._id = $("#hidden_IdContratos").val();
            } else {
                sAccion = "insertar";
                objContratos.IdUsuarioRegistro = obtenerQueryString("IdUsuario");
                objContratos.FechaRegistro = new Date();
            }

            guardarFrecuencias();
            
            sDataRol = JSON.stringify(objContratos);

            $.ajax({
                type: "POST",
                url: gsUrlApi + "/Contratos/" + sAccion,
                data: sDataRol,
                headers: gsAutenticacion,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(result) {
                    if (result.Error) {
                        mostrarAlertas(result.Mensaje, "error");
                        return;
                    }


                    gObjGrid.rows().every(function() { });

                    mostrarAlertas("Registro guardado con éxito.", "success");
                    mostrarFormulario(false);

                    listar();



                },
                error: function(e) {
                    mostrarAlertas("Error en ajax al gestionar el guardado de  Contratos. " + e.responseJSON.Mensaje, "error");
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
                title: 'Número',
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
                width: '16.6%'
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
                width: '16.6%'
            }, {
                title: 'Valor Contrato',
                data: 'ValorContrato',
                render: function(data, type, row) {
                    var sResult = "";
                    if (row.Codigo !== "") {
                        if (data == undefined) {
                            sResult = '<label type="number"> ' + formatPrecioText(data.toString()) + '</label>';

                        } else {
                            sResult = '<label  type="number"> $' + formatPrecioText(data.toString() )  + '</label>';

                        }

                    }
                    return sResult;
                },
                orderable: false,
                className: 'text-center',
                width: '16.6%'
            }, {
                title: 'Población',
                data: 'Poblacion',
                render: function(data, type, row) {
                    var sResult = "";
                    if (row.Codigo !== "") {
                        sResult = '<label>' + formatPrecioText(data.toString()) + '</label>';
                    }
                    return sResult;
                },
                orderable: false,
                className: 'text-center',
                width: '16.6%'
            }, {
                title: 'Feacha Inicio',
                data: 'FechaInicioContrato',
                render: function(data, type, row) {
                    var sResult = "";
                    if (row.Codigo !== "") {
                        sResult = '<label>' + data + '</label>';
                    }
                    return sResult;
                },
                orderable: false,
                className: 'text-center',
                width: '16.6%'
            },{
                title: 'Feacha Fin',
                data: 'FechaFinContrato',
                render: function(data, type, row) {
                    var sResult = "";
                    if (row.Codigo !== "") {
                        sResult = '<label>' + data + '</label>';
                    }
                    return sResult;
                },
                orderable: false,
                className: 'text-center',
                width: '16.6%'
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
            select: {
                style: 'single'
            }
        });

        $('#table_Lista').off('click', 'tbody tr');
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
    
    var sIdRegistro = $("#hidden_IdContratos").val();

    if (sIdRegistro) {
        mostrarAlertas("¿Desea eliminar el registro seleccionado?", "confirm", undefined, "Si", "No", "quitarRegistro", sIdRegistro)
    } else {
        mostrarAlertas("Error al obtener dato para eliminar la finalidad.", "error");
    }
}

function quitarRegistro(sKey) {

    var objContratos = new Object();
    objContratos._id = sKey;
    var sDataRol = JSON.stringify(objContratos);

    $.ajax({
        type: "POST",
        url: gsUrlApi + "/Contratos/eliminar",
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
    $("#hidden_IdContratos").val(objData._id);
    $("#input_Nombre").val(objData.Nombre);
    $("#input_Codigo").val(objData.Codigo);
    $("#input_Descripcion").val(objData.Descripcion);
    $("#select_Cliente").val(objData.IdCliente).trigger("change");
    $("#input_Homologo").val(objData.Homologo);
    $("#input_ValorContrato").val(objData.ValorContrato);
    $("#input_Poblacion").val(objData.Poblacion);
    $("#input_FechaInicioContrato").val(objData.FechaInicioContrato);
    $("#input_FechaFinContrato").val(objData.FechaFinContrato);
    $("#input_Alcance").val(objData.Alcance);
    $("#select_Pais").val(objData.IdPais).trigger("change");
    $("#hidden_Empresa").val(objData.Empresa).trigger("change");

    if (document.getElementById("input_Activo") !== null) {
        if (document.getElementById("input_Activo").checked && !objData.Activo) {
            document.getElementById("input_Activo").click();
        } else if (!document.getElementById("input_Activo").checked && objData.Activo) {
            document.getElementById("input_Activo").click();
        }
    }
    gsIdMunicipio = objData.Municipio;
    consultarMunicipios();

    consultarFrecuencias();
}


function consultarMunicipios() {

    var sPais = document.getElementById("select_Pais").value;

    if (!sPais) {

        crearComboBuscador("select_Municipio", [], "Seleccionar municipio");
        $("#select_Municipio").prop("disabled", true);
        return;

    }

    $.ajax({
        type: "GET",
        url: gsUrlApi + "/municipios/Pais/" + sPais,
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {

            if (result.Error) {

                mostrarAlertas(result.Mensaje, "error");
                return;

            }

            var lstData = result.municipios;

            crearComboBuscador("select_Municipio", lstData, "Seleccionar municipio",null , "_id","Municipio");

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

function generarGuid() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now();; //use high-precision timer if available
    }
    var sGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return sGuid;
};

function armarDataTableVisualizacion(lstData) {

    if (gObjGridvisualizacion != null) {
        $('#table_Visualizacion').DataTable().clear();
        $('#table_Visualizacion').DataTable().destroy();
        $('#table_Visualizacion').empty();
        gObjGridvisualizacion = null;
    }

    var lstColumns = [];
    var lstDataRow = [{}];

    for (var i = 0; i < lstData.length; i++) {

        var sTitle = "";
        sTitle = lstData[i].nombreDeRuta;
        var sCulumnData = "data" + i;
        lstColumns.push({
            title: sTitle,
            data: sCulumnData,
            orderable: false,
            className: 'text-center'
        });
        lstDataRow[0][sCulumnData] = "-";
    }
    gObjGridvisualizacion = $('#table_Visualizacion').DataTable({
        data: lstDataRow,
        paging: false,
        ordering: false,
        info: false,
        searching: false,
        autoWidth: false,
        columns: lstColumns,
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
        }
    });

}


function consultarClientes() {
    var sIdEmpresa = obtenerQueryString("IdEmpresa");

    $.ajax({
        type: "GET",
        url: gsUrlApi + "/clientes/empresa/" + sIdEmpresa,
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.Error) {
                mostrarAlertas(result.Mensaje, "error");
                return;
            }



            crearComboBuscador("select_Cliente", result.datos, "Seleccionar Constratista", null, "_id", "razonSocial");
        },
        error: function (e) {
            mostrarAlertas("Error en ajax al cargar los Constratista.", "error");
        }
    });
}



