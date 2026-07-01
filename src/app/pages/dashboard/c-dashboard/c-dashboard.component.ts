import { Component, OnInit, OnDestroy } from '@angular/core';
import { constantesLocalStorage } from '@constantes';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription, forkJoin } from 'rxjs';
import { UtilitariosService } from '../../../services/utilitarios.service';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { TesoreriaService } from '../../tesoreria/service/tesoreriaServices';

@Component({
    selector: 'app-c-dashboard',
    templateUrl: './c-dashboard.component.html',
    styleUrls: ['./c-dashboard.component.scss'],
})

export class CDashboardComponent implements OnInit, OnDestroy {

    nomUsuario: string;
    nomPerfil: string;
    fechaHoy: Date = new Date();

    $listSubcription: Subscription[] = [];
    events: any;
    Cliente: any;
    Proveedor: any;
    event: any;
    dataCT: any;
    idperfil: number = 0;

    annio!: Date;
    lstQ: any[] = [];
    verbtn: number = 1;

    chartMonthlyData: any;
    chartMonthlyOptions: any;
    chartCategoryData: any;
    chartCategoryOptions: any;

    tipoCambio: number = 3.75;

    // KPI Ventas
    kpiVentasActual: number = 0;
    kpiVentasAnterior: number = 0;
    kpiVentasPct: number = 0;
    kpiVentasProgress: number = 0;

    // KPI Compras
    kpiComprasActual: number = 0;
    kpiComprasAnterior: number = 0;
    kpiComprasPct: number = 0;
    kpiComprasProgress: number = 0;

    // KPI CxC
    kpiCxCTotal: number = 0;
    kpiCxCPct: number = 0;
    kpiCxCProgress: number = 0;
    kpiCxCVencidoSol: number = 0;

    // KPI CxP
    kpiCxPTotal: number = 0;
    kpiCxPPct: number = 0;
    kpiCxPProgress: number = 0;
    kpiCxPVencidoSol: number = 0;

    // Módulo CxC
    modCxCSaldoSol: number = 0;
    modCxCSaldoDol: number = 0;
    modCxCActualSol: number = 0;
    modCxCActualDol: number = 0;
    modCxCVencidoSol: number = 0;
    modCxCVencidoDol: number = 0;

    // Módulo CxP
    modCxPSaldoSol: number = 0;
    modCxPSaldoDol: number = 0;
    modCxPActualSol: number = 0;
    modCxPActualDol: number = 0;
    modCxPVencidoSol: number = 0;
    modCxPVencidoDol: number = 0;

    // Módulo Ingresos/Egresos (Flujo Caja)
    modFCIngresosSol: number = 0;
    modFCEgresosSol: number = 0;
    modFCSaldoSol: number = 0;

    // Listas para documentos, categoría y alertas
    private lstVentasActual: any[] = [];
    private lstComprasActual: any[] = [];
    private lstCxPActual: any[] = [];

    // OC Dashboard (idperfil 7)
    mesSeleccionadoOC: Date = new Date();
    fecIniOC: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    private fecFinOC: Date = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    ocTotalCount: number = 0;
    ocTotalMonto: number = 0;
    ocAnteriorMonto: number = 0;
    ocMontoPct: number = 0;
    ocMontoProgress: number = 0;
    ocPendientesCount: number = 0;
    ocPendientesMonto: number = 0;
    ocAprobadasCount: number = 0;
    ocAprobadasMonto: number = 0;
    ocPendientePct: number = 0;
    ocAprobadaPct: number = 0;
    private lstOcActual: any[] = [];
    ultimasOC: any[] = [];
    ocPorEstado: any[] = [];
    topProveedores: any[] = [];
    chartOCEstadoData: any;
    chartOCEstadoOptions: any;
    ocServiciosCount: number = 0;
    ocOCCount: number = 0;
    ocServiciosMonto: number = 0;
    ocOCMonto: number = 0;
    ocAnuladasCount: number = 0;
    ocGeneradasCount: number = 0;
    private lstServiciosActual: any[] = [];
    private lstCombinedActual: any[] = [];
    chartServOCData: any;
    chartServOCOptions: any;

    categoriaVentas: any[] = [
        { label: 'Productos', color: '#42A5F5', pct: 35 },
        { label: 'Materiales', color: '#66BB6A', pct: 28 },
        { label: 'Servicios',  color: '#FFA726', pct: 22 },
        { label: 'Otros',      color: '#AB47BC', pct: 15 },
    ];

    ultimosDocumentos: any[] = [];

    alertas: any[] = [];

