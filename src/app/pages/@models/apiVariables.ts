import { environment } from "src/environments/environment";

const webApi = environment.webAPI;

const controllerLogin: string = webApi+'Login';
const controllerSeguridad: string = webApi+'Seguridad';
const controllerCRM: string = webApi+'Crm';
const controllerUsuario: string = webApi+'Usuario';
const controllerComercial: string = webApi+'Comercial';
const controllerMain: string = webApi+'Main';
const controllerArchivo: string = webApi+'Archivo';
const controllerPerfil: string = webApi+'Perfil';

export const constantesApiWeb = {
    refreshToken: controllerLogin + '/refreshToken',
    validausuario: controllerLogin + '/validausuario',
    opcionesperfilusuario: controllerSeguridad + '/opcionesperfilusuario',
    validaNombreUsuario: controllerLogin + '/validanombreusuario',
    validarloginAzure: controllerLogin + '/validarloginAzure',

    listarCasoNegocio: controllerCRM + '/casonegociotraeruno/',
    lstCotizacion: controllerComercial + '/cotizacionoportunidadlist/',
    obtenerMonto: controllerComercial + '/CalculaTotalQuotes/',

    fotocloudinary: controllerSeguridad + '/fotocloudinary/',
    TraerUnoUsuario: controllerUsuario + '/traerUnoUsuario/',
    GuardarUsuarioPerfil: controllerUsuario + '/actualizarUsuarioPerfilPersonal/',
    ListarNotificacion: controllerMain + '/notificacionlistar/',
    NotificacionPrc: controllerMain + '/notificacionprc/',

    
    Cambioclaveuserapp: controllerSeguridad + '/cambioclaveuserapp/',
    ListaClientes: controllerCRM + '/personalist/',
    obtenerOportunidadXCliente: controllerCRM + '/oportunidadlist02',

    ListaProveedores: controllerMain + '/personalistar',
    prcClientes: controllerMain + '/personaprc',
    listaTipoDocumento: controllerMain + '/listaritems/',

    prcPersonaCuenta: controllerComercial + '/personacuentaprc/',
    kanbanListaMonedas: controllerCRM + '/monedalist',
    prcProveedorLinea: controllerComercial + '/lineaproveedorprc/',
    lineaProveedorlist: controllerComercial + '/lineaProveedorlist/',
    personacuentalist: controllerComercial + '/personacuentalist/',
    kanbanListaContactos: controllerCRM + '/contactolist/',
    vigenciaContactos: controllerCRM + '/contactovigencia/',
    PrcContactos: controllerCRM + '/contactoprc/',
    listaArchivos: controllerArchivo + '/ListarFile/',
    eliminaradjunto: controllerArchivo + '/eliminaradjunto/',
    descargaradjunto: controllerArchivo + '/descargaradjunto/',
    uploadfile: controllerArchivo + '/uploadfile/',
    editarAdjunto: controllerArchivo + '/editaradjunto/',
    listarAdjuntoProc: controllerArchivo + '/listaradjuntoproc/',
    lstItemsTabla: controllerMain + '/listaritems/',
    listProyecto: controllerComercial + '/proyectolist',
    newProyecto: controllerComercial + '/proyectonew',

    prcCotizacion: controllerComercial + '/cotizacionprc',
    lstCotizacionUno: controllerComercial + '/cotizaciontraeruno/',
    lstProducto: controllerComercial + '/tipoproductolist',
    lstMarca: controllerComercial + '/marcalist',
    prcMarca: controllerComercial + '/marcaprc',

    oportunidadTraeruno: controllerCRM + '/oportunidadtraeruno/', 
    prcTerminoPago: controllerComercial + '/personaupd02/',

    ordencompraprc: controllerComercial + '/ordencompraprc',
    ordenCompraProyectoList: controllerComercial + '/ordencompraproyectolist/',
    ordenCompralist: controllerComercial + '/ordencompralist',
    activarProveedor: controllerComercial + '/personaupd03',
    proyectotraeruno: controllerComercial + '/proyectotraeruno',
    updProyecto: controllerComercial + '/proyectoupd',
    lineaproveedorDel: controllerComercial + '/lineaproveedordel/',
    PersonaCuentaDell: controllerComercial + '/PersonaCuentaDell/',
    kanbanListaContactosOpor: controllerCRM + '/contactolistoportunidad/',
    ordenCompraTraeruno: controllerComercial + '/ordencompratrearuno',
    tipoProyectoList: controllerComercial + '/tipoproyectolist',
    portipoProyectoList: controllerComercial + '/proyectolist02/',

    procesarTrx: controllerMain + '/prctrxdoc',
    prcDocumento: controllerMain + '/prcdocumento',
    listarFlujo: controllerComercial + '/trackflujolist',
    grabarRegla: controllerComercial + '/reglaflujoprc/',
    listarReglaFlujo: controllerComercial + '/reglaflujolist',
    traerUnoReglaFlujo: controllerComercial + '/reglaflujotraeruno/',
    agregarResolutor: controllerComercial + '/reglaflujoresolutorprc',
    listarPerfil: controllerPerfil + '/listarPerfil/',
    listarResolutor: controllerComercial + '/reglaflujoresolutorlist/',
    eliminarResolutor: controllerComercial + '/reglaflujoresolutordel/',

    //reglaflujoresolutordel
    descargarPlantilla: controllerArchivo + '/descargarplantilla/',

}
