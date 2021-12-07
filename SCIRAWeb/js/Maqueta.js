var gObjSesion = null;
var gbAjustar = false;
var gLstinterfaces = false;
var glstPermisos = false;

$(document).ready(function () {
    var objSesion = JSON.parse(localStorage.getItem('Sesion'));

    if (objSesion == null || objSesion == undefined) {
        window.location.replace("Login.html");
        return;
    }
    else {
        gObjSesion = objSesion;



        glstPermisos = gObjSesion.Usuario.Rol.Permisos;
        cargarLogoEmpresa(objSesion.Usuario.Empresa)
        consultarInterfaces();
        actualizarDatos();

        actualizarDataUsuario(objSesion.Usuario);
    }

    setInterval(ajustarAltoContenidoAreaTrabajo, 900);
    $("#iframe_BoxJob").on("load", onloadIframeAreaTrabajo);

});

function cargarLogoEmpresa() {



    var objSesion = JSON.parse(localStorage.getItem('Sesion'));
    if (objSesion.Empresa.Logo) {

        var objImgFoto = document.getElementById("logoEmpresa");
        if (objImgFoto) {
            objImgFoto.src = "data:image/jpeg;base64," + objSesion.Empresa.LogoImpresion;
        }

    }

    $.ajax({
        type: "GET",
        url: gsUrlApi + "/empresas/_id/" + gObjSesion.Usuario.Empresa + "/",
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.Error) {
                //mostrarAlertas(result.Mensaje, "error");
                return;
            }

            var objSesion = new Object();
            var objSesion = JSON.parse(localStorage.getItem('Sesion'));

            objSesion.Empresa = result.empresas[0]

            $("#nombreEmpresa").text(objSesion.Empresa.Nombre);

            if (objSesion.Empresa.Logo) {
                var objImgLogo = document.getElementById("logoEmpresa");
                if (objImgLogo) {
                    objImgLogo.src = "data:image/jpeg;base64," + objSesion.Empresa.LogoImpresion;
                }

            }

        },


        error: function (e) {
            //mostrarAlertas("Error en ajax al cargar usuarios.", "error");
        }

    });

}

function actualizarDatos() {

    $.ajax({
        type: "GET",
        url: gsUrlApi + "/usuarios/_id/" + gObjSesion.Usuario._id + "/",
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",


        success: function (result) {
            if (result.Error) {
                //mostrarAlertas(result.Mensaje, "error");
                return;
            }
            var objSesion = new Object();
            var objSesion = JSON.parse(localStorage.getItem('Sesion'));

            objSesion.Usuario = result.datos[0];
            if (objSesion.Usuario.Foto) {

                var objImgFoto = document.getElementById("img_FotoUsuarioMaqueta");
                if (objImgFoto) {
                    objImgFoto.src = "data:image/jpeg;base64," + objSesion.Usuario.Foto;
                }

                var objImgFoto = document.getElementById("img_FotoUsuarioMaqueta_MenuDesplegable");
                if (objImgFoto) {
                    objImgFoto.src = "data:image/jpeg;base64," + objSesion.Usuario.Foto;
                }

            }


        },
        error: function (e) {
            //mostrarAlertas("Error en ajax al cargar usuarios.", "error");
        }
    });

}



function actualizarDataUsuario(objUsuario) {



    if (gObjSesion.Usuario._id === objUsuario._id) {

        gObjSesion.Usuario = objUsuario;//Actualizar la data del usuario.
        $("#span_NombreUsuario").text(objUsuario.NombreCompleto);
        $("#span_RolUsuario").text(gObjSesion.Usuario.Rol.Nombre);



        if (objUsuario.Foto) {

            var objImgFoto = document.getElementById("img_FotoUsuarioMaqueta");
            if (objImgFoto) {
                objImgFoto.src = "data:image/jpeg;base64," + objUsuario.Foto;
            }

            var objImgFoto = document.getElementById("img_FotoUsuarioMaqueta_MenuDesplegable");
            if (objImgFoto) {
                objImgFoto.src = "data:image/jpeg;base64," + objUsuario.Foto;
                document.querySelector('#nombreUsuario').innerText = objUsuario.PrimerNombre;
            }

        }

    }


}

function ajustarAltoContenidoAreaTrabajo() {

    if (gbAjustar) {
        let objIframe = document.getElementById("iframe_BoxJob");
        let iHeightAreaTrabajo = 1000;

        if (objIframe !== null) {

            iHeightAreaTrabajo = $(objIframe.contentDocument ? objIframe.contentDocument : objIframe.contentWindow.document).find("body").height();
            iHeightAreaTrabajo += 300;
            $(objIframe).height(iHeightAreaTrabajo);
        }
    }
}

