import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-property-barr',
  templateUrl: './property-barr.component.html',
  styleUrls: ['./property-barr.component.css']
})
export class PropertyBarrComponent implements OnInit {

  @Input() isM2: boolean;
  constructor() { }

  ngOnInit() {
  }

}
