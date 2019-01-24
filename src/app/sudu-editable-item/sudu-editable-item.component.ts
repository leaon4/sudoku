import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChange } from '@angular/core';


@Component({
    selector: 'app-sudu-editable-item',
    templateUrl: './sudu-editable-item.component.html',
    styleUrls: ['./sudu-editable-item.component.css']
})
export class SuduEditableItemComponent implements OnInit, OnChanges {
    @Input() tempArr: number[];
    @Output() confirm = new EventEmitter<number>();
    templateItems: boolean[] = new Array(9).fill(false);

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        let curr: number[] = changes.tempArr.currentValue;
        let prev: number[] = changes.tempArr.previousValue;
        /* if (Array.isArray(curr)&&Array.isArray(prev)){
            if ()
        } */
        if (Array.isArray(curr)) {
            this.templateItems.forEach((item, index) => {
                this.templateItems[index] = curr.includes(index + 1)
            })
        } else {
            // this.noChangeConfirmItem(null, curr);
            // todo 错误处理
        }
    }

    ngOnInit() {
        if (typeof this.tempArr !== 'number') {
            this.tempArr.forEach(item => {
                this.templateItemChange(item);
            });
        }
    }

    private templateItemChange(index: number): void {
        this.templateItems[index - 1] = !this.templateItems[index - 1];
    }

    changeTestItem(num: number): void {
        num++;
        this.templateItemChange(num);
        // 未通知父组件直接修改值是不好的！
        let index = this.tempArr.indexOf(num);
        if (index > -1) {
            this.tempArr.splice(index, 1);
        } else {
            let idx = this.tempArr.findIndex(item => item > num);
            if (idx === -1) {
                idx = this.tempArr.length;
            }
            this.tempArr.splice(idx, 0, num);
        }
    }

    trackByFn(index: number): number {
        return index;
    }

    confirmItem(e: Event, index: number): void {
        e && e.preventDefault();
        this.confirm.emit(index + 1);
    }

    returnToTest(e: Event): void {
        e.preventDefault();
        this.confirm.emit(0);
        setTimeout(() => {
            this.templateItems.forEach((item, index) => {
                if (item) {
                    this.tempArr.push(index + 1);
                }
            });
        }, 5)
    }
}
