import { I_rptaDataLogin } from "@interfaces"

export const moduloAPP =  'COM';

export const constantesLocalStorage: I_rptaDataLogin = {
  nombreUsuario: "",
  token: "",
  login: "",
  idusuario: 0,
  estado: 0,
  mensaje: "",
  tipoacceso: ""
}

export const mensajesGenericos = {
  msgErrorGenerico: 'Lo sentimos ocurrio un error',
  msgSinRegistros: 'No se encontró registros',
  msgSinResultadosGrilla: 'No se encontró resultados.',
  msgCargandoResultadosGrilla: 'Cargando datos en la tabla. espere por favor...',
  msgErrorTI: 'Inconveniente, Comunicarse con TI'
}

export const mensajesQuestion = {
  msgAceptar: 'Si',
  msgCancelar: 'No',
  msgPreguntaGuardar: '¿Desea guardar los datos?',
  msgPreguntaActualizar: '¿Desea actualizar los datos?',
  msgPreguntaInactivar: '¿Desea eliminar el registro?',
  msgPreguntaActivar: '¿Desea activar el registro?',
  msgErrorGenerico: 'Lo sentimos ocurrio un error'
}

export const mensajesSpinner = {
  msjRecuperaLista: "Recuperando listado",
  msjRecuperaRegistro: "Recuperando registro",
  msjGuardar: "Guardando registro...!",
  msjActualizar: "Actualizando registro...!",
  msjInactivar: "Eliminando registro...!",
  msjActivar: "Activando registro...!",
  msjProcesando: "Procesando, por favor espere...!",
}

export const mensajesToast = {
  msgErrorGenerico: 'Lo sentimos ocurrio un error'
}

export const tipoAcceso = {
  azure: 'A',
  modulo: 'M'
}

export const respuestaProceso = {
  ConExito: 0,
  SinExito: 1
}