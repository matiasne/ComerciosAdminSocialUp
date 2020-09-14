import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'recuperar-contrasena',
    loadChildren: () => import('./recuperar-contrasena/recuperar-contrasena.module').then( m => m.RecuperarContrasenaPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'form-cliente',
    loadChildren: () => import('./form-cliente/form-cliente.module').then( m => m.FormClientePageModule)
  },
  {
    path: 'form-servicio',
    loadChildren: () => import('./form-servicio/form-servicio.module').then( m => m.FormServicioPageModule)
  },
  {
    path: 'form-plan',
    loadChildren: () => import('./form-plan/form-plan.module').then( m => m.FormPlanPageModule)
  },
  {
    path: 'form-categoria',
    loadChildren: () => import('./form-categoria/form-categoria.module').then( m => m.FormCategoriaPageModule)
  },
  {
    path: 'form-subscripcion',
    loadChildren: () => import('./form-subscripcion/form-subscripcion.module').then( m => m.FormSubscripcionPageModule)
  },
  {
    path: 'list-servicios',
    loadChildren: () => import('./list-servicios/list-servicios.module').then( m => m.ListServiciosPageModule)
  },
  {
    path: 'list-clientes',
    loadChildren: () => import('./list-clientes/list-clientes.module').then( m => m.ListClientesPageModule)
  },
  {
    path: 'list-subscripciones',
    loadChildren: () => import('./list-subscripciones/list-subscripciones.module').then( m => m.ListSubscripcionesPageModule)
  },
  {
    path: 'details-cliente',
    loadChildren: () => import('./details-cliente/details-cliente.module').then( m => m.DetailsClientePageModule)
  },
  {
    path: 'details-servicio',
    loadChildren: () => import('./details-servicio/details-servicio.module').then( m => m.DetailsServicioPageModule)
  },
  {
    path: 'details-subscripcion',
    loadChildren: () => import('./details-subscripcion/details-subscripcion.module').then( m => m.DetailsSubscripcionPageModule)
  },
  {
    path: 'form-comercio',
    loadChildren: () => import('./form-comercio/form-comercio.module').then( m => m.FormComercioPageModule)
  },
  {
    path: 'details-comercio',
    loadChildren: () => import('./details-comercio/details-comercio.module').then( m => m.DetailsComercioPageModule)
  },
  {
    path: 'list-comercios',
    loadChildren: () => import('./list-comercios/list-comercios.module').then( m => m.ListComerciosPageModule)
  },
  {
    path: 'invitar-usuario',
    loadChildren: () => import('./invitar-usuario/invitar-usuario.module').then( m => m.InvitarUsuarioPageModule)
  },
  {
    path: 'mensajes',
    loadChildren: () => import('./mensajes/mensajes.module').then( m => m.MensajesPageModule)
  },
  {
    path: 'list-invitaciones',
    loadChildren: () => import('./list-invitaciones/list-invitaciones.module').then( m => m.ListInvitacionesPageModule)
  },
  {
    path: 'form-invitacion',
    loadChildren: () => import('./form-invitacion/form-invitacion.module').then( m => m.FormInvitacionPageModule)
  },
  {
    path: 'dashboard-comercio',
    loadChildren: () => import('./dashboard-comercio/dashboard-comercio.module').then( m => m.DashboardComercioPageModule)
  },
  {
    path: 'dashboard-subscripciones',
    loadChildren: () => import('./dashboard-subscripciones/dashboard-subscripciones.module').then( m => m.DashboardSubscripcionesPageModule)
  },
  {
    path: 'dashboard-ventas',
    loadChildren: () => import('./dashboard-ventas/dashboard-ventas.module').then( m => m.DashboardVentasPageModule)
  },
  {
    path: 'dashboard-clientes',
    loadChildren: () => import('./dashboard-clientes/dashboard-clientes.module').then( m => m.DashboardClientesPageModule)
  },
  {
    path: 'dashboard-productos',
    loadChildren: () => import('./dashboard-productos/dashboard-productos.module').then( m => m.DashboardProductosPageModule)
  },
  {
    path: 'dashboard-servicios',
    loadChildren: () => import('./dashboard-servicios/dashboard-servicios.module').then( m => m.DashboardServiciosPageModule)
  },
  {
    path: 'form-producto',
    loadChildren: () => import('./form-producto/form-producto.module').then( m => m.FormProductoPageModule)
  },
  {
    path: 'details-producto',
    loadChildren: () => import('./details-producto/details-producto.module').then( m => m.DetailsProductoPageModule)
  },
  {
    path: 'list-venta',
    loadChildren: () => import('./list-venta/list-venta.module').then( m => m.ListVentaPageModule)
  },
  {
    path: 'details-venta',
    loadChildren: () => import('./details-venta/details-venta.module').then( m => m.DetailsVentaPageModule)
  },
  {
    path: 'form-venta',
    loadChildren: () => import('./form-venta/form-venta.module').then( m => m.FormVentaPageModule)
  },
  {
    path: 'add-producto-venta',
    loadChildren: () => import('./add-producto-venta/add-producto-venta.module').then( m => m.AddProductoVentaPageModule)
  },
  {
    path: 'add-servicio-subscripcion',
    loadChildren: () => import('./add-servicio-subscripcion/add-servicio-subscripcion.module').then( m => m.AddServicioSubscripcionPageModule)
  },
  {
    path: 'list-productos-servicios',
    loadChildren: () => import('./list-productos-servicios/list-productos-servicios.module').then( m => m.ListProductosServiciosPageModule)
  },
  
  {
    path: 'details-carrito',
    loadChildren: () => import('./details-carrito/details-carrito.module').then( m => m.DetailsCarritoPageModule)
  },
  {
    path: 'form-caja',
    loadChildren: () => import('./form-caja/form-caja.module').then( m => m.FormCajaPageModule)
  },
  {
    path: 'list-cajas',
    loadChildren: () => import('./list-cajas/list-cajas.module').then( m => m.ListCajasPageModule)
  },
  {
    path: 'dashboard-comandas',
    loadChildren: () => import('./dashboard-comandas/dashboard-comandas.module').then( m => m.DashboardComandasPageModule)
  },
  {
    path: 'list-comandas',
    loadChildren: () => import('./list-comandas/list-comandas.module').then( m => m.ListComandasPageModule)
  },
  {
    path: 'form-direccion',
    loadChildren: () => import('./form-direccion/form-direccion.module').then( m => m.FormDireccionPageModule)
  },
  {
    path: 'dashboard-cajas',
    loadChildren: () => import('./dashboard-cajas/dashboard-cajas.module').then( m => m.DashboardCajasPageModule)
  },
  {
    path: 'form-egreso-caja',
    loadChildren: () => import('./form-egreso-caja/form-egreso-caja.module').then( m => m.FormEgresoCajaPageModule)
  },
  {
    path: 'form-cierre-caja',
    loadChildren: () => import('./form-cierre-caja/form-cierre-caja.module').then( m => m.FormCierreCajaPageModule)
  },
  {
    path: 'form-horario',
    loadChildren: () => import('./form-horario/form-horario.module').then( m => m.FormHorarioPageModule)
  },
  {
    path: 'list-cta-corrientes',
    loadChildren: () => import('./list-cta-corrientes/list-cta-corrientes.module').then( m => m.ListCtaCorrientesPageModule)
  },
  {
    path: 'form-cta-corriente',
    loadChildren: () => import('./form-cta-corriente/form-cta-corriente.module').then( m => m.FormCtaCorrientePageModule)
  },
  {
    path: 'form-ingreso-cta-corriente',
    loadChildren: () => import('./form-ingreso-cta-corriente/form-ingreso-cta-corriente.module').then( m => m.FormIngresoCtaCorrientePageModule)
  },
  {
    path: 'details-cta-corriente',
    loadChildren: () => import('./details-cta-corriente/details-cta-corriente.module').then( m => m.DetailsCtaCorrientePageModule)
  },
  {
    path: 'list-comercios-owner',
    loadChildren: () => import('./list-comercios-owner/list-comercios-owner.module').then( m => m.ListComerciosOwnerPageModule)
  },
  {
    path: 'form-deposito-cta-corriente',
    loadChildren: () => import('./form-deposito-cta-corriente/form-deposito-cta-corriente.module').then( m => m.FormDepositoCtaCorrientePageModule)
  },
  {
    path: 'form-extraccion-cta-corriente',
    loadChildren: () => import('./form-extraccion-cta-corriente/form-extraccion-cta-corriente.module').then( m => m.FormExtraccionCtaCorrientePageModule)
  },
  {
    path: 'form-ingreso-caja',
    loadChildren: () => import('./form-ingreso-caja/form-ingreso-caja.module').then( m => m.FormIngresoCajaPageModule)
  },
  {
    path: 'form-producto-opcion',
    loadChildren: () => import('./form-producto-opcion/form-producto-opcion.module').then( m => m.FormProductoOpcionPageModule)
  },
  {
    path: 'form-producto-grupo-opciones',
    loadChildren: () => import('./form-producto-grupo-opciones/form-producto-grupo-opciones.module').then( m => m.FormProductoGrupoOpcionesPageModule)
  },
  {
    path: 'form-mesa',
    loadChildren: () => import('./form-mesa/form-mesa.module').then( m => m.FormMesaPageModule)
  },
  {
    path: 'list-empleados',
    loadChildren: () => import('./list-empleados/list-empleados.module').then( m => m.ListEmpleadosPageModule)
  },
  {
    path: 'list-mesas',
    loadChildren: () => import('./list-mesas/list-mesas.module').then( m => m.ListMesasPageModule)
  },
  {
    path: 'form-comercio-configuracion',
    loadChildren: () => import('./form-comercio-configuracion/form-comercio-configuracion.module').then( m => m.FormComercioConfiguracionPageModule)
  },
  {
    path: 'list-horarios',
    loadChildren: () => import('./list-horarios/list-horarios.module').then( m => m.ListHorariosPageModule)
  },
  {
    path: 'select-empleado',
    loadChildren: () => import('./select-empleado/select-empleado.module').then( m => m.SelectEmpleadoPageModule)
  },
  {
    path: 'select-cliente',
    loadChildren: () => import('./select-cliente/select-cliente.module').then( m => m.SelectClientePageModule)
  },
  {
    path: 'form-comanda-configuracion',
    loadChildren: () => import('./form-comanda-configuracion/form-comanda-configuracion.module').then( m => m.FormComandaConfiguracionPageModule)
  },
  {
    path: 'form-pedidos-configuracion',
    loadChildren: () => import('./form-pedidos-configuracion/form-pedidos-configuracion.module').then( m => m.FormPedidosConfiguracionPageModule)
  },
  {
    path: 'list-categorias',
    loadChildren: () => import('./list-categorias/list-categorias.module').then( m => m.ListCategoriasPageModule)
  },
  {
    path: 'recortar-imagen',
    loadChildren: () => import('./recortar-imagen/recortar-imagen.module').then( m => m.RecortarImagenPageModule)
  },
  {
    path: 'list-notificaciones',
    loadChildren: () => import('./list-notificaciones/list-notificaciones.module').then( m => m.ListNotificacionesPageModule)
  },
  {
    path: 'form-add-profesional',
    loadChildren: () => import('./form-add-profesional/form-add-profesional.module').then( m => m.FormAddProfesionalPageModule)
  },
  {
    path: 'details-whatsapp',
    loadChildren: () => import('./details-whatsapp/details-whatsapp.module').then( m => m.DetailsWhatsappPageModule)
  },
  {
    path: 'servicio-calendario',
    loadChildren: () => import('./servicio-calendario/servicio-calendario.module').then( m => m.ServicioCalendarioPageModule)
  },
  {
    path: 'form-reserva',
    loadChildren: () => import('./form-reserva/form-reserva.module').then( m => m.FormReservaPageModule)
  },
  {
    path: 'form-calendario',
    loadChildren: () => import('./form-calendario/form-calendario.module').then( m => m.FormCalendarioPageModule)
  },
  {
    path: 'list-calendarios',
    loadChildren: () => import('./list-calendarios/list-calendarios.module').then( m => m.ListCalendariosPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
