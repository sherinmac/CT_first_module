import { NgModule, Component } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { RequestOptions, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

import { BrowserModule } from "@angular/platform-browser";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'File type checking';
  public showflag = false;
  public items: any = [];
  constructor(private http: Http) {

  }

  ngOnInit() {

  }

  loadFileTypes() {

    alert('Load file types');

    
    const payload = { filepath: "/home/sherin_ag/project_express/filetype.zip" };

   
    let url = `http://localhost:8081/filesTypes`;

    this.http.post(url, payload).subscribe(res => {
      this.items = JSON.parse(res['_body']);
      this.showflag = true;
    }
    );
  }

  isAnswerProvided(event, item) {

    console.log(this.items);
    if (event.target.checked) {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].filename == item.filename) {
          this.items[i].selected = true;
        }
      }
    } else {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].filename == item.filename) {
          this.items[i].selected = false;
        }
      }
    }
    console.log(this.items);

  }

  checkAll(event) {

    if (event.target.checked) {
      for (var i = 0; i < this.items.length; i++) {
        this.items[i].selected = true;
      }
    }
    else {
      for (var i = 0; i < this.items.length; i++) {
        this.items[i].selected = false;
      }
    }

  }

  writeFileTypes() {

    alert('Write file Types')
    const payload = this.items;
    console.log(payload);
    let url = `http://localhost:8081/writefilesTypes`;
    this.http.post(url, payload).subscribe(res => {
      //do the  process
    }
    );

  }


}
