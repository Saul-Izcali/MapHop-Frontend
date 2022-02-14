import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from "./components/inicio/inicio.component";
import { RegistroComunComponent } from "./components/registro-comun/registro-comun.component";
import { RegistroEspecialComponent } from "./components/registro-especial/registro-especial.component";
import { RegistroResponsableComponent } from "./components/registro-responsable/registro-responsable.component";
import { MapaReportesComponent } from "./components/mapa-reportes/mapa-reportes.component";
import { MapaSolucionadosComponent } from "./components/mapa-solucionados/mapa-solucionados.component";
import { RutaAutomaticaComponent } from "./components/ruta-automatica/ruta-automatica.component";
import { TablaComunesComponent } from "./components/tabla-usuarios/tabla-comunes/tabla-comunes.component";
import { TablaEspecialesComponent } from "./components/tabla-usuarios/tabla-especiales/tabla-especiales.component";
import { TablaResponsablesComponent } from "./components/tabla-usuarios/tabla-responsables/tabla-responsables.component";
import { InformacionComponent } from "./components/informacion/informacion/informacion.component";
import { ConoceMasComponent } from "./components/informacion/conoce-mas/conoce-mas.component";
import { TablaDesatendidosComponent } from './components/tabla-reportes/tabla-desatendidos/tabla-desatendidos.component';
import { TablaEnProcesoComponent } from './components/tabla-reportes/tabla-en-proceso/tabla-en-proceso.component';
import { TablaSolucionadosComponent } from './components/tabla-reportes/tabla-solucionados/tabla-solucionados.component';
import { BaseGraficasComponent } from './components/analisis-datos/base-graficas/base-graficas.component';
import { Grafica1Component } from './components/analisis-datos/grafica1/grafica1.component';
// import { TablaSolucionadosComponent } from './components/tabla-reportes/tabla-solucionados/tabla-solucionados.component';
// import { TablaSolucionadosComponent } from './components/tabla-reportes/tabla-solucionados/tabla-solucionados.component';
import { PerfilComponent } from "./components/perfil/perfil.component";


import { AutenticacionGuard } from './services/guard/autenticacion.guard';
import { InvitadoGuard } from "./services/guard/guard-usuario-invitado/invitado.guard";
import { AdminGuard } from './services/guard/guard-usuario-admin/admin.guard';
import { ComunGuard } from './services/guard/guard-usuario-comun/comun.guard';
import { EspecialGuard } from './services/guard/guard-usuario-especial/especial.guard';
import { ResponsableGuard } from './services/guard/guard-usuario-responsable/responsable.guard';


const routes: Routes = [
  {path: '', component: InicioComponent, canActivate: [InvitadoGuard]},
  {path: 'registro', component: RegistroComunComponent, canActivate: [InvitadoGuard]},
  {path: 'registro-especial', component: RegistroEspecialComponent},
  {path: 'registro-responsable', component: RegistroResponsableComponent, canActivate: [AutenticacionGuard, AdminGuard]},
  {path: 'usuarios', component: TablaComunesComponent, canActivate: [AutenticacionGuard, AdminGuard]},
  {path: 'usuarios-comunes', component: TablaComunesComponent, canActivate: [AutenticacionGuard, AdminGuard]},
  {path: 'usuarios-especiales', component: TablaEspecialesComponent, canActivate: [AutenticacionGuard, AdminGuard]},
  {path: 'usuarios-responsables', component: TablaResponsablesComponent, canActivate: [AutenticacionGuard, AdminGuard]},
  {path: 'mapa-reportes', component: MapaReportesComponent},
  {path: 'mapa-solucionados', component: MapaSolucionadosComponent},
  {path: 'ruta-automatica', component: RutaAutomaticaComponent, canActivate: [AutenticacionGuard, ResponsableGuard]},
  {path: 'reportes', component: TablaDesatendidosComponent, canActivate: [AutenticacionGuard, ResponsableGuard]},
  {path: 'reportes-desatendidos', component: TablaDesatendidosComponent, canActivate: [AutenticacionGuard, ResponsableGuard]},
  {path: 'reportes-en-proceso', component: TablaEnProcesoComponent, canActivate: [AutenticacionGuard, ResponsableGuard]},
  {path: 'reportes-solucionados', component: TablaSolucionadosComponent, canActivate: [AutenticacionGuard, ResponsableGuard]},
  {path: 'informacion', component: InformacionComponent},
  {path: 'informacion/conoce-mas', component: ConoceMasComponent},
  {path: 'perfil', component: PerfilComponent, canActivate: [ComunGuard]},
  {path: 'graficas', component: BaseGraficasComponent, canActivate: [AutenticacionGuard, ResponsableGuard]},
  {path: 'grafica-uno', component: Grafica1Component},
  {path: '**', component: InicioComponent, canActivate: [InvitadoGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }