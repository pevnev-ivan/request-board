import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from "./pages/main-page/main-page.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'groups/:id', component: MainPageComponent, canActivate: [AuthGuard] },
  { path: 'groups', component: MainPageComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
