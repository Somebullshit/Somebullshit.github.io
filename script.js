// Start game
let mainscreen = document.querySelector(".screen");
let gameover = document.querySelector("#gameover");
let lasttime = document.querySelector("#timeout");
let scorecounter = document.querySelector("#scorecounter");
let overscreen = document.querySelector(".overscreen");
let timerspeedUp;
let timerspeedDown;
let timerspeedlowUp;
let timerspeedlowDown;
let keydownUp = false;
let keydownDown = false;
let scoretimer;
let boomrtimeout;
let score = 0;
let barrels = [];
for (i = 0; i < 5; i++) {
    barrels[i] = createBarrel(i * 130 + 650, randInt(0, 5) * 80 + 10, 6);
    console.log(barrels[i])
    console.log(barrels)
}
setTimeout(() => {
    overscreen.style.width = "300px";
}, 1500);
// let barrel1 = createBarrel(randInt(600, 1000), randInt(10, 330));
requestAnimationFrame(game);
let player = createPlayer();
let boomimage = document.querySelector("#boomimg");
boomimage.style.display = "none";
let lives = document.querySelectorAll("#apt");
let apt = 3;

scoretimer = setInterval(() => {
    score += 1;
    scorecounter.innerHTML = "Score: " + score;
}, 100);

function createPlayer() {
    let player = document.createElement("div");
    player.classList.add("car");
    mainscreen.appendChild(player);
    player.x = 40;
    player.y = 177;
    player.dirY = 0;
    player.speedUp = 0;
    player.speedDown = 0;
    player.speed = 0;
    player.width = 92;
    player.height = 45;
    player.undestr = false;
    player.crash = false;
    player.innerHTML = "<img src='boom.png' id='boomimg'>"
    return player;
}
function createBarrel(startX, startY, speed) {
    let barrel = document.createElement("div");
    barrel.classList.add("barrel");
    mainscreen.appendChild(barrel);
    barrel.x = startX;
    barrel.y = startY;
    barrel.speed = speed;
    barrel.width = 92;
    barrel.height = 45;
    return barrel;
}
document.body.addEventListener('keydown', function (e) {
    if (e.key === "ArrowUp") {
        if (!keydownUp && !player.crash) {
            keydownUp = true;
            clearInterval(timerspeedlowUp);
            timerspeedUp = setInterval(() => {
                // console.log(player.speedUp + "U");
                if (player.speedUp >= 8) {
                    player.speedUp = 8;
                    clearInterval(timerspeedUp);
                } else {
                    player.speedUp += 1;
                }
            }, 50);
        }
    }
    if (e.key === "ArrowDown") {
        if (!keydownDown && !player.crash) {
            keydownDown = true;
            clearInterval(timerspeedlowDown);
            timerspeedDown = setInterval(() => {
                // console.log(player.speedDown + "D");
                if (player.speedDown >= 8) {
                    player.speedDown = 8;
                    clearInterval(timerspeedDown);
                } else {
                    player.speedDown += 1;
                }
            }, 50);
        }
    }
});
document.body.addEventListener('keyup', function (e) {
    // console.log(e.key);
    if (e.key === "ArrowUp") {
        keydownUp = false;
        clearInterval(timerspeedUp);
        timerspeedlowUp = setInterval(() => {
            if (player.speedUp <= 0) {
                player.speedUp = 0;
                clearInterval(timerspeedlowUp);
            } else {
                player.speedUp -= 1;
            }
        }, 50);
    }
    if (e.key === "ArrowDown") {
        keydownDown = false;
        clearInterval(timerspeedDown);
        timerspeedlowDown = setInterval(() => {
            if (player.speedDown <= 0) {
                player.speedDown = 0;
                clearInterval(timerspeedlowDown);
            } else {
                player.speedDown -= 1;
            }
        }, 50);
    }
});
function game() {
    // Изменяем параметры объектов
    player.y += player.dirY * player.speed;
    for (i = 0; i < 5; i++) {
        barrels[i].x -= barrels[i].speed;
        if (barrels[i].x <= -100) {
            barrels[i].x = 600;
            barrels[i].y = randInt(0, 5) * 80 + 10;
            barrels[i].style.display = "inline";
        }
    }
    // Перемещаем объекты на сцене
    if (player.y <= 4) {
        player.y = 5;
        player.speedDown = 0;
        player.speedUp = 0;
        clearInterval(timerspeedUp);
    }
    if (player.y >= 355) {
        player.y = 354;
        player.speedDown = 0;
        player.speedUp = 0;
        clearInterval(timerspeedDown);
    }
    player.style.top = player.y + 'px';
    player.style.left = player.x + 'px';
    for (i = 0; i < 5; i++) {
        barrels[i].style.top = barrels[i].y + 'px';
        barrels[i].style.left = barrels[i].x + 'px';
    }

    for (i = 0; i < 5; i++) {
        if (!player.undestr && collisionDetection(player, barrels[i])){
            player.style.borderColor = "red";
            player.style.transform = "rotate(0deg)";
            boomimage.style.display = "inline";
            player.crash = true;
            boomrtimeout = setTimeout(() => {
                boomimage.style.display = "none";
                player.style.opacity = 0.5;
                player.crash = false;
            }, 300);
            if (apt == 0) {
                gameover.innerHTML = "Game Over"
                clearInterval(scoretimer);
                clearTimeout(boomrtimeout);
                return;
            }
            lives[apt - 1].style.display = "none";
            apt--;
            player.undestr = true;
            setTimeout(() => {
                player.style.opacity = 1;
                player.undestr = false;
            }, 3000);
            let timeover = 3;
            let timeout = setInterval(() => {
                timeover = timeover - 0.1;
                lasttime.innerHTML = "Timeout: " + timeover.toFixed(1) + "s";
                if (timeover <= 0) {
                    lasttime.innerHTML = "";
                    clearInterval(timeout);
                }
            }, 100);
            barrels[i].style.display = "none";
        } else {
            player.style.borderColor = "gray";
        }
    }
    console.log(player.speed);
    if (player.speedDown < player.speedUp) {
        player.speed = player.speedUp - player.speedDown;
        player.dirY = -1;
    } else if (player.speedDown > player.speedUp) {
        player.speed = player.speedDown - player.speedUp;
        player.dirY = 1;
    } else {
        player.speed = 0;
        player.dirY = 0;
    }
    if (!player.crash) {
        player.style.transform = "rotate(" + player.speed * player.dirY +"deg)";
    } else {
        player.style.transform = "rotate(0deg)";
    }
    if (player.crash) {
        player.speedDown = 0;
        player.speedUp = 0;
        clearInterval(timerspeedUp);
        clearInterval(timerspeedDown);
    }
    requestAnimationFrame(game);
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
// function collisionDetection(obj1, obj2) {
//     return (obj1.x < obj2.x + obj2.width &&
//         obj1.x + obj1.width > obj2.x &&
//         obj1.y < obj2.y &&
//         obj1.height + obj1.y > obj2.y - obj2.height)

// }
function collisionDetection(obj1, obj2) {
    return (obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.height + obj1.y > obj2.y)

}
