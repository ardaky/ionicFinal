import { Gonderiler } from 'src/app/models/gonderiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { HotToastService } from '@ngneat/hot-toast';
import { Users } from 'src/app/models/users';
import { FirebaseService } from 'src/app/services/firebase.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-kullanicilar',
  templateUrl: './kullanicilar.component.html',
  styleUrls: ['./kullanicilar.component.scss'],
})
export class KullanicilarComponent implements OnInit {
  uye = this.fbservisi.AktifUyeBilgi;
  constructor(
    public fbservisi:FirebaseService,
    public toastim:HotToastService,
    public modalcik:ModalController
  ) { }
  kullanicilar!: Users[];
  secKullanici!:Users;
  gonderiler!:Gonderiler[];
  
  kullaniciDuzenleme: FormGroup = new FormGroup({
    displayName: new FormControl(),
    email: new FormControl(),
    rol: new FormControl()
  });
  
  kullaniciEkleme: FormGroup = new FormGroup({
    displayName: new FormControl(),
    email: new FormControl(),
    rol: new FormControl(),
    parola: new FormControl()
  });

  ngOnInit() {
    this.tumKullanicilariListele();
    this.gonderiListele();
  }
  tumKullanicilariListele() {
    this.fbservisi.kullaniciListele().subscribe(d => {
      this.kullanicilar = d;
    });
  }

  gonderiListele() {
    this.fbservisi.gonderiListele().subscribe(d => {
      this.gonderiler = d;
    });
  }

  duzenleModalAyarla(kullanici:Users){
    this.kullaniciDuzenleme.reset();
    this.kullaniciDuzenleme.patchValue(kullanici);
    this.secKullanici = kullanici;
  }


  kullaniciDuzenle() {
    if(this.secKullanici.uid == 'RlZhNoGicrhKVXpxscLYNXl1yca2' && this.kullaniciDuzenleme.value.rol == '2'){
      this.toastim.error("Bu kullanıcının yetkileri alınamaz !")
    } else{
      this.secKullanici.displayName = this.kullaniciDuzenleme.value.displayName;
      this.secKullanici.email = this.kullaniciDuzenleme.value.email;
      this.secKullanici.rol = this.kullaniciDuzenleme.value.rol;
     
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
    
    this.modalcik.dismiss();
  }

  kullaniciSil(kullanici:Users){
    this.secKullanici = kullanici;
  }

  // kullanıcı ve ona ait olan tüm gönderiler silinir 
  kullaniciSilKaydet(){
    if(this.secKullanici.uid == "RlZhNoGicrhKVXpxscLYNXl1yca2"){
      this.toastim.error("Bu kullanıcı silinemez !");
    } else{
      this.gonderiler.forEach(gonderi => {
        if(gonderi.uid == this.secKullanici.uid){
          this.fbservisi.gonderiSil(gonderi);
        }
      })
      setTimeout(() => {
        this.fbservisi.kullaniciSil(this.secKullanici).then(() => {
          this.toastim.success("Kullanıcı Silindi.")
        })
      }, 1200);
     
    }
  }


  kullaniciEkle() {
    var tarih = new Date();
    this.fbservisi.
      KayitOl(this.kullaniciEkleme.value.email, this.kullaniciEkleme.value.parola)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.fbservisi.kullaniciEkle({ 
            uid,
            email:this.kullaniciEkleme.value.email,
            displayName: this.kullaniciEkleme.value.displayName,
            rol: this.kullaniciEkleme.value.rol,
            kayTarih: tarih.getTime().toString()

          })
        ),
        this.toastim.observe({
          success: 'Tebrikler Kayıt Yapıldı',
          loading: 'Kullanıcı Kaydı Yapılıyor...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {});
      this.modalcik.dismiss();
  }



}
