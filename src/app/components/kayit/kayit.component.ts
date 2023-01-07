import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { switchMap } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-kayit',
  templateUrl: './kayit.component.html',
  styleUrls: ['./kayit.component.scss'],
})
export class KayitComponent implements OnInit {

  constructor(
    public fbservisi: FirebaseService,
    public toastim:HotToastService,
    public router: Router
  ) { }

  ngOnInit() {}
  kayitOl(adsoyad: any, email: any, parola: any) {
    var tarih = new Date();
    this.fbservisi.
      KayitOl(email, parola)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.fbservisi.kullaniciEkle({ 
            uid,
            email: email,
            displayName: adsoyad,
            rol: "2",
            kayTarih: tarih.getTime().toString()

          })
        ),
        this.toastim.observe({
          success: 'Tebrikler Kayıt Yapıldı',
          loading: 'Kayıt Yapılıyor...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }
}
