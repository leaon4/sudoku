import { Component, OnInit } from '@angular/core';
import { suduNum, SUDU, SUDU_DATA } from './sudu-data';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    bottomControl: {
        current: number;
        total: number;
    } = {
            current: 1,
            total: SUDU_DATA.length
        };
    suduData: SUDU = SUDU_DATA[this.bottomControl.current - 1];
    editableData: suduNum;
    validArr: boolean[][] = JSON.parse(
        JSON.stringify(new Array(9).fill(new Array(9).fill(false)))
    );
    gen: Generator;
    auto: Function;
    private initTime: number;
    time: number;
    wrongMessage: string;
    // private curr: number = 1;
    trackByFn = y => y;
    trackByFn2 = x => x;
    onCurrChange(current: number) {
        this.bottomControl.current = current;
        this.suduData = SUDU_DATA[current - 1];
        this.initTime = Date.now();
        this.editableData = this.convertToNumber(this.suduData);
        this.runAlgorithm(this.editableData);
        this.initTime = Date.now() - this.initTime;
    }
    onStepSolve() {
        this.gen.next();
    }
    onAutoSolve() {
        let prevtime = Date.now();
        this.auto();
        this.time = Date.now() - prevtime + this.initTime;
        this.finalValidate();
    }
    ngOnInit() {
        this.initTime = Date.now();
        this.editableData = this.convertToNumber(this.suduData);
        this.runAlgorithm(this.editableData);
        this.initTime = Date.now() - this.initTime;
        /* setInterval(() => {
            this.onCurrChange(this.curr++);
            this.onAutoSolve();
            console.error('fdsfdf'+this.curr)
        },500) */
    }
    showIntro() {
        alert('每个格子又分为9个小宫格，左键点击即在宫格内显式相应数字，此数字仅用于辅助。对小宫格点击右键，则确定这一格真正的数字。若确定的数字有冲突，会显示为粉红色背景。')
    }
    private runAlgorithm(data: suduNum) {
        const that = this;
        const snapShots: {
            data: suduNum,
            result: {},
            rows: number[][],
            columns: number[][],
            cubes: number[][],
            y: number,
            x: number,
            resultLength: number,
        }[] = [];
        let result: {} = {};
        let resultLength: number = 0;
        let rows: number[][];
        let columns: number[][];
        let cubes: number[][];
        let found: boolean = false;
        let assumeWrong: boolean = false;

        (function () {
            let tempArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            let tempArr2 = new Array(9).fill(tempArr.slice(0));
            rows = JSON.parse(JSON.stringify(tempArr2));
            columns = JSON.parse(JSON.stringify(tempArr2));
            cubes = JSON.parse(JSON.stringify(tempArr2));
            for (let y = 0; y < 9; y++) {
                for (let x = 0; x < 9; x++) {
                    if (typeof data[y][x] === 'number') {
                        rows[y].splice(rows[y].indexOf(+data[y][x]), 1);
                        columns[x].splice(columns[x].indexOf(+data[y][x]), 1);
                        let cubeIndex = getCubeIndex(y, x);
                        cubes[cubeIndex].splice(cubes[cubeIndex].indexOf(+data[y][x]), 1);
                    } else {
                        result['' + y + x] = [];
                        resultLength++;
                    }
                }
            }
        })();
        this.gen = gen();
        this.auto = function () {
            while (resultLength) {
                found = false;
                if (!assumeWrong) {
                    step1();
                    if (!found && !assumeWrong) {
                        step2();
                        if (!found && !assumeWrong) {
                            assumeStep();
                        }
                    }
                } else {
                    assumeWrong = false;
                    restoreAssume();
                }
            }
            this.reCalEditableData(result);
        }

        function* gen() {
            while (resultLength) {
                found = false;
                if (!assumeWrong) {
                    step1();
                    that.reCalEditableData(result);
                    yield;
                    if (!found && !assumeWrong) {
                        step2();
                        that.reCalEditableData(result);
                        yield;
                        if (!found && !assumeWrong) {
                            assumeStep();
                            that.reCalEditableData(result);
                            yield;
                        }
                    }
                } else {
                    assumeWrong = false;
                    restoreAssume();
                    that.reCalEditableData(result);
                    yield;
                }
            }
        }

        function assumeStep() {
            for (let i in result) {
                if (result[i].length === 2) {
                    let [y, x] = getXYIndex(i);
                    let snapShot = {
                        data,
                        result,
                        rows,
                        columns,
                        cubes,
                        y,
                        x,
                        resultLength,
                    };
                    snapShots.push(JSON.parse(JSON.stringify(snapShot)));
                    console.info('assume ' + i + ';value=' + result[i][0]);
                    afterFindOne(y, x, result[i][0]);
                    return;
                }
            }
            console.error('没有只有两个假设值的数字！');
        }
        function restoreAssume() {
            let snapShot = snapShots.pop();
            that.editableData = data = snapShot.data;
            result = snapShot.result;
            resultLength = snapShot.resultLength;
            rows = snapShot.rows;
            columns = snapShot.columns;
            cubes = snapShot.cubes;
            let y = snapShot.y;
            let x = snapShot.x;
            let i = '' + y + x;
            result[i].shift();
            console.info('restore ' + i + ';value=' + result[i][0]);
            afterFindOne(y, x, result[i][0]);
        }
        function step2() {
            console.info('step2');
            let differs = getDiffers();
            for (let i = 0, l = differs.length; i < l; i++) {
                if (assumeWrong) {
                    console.warn('wrong assume in step2');
                    return;
                }
                findByDiffer(differs[i]);
            }
        }
        function getDiffers(): {}[][] {
            let rowDiffer = [{}, {}, {}, {}, {}, {}, {}, {}, {}];
            let columnDiffer = [{}, {}, {}, {}, {}, {}, {}, {}, {}];
            let cubeDiffer = [{}, {}, {}, {}, {}, {}, {}, {}, {}];
            for (let i in result) {
                let [y, x] = getXYIndex(i);
                computeDiffer(rowDiffer, i, y);
                computeDiffer(columnDiffer, i, x);
                computeDiffer(cubeDiffer, i, getCubeIndex(y, x));
            }
            return [rowDiffer, columnDiffer, cubeDiffer];
        }
        function findByDiffer(bigDiffer: {}[]) {
            for (let j = 0, l = bigDiffer.length; j < l; j++) {
                for (let i in bigDiffer[j]) {
                    if (bigDiffer[j][i].length === 1 && result[bigDiffer[j][i][0]]) {
                        console.info('find by step2')
                        let [y, x] = getXYIndex(bigDiffer[j][i][0]);
                        if (validate(y, x, +i)) {
                            assumeWrong = true;
                            return;
                        }
                        afterFindOne(y, x, +i);
                    }
                }
            }
            function validate(y: number, x: number, num: number): boolean {
                for (let i = 0; i < 9; i++) {
                    if (data[y][i] === num
                        || data[i][x] === num
                        || data[~~(y / 3) * 3 + ~~(i / 3)][~~(x / 3) * 3 + i % 3] === num
                    ) {
                        return true;
                    }
                }
            }
        }
        function computeDiffer(differ: {}[], i: string, index: number) {
            result[i].forEach(item => {
                if (item in differ[index]) {
                    differ[index][item].push(i);
                } else {
                    differ[index][item] = [i];
                }
            })
        }
        function step1() {
            console.info('step1');
            for (let i in result) {
                let [y, x] = getXYIndex(i);
                result[i] = intersect(y, x);
                if (!result[i].length) {
                    console.warn('wrong assume');
                    assumeWrong = true;
                    return;
                }
                if (result[i].length === 1) {
                    console.info('find by step1')
                    afterFindOne(y, x, result[i][0]);
                }
            }
        }
        function afterFindOne(y: number, x: number, num: number) {
            let i = '' + y + x;
            removeSet(y, x, num);
            delete result[i];
            resultLength--;
            found = true;
            that.onConfirm(num, y, x);
        }
        function getCubeIndex(y: number, x: number): number {
            return ~~(x / 3) + ~~(y / 3) * 3;
        }
        function getXYIndex(i: string): number[] {
            return [+i[0], +i[1]];
        }
        function intersect(y: number, x: number): number[] {
            let row = rows[y];
            let column = columns[x];
            let cube = cubes[getCubeIndex(y, x)];
            let arr = [];
            row.forEach(item => {
                if (column.indexOf(item) > -1 && cube.indexOf(item) > -1) {
                    arr.push(item);
                }
            });
            return arr;
        }
        function removeSet(y: number, x: number, num: number) {
            remove(rows[y]);
            remove(columns[x]);
            remove(cubes[getCubeIndex(y, x)])
            function remove(set: number[]) {
                let i = set.indexOf(num);
                if (i > -1) {
                    set.splice(i, 1);
                }
            }
        }
    }
    private reCalEditableData(result: {}): void {
        for (let i in result) {
            let y = +i[0], x = +i[1];
            this.editableData[y][x] = result[i].slice(0);
        }
    }
    private convertToNumber(data: SUDU): suduNum {
        return data.map((item, y) => {
            return item.map((item2, x) => {
                if (item2 !== '.') {
                    return +item2;
                } else {
                    return [];
                }
            })
        });
    }
    private finalValidate() {
        this.clearWrong();
        let result = isValidSudoku(this.editableData);
        if (result.length) {
            console.error(result);
            this.validArr[result[0]][result[1]] = true;
        }
        function isValidSudoku(data): number[] {
            let obj;
            for (let y = 0; y < 9; y++) {
                obj = {};
                for (let x = 0; x < 9; x++) {
                    if (obj[data[y][x]]) {
                        return [y, x];
                    }
                    obj[data[y][x]] = true;
                }
            }
            for (let x = 0; x < 9; x++) {
                obj = {};
                for (let y = 0; y < 9; y++) {
                    if (obj[data[y][x]]) {
                        return [y, x];
                    }
                    obj[data[y][x]] = true;
                }
            }
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    obj = {};
                    for (let y = i * 3; y < 3 + i * 3; y++) {
                        for (let x = j * 3; x < 3 + j * 3; x++) {
                            if (obj[data[y][x]]) {
                                return [y, x];
                            }
                            obj[data[y][x]] = true;
                        }
                    }
                }
            }
            return [];
        };
    }
    private clearWrong() {
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                this.validArr[y][x] = false;
            }
        }
    }
    onConfirm(num: number, y: number, x: number) {
        if (!num) {
            this.validArr[y][x] = false;
            this.editableData[y][x] = [];
            return;
        }
        for (let i = 0; i < 9; i++) {
            if (this.editableData[y][i] === num
                || this.editableData[i][x] === num
                || this.editableData[~~(y / 3) * 3 + ~~(i / 3)][~~(x / 3) * 3 + i % 3] === num
            ) {
                this.validArr[y][x] = true;
                break;
            }
        }
        this.editableData[y][x] = num;
    }
}
