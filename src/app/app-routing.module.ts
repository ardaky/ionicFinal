import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { KayitComponent } from './components/kayit/kayit.component';
import { KullanicilarComponent } from './components/kullanicilar/kullanicilar.component';
import { LoginComponent } from './components/login/login.component';
import { ProfilComponent } from './components/profil/profil.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'profil',component:ProfilComponent},
  {path:'login',component:LoginComponent},
  {path:'kayit',component:KayitComponent},
  {path:'kullanicilar',component:KullanicilarComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
