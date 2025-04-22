export interface I_loginUsuario {
    nombreUsuario: string;
    clave: string;
}

export interface I_respuestaLogin {
    estado: boolean;
    mensaje: string;
    respuestaData: I_rptaDataLogin;
}

export interface I_rptaDataLogin {
    nombreUsuario: string;
    login: string;
    imagen:string;
    estado: number;
    idusuario: number;
    mensaje: string;
    token: string;
    tipoacceso: string;
    idperfil: number;
    nomperfil: string;
}

export interface I_respuestaGeneral {
    estado: boolean;
    mensaje: string;
    respuestaData: any;
}

export interface I_RespuestaProceso{
    procesoSwitch: number
    errorNumero:number;
    errorSeveridad:number;
    errorEstado:number;
    errorProcedimiento:string;
    errorLinea:number;
    mensaje:string;
    resultProceso:string;
}

export interface I_ConfirmDialog {
    message?: string;
    header?: string;
    rejectButtonStyleClass?: string;
    acceptButtonStyleClass?: string;
    acceptLabel?: string;
    acceptIcon?: string;
    rejectLabel?: string;
    rejectIcon?: string;
}

export interface I_MessageToast {
    severity?: string;
    summary?: string;
    detail?: string;
}

export interface I_ListadoUsuarios {
    codigoUsuario: number;
    nomUsuario: string;
    sucursal: string;
    unidad: string;
    userlogin: string;
    vigencia: boolean;
    bloqueo: boolean;
    imagen: string;
}

export interface I_Usuario {
    idusuario: number;
    nomusuario: string;
    tipousuario: string;
    idsucursal: number;
    idunidad: number;
    codpersona: number;
    userlogin: string;
    indvigencia: true,
    fechainivig: Date;
    fechafinvig: Date;
    fechareg: Date;
    usereg: number;
    fechaact: Date;
    useract: string;
    email: string;
    fecanulacion: Date
    useranulacion: string;
    indbloqueo: false,
    fecbloqueo: null,
    userbloqueo: null,
    imagen: string;
}

export interface I_ListadoSucursal {
    idsucursal: number;
    descripcion: string;
}

export interface I_ListadoUnidad {
    idunidad: number;
    descripcion: string;
}

export interface I_ListadoPerfil {
    idperfil: number;
    desperfil: string;
    grupoperfil: string;
    vigencia: string;
    descvigencia: string;
    caja: string;
    fechareg: Date;
    userreg: number;
    fechaact: Date;
    useract: string;
}

export interface I_Perfil {
    idperfil: number;
    desperfil: string;
    grupoperfil: string;
    indvigencia: string;
    indcaja: string;
    userreg: number;
    useract: string;
}

export interface I_Proyecto {
    idproyecto: number;
    idcasonegocio: number;
    nomproyecto: string;
    fecproyecto: string;
    descripcion: string;
    fecreg: string;
    horareg: string;
    nompreventa: string;
    nomproveedor: string;
    idoportunidad: string;
    monto: number;
    nomcomercial: string;
    nomvendedor: string;
}

export interface Secciones{
    idtipoprod: number;
    nomtipoproducto: string;
    badgeColor: string;
    itemsQuote:CotizacionItem[];
}

export interface I_RespuestaProceso{
    procesoSwitch: number
    errorNumero:number;
    errorSeveridad:number;
    errorEstado:number;
    errorProcedimiento:string;
    errorLinea:number;
    mensaje:string;
    resultProceso:string;
}

export interface Cotizacion {
    idcotiza: number;
    idrequerimiento: number;
    idoportunidad: number;
    codtipodoc?: string;
    idmoneda: number;
    monto: number;
    costo: number;
    idproveedor: number;
    fechaingreso ?: Date;
    horaingreso ?: Date;
    fechacompleto ?: Date;
    horacompleto ?: Date;
    fechaaprobacio?: Date;
    horaaprobacion?: Date;
    estado: string;
    idusercompleto: number;
    iduseraprueba: number;
    idproveedor_original: number;
    fechareg?: Date;
    iduserreg?: number;
    fechaact?: Date;
    iduseract?: number;
    tiempoentrega: number;
    codformapago?: string;
    validezoferta: number;
    lugarentrega?: string;
    observacion?: string;
    garantia: number;
    nrodocumentoadd?: string;
    idusuario?: number;
    items:CotizacionItem[];
    nomempresa: string;
    s_monto: string;
    simbmoneda: string;
    condicionescomerciales: string;
    indseleccion: boolean;
}


export interface CotizacionItem{
    idcotizaitem?: number;
    idcotiza?: number;
    idtipoprod: number;
    idprod?: number;
    descripcion?: string;
    cantidad: number;
    codunidad?: string;
    preciocosto : number;
    descuento?:number;
    margen? :number;
    precioventa :number;
    indvig ?:boolean;
    iduserreg?:number;
    fecreg ?:Date;
    iduseract? :number;
    fecact ?:Date;
    coditem ?:string;
    idmarca?: number;
    nomprod?: string;
    nommarca?: string;
    preciocostototal: number;
    precioventatotal: number;
    preprofit: number;
    nomtipoprod?: string;
    nomproveedor?: string;
    badgeColor?: string;
    idnvoitem:number;
    nroindex:number;
    nrocontrato?: string;
    nromeses:number;
    sku?: string;
    serialnumber?: string;
    idproveedor?: number;
}

