
let canvas = document.createElement("canvas"),
    ctx = canvas.getContext('2d');
document.body.append(canvas);
canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight

// Write "Awesome!"
ctx.font = '30px Impact';
ctx.fillText('Awesome!', 50, 100);

// Draw line under text
let text = ctx.measureText('Awesome!');
ctx.strokeStyle = 'rgba(0,0,0,0.5)';
ctx.beginPath();
ctx.lineTo(50, 102);
ctx.lineTo(50 + text.width, 102);
ctx.stroke();


ctx.translate(300,300)
let A = {x:0,y:0}
let B = {x:100,y:0}
let C = {x:0,y:100}

function point(point,size= 2,color="black"){
    ctx.fillStyle = color
    ctx.beginPath();
    ctx.arc(point.x, point.y, size, 0, 2 * Math.PI, true);
    ctx.fill();
}
function line(a,b,color="black"){

    ctx.strokeStyle = color
    ctx.beginPath();
    ctx.lineTo(a.x, a.y);
    ctx.lineTo(b.x , b.y);
    ctx.stroke();
}

let angle = Math.atan2(A.y -B.y,A.x -B.x);
let ABX = {x: A.x + Math.cos(angle) * 20, y: A.y + Math.sin(angle) * 20}
let BAX = {x: B.x + Math.cos(Math.PI + angle) * 20, y: B.y + Math.sin(Math.PI + angle) * 20}

angle = Math.atan2(B.y -C.y,B.x -C.x);
let BCX = {x: B.x + Math.cos(angle) * 20, y: B.y + Math.sin(angle) * 20}
let CBX = {x: C.x + Math.cos(Math.PI + angle) * 20, y: C.y + Math.sin(Math.PI + angle) * 20}

angle = Math.atan2(A.y -C.y,A.x -C.x);
let ACX = {x: A.x + Math.cos(angle) * 20, y: A.y + Math.sin(angle) * 20}
let CAX = {x: C.x + Math.cos(Math.PI + angle) * 20, y: C.y + Math.sin(Math.PI + angle) * 20}


// let ABX = ext(A,B)
// let BAX = ext(B,A)
// let BCX = ext(B,C)
// let CBX = ext(C,B)
// let ACX = ext(A,C)
// let CAX = ext(C,A)

//
// function find_angle(A,B,C) {
//     var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));
//     var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2));
//     var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
//     return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
// }
//
// function sup(X1,X2,X){
//         let angle = find_angle(X1, X, X2);
//    let degrees =  (angle * 180) / Math.PI
//
//     console.log(degrees)
// }
//
// sup(BCX,BAX,B)





point(ABX,2, "green")
point(BAX,2, "green")
point(BCX,2, "green")
point(CBX,2, "green")
point(ACX,2, "green")
point(CAX,2, "green")

point(A,3)
point(B,3)
point(C,3)

ctx.strokeStyle = "yellow"
ctx.beginPath();
ctx.moveTo(ABX.x, ABX.y);
ctx.lineTo(ACX.x, ACX.y);
ctx.lineTo(BCX.x, BCX.y);
ctx.lineTo(BAX.x , BAX.y);
ctx.lineTo(CAX.x , CAX.y);
ctx.lineTo(CBX.x, CBX.y);
ctx.closePath()
ctx.stroke();
