import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadjsService {
  myScriptElement:any = HTMLScriptElement;

  constructor() { }
  async runScript(){
    this.runScript1();   
    this.runScript2();   
    this.runScript3();   
    this.runScript4();   
  }
  async runScript1(){
    this.myScriptElement = document.createElement("script");
    this.myScriptElement.src = "./assets/js/bootstrap.min.js";
    await document.body.appendChild(this.myScriptElement);
  }
  async runScript2(){
    this.myScriptElement = document.createElement("script");
    this.myScriptElement.src = "./assets/js/jquery-3.2.1.slim.min.js";
    await document.body.appendChild(this.myScriptElement);
  }
  async runScript3(){
    this.myScriptElement = document.createElement("script");
    this.myScriptElement.src = "./assets/js/popper.min.js";
    await document.body.appendChild(this.myScriptElement);
  }
  async runScript4(){
    this.myScriptElement = document.createElement("script");
    this.myScriptElement.src = "./assets/js/main.js";
    await document.body.appendChild(this.myScriptElement);
  }
}
