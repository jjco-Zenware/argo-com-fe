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
const controllerAlmacen: string = webApi+'Almacen';
const controllerProducto: string = webApi+'Producto';
const controllerTesoreria: string = webApi+'Tesoreria';
const controllerContabilidad: string = webApi+'Contabilidad';
const controllerAdministracion: string = webApi+'Administracion';
const controllerMarketing: string = webApi +'Marketing'
const controllerEventos: string = webApi +'Evento'
const controllerLogger: string = webApi + 'Logger'

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
    prcDocumento: controllerMain + '/prcdocumentordlc',
    //prcDocumento: controllerMain + '/fichardlc',
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
    prcItem: controllerMain + '/tablaitemnew',
    obtenerOportunidadCliente: controllerCRM + '/oportunidadlist03',
    eliminarProyecto: controllerComercial + '/proyectodel',
    listarTrasacciones: controllerMain + '/trxmovimientolist02/',


    ListarAlamcen: controllerAlmacen + '/listarAlmacen/',
    GrabarAlamcen: controllerAlmacen + '/almacenprc/',
    ordencompraaprobadasprovlist: controllerComercial + '/ordencompraaprobadasprovlist/',
    listarProducto: controllerProducto + '/listarproducto',
    prcProducto: controllerProducto + '/actualizarProducto/',
    traerunoProducto: controllerProducto + '/traerUnoProducto/',
    listarFamilia: controllerProducto + '/familialist',
    listarSubFamilia: controllerProducto + '/subfamilialist/',
    traerProductoPorCodigo: controllerProducto + '/traerProductoPorCodigo/',
    buscarProducto: controllerAlmacen + '/buscarproducto',
    almacenTraeruno: controllerAlmacen + '/traerUnoalmacen/',
    buscarporRUC: controllerMain + '/personatraerunoruc',
    kardexlistar: controllerAlmacen + '/kardexlistar',
    productotaglist: controllerProducto + '/taglist/',
    tagNew: controllerProducto + '/tagNew',

    traerunoFamilia: controllerAlmacen + '/familiatraeruno/',
    traerunoSubFamilia: controllerAlmacen + '/subfamiliatraeruno/',
    
    prcFamilia: controllerAlmacen + '/familiaprc/',
    prcSubFamilia: controllerAlmacen + '/subfamiliaprc/',
    
    oficinaTraeruno: controllerAlmacen + '/traerUnooficina/',
    grabarOficina: controllerAlmacen + '/oficinaprc/',
    ListarOficina: controllerAlmacen + '/listaroficina/',
    buscarProducto03: controllerAlmacen + '/buscarproducto03',
    
    prcBanco: controllerTesoreria + '/bancoprc/',
    listarBanco: controllerTesoreria + '/bancolist/',
    traerunoBanco: controllerTesoreria + '/bancotraeruno/',

    prcProgramacion: controllerTesoreria + '/programacionprc/',
    listarProgramacion: controllerTesoreria + '/programacionlist/',
    traerunoprcProgramacion: controllerTesoreria + '/programaciontraeruno/',

    prcProgramacionDet: controllerTesoreria + '/programaciondetalleprc/',

    prcCentroCosto: controllerTesoreria + '/centrocostoprc/',
    listarCentroCosto: controllerTesoreria + '/centrocostolist/',
    eliminarCentroCosto: controllerTesoreria + '/centrocostoeliminar/',
    prcReporte: controllerComercial + '/reporteRdlc',
    
    prcPagoDocumento: controllerTesoreria + '/pagodocumentoprc/',
    listPagoDocumento: controllerTesoreria + '/pagodocumentolist/',
    traerunoPagoDocumento: controllerTesoreria + '/pagodocumentotraeruno/',

    listarPlanContable: controllerContabilidad + '/listarPlanContable',
    prcDocumentoDet: controllerMain + '/prcdetdocumentordlc',
    prcDocumentoDet2: controllerMain + '/prcdetdocumentordlc2',

    recalcularRegistro: controllerTesoreria + '/obtenercalculodetraccion/',
    listarUsuario: controllerUsuario + '/listarUsuario02',

    postordocumentoseleccionacotiza: controllerComercial + '/postordocumentoseleccionacotiza',
    prcPersona: controllerMain + '/personaprc',
    descargarInformeEmpleado: controllerMain + '/descargarinfoempleado',
    
    listavinculados: controllerAdministracion + '/VinculadoList/',
    listadatoslaborales: controllerAdministracion + '/LaboralPerList/',
    delVinculado: controllerAdministracion + '/vinculadodel/',
    delDatosLaborales: controllerAdministracion + '/LaboralDel/',
    prcVinculado: controllerAdministracion + '/VinculadoPrc',
    prcDatosLaborales: controllerAdministracion + '/LaboralPrc',
    listaEstadoLab: controllerAdministracion + '/estadoLaboral/',
    kanbanListaUsuarios: controllerCRM + '/usuariolist',
    prcFondosTrimestrales: controllerMarketing + '/fondosPrc',
    listarFondosTrimestrales: controllerMarketing + '/listarfondos',
    prcEventos: controllerEventos + '/eventoprc',
    listEventos: controllerEventos + '/eventolist',
    procesarTrxEvento: controllerEventos + '/prctrxevento',

    
    ordenCompraTraerunoSubproceso: controllerComercial + '/ordencompratrearunosubproceso',
    personaTraerUno: controllerMain + '/personatraeruno',
    ordencompraaprobadasprovlistsal: controllerComercial + '/ordencompraaprobadasprovlistSalida/',
    documentoPrcTipoDocPrcLista: controllerComercial + '/documentoprctipodocprclista/',
    documentoPrcOrdenCompraxProyecto: controllerComercial + '/documentoprcordencompraxproyectoxpro/',
    ordenCompralistGasto: controllerComercial + '/ordencompralistgasto',
    ordendocumentoprc: controllerComercial + '/ordendocumentoprc',
    ordendocumentoupd: controllerComercial + '/ordendocumentoupd',

    traerUbicaciones: controllerAlmacen + '/UbicacionesAlmacenTraerUno/',
    UbicacionAlmacenPrc: controllerAlmacen + '/UbicacionAlmacenPrc',

    obtenerUsuario: controllerUsuario + '/traerUnoUsuario',
    enviarEmailRequerimiento: controllerUsuario + '/enviaremailrequerimiento',
    
    listarMovimientosPrc: controllerComercial + '/listarmovimientosprc/',
    pagodocextornoprc: controllerTesoreria + '/pagodocextornoprc/',
    exportarexcelcuentas: controllerMain + '/exportarexcelcuentas',
    exportarexcelcuentaspc: controllerMain + '/exportarexcelcuentaspc',
    updateFechaProgramacion: controllerTesoreria + '/updatefechaprogramacion/',

    ordencompralistcuentas: controllerComercial + '/ordencompralistcuentas',
    pagosProgramados: controllerComercial + '/pagosprogramados',
    exportarExcelpagosprogramados: controllerMain + '/exportarexcelpagosprogramados',
    obtenerToken: controllerEventos + '/obtenertoken',
    //enviarCorreo: controllerEventos + '/enviarcorreo',
    listaritemTablaSunat: controllerContabilidad + '/listaritemtablasunat/',
    listarTipoTransporteTablaSunat: controllerContabilidad + '/listartipotransportetablasunat',
    listarMotivoTrasladoTablaSunat: controllerContabilidad + '/listarmotivotrasladotablasunat',
    listarTipoDocumentoTablaSunat: controllerContabilidad + '/listartipodocumentotablasunat/',

    listarGastos: controllerMarketing + '/listargastos',
    prcGastos: controllerMarketing + '/gastosprc',  
    gastosTraeruno: controllerMarketing + '/gastostraeruno/',
    
    ordenCompraTraerunoNroDoc: controllerComercial + '/ordendocumentotrearunonrodoc',
    emitirDocumento: controllerLogger + '/comprobantefelprc',
    
    operacionFel: controllerLogger + '/operacionfel',
    //operacionFel: controllerContabilidad + '/operacionfel',

    procesarTrxGasto: controllerMain + '/prctrxgasto',
    enviarCorreo: controllerEventos + '/send',

    gettipocambio: controllerContabilidad + '/gettipocambio/',
    gettipocambiodia: controllerContabilidad + '/gettipocambiodia/',
    plancontablePrc: controllerContabilidad + '/plancontableprc',
    exportarexcelgastos: controllerMarketing + '/exportarexcelgastos',
    pdfDocumentoEvento: controllerMain + '/pdfdocumentoevento',
    portipoProyectoClienteList: controllerComercial + '/proyectolist03/',
    listarTrasaccionesGastos: controllerMain + '/trxmovimientolist03/',
    descargarInformeEvento: controllerMain + '/descargarinfoevento',
    obtenerConfirmados: controllerEventos + '/confirmadoseventolist/',
    exportarexcelevento: controllerMarketing + '/exportarexcelevento',

    ConfirmadoseventoAsiste: controllerEventos + '/confirmadosasistencia',
}
