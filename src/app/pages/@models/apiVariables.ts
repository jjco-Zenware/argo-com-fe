import { environment } from "src/environments/environment";

const webApi = environment.webAPI;

const controllerLogin: string = webApi+'Login';
const controllerSeguridad: string = webApi+'Seguridad';

export const constantesApiWeb = {
    refreshToken: controllerLogin + '/refreshToken',
    validausuario: controllerLogin + '/validausuario',
    opcionesperfilusuario: controllerSeguridad + '/opcionesperfilusuario',
    validaNombreUsuario: controllerLogin + '/validanombreusuario',
    validarloginAzure: controllerLogin + '/validarloginAzure',
}