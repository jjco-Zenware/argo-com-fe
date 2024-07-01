import { Component } from '@angular/core';
import { mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { ComprasService } from '../../Service/compraServices';
import { SharedAppService } from '@sharedAppService';

@Component({
  selector: 'app-reglas-aprobacion',
  templateUrl: './c-reglas-aprobacion.component.html',
  styleUrls: ['./c-reglas-aprobacion.component.scss']
})
export class ReglasAprobacionComponent {
  
  $listSubcription: Subscription[] = [];
  vistaLista: boolean = true;
  visDetalle: boolean = false;
  lstReglas: any;
  tituloDetalle!: string;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  dataRegla: any;

  constructor(
    private comprasService: ComprasService  ,
    private serviceSharedApp: SharedAppService,
    ){          
  }

  ngOnInit(): void{
      this.getListar();
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
    //console.log('this.frmDatos...', this.frmDatos.value);

    const $listaReglas = this.comprasService.listarReglaFlujo()
      .subscribe({
        next: (rpta:any) => {
            this.setSpinner(false);
            console.log('rpta getListar', rpta);
            this.lstReglas = rpta
        },
        error:(err)=>{
            this.setSpinner(false);
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($listaReglas)
  }

  onVer(dato: any) {
      this.tituloDetalle = "REGLAS DE APROBACIÓN N° " + dato.idregla;
      this.dataRegla = dato.idregla;
      this.vistaLista = false;
  }

  onEditar(dato: any) {
      this.tituloDetalle = "REGLAS DE APROBACIÓN N° " + dato.idregla;
      this.dataRegla = dato.idregla;
      this.vistaLista = false;
  }

  

  getDetalle(dato:boolean){
    this.vistaLista = true;
    this.visDetalle = false;
    this.getListar();
  }

  getBack() {
    this.vistaLista = true;
    this.visDetalle = false;
    this.getListar();
  }

  onNuevo() {        
    this.tituloDetalle = "REGLAS DE APROBACIÓN";
    this.dataRegla = 0;
    this.vistaLista = false;
  }

  eliminar(dato: any){
    
  }

}
