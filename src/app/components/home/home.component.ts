import { HotToastService } from '@ngneat/hot-toast';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Gonderiler } from 'src/app/models/gonderiler';
import { FormControl, FormGroup } from '@angular/forms';
import { Users } from 'src/app/models/users';
import { ModalController } from '@ionic/angular';
import { type } from 'os';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(
    public fbservisi:FirebaseService,
    public toastim:HotToastService,
    public modalcik:ModalController
  ) { }
  
  uye = this.fbservisi.AktifUyeBilgi;
  gonderiEkleme: FormGroup = new FormGroup({
    gonderi: new FormControl(),
    gonderiTarihi: new FormControl(),
    duzenlemeTarihi: new FormControl()
  });
  gonderiDuzenleme: FormGroup = new FormGroup({
    gonderi: new FormControl(),
    duzenlemeTarihi: new FormControl()
  });
  presentingElement1 = null;
  presentingElement2 = null;
  gonderiler!: Gonderiler[];
  secGonderi!:Gonderiler;
  kullanicilar!: Users[];
  filtreliKullanici!:Users[];
  secKullanici!:Users;

  ngOnInit() {
    this.tumKullanicilariListele();
    this.gonderiListele();
  }
  
  Kaydet() {
    console.log("GİRDİ");
    var tarih = new Date();
    this.gonderiEkleme.value.gonderiTarihi = tarih.getTime().toString();
    this.gonderiEkleme.value.duzenlemeTarihi = tarih.getTime().toString();
    this.fbservisi.gonderiEkle(this.gonderiEkleme.value)
      .pipe(
        this.toastim.observe({
          success: 'Gönderi Başarıyla Eklendi',
          loading: 'Gönderi Ekleniyor...',
          error: ({ message }) => `${message}`
        })
      )
      .subscribe();
      this.modalcik.dismiss(); 
      
  }

  gonderiListele() {

    this.fbservisi.gonderiListele().subscribe(d => {
      this.gonderiler = d;
    });
  }

  gonderiSil(gonderi:Gonderiler){
    this.secGonderi = gonderi;
  }

  gonderiSilKaydet(){
    console.log("girdi");
    this.fbservisi.gonderiSil(this.secGonderi);
    this.toastim.success("Gönderi Silindi");
    this.modalcik.dismiss();
  }
  gonderiDuzenle(gonderi:Gonderiler){
    this.secGonderi = gonderi;
    this.gonderiDuzenleme.patchValue(gonderi);
  }

  gonderiDuzenleKaydet(){
    console.log("GİRDİ")
    var tarih = new Date();
    this.gonderiDuzenleme.value.duzenlemeTarihi = tarih.getTime().toString();
    this.secGonderi.duzenlemeTarihi = this.gonderiDuzenleme.value.duzenlemeTarihi;
    this.secGonderi.gonderi = this.gonderiDuzenleme.value.gonderi;
    console.log("SEÇİLİ GÖNDERİ",this.secGonderi)
    this.fbservisi.gonderiDuzenle(this.secGonderi).subscribe(d=> {
      this.toastim.success("Gönderi Düzenlendi");
    })
  }

  kullaniciGonderiById(gonderi:Gonderiler){
    this.filtreliKullanici= this.kullanicilar.filter(s=> s.uid ==  gonderi.uid );
    this.secKullanici = this.filtreliKullanici[0];

  }

  tumKullanicilariListele() {
    this.fbservisi.kullaniciListele().subscribe(d => {
      this.kullanicilar = d;
    });

  }



}