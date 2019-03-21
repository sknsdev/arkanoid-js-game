
let arr=document.cookie.split(";");
console.log(arr);

let leaderScore = document.getElementById("scoreTable");


arr.forEach(function(item, i, arr) {
    let temp=arr[i];
    let alonePlayerScore = temp.split('=');

    let row = document.createElement("TR");
    leaderScore.appendChild(row);
    let td1 = document.createElement("TD");
    let td2 = document.createElement("TD");


    row.appendChild(td1);
    row.appendChild(td2);

    td1.innerHTML = alonePlayerScore[0];
    td2.innerHTML = alonePlayerScore[1];



});