    constructor(private route: ActivatedRoute,
      protected router: Router,
        private messageService: MessageService,
        private utilitariosService: UtilitariosService,
        private proyectosService: ProyectosService,
        private tesoreriaService: TesoreriaService
        ) {

        console.log('constantesLocalStorage', constantesLocalStorage);

        this.nomUsuario = constantesLocalStorage.nombreUsuario;
        this.nomPerfil = '@' + constantesLocalStorage.nomperfil;
        this.idperfil = constantesLocalStorage.idperfil;
    }


  ngOnInit(): void {
    if (this.idperfil === 7) {
      this.ocChartInit();
      this.cargarDatosOC();
    } else {
      this.monthlyChartInit();
      this.categoryChartInit();
      this.cargarDatos();
    }
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  // ─── OC Dashboard (idperfil 7) ──────────────────────────────────────────────

  private cargarDatosOC() {
    const hoy = new Date();
    const $tc = this.proyectosService.gettipocambiodia({
      anio: hoy.getFullYear(), mes: hoy.getMonth() + 1, dia: hoy.getDate()
    }).subscribe({
      next: (rpta: any) => {
        const tc = parseFloat(rpta.valTipo);
        if (tc > 0) this.tipoCambio = tc;
      },
      error: () => {},
      complete: () => { this.cargarOCMes(); }
    });
    this.$listSubcription.push($tc);
  }

  aplicarFiltroOC() {
    if (!this.mesSeleccionadoOC) return;
    this.fecIniOC = new Date(this.mesSeleccionadoOC.getFullYear(), this.mesSeleccionadoOC.getMonth(), 1);
    this.fecFinOC = new Date(this.mesSeleccionadoOC.getFullYear(), this.mesSeleccionadoOC.getMonth() + 1, 0);
    this.cargarOCMes();
  }

  private cargarOCMes() {
    const mesAnt  = new Date(this.fecIniOC.getFullYear(), this.fecIniOC.getMonth() - 1, 1);
    const baseOC  = { idusuario: constantesLocalStorage.idusuario, idproveedor: 0, idmoneda: 0, idcliente: 0, idcentrocosto: 0, ind_estado_fel: 0, idtipodocprc: 8 };
    //const baseSrv = { ...baseOC, idtipodocprc: 8 };

    const $subs = forkJoin([
      this.proyectosService.ordenCompraList({ ...baseOC,  fecini: this.fecIniOC,             fecfin: this.fecFinOC }),
      //this.proyectosService.ordenCompraList({ ...baseSrv, fecini: this.fecIniOC,             fecfin: this.fecFinOC }),
      this.proyectosService.ordenCompraList({ ...baseOC,  fecini: this.primerDiaMes(mesAnt), fecfin: this.ultimoDiaMes(mesAnt) }),
      //this.proyectosService.ordenCompraList({ ...baseSrv, fecini: this.primerDiaMes(mesAnt), fecfin: this.ultimoDiaMes(mesAnt) }),
    ]).subscribe({
      next: ([ocAct, ocAnt]: any[]) => {
        this.lstOcActual        = (ocAct.ordenescompra  || []).map((i: any) => ({ ...i, _tipoDoc: 'O. Compra' }));
        //this.lstServiciosActual = (srvAct.ordenescompra || []).map((i: any) => ({ ...i, _tipoDoc: 'Servicio'  }));
        this.lstCombinedActual  = [...this.lstOcActual, ...this.lstServiciosActual];
        const lstAnt = [...(ocAnt.ordenescompra || [])];

        this.ocTotalCount    = this.lstCombinedActual.length;
        this.ocTotalMonto    = this.sumEnSoles(this.lstCombinedActual);
        this.ocAnteriorMonto = this.sumEnSoles(lstAnt);
        this.ocMontoPct      = this.calcularPct(this.ocTotalMonto, this.ocAnteriorMonto);
        this.ocMontoProgress = this.calcularProgress(this.ocTotalMonto, this.ocAnteriorMonto);

        this.ocOCCount        = this.lstOcActual.length;
        this.ocServiciosCount = this.lstServiciosActual.length;
        this.ocOCMonto        = this.sumEnSoles(this.lstOcActual);
        this.ocServiciosMonto = this.sumEnSoles(this.lstServiciosActual);

        const pendientes = this.lstCombinedActual.filter(i => (i.nomestado || '').toUpperCase().includes('PEN'));
        const aprobadas  = this.lstCombinedActual.filter(i => (i.nomestado || '').toUpperCase().includes('APR'));
        const anuladas   = this.lstCombinedActual.filter(i => (i.nomestado || '').toUpperCase().includes('ANU'));

        this.ocPendientesCount = pendientes.length;
        this.ocPendientesMonto = this.sumEnSoles(pendientes);
        this.ocAprobadasCount  = aprobadas.length;
        this.ocAprobadasMonto  = this.sumEnSoles(aprobadas);
        this.ocAnuladasCount   = anuladas.length;
        this.ocGeneradasCount  = this.lstCombinedActual.length;

        this.ocPendientePct = this.ocTotalCount > 0 ? Math.round((this.ocPendientesCount / this.ocTotalCount) * 100) : 0;
        this.ocAprobadaPct  = this.ocTotalCount > 0 ? Math.round((this.ocAprobadasCount  / this.ocTotalCount) * 100) : 0;

        this.actualizarTopProveedores();
        this.actualizarOcPorEstado();
        this.actualizarUltimasOC();
        this.actualizarChartServOC();
      },
      error: () => {}
    });
    this.$listSubcription.push($subs);
  }

  private actualizarTopProveedores() {
    const map: Record<string, number> = {};
    for (const oc of this.lstCombinedActual) {
      const prov  = oc.nomcomercial || oc.nomempresa || 'Desconocido';
      const monto = oc.idmoneda === 2 ? (oc.s_monto_total || 0) * this.tipoCambio : (oc.s_monto_total || 0);
      map[prov] = (map[prov] || 0) + monto;
    }
    this.topProveedores = Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nombre, monto]) => ({ nombre, monto }));
  }

  private actualizarOcPorEstado() {
    const map: Record<string, number> = {};
    for (const oc of this.lstCombinedActual) {
      const estado = oc.nomestado || 'Sin estado';
      map[estado] = (map[estado] || 0) + 1;
    }
    const colores = ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#FF7043'];
    this.ocPorEstado = Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([label, count], i) => ({ label, count, color: colores[i % colores.length] }));

    this.chartOCEstadoData = {
      labels: this.ocPorEstado.map(e => e.label),
      datasets: [{
        data: this.ocPorEstado.map(e => e.count),
        backgroundColor: this.ocPorEstado.map(e => e.color),
        hoverOffset: 6
      }]
    };
  }

  private actualizarUltimasOC() {
    this.ultimasOC = [...this.lstCombinedActual]
      .sort((a, b) => this.parseFecha(b.fecemision) - this.parseFecha(a.fecemision))
      .slice(0, 8)
      .map(oc => ({
        numero:    oc.nrofactura || oc.codigonroorden || '',
        proveedor: oc.nomcomercial || oc.nomempresa || '',
        monto:     oc.s_monto_total > 0 ? `${oc.simbmoneda || 'S/'} ${(oc.s_monto_total || 0)}` : '',
        estado:    oc.nomestado || '',
        severidad: this.getSeveridad(oc.nomestado),
        tipo:      oc._tipoDoc || 'O. Compra'
      }));
  }

  private actualizarChartServOC() {
    this.chartServOCData = {
      labels: ['Órd. de Compra', 'Servicios'],
      datasets: [
        {
          label: 'Cantidad',
          data: [this.ocOCCount, this.ocServiciosCount],
          backgroundColor: ['#42A5F5', '#66BB6A'],
          borderColor: ['#1E88E5', '#43A047'],
          borderWidth: 1,
          yAxisID: 'yCant'
        },
        {
          label: 'Monto (S/)',
          data: [this.ocOCMonto, this.ocServiciosMonto],
          backgroundColor: ['rgba(66,165,245,0.3)', 'rgba(102,187,106,0.3)'],
          borderColor: ['#1E88E5', '#43A047'],
          borderWidth: 1,
          yAxisID: 'yMonto'
        }
      ]
    };
  }

  private cargarDatos() {
    const hoy = new Date();

    // Flujo de caja: carga inmediata, no depende del TC
    this.cargarFlujoCaja(hoy.getFullYear());

    // TC del día → luego KPIs + módulos
    const $tc = this.proyectosService.gettipocambiodia({
      anio: hoy.getFullYear(), mes: hoy.getMonth() + 1, dia: hoy.getDate()
    }).subscribe({
      next: (rpta: any) => {
        const tc = parseFloat(rpta.valTipo);
        if (tc > 0) this.tipoCambio = tc;
      },
      error: () => {},
      complete: () => {
        this.cargarKpiVentasCompras();
        this.cargarModuloCxC();
        this.cargarModuloCxP();
      }
    });
    this.$listSubcription.push($tc);
  }

  // ─── Flujo de Caja ──────────────────────────────────────────────────────────

  private cargarFlujoCaja(anio: number) {
    const meses = ['enero','febrero','marzo','abril','mayo','junio',
                   'julio','agosto','xxxx','octubre','noviembre','diciembre'];
    const mesActual = meses[new Date().getMonth()];

    const $fc = this.tesoreriaService.listarFlujoCaja(anio).subscribe({
      next: (rpta: any) => {
        if (!Array.isArray(rpta)) return;

        const rowA = rpta.find((r: any) => r.tipo === 'A');
        const rowB = rpta.find((r: any) => r.tipo === 'B');

        const ingresos = meses.map(m => rowA ? (rowA[m] || 0) : 0);
        const egresos  = meses.map(m => rowB ? (rowB[m] || 0) : 0);

        this.modFCIngresosSol = rowA ? (rowA[mesActual] || 0) : 0;
        this.modFCEgresosSol  = rowB ? (rowB[mesActual] || 0) : 0;
        this.modFCSaldoSol    = this.modFCIngresosSol - this.modFCEgresosSol;

        this.actualizarChartFlujo(ingresos, egresos, anio);
      },
      error: () => {}
    });
    this.$listSubcription.push($fc);
  }

  private actualizarChartFlujo(ingresos: number[], egresos: number[], anio: number) {
    const { tealColor, orangeColor } = this.getColors();
    this.chartMonthlyData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
      datasets: [
        {
          label: 'Ingresos ' + anio,
          data: ingresos,
          borderColor: tealColor,
          backgroundColor: tealColor,
          borderWidth: 2,
          fill: true
        },
        {
          label: 'Egresos ' + anio,
          data: egresos,
          borderColor: orangeColor,
          backgroundColor: orangeColor,
          borderWidth: 2,
          fill: true
        }
      ]
    };
  }

  // ─── KPI Ventas + Compras (1 forkJoin con 4 llamadas) ───────────────────────

  private cargarKpiVentasCompras() {
    const hoy = new Date();
    const mesAnt = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const baseV = { idusuario: constantesLocalStorage.idusuario, idproveedor: 0, idmoneda: 0, idcliente: 0, idcentrocosto: 0, ind_estado_fel: 0, idtipodocprc: 6 };
    const baseC = { ...baseV, idtipodocprc: 7 };

    const $subs = forkJoin([
      this.proyectosService.ordenCompraList({ ...baseV, fecini: this.primerDiaMes(hoy),  fecfin: this.ultimoDiaMes(hoy) }),
      this.proyectosService.ordenCompraList({ ...baseV, fecini: this.primerDiaMes(mesAnt), fecfin: this.ultimoDiaMes(mesAnt) }),
      this.proyectosService.ordenCompraList({ ...baseC, fecini: this.primerDiaMes(hoy),  fecfin: this.ultimoDiaMes(hoy) }),
      this.proyectosService.ordenCompraList({ ...baseC, fecini: this.primerDiaMes(mesAnt), fecfin: this.ultimoDiaMes(mesAnt) }),
    ]).subscribe({
      next: ([vAct, vAnt, cAct, cAnt]: any[]) => {
        this.lstVentasActual  = vAct.ordenescompra || [];
        this.lstComprasActual = cAct.ordenescompra || [];
        const lstVAnt = vAnt.ordenescompra || [];
        const lstCAnt = cAnt.ordenescompra || [];

        this.kpiVentasActual   = this.sumEnSoles(this.lstVentasActual);
        this.kpiVentasAnterior = this.sumEnSoles(lstVAnt);
        this.kpiVentasPct      = this.calcularPct(this.kpiVentasActual, this.kpiVentasAnterior);
        this.kpiVentasProgress = this.calcularProgress(this.kpiVentasActual, this.kpiVentasAnterior);

        this.kpiComprasActual   = this.sumEnSoles(this.lstComprasActual);
        this.kpiComprasAnterior = this.sumEnSoles(lstCAnt);
        this.kpiComprasPct      = this.calcularPct(this.kpiComprasActual, this.kpiComprasAnterior);
        this.kpiComprasProgress = this.calcularProgress(this.kpiComprasActual, this.kpiComprasAnterior);

        this.actualizarDocumentosRecientes();
        this.actualizarCategoriaVentas();
        this.actualizarAlertas();
      },
      error: () => {}
    });
    this.$listSubcription.push($subs);
  }

  // ─── Módulo CxC ─────────────────────────────────────────────────────────────

  private cargarModuloCxC() {
    const hoy = new Date();
    const mesAnt = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const base = { idusuario: constantesLocalStorage.idusuario, idproveedor: 0, idmoneda: 0, idcliente: 0, estado: '000', idtipodocprc: 17 };

    const $subs = forkJoin([
      this.proyectosService.ordenCompraListCuentas({ ...base, fecini: this.primerDiaMes(hoy),   fecfin: this.ultimoDiaMes(hoy) }),
      this.proyectosService.ordenCompraListCuentas({ ...base, fecini: this.primerDiaMes(mesAnt), fecfin: this.ultimoDiaMes(mesAnt) }),
    ]).subscribe({
      next: ([act, ant]: any[]) => {
        const lst: any[] = act.ordenescompra || [];

        this.modCxCSaldoSol = lst.filter(i => i.idmoneda === 1).reduce((a, i) => a + i.saldo_documento, 0);
        this.modCxCSaldoDol = lst.filter(i => i.idmoneda === 2).reduce((a, i) => a + i.saldo_documento, 0);

        this.modCxCVencidoSol = lst.filter(i => i.idmoneda === 1 && this.esFechaVencida(i.fecvencimiento) && i.saldo_documento > 0).reduce((a, i) => a + i.saldo_documento, 0);
        this.modCxCVencidoDol = lst.filter(i => i.idmoneda === 2 && this.esFechaVencida(i.fecvencimiento) && i.saldo_documento > 0).reduce((a, i) => a + i.saldo_documento, 0);
        this.modCxCActualSol  = this.modCxCSaldoSol - this.modCxCVencidoSol;
        this.modCxCActualDol  = this.modCxCSaldoDol - this.modCxCVencidoDol;

        const totalAct = this.modCxCSaldoSol + this.modCxCSaldoDol * this.tipoCambio;
        const totalAnt = (ant.ordenescompra || []).reduce((a: number, i: any) => a + (i.idmoneda === 2 ? i.saldo_documento * this.tipoCambio : i.saldo_documento), 0);

        this.kpiCxCTotal      = totalAct;
        this.kpiCxCVencidoSol = this.modCxCVencidoSol + this.modCxCVencidoDol * this.tipoCambio;
        this.kpiCxCPct        = this.calcularPct(totalAct, totalAnt);
        this.kpiCxCProgress   = this.calcularProgress(totalAct, totalAnt);

        this.actualizarAlertas();
      },
      error: () => {}
    });
    this.$listSubcription.push($subs);
  }

  // ─── Módulo CxP ─────────────────────────────────────────────────────────────

  private cargarModuloCxP() {
    const hoy = new Date();
    const mesAnt = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const base = { idusuario: constantesLocalStorage.idusuario, idproveedor: 0, idmoneda: 0, idcliente: 0, estado: '000', idtipodocprc: 18 };

    const $subs = forkJoin([
      this.proyectosService.ordenCompraListCuentas({ ...base, fecini: this.primerDiaMes(hoy),   fecfin: this.ultimoDiaMes(hoy) }),
      this.proyectosService.ordenCompraListCuentas({ ...base, fecini: this.primerDiaMes(mesAnt), fecfin: this.ultimoDiaMes(mesAnt) }),
    ]).subscribe({
      next: ([act, ant]: any[]) => {
        this.lstCxPActual = act.ordenescompra || [];

        this.modCxPSaldoSol = this.lstCxPActual.filter(i => i.idmoneda === 1).reduce((a, i) => a + i.saldo_documento, 0);
        this.modCxPSaldoDol = this.lstCxPActual.filter(i => i.idmoneda === 2).reduce((a, i) => a + i.saldo_documento, 0);

        this.modCxPVencidoSol = this.lstCxPActual.filter(i => i.idmoneda === 1 && this.esFechaVencida(i.fecvencimiento) && i.saldo_documento > 0).reduce((a, i) => a + i.saldo_documento, 0);
        this.modCxPVencidoDol = this.lstCxPActual.filter(i => i.idmoneda === 2 && this.esFechaVencida(i.fecvencimiento) && i.saldo_documento > 0).reduce((a, i) => a + i.saldo_documento, 0);
        this.modCxPActualSol  = this.modCxPSaldoSol - this.modCxPVencidoSol;
        this.modCxPActualDol  = this.modCxPSaldoDol - this.modCxPVencidoDol;

        const totalAct = this.modCxPSaldoSol + this.modCxPSaldoDol * this.tipoCambio;
        const totalAnt = (ant.ordenescompra || []).reduce((a: number, i: any) => a + (i.idmoneda === 2 ? i.saldo_documento * this.tipoCambio : i.saldo_documento), 0);

        this.kpiCxPTotal      = totalAct;
        this.kpiCxPVencidoSol = this.modCxPVencidoSol + this.modCxPVencidoDol * this.tipoCambio;
        this.kpiCxPPct        = this.calcularPct(totalAct, totalAnt);
        this.kpiCxPProgress   = this.calcularProgress(totalAct, totalAnt);

        this.actualizarAlertas();
      },
      error: () => {}
    });
    this.$listSubcription.push($subs);
  }

  // ─── Documentos recientes ────────────────────────────────────────────────────

  private actualizarDocumentosRecientes() {
    const conTipo = (lst: any[], tipo: number) => lst.map(i => ({ ...i, _tipo: tipo }));
    const todos = [...conTipo(this.lstVentasActual, 6), ...conTipo(this.lstComprasActual, 7)]
      .sort((a, b) => this.parseFecha(b.fecemision) - this.parseFecha(a.fecemision))
      .slice(0, 6);

    this.ultimosDocumentos = todos.map(item => ({
      tipo:      this.labelTipoDoc(item._tipo, item.nrofactura),
      numero:    item.nrofactura || '',
      entidad:   item.nomcomercial || item.nomempresa || '',
      monto:     item.s_monto_total > 0 ? `${item.simbmoneda || 'S/'} ${(item.s_monto_total || 0).toFixed(2)}` : '',
      estado:    item.nomestado || '',
      severidad: this.getSeveridad(item.nomestado),
      bgClass:   item._tipo === 6 ? 'bg-blue-50' : 'bg-green-50',
      icon:      item._tipo === 6 ? 'pi pi-file-edit text-blue-500 text-sm' : 'pi pi-shopping-bag text-green-500 text-sm'
    }));
  }

  private labelTipoDoc(tipo: number, nro: string): string {
    if (tipo === 7) return 'O. Compra';
    const p = (nro || '').toUpperCase();
    if (p.startsWith('NC')) return 'N. Crédito';
    if (p.startsWith('ND')) return 'N. Débito';
    if (p.startsWith('B'))  return 'Boleta';
    return 'Factura';
  }

  // ─── Ventas por Categoría ────────────────────────────────────────────────────

  private actualizarCategoriaVentas() {
    const grupos: Record<string, number> = { Facturas: 0, Boletas: 0, 'N. Crédito': 0, Otros: 0 };
    for (const item of this.lstVentasActual) {
      const nro   = (item.nrofactura || '').toUpperCase();
      const monto = (item.idmoneda === 2 ? (item.s_monto_total || 0) * this.tipoCambio : (item.s_monto_total || 0));
      if      (nro.startsWith('NC') || nro.startsWith('ND')) grupos['N. Crédito'] += monto;
      else if (nro.startsWith('F'))                           grupos['Facturas']   += monto;
      else if (nro.startsWith('B'))                           grupos['Boletas']    += monto;
      else                                                     grupos['Otros']      += monto;
    }

    const total = Object.values(grupos).reduce((a, b) => a + b, 0);
    if (total === 0) return;

    const colores = ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC'];
    const entradas = Object.entries(grupos).filter(([, v]) => v > 0);
    this.categoriaVentas = entradas.map(([label, value], i) => ({
      label,
      color: colores[i % colores.length],
      pct: Math.round((value / total) * 100)
    }));

    this.chartCategoryData = {
      labels: this.categoriaVentas.map(c => c.label),
      datasets: [{ data: this.categoriaVentas.map(c => c.pct), backgroundColor: this.categoriaVentas.map(c => c.color), hoverOffset: 6 }]
    };
  }

  // ─── Alertas reales ──────────────────────────────────────────────────────────

  private actualizarAlertas() {
    const lista: any[] = [];

    if (this.kpiCxCVencidoSol > 0) {
      lista.push({
        titulo: 'CxC Vencidas',
        descripcion: `Facturas vencidas por S/ ${this.kpiCxCVencidoSol.toLocaleString('es-PE', { maximumFractionDigits: 0 })}`,
        icon: 'pi pi-exclamation-circle', iconClass: 'text-red-500', bgClass: 'bg-red-50'
      });
    }

    const pendientesCxP = this.lstCxPActual.filter(i =>
      i.saldo_documento > 0 && !this.esFechaVencida(i.fecvencimiento) && this.diasHastaVencimiento(i.fecvencimiento) <= 7
    );
    if (pendientesCxP.length > 0) {
      const montoProximo = pendientesCxP
        .reduce((a, i) => a + (i.idmoneda === 2 ? i.saldo_documento * this.tipoCambio : i.saldo_documento), 0);
      lista.push({
        titulo: 'Próx. Vencimiento',
        descripcion: `${pendientesCxP.length} pago(s) próximos a vencer — S/ ${montoProximo.toLocaleString('es-PE', { maximumFractionDigits: 0 })}`,
        icon: 'pi pi-calendar', iconClass: 'text-yellow-600', bgClass: 'bg-yellow-50'
      });
    }

    if (this.kpiCxPVencidoSol > 0) {
      lista.push({
        titulo: 'CxP Vencidas',
        descripcion: `Pagos vencidos por S/ ${this.kpiCxPVencidoSol.toLocaleString('es-PE', { maximumFractionDigits: 0 })}`,
        icon: 'pi pi-exclamation-triangle', iconClass: 'text-red-600', bgClass: 'bg-red-50'
      });
    }

    const ocPendientes = this.lstComprasActual.filter(i => (i.nomestado || '').toUpperCase().includes('PEND'));
    if (ocPendientes.length > 0) {
      lista.push({
        titulo: 'OC Pendiente',
        descripcion: `${ocPendientes.length} orden(es) de compra por aprobar`,
        icon: 'pi pi-shopping-cart', iconClass: 'text-blue-500', bgClass: 'bg-blue-50'
      });
    }

    if (lista.length === 0) {
      lista.push({
        titulo: 'Sin alertas',
        descripcion: 'No hay alertas pendientes en este momento',
        icon: 'pi pi-check-circle', iconClass: 'text-green-500', bgClass: 'bg-green-50'
      });
    }

    this.alertas = lista;
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private primerDiaMes(fecha: Date): Date {
    return new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  }

  private ultimoDiaMes(fecha: Date): Date {
    return new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
  }

  private sumEnSoles(lista: any[]): number {
    return lista.reduce((acc: number, item: any) => {
      const monto = item.s_monto_total || 0;
      return acc + (item.idmoneda === 2 ? monto * this.tipoCambio : monto);
    }, 0);
  }

  private calcularPct(actual: number, anterior: number): number {
    if (anterior <= 0) return 0;
    return Math.round(((actual - anterior) / anterior) * 1000) / 10;
  }

  private calcularProgress(actual: number, anterior: number): number {
    if (anterior <= 0) return actual > 0 ? 100 : 0;
    return Math.min(100, Math.round((actual / anterior) * 100));
  }

  private esFechaVencida(fechaStr: string): boolean {
    if (!fechaStr) return false;
    const p = fechaStr.split('/');
    if (p.length !== 3) return false;
    return new Date(+p[2], +p[1] - 1, +p[0]) < new Date();
  }

  private diasHastaVencimiento(fechaStr: string): number {
    if (!fechaStr) return 999;
    const p = fechaStr.split('/');
    if (p.length !== 3) return 999;
    const diff = new Date(+p[2], +p[1] - 1, +p[0]).getTime() - new Date().getTime();
    return Math.ceil(diff / 86400000);
  }

  private parseFecha(fechaStr: string): number {
    if (!fechaStr) return 0;
    const p = fechaStr.split('/');
    if (p.length !== 3) return 0;
    return new Date(+p[2], +p[1] - 1, +p[0]).getTime();
  }

  private getSeveridad(nomestado: string): string {
    if (!nomestado) return 'info';
    const s = nomestado.toUpperCase();
    if (s.includes('PAG') || s.includes('APRO') || s.includes('EMIT') || s.includes('ACEP') || s.includes('ENVI')) return 'success';
    if (s.includes('PEND') || s.includes('PROC') || s.includes('PARCI'))  return 'warning';
    if (s.includes('VENC') || s.includes('ANULA') || s.includes('ERROR')) return 'danger';
    return 'info';
  }

  // ─── Charts ──────────────────────────────────────────────────────────────────

  ocChartInit() {
    this.chartOCEstadoData = {
      labels: [],
      datasets: [{ data: [], backgroundColor: [], hoverOffset: 6 }]
    };
    this.chartOCEstadoOptions = {
      plugins: { legend: { display: false } },
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false,
    };
    this.chartServOCData = {
      labels: ['Órd. de Compra', 'Servicios'],
      datasets: [
        { label: 'Cantidad',    data: [0, 0], backgroundColor: ['#42A5F5', '#66BB6A'], borderColor: ['#1E88E5', '#43A047'], borderWidth: 1, yAxisID: 'yCant' },
        { label: 'Monto (S/)', data: [0, 0], backgroundColor: ['rgba(66,165,245,0.3)', 'rgba(102,187,106,0.3)'], borderColor: ['#1E88E5', '#43A047'], borderWidth: 1, yAxisID: 'yMonto' }
      ]
    };
    const textColor  = getComputedStyle(document.body).getPropertyValue('--text-color')     || 'rgba(0,0,0,0.87)';
    const gridColor  = getComputedStyle(document.body).getPropertyValue('--surface-border') || 'rgba(160,167,181,.3)';
    this.chartServOCOptions = {
      plugins: { legend: { display: true, labels: { color: textColor } } },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yCant:  { type: 'linear', position: 'left',  ticks: { color: textColor, stepSize: 1 }, grid: { color: gridColor }, title: { display: true, text: 'Cantidad', color: textColor } },
        yMonto: { type: 'linear', position: 'right', ticks: { color: textColor }, grid: { drawOnChartArea: false }, title: { display: true, text: 'Monto S/', color: textColor } },
        x: { ticks: { color: textColor }, grid: { color: gridColor } }
      }
    };
  }

  monthlyChartInit() {
    this.chartMonthlyData = this.getChartData();
    this.chartMonthlyOptions = this.getChartOptions();
  }

  categoryChartInit() {
    this.chartCategoryData = {
      labels: this.categoriaVentas.map(c => c.label),
      datasets: [{
        data: this.categoriaVentas.map(c => c.pct),
        backgroundColor: this.categoriaVentas.map(c => c.color),
        hoverOffset: 6
      }]
    };
    this.chartCategoryOptions = {
      plugins: { legend: { display: false } },
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false,
    };
  }

  getChartData() {
    const { tealColor, orangeColor } = this.getColors();
    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
      datasets: [
        { label: 'Ingresos', data: new Array(12).fill(0), borderColor: tealColor,   backgroundColor: tealColor,   borderWidth: 2, fill: true },
        { label: 'Egresos',  data: new Array(12).fill(0), borderColor: orangeColor, backgroundColor: orangeColor, borderWidth: 2, fill: true }
      ]
    };
  }

  getChartOptions() {
    const textColor     = getComputedStyle(document.body).getPropertyValue('--text-color')     || 'rgba(0,0,0,0.87)';
    const gridLinesColor = getComputedStyle(document.body).getPropertyValue('--surface-border') || 'rgba(160,167,181,.3)';
    const fontFamily    = getComputedStyle(document.body).getPropertyValue('--font-family');
    return {
      plugins: {
        legend: { display: true, labels: { fontFamily, color: textColor } },
      },
      animation: { animateScale: true, animateRotate: true },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { ticks: { fontFamily, color: textColor }, grid: { color: gridLinesColor } },
        x: { categoryPercentage: .9, barPercentage: .8, ticks: { fontFamily, color: textColor }, grid: { color: gridLinesColor } }
      },
    };
  }

  getColors() {
    const isLight = true;
    return {
      pinkColor:        isLight ? '#EC407A' : '#F48FB1',
      purpleColor:      isLight ? '#AB47BC' : '#CE93D8',
      deeppurpleColor:  isLight ? '#7E57C2' : '#B39DDB',
      indigoColor:      isLight ? '#5C6BC0' : '#9FA8DA',
      blueColor:        isLight ? '#42A5F5' : '#90CAF9',
      lightblueColor:   isLight ? '#29B6F6' : '#81D4FA',
      cyanColor:        isLight ? '#00ACC1' : '#4DD0E1',
      tealColor:        isLight ? '#26A69A' : '#80CBC4',
      greenColor:       isLight ? '#66BB6A' : '#A5D6A7',
      lightgreenColor:  isLight ? '#9CCC65' : '#C5E1A5',
      limeColor:        isLight ? '#D4E157' : '#E6EE9C',
      yellowColor:      isLight ? '#FFEE58' : '#FFF59D',
      amberColor:       isLight ? '#FFCA28' : '#FFE082',
      orangeColor:      isLight ? '#FFA726' : '#FFCC80',
      deeporangeColor:  isLight ? '#FF7043' : '#FFAB91',
      brownColor:       isLight ? '#8D6E63' : '#BCAAA4'
    };
  }

  // ─── Navegación ──────────────────────────────────────────────────────────────

  goCuentaCobrar() { this.router.navigate(['/pages/tesoreria/cuentaporcobrar']); }
  goCuentaPagar()  { this.router.navigate(['/pages/tesoreria/cuentaporpagar']); }
  goCajaChica()    { this.router.navigate(['/pages/tesoreria/cajachica']); }
  goFlujoCaja()    { this.router.navigate(['/pages/tesoreria/flujocaja']); }
}
