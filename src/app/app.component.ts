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
            current: 3,
            total: SUDU_DATA.length
        };
    suduData: SUDU = SUDU_DATA[this.bottomControl.current - 1];
    editableData: suduNum;
    validArr: boolean[][] = JSON.parse(
        JSON.stringify(new Array(9).fill(new Array(9).fill(false)))
    );
    aa() {
        console.log(this.editableData)
    }
    trackByFn(y) {
        return y * 10;
    }
    trackByFn2(x) {
        return x;
    }
    onCurrChange(current: number) {
        this.bottomControl.current = current;
        this.suduData = SUDU_DATA[current - 1];
        this.editableData = this.convertToNumber(this.suduData);
    }
    onRunAlgorithm() {
        console.time('aa');
        this.runAlgorithm(this.editableData);
        console.timeEnd('aa');
    }
    ngOnInit() {
        this.editableData = this.convertToNumber(this.suduData);
        // console.time('aa');
        // this.runAlgorithm(this.editableData);
        // console.timeEnd('aa');
    }
    private runAlgorithm(data: suduNum) {
        let that = this;
        const snapShots: {
            data: suduNum,
            result: {},
            rows: number[][],
            columns: number[][],
            cubes: number[][],
            y: number,
            x: number
        }[] = [];
        let result: {} = {};
        let tempArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let tempArr2 = new Array(9).fill(tempArr.slice(0));
        let rows: number[][] = JSON.parse(JSON.stringify(tempArr2));
        let columns: number[][] = JSON.parse(JSON.stringify(tempArr2));
        let cubes: number[][] = JSON.parse(JSON.stringify(tempArr2));
        let needIterate = true;
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (typeof data[y][x] === 'number') {
                    rows[y].splice(rows[y].indexOf(+data[y][x]), 1);
                    columns[x].splice(columns[x].indexOf(+data[y][x]), 1);
                    let cubeIndex = getCubeIndex(y, x);
                    cubes[cubeIndex].splice(cubes[cubeIndex].indexOf(+data[y][x]), 1);
                } else {
                    result['' + y + x] = [];
                }
            }
        }
        runStep1();
        step2();
        runStep1();
        step2();
        runStep1();
        step2();
        runStep1();
        step2();
        assumeStep();
        runStep1();
        step2();
        runStep1();
        restoreAssume();
        runStep1();
        step2();
        assumeStep();
        runStep1();
        step2();
        runStep1();
        step2();
        runStep1();
        function runStep1() {
            needIterate = true;
            while (needIterate && Object.keys(result).length) {
                console.info('step1')
                step1();
            }
        }
        this.reCalEditableData(result);


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
                        x
                    };
                    snapShots.push(JSON.parse(JSON.stringify(snapShot)));
                    console.info('assume ' + i + ';value=' + result[i][0]);
                    afterFindOne(y, x, i);
                    break;
                }
            }
        }
        function restoreAssume() {
            let snapShot = snapShots.shift();
            that.editableData = data = snapShot.data;
            result = snapShot.result;
            rows = snapShot.rows;
            columns = snapShot.columns;
            cubes = snapShot.cubes;
            let y = snapShot.y;
            let x = snapShot.x;
            let i = '' + y + x;
            console.info('restore ' + i + ';value=' + result[i][1]);
            result[i].shift();
            afterFindOne(y, x, i);

            /* restoreSet(y, x, assume.value);
            function restoreSet(y: number, x: number, num: number) {
                restore(rows[y]);
                restore(columns[x]);
                restore(cubes[getCubeIndex(y, x)]);
                function restore(set: number[]) {
                    let index = set.findIndex(item => item > num);
                    if (index === -1) {
                        index = set.length;
                    }
                    set.splice(index, 0, num);
                }
            } */
        }
        function step2() {
            let differs = getDiffers();
            differs.forEach(differ => {
                findByDiffer(differ);
            });
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
            bigDiffer.forEach((differ) => {
                for (let i in differ) {
                    if (differ[i].length === 1 && result[differ[i][0]]) {
                        console.info('find by step2')
                        let [y, x] = getXYIndex(differ[i][0]);
                        data[y][x] = +i;
                        removeSet(y, x, +i);
                        delete result[differ[i][0]];
                    }
                }
            });
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
            needIterate = false;
            for (let i in result) {
                let [y, x] = getXYIndex(i);
                result[i] = intersect(y, x);
                if (!result[i].length) {
                    console.warn('wrong assume');
                    needIterate = false;
                    // restoreAssume();
                    return;
                }
                if (result[i].length === 1) {
                    console.info('find by step1')
                    needIterate = true;
                    afterFindOne(y, x)
                }
            }
        }
        function afterFindOne(y: number, x: number, i?: string) {
            i = i || '' + y + x;
            data[y][x] = result[i][0];
            removeSet(y, x, result[i][0]);
            delete result[i];
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
    private getCubeIndex(y: number, x: number): number {
        return ~~(x / 3) + ~~(y / 3) * 3;
    }
    /* private SUDUTosudu(data: SUDU): sudu {
        let res;
        let result = {};
        let tempArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let tempArr2 = new Array(9).fill(tempArr.slice(0));
        const rows: number[][] = JSON.parse(JSON.stringify(tempArr2));
        const columns: number[][] = JSON.parse(JSON.stringify(tempArr2));
        const cubes: number[][] = JSON.parse(JSON.stringify(tempArr2));
        let needIterate = true;
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (data[y][x] !== '.') {
                    rows[y].splice(rows[y].indexOf(+data[y][x]), 1);
                    columns[x].splice(columns[x].indexOf(+data[y][x]), 1);
                    let cubeIndex = getCubeIndex(y, x);
                    cubes[cubeIndex].splice(cubes[cubeIndex].indexOf(+data[y][x]), 1);
                } else {
                    result[y * 10 + x] = [];
                }
            }
        }
        while (needIterate) {
            step1();
        }
        function step3() {
            const twoSame: { index: string[], nums: number[] }[] = [];
            let differs = getDiffers();
            differs.forEach(bigDiffer => {
                bigDiffer.forEach(differ => {
                    let value2 = {};
                    for (let i in differ) {
                        if (differ[i].value === 2) {
                            let str = differ[i].index.toString();
                            if (str in value2) {
                                value2[str].push(+i);
                                twoSame.push({
                                    index: differ[i].index,
                                    nums: value2[str]
                                });
                            } else {
                                value2[str] = [+i];
                            }
                        }
                    }
                });
            });
            console.log(twoSame);
            twoSame.forEach(item => {
                let [[y1, x1], [y2, x2]] = [getXYIndex(item.index[0]), getXYIndex(item.index[1])];
                result[item.index[0]] = item.nums.slice(0);
                result[item.index[1]] = item.nums.slice(0);
                if (y1 === y2) {
                    for (let i = 0; i < 9; i++) {
                        removeByTowSame(y1 * 10 + i, item);
                    }
                }
                if (x1 === x2) {
                    for (let i = 0; i < 9; i++) {
                        removeByTowSame(i * 10 + x1, item);
                    }
                }
                let cubeIndex = getCubeIndex(y1, x1);
                if (cubeIndex === getCubeIndex(y2, x2)) {
                    for (let i = 0; i < 9; i++) {
                        let num = ((~~(cubeIndex / 3)) * 3 + ~~(i / 3)) * 10 + (cubeIndex % 3) * 3 + i % 3;
                        removeByTowSame(num, item);
                    }
                }
            });
        }
        function removeByTowSame(i: number, item: { index: string[], nums: number[] }) {
            if (result[i] && item.index.indexOf(i + '') < 0) {
                result[i] = result[i]
                    .filter(item2 => item.nums.indexOf(item2) < 0);
            }
        }
        function step2() {
            let differs = getDiffers();
            differs.forEach(differ => {
                findByDiffer(differ);
            });
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
            bigDiffer.forEach((differ) => {
                for (let i in differ) {
                    if (differ[i].value === 1) {
                        console.log('find by differ')
                        let [y, x] = getXYIndex(differ[i].index[0]);
                        data[y][x] = i;
                        removeSet(y, x, +i);
                        delete result[differ[i].index[0]];
                        // delete rowDiffer[y][i];
                    }
                }
            });
        }
        function computeDiffer(differ: {}[], i: string, index: number) {
            result[i].forEach(item => {
                if (item in differ[index]) {
                    differ[index][item].value++;
                    differ[index][item].index.push(i);
                } else {
                    differ[index][item] = {
                        value: 1,
                        index: [i]
                    };
                }
            })
        }
        convertToNumber();
        console.log('res', res)
        return res;
        function step1() {
            needIterate = false;
            for (let i in result) {
                let [y, x] = getXYIndex(i);
                result[i] = intersect(y, x);
                if (result[i].length === 1) {
                    console.log('find by step1')
                    needIterate = true;
                    data[y][x] = result[i][0] + '';
                    removeSet(y, x, result[i][0]);
                    delete result[i];
                }
            }
        }
        function getCubeIndex(y: number, x: number): number {
            return ~~(x / 3) + ~~(y / 3) * 3;
        }
        function getXYIndex(i: string): number[] {
            if (i.length === 2) {
                return [+i[0], +i[1]];
            }
            return [0, +i];
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
        function convertToNumber() {
            res = data.map((item, y) => {
                return item.map((item2, x) => {
                    if (item2 !== '.') {
                        return +item2;
                    } else {
                        if (!result[y * 10 + x]) {
                            console.log(y, x)
                        }
                        return result[y * 10 + x];
                    }
                })
            });
        }
    } */
}
