import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService, TreeNode } from 'primeng/api';
import { AlmacenService } from '../service/almacenServices';
@Component({
  selector: 'app-modal-ubicacion',
  templateUrl: './modal-ubicacion.component.html',
  styleUrls: ['./modal-ubicacion.component.scss']
})
export class CModalUbicacionComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  files!: TreeNode[];
  verbtnUbicacion: boolean = false; 
  file: any; 
  selectedFiles!: TreeNode[];
  loading: boolean = false;

  constructor(
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
        private almacenService: AlmacenService,
  ) { }



  ngOnInit(): void {
    this.loading = true;
    console.log('this.config.data...', this.config.data);
    this.TraerUbicacion();
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }



  guardar() {
    console.log('this.file...', this.file);
    if (this.file === undefined) {
      this.messageService.add({severity: 'info', summary: 'Aviso', detail: "Debe Seleccionar Una Ubicación..." });
      return;
  }
    if (this.file.length = 0) {
        this.messageService.add({severity: 'info', summary: 'Aviso', detail: "Debe Seleccionar Una Ubicación..." });
        return;
    }

    if (this.file.children != undefined) {
      this.messageService.add({severity: 'info', summary: 'Aviso', detail: "Debe Seleccionar Una Ubicación Válida..." });
      return;
  }
    
    const obj = {
      idubicacion: this.file.key,
      rutaubicacion: this.file.rutaubicacion,
      idalmacen: this.file.idalmacen,
      idordencompraitem: this.config.data.idordencompraitem,
      iddocumentoprcitem_trx: this.config.data.iddocumentoprcitem_trx
    }
    this.cerrar({...obj})
      
  }

  cerrar(data:any) {
    console.log('this.cerrar...');
    const objeto = {
      ...data
    }
    this.refDatoItem.close({objeto});
  }

  TraerUbicacion(){
    const $TraerUbicacion = this.almacenService.traerUbicaciones(this.config.data.idalmacen)
    .subscribe({
      next: (rpta:any) => {
          console.log('TraerUbicacion', rpta)
          this.files = rpta;
          this.loading = false;
        //   this.files.forEach((node) => {
        //     this.expandRecursive(node, true);
        // });
      },
      error:(err)=>{
          this.serviceSharedApp.messageToast()
      },
      complete:() => { 
      }
    });
  this.$listSubcription.push($TraerUbicacion)
  }

  nodeSelect(event: any) {
    this.verbtnUbicacion = true;
    console.log('event.node', event.node)
    console.log('event.children', event.node.children)
    this.file = event.node;
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
        node.children.forEach((childNode) => {
            this.expandRecursive(childNode, isExpand);
        });
    }
}
 
}