function onloadIframeAreaTrabajo() {
    var sObjetoScroll = "html, body";
    //hacemos que el scroll se ubique
    $(sObjetoScroll).animate({ scrollTop: "0px" }, 700, "swing");
}

function redireccionarVentana(objEvento, sUrl, sTitulo, sOpciones) {
    var objContenedorMenu = $(objEvento).closest(".nav");
    var iIdSubmenu = objEvento.id;
    var lstOpciones = sOpciones.split('|');
    var lstOpcionesVentanaHab = [];
    var idUsuario = gObjSesion.Usuario._id;
    var idEmpresa = gObjSesion.Usuario.Empresa;

    if (gLstinterfaces !== null && gLstinterfaces) {

        lstOpcionesVentanaHab = gLstinterfaces.filter(function (obj) {
            return (obj.parent === iIdSubmenu && obj.selected);
        });

    }

    $("#h2_TituloPanelMaqueta").text(sTitulo);
    $("#div_btnOperaciones").find(".btn").addClass("objControlOculto");
    $("#div_btnOperaciones").find(".btn").removeClass("grayscale");
    $("#div_btnOperaciones").find(".btn").unbind("click");
    $("#div_btnOperaciones").find(".btn").removeAttr("hab");
    $("#div_btnOperaciones").find(".btn").removeAttr("title");
    $("#div_btnOperaciones").find(".btn").attr("hab", "0");

    if (objContenedorMenu) {
        $(objContenedorMenu).find("li.active").removeClass("active");
        $(objEvento).addClass("active");
    }

    //mostrar botones
    for (let i = 0; i < lstOpciones.length; i++) {

        if (lstOpciones[i] !== "") {

            var objBoton = $("#div_btnOperaciones").find(".btn[operacion='" + lstOpciones[i] + "']")[0];

            if (objBoton) {

                $(objBoton).removeClass("objControlOculto");
                $(objBoton).attr("title", $(objBoton).attr("titlealt"));

            }

        }

    }

    //hab botones
    for (let i = 0; i < lstOpcionesVentanaHab.length; i++) {

        if (lstOpcionesVentanaHab[i].Acciones !== null && lstOpcionesVentanaHab[i].Acciones) {

            var sOpcion = $.trim(lstOpcionesVentanaHab[i].Acciones.split('|')[1]);

            if (sOpcion) {

                $("#div_btnOperaciones").find(".btn[operacion='" + sOpcion + "']").removeAttr("hab");
                $("#div_btnOperaciones").find(".btn[operacion='" + sOpcion + "']").attr("hab", "1");

            }

        }

    }

    if (gObjSesion !== null) {
        if (sUrl.indexOf("?") === -1) {
            sUrl = sUrl + "?IdUsuario=" + idUsuario + "&IdEmpresa=" + idEmpresa;
        } else {
            if (sUrl.indexOf("IdUsuario=") === -1) { //Agregar el QueryString IdUsuario si no esta en la url
                sUrl = sUrl + "&IdUsuario=" + idUsuario;
            }
            if (sUrl.indexOf("IdEmpresa=") === -1) { //Agregar el QueryString IdEmpresa si no esta en la url
                sUrl = sUrl + "&IdEmpresa=" + idEmpresa;
            }
        }
    }

    var objIframe = document.getElementById("iframe_BoxJob");
    if (objIframe && objIframe !== null) {
        objIframe.src = sUrl;
        gbAjustar = true;

        //Asignar acciones de los botones genericos.
        $("#div_btnOperaciones").find(".btn[hab='1']").on("click", function () {
            operacionesMenu($(this).attr("operacion"));
        });

        $("#div_btnOperaciones").find(".btn[hab='0']").removeAttr("title");
        $("#div_btnOperaciones").find(".btn[hab='0']").attr("title", "No tiene permisos para esta opción");
        $("#div_btnOperaciones").find(".btn[hab='0']").addClass("grayscale");

        if ($('body').hasClass('body-small')) {
            $('.navbar-minimalize').trigger("click");
        }

    }
}

function operacionesMenu(sTipo) {

    var objIframe = document.getElementById("iframe_BoxJob");

    switch (sTipo) {
        case "N":
            objIframe.contentWindow.nuevo();
            break;
        case "G":
            objIframe.contentWindow.guardar();
            break;
        case "C":
            objIframe.contentWindow.cancelar();
            break;
        case "E":
            objIframe.contentWindow.eliminar();
            break;
        case "I":
            objIframe.contentWindow.imprimir();
            break;
        default:
            break;
    }

}

