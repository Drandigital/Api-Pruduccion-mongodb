var gsIdMunicipio = null;
var gObjEventoImagen = null;

function inicializarVentana() {

    ///Consultar TipoConsulta
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
            mostrarAlertas("Error en ajax al cargar paises.", "error");
        }
    });

    crearComboBuscador("select_TipoIdentificacion", null, "Seleccionar tipo identificación");
    consultarEmpresa();

    $("#select_TipoIdentificacion").on("change", function () {

        if ($("#select_TipoIdentificacion").val() === "31") {

            var sResultado = calcularDigitoVerificacion($("#input_Identificacion").val());
            $("#label_DigitoVerificacion").text(sResultado);

        } else {

            $("#label_DigitoVerificacion").text("-");

        }

    });

    $("#input_Identificacion").on("change", function () {

        if ($("#select_TipoIdentificacion").val() === "31") {

            var sResultado = calcularDigitoVerificacion($("#input_Identificacion").val());
            $("#label_DigitoVerificacion").text(sResultado);

        } else {

            $("#label_DigitoVerificacion").text("-");

        }

    });

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('input_FileImagen').addEventListener('change', handleFileSelect, false);
    } else {
        mostrarAlertas('No es posible subir imagenes usando este navegador web.', "error");
    }

    parent.habilitarBotones(true, "|G|");

    var elem = document.querySelector('.js-switch');
    var switchery = new Switchery(elem, { color: '#1AB394' });

    marcarCamposRequeridos("#div_Formulario");

}

function consultarEmpresa() {


    var sIdEmpresa = obtenerQueryString("IdEmpresa");

    $.ajax({
        type: "GET",
        url: gsUrlApi + "/empresas/_id/" + sIdEmpresa,
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {

            if (result.Error) {

                mostrarAlertas(result.Mensaje, "error");
                return;

            }

            //Cargar datos de la empresa

            
            cargarDataEmpresa(result.empresas[0]);

        },
        error: function (e) {
            mostrarAlertas("Error en ajax al cargar empresas.", "error");
        }
    });

}


function guardar() {

    var objEmpresa = new Object();
    var sData = "";

    try {

        parent.habilitarBotones();

        if (ValidarCamposJson("#div_Formulario")) {

            objEmpresa.IdTipoIdentificacion = $("#select_TipoIdentificacion").val();
            objEmpresa.TipoIdentificacion = $("#select_TipoIdentificacion").find("option:selected").text();
            objEmpresa.Identificacion = $("#input_Identificacion").val();
            objEmpresa.DigitoVerificacion = $("#label_DigitoVerificacion").text();
            objEmpresa.Nombre = $("#input_RazonSocial").val();
            objEmpresa.Direccion = $("#input_Direccion").val();
            objEmpresa.IdPais = $("#select_Pais").val();
            objEmpresa.Pais = $("#select_Pais").find("option:selected").text();
            objEmpresa.IdMunicipio = $("#select_Municipio").val();
            objEmpresa.Municipio = $("#select_Municipio").find("option:selected").text();
            objEmpresa.Telefono1 = $("#input_Telefono1").val();
            objEmpresa.Telefono2 = $("#input_Telefono2").val();
            objEmpresa.Celular = $("#input_Celular").val();
            objEmpresa.Correo = $("#input_Correo").val();
            objEmpresa.PaginaWeb = $("#input_PaginaWeb").val();
            objEmpresa.UsuarioActualizacion = obtenerQueryString("IdUsuario");
            objEmpresa.FechaActualizacion = new Date();
            objEmpresa.IdEmpresa = obtenerQueryString("IdEmpresa");
            objEmpresa.Activo = document.getElementById("input_Activo").checked;

            var objLogoImpresion= document.getElementById("img_LogoImpresion");
            if (objLogoImpresion) {

                objEmpresa.LogoImpresion = objLogoImpresion.src.split('base64,')[1];

            }

            var objImgLogoInicioSesion = document.getElementById("img_LogoInicioSesion");
            if (objImgLogoInicioSesion) {

                objEmpresa.LogoInicioSesion = objImgLogoInicioSesion.src.split('base64,')[1];

            }

            var objImgLogo = document.getElementById("img_Logo");
            if (objImgLogo) {

                objEmpresa.Logo = objImgLogo.src.split('base64,')[1];

            }

            sData = JSON.stringify(objEmpresa);

            $.ajax({
                type: "POST",
                url: gsUrlApi + "/empresas/actualizar",
                data: sData,
                headers: gsAutenticacion,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {

                    if (result.empresas.Error) {

                        mostrarAlertas(result.empresas.Mensaje, "error");
                        return;

                    }

                    parent.habilitarBotones(true, "|G|");
                    mostrarAlertas(result.empresas.Mensaje, "success");

                },
                error: function (e) {
                    mostrarAlertas("Error en ajax al gestionar el guardado de la empresa.", "error");
                }
            });

        } else {

            parent.habilitarBotones(true, "|G|");

        }

    } catch (e) {
        mostrarAlertas("Error al guardar:\n" + e.message, "error");
        parent.habilitarBotones(true, "|G|");
    }

}

function cargarDataEmpresa(objData) {


    try {

        $("#select_TipoIdentificacion").val(objData.IdTipoIdentificacion).trigger("change");
        $("#input_Identificacion").val(objData.Identificacion);
        $("#label_DigitoVerificacion").text(objData.DigitoVerificacion);
        $("#input_RazonSocial").val(objData.Nombre);
        $("#input_Direccion").val(objData.Direccion);
        $("#input_Telefono1").val(objData.Telefono1);
        $("#input_Telefono2").val(objData.Telefono2);
        $("#input_Celular").val(objData.Celular);
        $("#input_Correo").val(objData.Correo);
        $("#input_PaginaWeb").val(objData.PaginaWeb);
        $("#select_Pais").val(objData.IdPais).trigger("change");
        gsIdMunicipio = objData.IdMunicipio;
        consultarMunicipios();

       
        var objImgFoto = document.getElementById("img_Logo");
        if (objImgFoto && objData.Logo) {
            objImgFoto.src = "data:image/jpeg;base64," + objData.Logo;
        }

        var objLogoImpresion = document.getElementById("img_LogoImpresion");
        if (objLogoImpresion) {

            objLogoImpresion.src = "data:image/jpeg;base64," + objData.LogoImpresion;

        }

        var objImgLogoInicioSesion = document.getElementById("img_LogoInicioSesion");
        if (objImgLogoInicioSesion) {

            objImgLogoInicioSesion.src = "data:image/jpeg;base64," + objData.LogoInicioSesion;

        }

      

        if (document.getElementById("input_Activo") !== null) {
            if (document.getElementById("input_Activo").checked && !objData.Activo) {
                document.getElementById("input_Activo").click();
            } else if (!document.getElementById("input_Activo").checked && objData.Activo) {
                document.getElementById("input_Activo").click();
            }
        }

        $("#input_Celular").trigger('keyup');

    } catch (e) {

        mostrarAlertas("Error al cargarDataEmpresa():\n" + e.message, "error");

    }
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

inicializarVentana();