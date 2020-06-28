import { Component, OnInit } from '@angular/core';
import { LoaderServiceService } from '../services/loader-service.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  constructor(private _loaderService:LoaderServiceService) { }
  show: boolean;
  ngOnInit() {
    this._loaderService.subject.subscribe((val:boolean) => {
      // console.log(val);
      this.show = val;
    });
  }

}
