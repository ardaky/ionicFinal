import { FirebaseService } from './services/firebase.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public fbservisi: FirebaseService,
    public router: Router
  ) {}

  uye = this.fbservisi.AktifUyeBilgi;

  OturumKapat() {
    this.fbservisi.OturumKapat().subscribe(() => {
      this.router.navigate(['login']);
    });
  }







}