function habilitarBotones(bEstado, sBotones) {

    $("#div_btnOperaciones").find(".btn").attr("disabled", "disabled");

    if (sBotones) {

        var lstBotones = sBotones.split('|');

        for (var i = 0; i < lstBotones.length; i++) {

            if (lstBotones[i] !== "") {

                var objBoton = $("#div_btnOperaciones").find(".btn[operacion='" + lstBotones[i] + "']")[0];

                if (objBoton) {

                    if ($(objBoton).attr("hab") === "1") {
                        $(objBoton).removeAttr("disabled");
                    }
                }

            }

        }

    }

    //if (sBotones.indexOf("|N|") !== -1) {
    //    $("#button_Nuevo").removeAttr("disabled");
    //}

    //if (sBotones.indexOf("|G|") !== -1) {
    //    $("#button_Guardar").removeAttr("disabled");
    //}

    //if (sBotones.indexOf("|E|") !== -1) {
    //    $("#button_Eliminar").removeAttr("disabled");
    //}

    //if (sBotones.indexOf("|I|") !== -1) {
    //    $("#button_Imprimir").removeAttr("disabled");
    //}

    //if (sBotones.indexOf("|C|") !== -1) {
    //    $("#button_Cancelar").removeAttr("disabled");
    //}

}


function cargarMenus(lstInterfaces) {

    var idUsuario = gObjSesion.Usuario._id;
    var idEmpresa = gObjSesion.Usuario.Empresa;

    var lstMenus = lstInterfaces.filter(obj => {
        return obj.parent === "#";
    });

    for (var i = 0; i < lstMenus.length; i++) {
        var objMenu = lstMenus[i];
        var lstSubMenu = lstInterfaces.filter(obj => {
            return obj.parent === lstMenus[i].id;
        });

        var sHtmlMenu = "<li";

        if (i === 0) {
            sHtmlMenu += " class='active'>";
        } else {
            sHtmlMenu += ">";
        }

        sHtmlMenu += "<a href=\"#\" aria-expanded=\"true\"><i class='" + objMenu.icon + "' /></i><span class='nav-label'>" + objMenu.text + "</span><span class=\"fa arrow\"></span></a>";

        if (lstSubMenu.length > 0) {

            sHtmlMenu += "<ul class=\"nav nav-second-level collapse\" aria-expanded=\"false\" >";

            for (let j = 0; j < lstSubMenu.length; j++) {

                objSubMenu = lstSubMenu[j];
                //Validar si el submenu tiene opciones activas si es asi se debe habilitar la ventana.
                objSubMenu.selected = (lstInterfaces.filter(obj => {
                    return (obj.parent === objSubMenu.id && obj.selected);
                }).length > 0);

                if (objSubMenu.selected) {

                    sHtmlMenu += "<li><a onclick=\"redireccionarVentana(this, '" + objSubMenu.Url + "?IdUsuario=" + idUsuario + "&IdEmpresa=" + idEmpresa + "', '" + objSubMenu.text + "', '" + objSubMenu.Acciones + "')\" id=\"" + objSubMenu.id + "\"><i class='" + objSubMenu.icon + "' /></i><span class='nav-label'>" + objSubMenu.text + "</span></a></li>";

                } else {

                    sHtmlMenu += "<li title='No tiene acceso a esta opción.' class='grayscale'><a disabled class='grayscale'>" + objSubMenu.text + "</a></li>";

                }

            }

            sHtmlMenu += "</ul>";

        }

        sHtmlMenu += "</li>";

        $("#side-menu").append(sHtmlMenu);


    }

    // MetisMenu
    var sideMenu = $('#side-menu').metisMenu();

}


function consultarInterfaces() {

    $.ajax({
        type: "GET",
        url: gsUrlApi + "/interfaces",
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.Error) {
                mostrarAlertas(result.Mensaje, "error");
                return;
            }

            if (result.interfaces !== null && result.interfaces) {

                lstData = result.interfaces;

                if (glstPermisos !== null) {

                    for (let i = 0; i < lstData.length; i++) {

                        lstData[i].selected = (glstPermisos.indexOf(lstData[i].id) !== -1);

                    }

                }

            }

            gLstinterfaces = lstData;

            cargarMenus(lstData);

        }
        , error: function (e) {
            mostrarAlertas("Error en ajax al cargar los menus.", "error");
        }
    });

}



//Valida si al menos una de sus acciones está seleccionada.
function validarActivo(arrAcciones) {
    var arrActivos = arrAcciones.filter(obj => {
        return obj.state.selected == true;
    });

    return arrActivos.length > 0 ? true : false;
}

function cargarAcciones(arrAcciones) {
    var sAcciones = "";
    for (var i = 0; i < arrAcciones.length; i++) {
        var objAccion = arrAcciones[i];

        if (objAccion.state.selected) {
            sAcciones += "|" + objAccion.li_attr.codigo + "|";
        }
    }
    return sAcciones;
}




function logout() {
    localStorage.clear();
    window.location.replace("Login.html");
}
