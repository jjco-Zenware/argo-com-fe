import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';

@Component({
  selector: 'app-c-resultado',
  templateUrl: './c-resultado.component.html',
  styleUrls: ['./c-resultado.component.scss']
})

export class CResultadoComponent implements OnInit, OnDestroy{

  $listSubcription: Subscription[] = [];
  lstCuentas: any[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  frmDatos!: FormGroup;
  saldo_documento_sol: number = 0;
  saldo_documento_dol: number = 0;
  s_monto_recaudado_sol: number = 0;
  s_monto_recaudado_dol: number = 0;

  
  lstResultado:any[] = [{
    "nomcomercial": "DINET S.A.",
    "destipo": "VENTAS",
    "tipo": "V",
    "tipodocumento": "RUC",
    "nrodocumento": "20563265984",
    "tiporegistro": "VENTA",
    "fecharegistro": "25/06/2025",
    "tipocomprobante": "FACTURA",
    "numcomprobante": "F001-00000001",
    "fechacomprobante": "24/06/2025",
    "simbmoneda": "DOLARES",
    "montocomprobante": "20,000.00",
    "ctactble": "70",
    "tipogasto": "",
    "tc": "3.687",
    "montosoles": "60,000.00"
  },
  {
    "nomcomercial": "DYNATRACE PERU",
    "destipo": "COMPRAS",
    "tipo": "C",
    "tipodocumento": "RUC",
    "nrodocumento": "20563265984",
    "tiporegistro": "COMPRA",
    "fecharegistro": "25/06/2025",
    "tipocomprobante": "FACTURA",
    "numcomprobante": "F002-00000221",
    "fechacomprobante": "24/06/2025",
    "simbmoneda": "DOLARES",
    "montocomprobante": "10,000.00",
    "ctactble": "42",
    "tipogasto": "",
    "tc": "3.687",
    "montosoles": "30,000.00"
  },
  {
    "nomcomercial": "WALLA",
    "destipo": "GASTOS",
    "tipo": "G",
    "tipodocumento": "RUC",
    "nrodocumento": "20563225984",
    "tiporegistro": "GASTO",
    "fecharegistro": "25/06/2025",
    "tipocomprobante": "FACTURA",
    "numcomprobante": "F002-00044221",
    "fechacomprobante": "24/06/2025",
    "simbmoneda": "DOLARES",
    "montocomprobante": "5,000.00",
    "ctactble": "63",
    "tipogasto": "",
    "tc": "3.687",
    "montosoles": "15,000.00"
  },
  {
    "nomcomercial": "CASBER",
    "destipo": "GASTOS",
    "tipo": "G",
    "tipodocumento": "RUC",
    "nrodocumento": "20563225984",
    "tiporegistro": "GASTO",
    "fecharegistro": "25/06/2025",
    "tipocomprobante": "FACTURA",
    "numcomprobante": "F012-44221",
    "fechacomprobante": "24/06/2025",
    "simbmoneda": "DOLARES",
    "montocomprobante": "15,000.00",
    "ctactble": "63",
    "tipogasto": "",
    "tc": "3.687",
    "montosoles": "45,000.00"
  }];
  
  @Output() OB_back = new EventEmitter<boolean>();


  constructor(
      private fb: FormBuilder,
      private utilitariosService: UtilitariosService,
      public dialogService: DialogService  ,
      private confirmationService: ConfirmationService,  
      private serviceSharedApp: SharedAppService,
      private messageService: MessageService,
      private proyectosService: ProyectosService,
      
    ){    
      
  }

  ngOnInit(): void{
      this.createFrm();
    this.getListar();
  }

  createFrm(){
      this.frmDatos = this.fb.group({          
        fecini: [{value: this.utilitariosService.obtenerFechaInicioMes(),disabled: false}],
        fecfin: [{value: this.utilitariosService.obtenerFechaFinMes(),disabled: false}],
        idusuario: [{value: constantesLocalStorage.idusuario,disabled: false}],
        idproveedor: [{ value: 0, disabled: false }],
        idmoneda: [{value: 0,disabled: false}],
        idcliente: [{value: 0,disabled: false}],
        estado: [{value: '000' ,disabled: false}],
      })
    }

  ngOnDestroy(): void {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  getListar(){
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
    // this.saldo_documento_sol =0;
    // this.saldo_documento_dol =0;
    // this.s_monto_recaudado_sol =0;
    // this.s_monto_recaudado_dol =0;

    const objeto = {
      ...this.frmDatos.value,
      idtipodocprc: 18
    }

    const $getListar = this.proyectosService.ordenDocumentoResultado(objeto)
      .subscribe({
        next: (rpta:any) => {
            this.setSpinner(false);
            console.log('Resultado',rpta);

            this.lstCuentas = rpta.ordenescompra;

          
        },
        error:(err)=>{
            this.setSpinner(false);
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
          this.setSpinner(false);
          // this.saldo_documento_sol = this.lstCuentas.filter((item:any) => item.idmoneda === 1).reduce((acc:any, item:any) => acc + item.saldo_documento, 0);
          // this.saldo_documento_dol = this.lstCuentas.filter((item:any) => item.idmoneda === 2).reduce((acc:any, item:any) => acc + item.saldo_documento, 0);
          // this.s_monto_recaudado_sol = this.lstCuentas.filter((item:any) => item.idmoneda === 1).reduce((acc:any, item:any) => acc + item.s_monto_recaudado, 0);
          // this.s_monto_recaudado_dol = this.lstCuentas.filter((item:any) => item.idmoneda === 2).reduce((acc:any, item:any) => acc + item.s_monto_recaudado, 0);
        }
      });
    this.$listSubcription.push($getListar)
  }  

}
