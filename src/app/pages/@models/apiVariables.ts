import { environment } from "src/environments/environment";

const webApi = environment.webAPI;

const controllerLogin: string = webApi+'Login';
const controllerSeguridad: string = webApi+'Seguridad';
const controllerCRM: string = webApi+'Crm';
const controllerComercial: string = webApi+'Comercial';

export const constantesApiWeb = {
    refreshToken: controllerLogin + '/refreshToken',
    validausuario: controllerLogin + '/validausuario',
    opcionesperfilusuario: controllerSeguridad + '/opcionesperfilusuario',
    validaNombreUsuario: controllerLogin + '/validanombreusuario',
    validarloginAzure: controllerLogin + '/validarloginAzure',

    listarCasoNegocio: controllerCRM + '/casonegociotraeruno/',
    lstCotizacion: controllerComercial + '/cotizacionoportunidadlist/',
    obtenerMonto: controllerComercial + '/CalculaTotalQuotes/',


}
