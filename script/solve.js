let rDate = ""
let rTime = "";
let rDiff = "";
let rInterval = "";
let strSS = sessionStorage.getItem("RNumberPlace");
if(strSS){
    let arr = strSS.split('/');
    rTime = arr[0];
    rDiff = arr[1];
    rInterval = arr[2];
}
switch (rDiff) {
    case '25': rDiff = "Easy";
      break;
    case '35': rDiff = "Normal";
      break;
    case '40': rDiff = "Hard";
      break;
    default:
}
let d = new Date();
rDate = d.getFullYear() + '/' + `${d.getMonth() + 1}` + '/' + d.getDate() + ' ' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();
document.getElementById("id-date").innerHTML = rDate;
document.getElementById("id-time").innerHTML = rTime;
document.getElementById("id-diff").innerHTML = rDiff;
document.getElementById("id-interval").innerHTML = rInterval + "sec";
