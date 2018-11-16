import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  values:any;
  constructor(private http:HttpClient) { }

  ngOnInit() {
  }

  registerToggle() {
    this.registerMode = true
  }

  getValues(){
    let url = "http://localhost:5000/api/values";
    this.http.get(url).subscribe(response => {
      this.values = response;
    }, error => {
      console.log(error);
    });
  }

  cancelRegisterMode(registerMode: boolean){
    this.registerMode = registerMode;
    console.log("cancelled")
  }
}
