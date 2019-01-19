import { Component, OnInit ,Input} from '@angular/core';

@Component({
    selector: 'app-sudu-item',
    templateUrl: './sudu-item.component.html',
    styleUrls: ['./sudu-item.component.css']
})
export class SuduItemComponent implements OnInit {
    @Input() item;
    constructor() { }

    ngOnInit() {
    }

}
