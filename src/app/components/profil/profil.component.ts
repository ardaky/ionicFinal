import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { HotToastService } from '@ngneat/hot-toast';
import { concatMap } from 'rxjs';
import { Gonderiler } from 'src/app/models/gonderiler';
import { Users } from 'src/app/models/users';
import { FirebaseService } from 'src/app/services/firebase.service';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  uye = this.fbservisi.AktifUyeBilgi;
  gonderiler!: Gonderiler[];
  kullanicilar!: Users[];
  secKullanici!:Users;
  
  kullaniciDuzenleme: FormGroup = new FormGroup({
    displayName: new FormControl(),
    email: new FormControl()
  });


  constructor(
    public fbservisi:FirebaseService,
    public toastim:HotToastService,
    public modalcik:ModalController
  ) { }

  ngOnInit() {
    this.tumKullanicilariListele();
    this.gonderiListele();
  }

  gonderiListele() {
    this.fbservisi.gonderiListele().subscribe(d => {
      this.gonderiler = d;
    });
  }

  tumKullanicilariListele() {
    this.fbservisi.kullaniciListele().subscribe(d => {
      this.kullanicilar = d;
    });
  }

  kullaniciDuzenle() {
    this.secKullanici.displayName = this.kullaniciDuzenleme.value.displayName;
    this.secKullanici.email = this.kullaniciDuzenleme.value.email;
    this.fbservisi
      .kullaniciDuzenle(this.secKullanici)
      .pipe(
        this.toastim.observe({
          loading: 'Güncelleniyor',
          success: 'Güncellendi',
          error: 'Hata Oluştu',
        })
      )
      .subscribe();
  }
  duzenleModalAyarla(kullanici:Users){
    this.kullaniciDuzenleme.reset();
    this.kullaniciDuzenleme.patchValue(kullanici);
    this.secKullanici = kullanici;
  }

  ResimYukle(event: any, user: Users) {
    this.fbservisi
      .uploadImage(event.target.files[0], `images/profile/${user.uid}`)
      .pipe(
        this.toastim.observe({
          loading: 'Fotoğraf Yükleniyor...',
          success: 'Fotoğraf yüklendi',
          error: 'Hata oluştu',
        }),
        concatMap((foto) =>
          this.fbservisi.kullaniciDuzenle({ uid: user.uid, foto })
        )
      )
      .subscribe();
  }
}
