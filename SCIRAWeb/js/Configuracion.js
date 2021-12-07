var gsUrlApi;
var gsAutenticacion = { "Authorization": "Basic " + btoa("caminosips:caminos1_xxxx") , "Access-Control-Allow-Origin": "*"};
var sAmbiente = "DESARROLLO";

switch (sAmbiente) {
    case "DESARROLLO":
        gsUrlApi = "http://localhost:3030";
        break;
    case "PRODUCCION":
        gsUrlApi = "http://40.87.68.203/apifacturacion";
        break;
    default:
        gsUrlApi = "http://localhost:59958/apifacturacion";
}