export interface CasoNegocio{
    descripcion: string;
    desmoneda: string;
    fecfinoportunidad: string;
    fecoportunidad: string;
    idcliente: number;
    idmoneda: number;
    idoportunidad: number;
    monto: number;
    razonsocial: string;
    secciones: Secciones[];
    simbmoneda: string;
    titulo: string;
    tipocambio: number;
    margen: number;
    profit: number;
    nomcreador: string;
    nomusuariocomercial:string;
    nomusuariopreventa:string;
}

export interface dOperacion{
    nrooperacion: number;
    idordencompra: number;
    nomproveedor: string;
    nommoneda: string;
    monto: number;
    nomtipoproducto: string;
    idproyecto: number;
    nomproyecto: string;
    idcotiza: number;
}

export interface Notificacion{
    codproceso: number;
    codtiponotif: string;
    detallenotifica: string;
    estado: string;
    fechanotifica: string;
    fecreg: string;
    idnotifica: string;
    idnroproceso: string;
    idtrx: string;
    iduserreg: string;
    idusuario: string;
    msgnotifica: string;
}

export interface Cliente {
    idcliente: number;
    idrolpersona?: string;
    tipopersona?: string;
    tipoalta?: string;
    indnacionalidad?: string;
    idpais?: number;
    idtipodoc?: string;
    nrodocumento: string;
    appaterno?: string;
    apmaterno?: string;
    apcasada?: string;
    nombres?: string;
    razonsocial?: string;
    nomcomercial?: string;
    direcresumen?: string;
    telefresumen?: string;
    email?: string;
    paginaweb?: string;
    facebook?: string;
    youtube?: string;
    indmigrado?: boolean;
    indestado?: string;
    indvig?: boolean;
    fechareg?: Date;
    iduserreg?: number;
    fechaact?: Date;
    iduseract?: number;
    idpersona?: number;
    nomtipopersona?: string;
    nroctadetraccion?: number;
    tipoentidad?: string;
}

export interface KanbanCard {
    id: string;
    title?: string;
    description?: string;
    startDate?: string;
    dueDate: string;
    completed?: boolean;
    progress?: number;
    idcliente?:number;
    // assignees?: Assignees[];
    // comments?: Comments[];
    // contactos?: Contacto[];
    priority?: object;
    attachments?: number;
    //taskList: TaskList;
    monto: number;
    idlista?: number;
    razonsocial?: string;
    simbmoneda?: string;
    idmoneda?:number;
    nroasignados?: number;
    nrocontactos?: number;
    nrotareas?: number;
    nroadjuntos?: number;
    nomlista?: string;
    idpreventa?:number;
    //acciones?: Acciones[]|undefined;
    bgcolor?: string;
    bgicon?: string;
    tipocambio: number;
    nomcreador?: string;
    tipoproducto?: undefined;
    nommoneda?: string;
    indestado_qu?: boolean;
    indestado_bc?: boolean;
    nomestado_qu?: string;
    nomestado_bc?: string;
    montodolar?: number;
    nomcomercial?: string;
    nompreventa?: string;
    nomproveedor?: string;
    idproveedor?:number;
    idmarca?:number;
    //regoportunidadesext?: RegOportunidadExt[];
    idtrx?: number;
    //preventas?: Assignees[];
    idnotifica?: number;
}

export interface TablaDetalle{
    iditem: number;
    valoritem: string;
}

export interface Contacto {
    idcontacto: number;
    idcliente?: number;
    nombrecontacto?: string;
    cargo?: string;
    email?: string;
    telefono?: string;
    image?: string;
    idcotiza?: number;
    tiporol?: number;
    nomtiporol?: string;
}

export interface Moneda {
    idmoneda: number;
    desmoneda?: string;
    simbmoneda?: string;
}

export interface TipoDocumento{
    iditem: number;
    valoritem: string;
}

export interface Marca{
    idmarca: number;
    nommarca: string;
}

export interface TipoProducto{
    idtipoprod: number;
    nomtipoprod: string;
}

export interface OrdenCompraItem{
    idordencompraitem?: number;
    idordencompra?: number;
    idtipoprod: number;
    idprod?: number;
    descripcion?: string;
    cantidad: number;
    codunidad?: string;
    preciocosto : number;
    descuento?:number;
    margen? :number;
    precioventa :number;
    indvig ?:boolean;
    iduserreg?:number;
    fecreg ?:Date;
    iduseract? :number;
    fecact ?:Date;
    coditem ?:string;
    idmarca?: number;
    nomprod?: string;
    nommarca?: string;
    preciocostototal: number;
    precioventatotal: number;
    preprofit: number;
    nomtipoprod?: string;
    nomproveedor?: string;
    badgeColor?: string;
    idnvoitem:number;
    nroindex:number;
    nrocontrato?: string;
    nromeses:number;
    sku?: string;
    serialnumber?: string;
    idproveedor?: number;
    idubicacion?: number;
    iddocumentoprcitem_trx?: number;
    rutaubicacion: string;
    coptipoexistencia: string;
    nomtipoexistencia: string;
}

