import { FirebaseService } from './../../services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    public fbservisi: FirebaseService,
    public toastim:HotToastService,
    public router: Router
  ) { }

  ngOnInit() {}


  girisYap(mail:any,parola:any){
    console.log(mail,parola)
    this.fbservisi.OturumAc(mail, parola)
      .pipe(
        this.toastim.observe({
          success: 'Oturum Açıldı',
          loading: 'Oturum Açılıyor...',
          error: ({ message }) => `${message}`
        })
      )
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }

 
}
