import { Injectable } from '@angular/core';

import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  user,
  User,
  UserInfo,
} from '@angular/fire/auth';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { concatMap, from, map, Observable, of, switchMap, take } from 'rxjs';
import { Users } from '../models/users';
import { Gonderiler } from '../models/gonderiler';
import { updateEmail } from '@firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  aktifUye = authState(this.auth);
  constructor(
    public firestore:Firestore,
    public auth:Auth,
    public storage: Storage
  ) { }

  KayitOl(mail: string, parola: string) {
    return from(createUserWithEmailAndPassword(this.auth, mail, parola));
  }
  OturumAc(mail: string, parola: string) {
    return from(signInWithEmailAndPassword(this.auth, mail, parola));
  }
  OturumKapat() {
    return from(this.auth.signOut());
  }

  
  

  get AktifUyeBilgi() {
    return this.aktifUye.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.firestore, 'Users', user?.uid);
        return docData(ref) as Observable<Users>;
      })
    );
  }

  kullaniciMailDegis(){

  }

  kullaniciListele(){
    var ref = collection(this.firestore, "Users");
    return collectionData(ref, { idField: 'uid' }) as Observable<Users[]>;
  }
  
  kullaniciEkle(uye: Users) {
    var ref = doc(this.firestore, 'Users', uye.uid);
    return from(setDoc(ref, uye));
  }
  
  kullaniciSil(kullanici: Users){
    var ref = doc(this.firestore, "Users/" + kullanici.uid);
    return deleteDoc(ref);
  }
  
  kullaniciDuzenle(kullanici: Users) {
    var ref = doc(this.firestore, "Users/" + kullanici.uid);
    return from(updateDoc(ref, { ...kullanici }));
  }


  // GÖNDERİLER

  gonderiEkle(gonderi: Gonderiler) {
    console.log("2","girdi")
    var ref = collection(this.firestore, "Gonderiler");
    return this.aktifUye.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          gonderi:gonderi.gonderi,
          uid: user?.uid,
          gonderiTarihi:gonderi.gonderiTarihi
        })
      ),
      map((ref) => ref.id)
    );
  }

  gonderiListele() {
    var ref = collection(this.firestore, "Gonderiler");
    return collectionData(ref, { idField: 'gonderiId' }) as Observable<Gonderiler[]>;
  }

  gonderiDuzenle(gonderi: Gonderiler) {
    var ref = doc(this.firestore, "Gonderiler/" + gonderi.gonderiId);
    return from(updateDoc(ref, { ...gonderi }));
  }
  gonderiSil(gonderi:Gonderiler){
    var ref = doc(this.firestore, "Gonderiler/" + gonderi.gonderiId);
    return deleteDoc(ref);
  }


  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
  }

  
}
