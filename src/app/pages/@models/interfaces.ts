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