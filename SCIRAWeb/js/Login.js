
$(document).ready(function () {
    $("input").keypress(function (event) {
        if (event.keyCode == 13) {
            iniciarSesion();
        }
    });
});

function iniciarSesion() {
    $(".loader").fadeIn();
    $("#preloader").fadeIn();
    setTimeout(login, 200);
}

function login() {


    var objUsuario = new Object();
    var sDataUsuario = "";
    var sAccion = "validarIngreso2";

    try {
        objUsuario.Login = $("#input_Login").val();
        objUsuario.Clave = $("#input_Clave").val();

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
                    $(".loader").fadeOut();
                    $("#preloader").delay(150).fadeOut("slow");
                    localStorage.clear();
                    return;
                }

                if (result.usuarios.length > 0) {
                    var objSesion = new Object();
                    objSesion.Usuario = result.usuarios[0];
                    objSesion.Rol = result.roles[0];
                    localStorage.setItem('Sesion', JSON.stringify(objSesion));
                    cargarLogoEmpres(result.usuarios[0].Empresa);

                }
                else {
                    mostrarAlertas("Usuario o contraseña inválidos. Por favor verificar.", "error");
                }
            },
            error: function (e) {
                var sMensaje = (e.responseJSON != undefined && e.responseJSON != null) ? e.responseJSON.errors[0].message : "";
                mostrarAlertas("Error en ajax al iniciar sesión. " + sMensaje, "error");
                $(".loader").fadeOut();
                $("#preloader").delay(150).fadeOut("slow");
            }
        });

    } catch (e) {
        mostrarAlertas("Error al guardar:\n" + e.message, "error");
    }
}


function cargarLogoEmpres(isEmpresa) {

    $.ajax({
        type: "GET",
        url: gsUrlApi + "/empresas/_id/" + isEmpresa + "/",
        headers: gsAutenticacion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (result) {
            if (result.Error) {
                //mostrarAlertas(result.Mensaje, "error");
                $(".loader").fadeOut();
                $("#preloader").delay(150).fadeOut("slow");
                localStorage.clear();
                return;
            }

            var objSesion = new Object();
            var objSesion = JSON.parse(localStorage.getItem('Sesion'));
            objSesion.Empresa = result.empresas[0];
            localStorage.setItem('Sesion', JSON.stringify(objSesion));
            window.location.replace("Maqueta.html");

        },


        error: function (e) {
            //mostrarAlertas("Error en ajax al cargar usuarios.", "error");
        }

    });

}


function mostarAlertaSweet(sMensaje, sType, sTitulo, sTextOk, sFuncionOk, sTextCancel, sFuncionCancel, objData) {

    var bMostrarBotonesCancel = false;

    if (!sTitulo) {
        sTitulo = "EDT";
    }

    if (!sType) {
        sType = "warning";
    }

    if (!sTextOk) {
        sTextOk = "Aceptar";
    }

    if (sType === "confirm") {
        sType = "warning";
        bMostrarBotonesCancel = true;
        var objInputValue = {
            sFuncionOk: sFuncionOk
            , sFuncionCancel: sFuncionCancel
            , data: objData
        }
    }

    swal({
        title: sTitulo,
        text: sMensaje,
        type: sType, // "warning",

        confirmButtonColor: "#1ab394",
        confirmButtonText: sTextOk,
        showConfirmButton: true,
        showCancelButton: bMostrarBotonesCancel,
        cancelButtonText: sTextCancel,
        closeOnConfirm: true,
        closeOnCancel: true,
        inputValue: objInputValue

    }, function (bRespuesta) {

        var objInputValue = this.inputValue;
        var objIframe = document.getElementById("iframe_BoxJob");
        var objEvento = null;

        if (objInputValue) {

            if (bRespuesta) {

                objEvento = eval('document.getElementById("' + objIframe.id + '").contentWindow.' + objInputValue.sFuncionOk);

            } else {

                objEvento = eval('document.getElementById("' + objIframe.id + '").contentWindow.' + objInputValue.sFuncionCancel);

            }

            if (objEvento !== null && objEvento) {
                objEvento(objInputValue.data);
                return;
            }
        }
    });

}

