import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    { path: '', redirectTo: '/auth', pathMatch:'full' },
    { path: 'auth', data: { breadcrumb: 'auth' }, loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
    { path: 'pages', data: { breadcrumb: 'Opciones' }, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
