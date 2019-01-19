import { Component, OnInit,Input } from '@angular/core';


@Component({
    selector: 'app-sudu-editable-item',
    templateUrl: './sudu-editable-item.component.html',
    styleUrls: ['./sudu-editable-item.component.css']
})
export class SuduEditableItemComponent implements OnInit {
    @Input() tempArr:number[];
    testItems: boolean[] = new Array(9).fill(false);
    choosenItems: number[] = [];
    mode: 'test' | 'choosen' = 'test';
    choosenItem: number = 0;

    ngOnInit() {
        this.tempArr.forEach(item=>{
            this.testItemChange(item);
        });
    }

    private testItemChange(index: number): void {
        this.testItems[index - 1] = !this.testItems[index - 1];
    }

    changeTestItem(index: number): void {
        this.choosenItems.push(index + 1);
        this.testItemChange(index + 1);
    }

    trackByFn(index: number): number {
        return index;
    }

    confirmItem(e: Event, index: number): void {
        e.preventDefault();
        this.mode = 'choosen';
        this.choosenItem = index + 1;
    }

    returnToTest(e: Event):void {
        e.preventDefault();
        this.mode = 'test';
        this.choosenItem = 0;
    }
}
