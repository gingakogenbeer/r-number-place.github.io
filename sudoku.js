const reset = 100;  //threshold for backtrack when create NP
let level = 25;
let startTime = 0;
let resetCount = 0;
let countClick = 0;
let thcClick = 0;
/*---------------------------------------------
 *
 *  Function definition
 *
 */
function initNumber(){
    for(var i=1; i<10; i++){
        for(var j=1; j<10; j++){
            document.getElementById(`cell-${i}-${j}`).value = '';
        }
    }
}
function setNumber(){
    for(var i=1; i<10; i++){
        let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for(var j=1; j<10; j++){
            let index = getIndex(arr, i, j);
            if (index === -1){
                i -= 1;
                continue;
            }else if (index === -2){
                i = 0;
                continue;
            }
            document.getElementById(`cell-${i}-${j}`).value = arr[index];
            arr.splice(index, 1);
        }
    }
}
/* Random number generation 0<= return <max */
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function getIndex(arr, i, j){
    var ret = 0;
    var ccount = 0;         /* counter using rowClear */
    var len = arr.length;
   
    while(true) {
        var idx = getRandomInt(len);

        /* Break if there is not deplicated number each row, col, block */
        if ((rowCheck(arr[idx], j)) && (rowCheck(arr[idx], j)) && (blockCheck(arr[idx], i, j))) {
            ret = idx;
            break;
        }
        ccount += 1;
        if (ccount > 50){
            rowClear(i);
            ret = -1;
            break;
        }
    }
    return ret;
}
function rowCheck(value, j){
    var ret = true;
    for(var i=1; i<10; i++){
        var tCell = document.getElementById(`cell-${i}-${j}`).value;
        var vCell = tCell * 1;
        if (value === vCell){
            ret = false;
        }
    }
    return ret;
}
function columnCheck(value, i){
    var ret = true;
    for(var j=1; j<10; j++){
        var tCell = document.getElementById(`cell-${i}-${j}`).value;
        var vCell = tCell * 1;
        if (value === vCell){
            ret = false;
        }
    }
    return ret;
}
function blockCheck(value, i, j){
    var ret = true;
    var x = parseInt((i-1)/3, 10) * 3 + 1;
    var y = parseInt((j-1)/3, 10) * 3 + 1;
    for(var s=0; s<3; s++){
        for(var t=0; t<3; t++){
            var tCell = document.getElementById(`cell-${x+s}-${y+t}`).value;
            var vCell = tCell * 1;
            if (value === vCell){
                ret = false;
            }
        }
    }
    return ret;
}
function rowClear(i){
    for(var j=1; j<10; j++){
        document.getElementById(`cell-${i}-${j}`).value = '';
    }
}
function cellMask(){
    var count = 0;
    while (true){
        var row = getRandomInt(8) + 1;
        var col = getRandomInt(8) + 1;
        if (document.getElementById(`cell-${row}-${col}`).value != ''){
            document.getElementById(`cell-${row}-${col}`).value = '';

            count += 1;
            if (count >= level){
                break;
            }
        }
    }
}
function setProperty(){
    let p;
    for(var i=1; i<10; i++){
        for(var j=1; j<10; j++){
            if(document.getElementById(`cell-${i}-${j}`).value != ''){
                p = document.getElementById(`cell-${i}-${j}`);
                p.className = "input-prop"
                p.readOnly = true;
            }else{
                p = document.getElementById(`cell-${i}-${j}`);
                p.className = "input-prop-df"
                p.readOnly = false;
            }
        }
    }
}
function valueChanged(f){
    let fCheck = fillCheck();
    let wCheck = false;
    
    if(fCheck === true){
        wCheck = waCheck();
    }
    if(wCheck === true){
        stopTimer();
        setProperty();
    }
    if(thcClick === 0){
        thcClick = getRandomInt(10);
    }
    countClick += 1;
    if(countClick === 15+thcClick){
        rotateSeed(getRandomInt(4));
        countClick = 0;
        thcClick = 0;
    }
}
function fillCheck(){
    var ret = true;
    for(var i=1; i<10; i++){
        for(var j=1; j<10; j++){
            if (document.getElementById(`cell-${i}-${j}`).value === ''){
                ret = false;
            }
        }
    }
    return ret;
}
function waCheck(){
    let ret = true;
    for(var i=1; i<10; i++){
        let sum = 0;
        for(var j=1; j<10; j++){
            sum += document.getElementById(`cell-${i}-${j}`).value * 1;
        }
        if(sum !== 45){
            ret = false;
        }
    }
    return ret;
}
function waRowCheck(j){
    var ret = false;
    var sum = 0;
    for(var i=1; i<10; i++){
        sum += document.getElementById(`cell-${i}-${j}`).value * 1;
    }
    if(sum === 45){
        ret = true;
    }
    return ret;
}
function waColumnCheck(i){
    var ret = false;
    var sum = 0;
    for(var j=1; j<10; j++){
        sum += document.getElementById(`cell-${i}-${j}`).value * 1;
    }
    if (sum === 45){
        ret = true;
    }
    return ret;
}
function setTimer(){
    startTime = performance.now();
}
function stopTimer(){
    endTime = performance.now();
    let min = Math.floor((endTime - startTime)/1000/60);
    let second = Math.round((endTime - startTime)/1000 - min*60);
    alert(`Congratulations!\n\nyour time is ${min}min${second}sec`);
}
function rotateSeed(r){
    let s, e;
    switch (r) {
        case 0:             //rotation PI/2
            seteMatrix(1);
            break;
        case 1:             //rotation PI
            seteMatrix(2);
            break;
        case 2:             //rotation 3PI/2
            seteMatrix(3);
            break;
    }
}
function seteMatrix(r){
    let p;
    let nonMaskedCell = [];
    let userInputCell = [];
    for(var i=1; i<10; i++){
        nonMaskedCell[i-1] = Array(9).fill(0);
        userInputCell[i-1] = Array(9).fill(0);
        for(var j=1; j<10; j++){
            p = document.getElementById(`cell-${i}-${j}`);
            if(p.readOnly){
                nonMaskedCell[i-1][j-1] = p.value * 1;
            }else{
                userInputCell[i-1][j-1] = p.value * 1;
            }
            p.value = '';
        }
    }
    for(var i=0; i<r; i++){
        nonMaskedCell = rotate(nonMaskedCell);
        userInputCell = rotate(userInputCell);
    }
    for(var i=1; i<10; i++)
        for(var j=1; j<10; j++)
            if(nonMaskedCell[i-1][j-1] > 0)
                document.getElementById(`cell-${i}-${j}`).value = nonMaskedCell[i-1][j-1];
    setProperty();
    for(var i=1; i<10; i++)
        for(var j=1; j<10; j++)
            if(userInputCell[i-1][j-1] > 0)
                document.getElementById(`cell-${i}-${j}`).value = userInputCell[i-1][j-1];
}
function rotate(arr){
    let rtArr = [];
    for(var i=0; i<9; i++){
        rtArr[i] = [];
        for(var j=0; j<9; j++){
            rtArr[i][j] = arr[j][8-i];
        }
    }
    return rtArr;
}
function levelEasy(l){
    level = l;
    initNumber();
    setNumber();
    cellMask();
    setProperty();
    setTimer();
}
function levelMiddle(l){
    level = l;
    initNumber();
    setNumber();
    cellMask();
    setProperty();
    setTimer();
}
function levelHard(l){
    level = l;
    initNumber();
    setNumber();
    cellMask();
    setProperty();
    setTimer();
}
/*---------------------------------------------
 *
 *  Keydown Event
 *
 */
window.addEventListener("keydown", handleKeydown);
function handleKeydown(event){
    let strfId = document.activeElement.id;
    if(!strfId.includes("cell")){
        return;
    }
    let temp = strfId.replace(/[^1-9]/g, "");
    let i = Math.floor((temp*1)/10);
    let j = temp%10;

    switch (event.key) {
        case 'ArrowUp':
            if(i===1){
                i = 9;
            }else{
                i--;
            }
            break;
        case 'ArrowRight':
            if(j===9){
                j = 1;
            }else{
                j++;
            }
            break;
        case 'ArrowDown':
            if(i===9){
                i = 1;
            }else{
                i++;
            }
            break;
        case 'ArrowLeft':
            if(j===1){
                j = 9;
            }else{
                j--;
            }
            break;
        default:
    }
    let p = document.getElementById(`cell-${i}-${j}`);
    if(p.readOnly === true){
        p.select();
        window.setTimeout(function() { p.select(); }, 1);   //I dont know but this is Magic func 
    }else{
        p.focus();
    }
}
/*---------------------------------------------
 *
 *  Function exec
 *
 */
initNumber();
setNumber();
cellMask();
setProperty();
setTimer();