export interface OrdenCompra {
    idordencompra: number;
    idrequerimiento: number;
    idproyecto: number;
    codtipodoc?: string;
    idmoneda: number;
    monto: number;
    costo: number;
    idproveedor: number;
    fechaingreso ?: Date;
    horaingreso ?: Date;
    fechacompleto ?: Date;
    horacompleto ?: Date;
    fechaaprobacio?: Date;
    horaaprobacion?: Date;
    estado: string;
    idusercompleto: number;
    iduseraprueba: number;
    idproveedor_original: number;
    fechareg?: Date;
    iduserreg?: number;
    fechaact?: Date;
    iduseract?: number;
    tiempoentrega: number;
    codformapago?: string;
    validezoferta: number;
    lugarentrega?: string;
    observacion?: string;
    garantia: number;
    nrodocumentoadd?: string;
    idusuario?: number;
    items:CotizacionItem[];
    nomempresa: string;
    s_monto: string;
    simbmoneda: string;
    condicionescomerciales: string;
}

export interface ContactoOrdenCompra {
    idcontacto: number;
    idcliente?: number;
    nombrecontacto?: string;
    cargo?: string;
    email?: string;
    telefono?: string;
    image?: string;
    idordencompra?: number;
    tiporol?: number;
    nomtiporol?: string;
}

export interface Tag{
    idtag: number;
    nomtag: string;
    valor: string;
    iditemdocumento: string;
}

export interface I_PersonaENT {
    idrolpersona: string
    tipopersona: string
    tipoalta: string
    indnacionalidad: string
    idpais: string
    idtipodoc: string
    nrodocumento: string
    appaterno: string
    apmaterno: string
    apcasada: any
    nombres: string
    razonsocial: any
    nomcomercial: any
    direcresumen: string
    telefresumen: string
    email: string
    paginaweb: any
    facebook: any
    youtube: any
    indmigrado: boolean
    indestado: string
    indvig: boolean
    idusuario: number
    idpersona: number
    tipoentidad: string
    nroctadetraccion: number
    adm_genero: string
    adm_contaco_emergenci: any
    adm_nrotelef_emergencia: any
    adm_fechanacimiento: string
    adm_estadocivil: number
    fechainicio: any
    fechafin: any
    idtipotrabajo: any
    idtipocontrato: any
    idcargo: any
    adm_email: string
  }

  export interface eventoList {
    map?: any;
    //listId: number;
    listId: string;
    title?: string;
    cards?: eventoCard[];
    nroorden: number;
    indvig?: boolean;
    bgcolor: string;
    bgicon: string;
    creaOportunidad?: number;
}
  

export interface eventoCard {
    idevento: number;
    title?: string;
    description?: string;
    fecinicio?: string;
    fecfinal: string;
    completed?: boolean;
    progress?: number;
    idcliente?:number;
    // assignees?: Assignees[];
    // comments?: Comments[];
    // contactos?: Contacto[];
    priority?: object;
    attachments?: number;
    //taskList: TaskList;
    monto: number;
    idlista?: number;
    razonsocial?: string;
    simbmoneda?: string;
    idmoneda?:number;
    nroasignados?: number;
    nrocontactos?: number;
    nrotareas?: number;
    nroadjuntos?: number;
    nomlista?: string;
    idpreventa?:number;
    //acciones?: Acciones[]|undefined;
    bgcolor?: string;
    bgicon?: string;
    tipocambio: number;
    nomcreador?: string;
    tipoproducto?: undefined;
    nommoneda?: string;
    indestado_qu?: boolean;
    indestado_bc?: boolean;
    nomestado_qu?: string;
    nomestado_bc?: string;
    montodolar?: number;
    nomcomercial?: string;
    nompreventa?: string;
    nomproveedor?: string;
    idproveedor?:number;
    idmarca?:number;
    //regoportunidadesext?: RegOportunidadExt[];
    idtrx?: number;
    //preventas?: Assignees[];
    idnotifica?: number;
    horainicio?: string;
    horafinal?: string;
    diainicio?: string;
    diafinal?: string;
    dueDate?: string;
    lugar?: string;
}

export interface Tasks {
    idtarea: number;
    sidtarea: string;
    text: string;
    completed: boolean;
    fechafin: string;
    asignados: TareaAsignado[];
    asignados_str?: string;
    nroorden: number;
    fechaini: string;
}

export interface TareaAsignado {
    idasignado: number;
    name: string;
    image: string;
    idtarea: number;
}

export interface Assignees {
    idasignado: number;
    name: string;
    image: string;
    cargo?: string;
    email?: string;
    nrocelular?: string;
}

export interface TaskList {
    id?: number;
    title: string;
    tasks: Tasks[];
}

