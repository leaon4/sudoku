import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-bottom-controller',
    templateUrl: './bottom-controller.component.html',
    styleUrls: ['./bottom-controller.component.css'],
})
export class BottomControllerComponent implements OnInit {
    @Input() bottomControl: {
        current: number;
        total: number;
    };
    @Output() currChange = new EventEmitter<number>();
    @Output() runAlgorithm = new EventEmitter<any>();
    current: number | string = 1;
    total: number[] = [];
    ngOnInit() {
        this.current = this.bottomControl.current;
        this.total = new Array(this.bottomControl.total).fill(0).map((item, index) => index + 1);
    }
    onChange(dir: number) {
        this.current = +this.current;
        if (dir) {
            this.current += dir;
            if (this.current < 1) {
                this.current = 1;
            } else if (this.current > this.bottomControl.total) {
                this.current = this.bottomControl.total;
            }
        }
        this.currChange.emit(this.current);
    }
    onRunAlgorithm() {
        this.runAlgorithm.emit();
    }
}
