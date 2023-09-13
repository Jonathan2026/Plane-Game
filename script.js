//_________________________________________________________Setup________________________________________
const canvas = document.querySelector('canvas');
const start_screen = document.getElementById("start-button")
const levels = document.getElementById('levels')
const ctx = canvas.getContext('2d');

canvas.width = innerWidth
canvas.height = innerHeight

let score = 0
let gameFrame = 0
ctx.font = '50px Georgia'

sky_bg = new Image()
sky_bg.src = "planes/sky_background_mountains.png"




//___________________________________________________________End Of Setup____________________________________________


//___________________________________________--Mouse Interactivity________________________________________________
let canvasPosition = canvas.getBoundingClientRect()
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}

canvas.addEventListener('mousedown', function(event){
    mouse.click = true
    mouse.x = event.x - canvasPosition.left
    mouse.y = event.y - canvasPosition.top
    console.log(mouse.x, mouse.y)

})

canvas.addEventListener('mouseup', function(){
    mouse.click = false
})
//_______________________________________________________End of Mouse Interactivity________________________________


//_______________________________________________________Player_________________________________________________-

leftPlayer = new Image()
leftPlayer.src = "planes/plane_1_pink.png"

class Player{
    constructor(){
        this.x = canvas.width/2
        this.y = canvas.height/2
        this.radius = 75
        this.angle = 0
    }

    update(){
        const dx = this.x - mouse.x
        const dy = this.y - mouse.y
        if (mouse.x != this.x){
            this.x -= dx/30
        }

        if (mouse.y != this.y){
            this.y -= dy/30
        }

        if (mouse.x > this.x){
            leftPlayer.src = "planes/plane_1_pink.png"
        }
        
        else if (mouse.x < this.x){
            leftPlayer.src = "planes/plane_left.png"
        }
    }

    draw(){
        if (mouse.click){

            //Making a line
            ctx.lineWidth = 0.2
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.closePath()
            ctx.stroke()
        }
//Circle
        ctx.fillStyle = "red"
        ctx.beginPath()
        ctx.drawImage(leftPlayer, this.x, this.y, 100, 100);
        ctx.fill()
        ctx.closePath()


    }
}

const player = new Player()
//_________________________________________________________________End of Player___________________________________________


//________________________________________________________________________Bubbles_____________________________________________

const bubblesArray = []

let blocked_gathered = document.createElement("audio")
blocked_gathered.src = "sound/block-gathered.wav"

let level_complete = document.createElement("audio")
level_complete.src - "sound/level-complete.mp3"
class Bubble {
    constructor(){
        this.x = Math.random() * canvas.width
        this.y = canvas.height + Math.random() * canvas.height
        this.radius = 50
        this.speed = Math.random() * 5 + 1
        this.distance;
        this.count = false
    }

    update(){
        this.y -= this.speed
        const dx = this.x - player.x
        const dy = this.y - player.y
        this.distance = Math.sqrt(dx * dx + dy * dy)
    }

    draw(){
        ctx.fillStyle = 'blue'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath()
        ctx.stroke()
        
} 
}

function handleBubbles(){
    if (gameFrame % 50 == 0){
        bubblesArray.push(new Bubble())
    }

    for (let i = 0; i < bubblesArray.length; i++){
        bubblesArray[i].update()
        bubblesArray[i].draw()
        
        if(bubblesArray[i].y < 0){
            bubblesArray.splice(i, 1)

        }

        if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius && bubblesArray[i].count == false){
            blocked_gathered.play()
            score++
            bubblesArray[i].count = true
            bubblesArray.splice(i, 1)

            if (score % 25 == 0){
                level_complete.play()
            }
            
        }

    }
}

//__________________________________________________________-End of Bubbles______________________________________________________________


//________________________________________________________Enemies___________________________________________________________________________

const enemyArray = [] 

torpedo = new Image()
torpedo.src = "planes/torpedo_black.png"

let block_hit = document.createElement("audio")
block_hit.src = "sound/block-hit.wav"

class Enemies{
    constructor(){
        this.x = 0
        this.y = Math.random() * canvas.height
        this.radius = 25
        this.speed = Math.random() * 5 + 1
        this.distance;
    }
    
    update(){
        this.x += this.speed
        const dxEnemies = this.x - player.x
        const dyEnemies = this.y - player.y
        this.distance = Math.sqrt(dxEnemies * dxEnemies + dyEnemies * dyEnemies)
    }

    draw(){
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.drawImage(torpedo, this.x, this.y, 75, 75)
        ctx.fill()
        ctx.closePath()
        ctx.stroke()
    }
}


function handleEnemies(){
    if (gameFrame % 200 == 0){
        enemyArray.push(new Enemies())
    }

    for (let i = 0; i < enemyArray.length; i++){
        enemyArray[i].update()
        enemyArray[i].draw()
        
        if(enemyArray[i].x > canvas.width){
            enemyArray.splice(i, 1)

        }
        else if (enemyArray[i].distance < enemyArray[i].radius + player.radius){
            score = 0
            enemyArray.splice(i, 1)
            block_hit.play()
            
        }
    }
}

//___________________________________________________________End of Enemies_____________________________________________________________________________________


//__________________________________________________Animation loop______________________________________________________
function animate(){
    start_screen.style.display = "none"
    canvas.style.display = "block"

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.drawImage(sky_bg, 0, 0, canvas.width, canvas.height)
    handleEnemies();
    handleBubbles();
    player.update();
    player.draw();


    ctx.fillText("Score: " + score, 10, 50)

    gameFrame++
    
    if (score % 25 != 0){
        requestAnimationFrame(animate)  
    }

    else{
        console.log("you win")
        ctx.fillText("YOu dadsffdsa", 100, 50)
        setTimeout(startGame(), 10000);
    }
}

function startGame(){
    canvas.style.display = "none"
    start_screen.style.display = "none"
    levels.style.display = "block"
    
}

function Level1(){
    console.log('level 1')
    score = 1
    levels.style.display = "none"
    canvas.style.display = 'block'
    animate()
}

function Level2(){
    console.log('level 2')
    if (score >= 25){
        levels.style.display = "none"
        canvas.style.display = 'block'
        score = 26
        animate()
    }
}

function Level3(){
    console.log('level 3')
    if (score >= 50){
        levels.style.display = "none"
        canvas.style.display = 'block'
        score = 51
        animate()
    }
}

function BacktoStart(){
    start_screen.style.display = "block"
    levels.style.display = 'none'
}

//________________________________________________________________End of Animation Loop___________________________________________-
