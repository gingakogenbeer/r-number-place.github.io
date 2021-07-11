let htmlFileName = window.location.href.split('/').pop();
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
function start(){
    try {
        setNumber();
        cellMask();
        setProperty();
        startTimer();
    } catch (error) {
        alert("作問に失敗しました。リロードしてください。。。");
    }
}
function reStart(){
    try {
        initNumber();
        setNumber();
        cellMask();
        setProperty();
        startTimer();        
    } catch (error) {
        alert("作問に失敗しました。リロードしてください。。。");
    }
}
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

        /* Break if there is not deplicated number each row, block */
        if ((rowCheck(arr[idx], j)) && (blockCheck(arr[idx], i, j))) {
            ret = idx;
            break;
        }
        ccount += 1;
        if (ccount > 30){
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
//マスクの仕方を検討中。
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
    let [fCheck, tmp] = fillCheck();
    let wCheck = false;
    
    if(fCheck === true){
        wCheck = waCheck();
    }
    if(wCheck === true){
        stopTimer();
        setProperty();
    }
//comment due to change rotation trigger to timer from click
/*    if(thcClick === 0){
        thcClick = getRandomInt(10);
    }
    countClick += 1;
    if(countClick === 15+thcClick){
        rotateSeed(getRandomInt(4));
        countClick = 0;
        thcClick = 0;
    }
*/
}
function fillCheck(){
    let ret = true;
    let count = 0;
    for(var i=1; i<10; i++){
        for(var j=1; j<10; j++){
            if (document.getElementById(`cell-${i}-${j}`).value === ''){
                ret = false;
                count++;
            }
        }
    }
    return [ret, count];
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
function startTimer(){
    startTime = performance.now();
}
function stopTimer(){
    clearInterval(rotateTimer);
    endTime = performance.now();
    let min = Math.floor((endTime - startTime)/1000/60);
    let second = Math.round((endTime - startTime)/1000 - min*60);
    let setVal = `${min}min ${second}sec/${level}/${(delay/1000)}`;
    sessionStorage.setItem('RNumberPlace', setVal);
    window.location.href = "solve.html"
}
function rotateSeed(r){
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
    clearInterval(rotateTimer);
    reStart();
    rotateTimer = setInterval(countUp, delay);
}
function levelMiddle(l){
    level = l;
    clearInterval(rotateTimer);
    reStart();
    rotateTimer = setInterval(countUp, delay);
}
function levelHard(l){
    level = l;
    clearInterval(rotateTimer);
    reStart();
    rotateTimer = setInterval(countUp, delay);
}
function rITimeChanged(f){
    if(isNaN(f.value) == true){
        f.value = preDelay/1000;
        return;
    }
    clearInterval(rotateTimer);
    f.value = (f.value<1 ? 1 : parseInt(f.value));
    delay = f.value * 1000;
    preDelay = delay;
    rotateTimer = setInterval(countUp, delay);
    reStart();
}
/*---------------------------------------------
 *
 *  Timer Event
 *
 */
let delay = 10000;
let preDelay = delay;
document.getElementById("cell-0-0").value = delay / 1000;
let countUp = function(){
    let [tmp, tmp2] = fillCheck();
    //The fewer the free cell, the more annoying the rotation just becomes. So stop.
    if(tmp2 < 10){
    }else{
        rotateSeed(getRandomInt(3));
    }
}
let rotateTimer = setInterval(countUp, delay);
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
    let temp = strfId.replace(/[^0-9]/g, "");
    let i = temp[0] * 1;
    let j = temp[1] * 1;

    if((i==0 && j==0) && event.key=='Enter'){
        document.getElementById(`cell-${i}-${j}`).blur();
        return;
    }

    switch (event.key) {
        case 'ArrowUp':
            i = i===1 ? 9 : i-1;
            break;
        case 'ArrowRight':
            j = j===9 ? 1 : j+1;
            break;
        case 'ArrowDown':
            i = i===9 ? 1 : i+1;
            break;
        case 'ArrowLeft':
            j = j===1 ? 9 : j-1;
            break;
        default:
    }
    let p = document.getElementById(`cell-${i}-${j}`);
    if(p.readOnly === true){
        p.select();
        window.setTimeout(function() { p.select(); }, 1);
    }else{
        p.focus();
    }
}
/*---------------------------------------------
 *
 *  Function exec
 *
 */
sessionStorage.removeItem('RNumberPlace');
start();
