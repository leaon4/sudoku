import { Component, OnInit } from '@angular/core';

type SUDU = string[][];
type sudu = (number | number[])[][];


















const SUDU: SUDU = [
    [".", ".", "1", ".", "7", "4", ".", ".", "."],
    [".", ".", ".", "9", ".", "2", ".", ".", "."],
    [".", ".", "9", "8", ".", ".", "2", ".", "4"],
    ["2", "3", ".", ".", "1", ".", "8", "6", "."],
    ["5", ".", ".", "3", "6", "7", ".", ".", "9"],
    [".", "9", "7", ".", "2", ".", ".", "1", "3"],
    ["4", "2", ".", ".", ".", "6", "1", ".", "."],
    [".", ".", ".", "1", ".", "3", ".", ".", "."],
    [".", ".", ".", "2", "8", ".", "9", ".", "."],
];








/* const SUDU: SUDU = [
    ["5", "3", ".", ".", "7", ".", ".", ".", "."],
    ["6", ".", ".", "1", "9", "5", ".", ".", "."],
    [".", "9", "8", ".", ".", ".", ".", "6", "."],
    ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
    ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
    ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
    [".", "6", ".", ".", ".", ".", "2", "8", "."],
    [".", ".", ".", "4", "1", "9", ".", ".", "5"],
    [".", ".", ".", ".", "8", ".", ".", "7", "9"]
]; */














/* const SUDU: SUDU = [
    [".", ".", "2", ".", ".", ".", ".", ".", "."],
    ["5", "1", ".", ".", "4", "8", ".", ".", "."],
    [".", "3", ".", "5", ".", ".", ".", ".", "7"],
    ["7", ".", "3", ".", ".", ".", ".", "8", "."],
    [".", ".", ".", "6", ".", "4", ".", ".", "."],
    [".", "6", ".", ".", ".", ".", "9", ".", "5"],
    ["6", ".", ".", ".", ".", "5", ".", "4", "."],
    [".", ".", ".", "3", "2", ".", ".", "5", "1"],
    [".", ".", ".", ".", ".", ".", "2", ".", "."]
]; */








@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    sudu: sudu;
    haha = 'haha';
    private SUDUTosudu(data: SUDU): sudu {
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
        // console.log(result);
        // console.log(rows,columns,cubes);

        /* while (needIterate) {
            step1();
        }
        step2();
        step1();
        step2();
        step1();
        step3();
        step1();
        step3(); */
        

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
    }
    /* for (let y=0;y<9;y++){
        for (let x=0;x<9;x++){
            if (data[y][x]==='.'){
                result[y*10+x]=[];
            }
        }
    } */
    /* private SUDUTosudu(data: SUDU): sudu {
        let result: sudu = data.map(item => {
            return item.map(item2 => {
                if (item2 !== '.') return +item2;
                return [];
            });
        });
        let tempArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let tempArr2 = new Array(9).fill(tempArr.slice(0));
        const rows: number[][] = JSON.parse(JSON.stringify(tempArr2));
        const columns: number[][] = JSON.parse(JSON.stringify(tempArr2));
        const cubes: number[][] = JSON.parse(JSON.stringify(tempArr2));
        let needIterate = true;
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (typeof result[y][x] === 'number') {
                    rows[y].splice(rows[y].indexOf(result[y][x] as number), 1);
                    columns[x].splice(columns[x].indexOf(result[y][x] as number), 1);
                    let cubeIndex = getCubeIndex(y, x);
                    cubes[cubeIndex].splice(cubes[cubeIndex].indexOf(result[y][x] as number), 1);
                }
            }
        }
        let haha = result.map(item => item.filter(item2 => typeof item2 === 'number'));
        console.log('初始已知数：'+haha.join().split(',').length)
        while (needIterate) {
            console.log('step1执行')
            step1();
        }
    
        haha = result.map(item => item.filter(item2 => typeof item2 === 'number'));
        console.log('step1后已知数：'+haha.join().split(',').length);

        const rowDiffrence=[]

        function step1() {
            needIterate = false;
            for (let y = 0; y < 9; y++) {
                for (let x = 0; x < 9; x++) {
                    if (typeof result[y][x] !== 'number') {
                        result[y][x] = intersect(y, x);
                        if ((result[y][x] as number[]).length === 1) {
                            needIterate = true;
                            result[y][x] = result[y][x][0];
                            removeSet(y, x, result[y][x] as number);
                        }
                    }
                }
            }
        }
        function step3() {
            let column = [[], [], [], [], [], [], [], [], []];
            let cube = [[], [], [], [], [], [], [], [], []];
            for (let y = 0; y < 9; y++) {
                for (let x = 0; x < 9; x++) {
                    column[x][y] = result[y][x];
                    cube[getCubeIndex(y, x)][x % 3 + (y % 3) * 3] = result[y][x];
                }
            }
            result.forEach((item, y) => {
                difference(item, (value: number, x: number) => {
                    result[y][x] = value;
                })
            });
            column.forEach((item, x) => {
                difference(item, (value: number, y: number) => {
                    result[y][x] = value;
                })
            });
            cube.forEach((item, index) => {
                difference(item, (value: number, index2: number) => {
                    result[~~(index / 3) * 3 + ~~(index2 / 3)][(index % 3) * 3 + index2 % 3];
                });
            });
        }
        function difference(arr: (number | number[])[], callback: Function) {
            let obj = {};
            arr.forEach((item, index) => {
                if (typeof item !== 'number') {
                    item.forEach((item2, index2) => {
                        if (obj[item2]) {
                            obj[item2].value++;
                        } else {
                            obj[item2] = {};
                            obj[item2].index = index;
                            obj[item2].value = 1;
                        }
                    })
                }
            })
            for (let i in obj) {
                if (obj[i].value === 1) {
                    arr[obj[i].index] = +i;
                }
            }
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
        function getCubeIndex(y: number, x: number): number {
            return ~~(x / 3) + ~~(y / 3) * 3;
        }
        return result;
    } */
    ngOnInit() {
        this.sudu = this.SUDUTosudu(SUDU);
    }
}
