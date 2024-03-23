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
