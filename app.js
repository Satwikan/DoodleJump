document.addEventListener('DOMContentLoaded',() =>{
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    const startButton = document.getElementById("button")
    const scoreOutput = document.getElementById('score')
    grid.innerHTML = `DOODLE JUMP by Satwikan`
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    let platformCount = 5
    let isGameOver = false
    let platforms = []
    let upTimerId
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let rightTimerId
    let leftTimerId
    let score = 0

    class Platform {
        constructor (newPlatBottom){
            this.bottom = newPlatBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual 
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function createDoodler(){
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    function createPlatforms(){
        for (let i = 0 ;i < platformCount ;i++){
            let  platGap = 600 / platformCount
            let newPlatBottom = 100 + i * platGap
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform)
            console.log(platforms)
        }
    }

    function movePlatforms(){
        if (doodlerBottomSpace > 50){
            platforms.forEach(platform =>{
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'
                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    scoreOutput.value= score
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function jump(){
        clearInterval(downTimerId)
        upTimerId = setInterval(function (){
            isJumping = true
            doodlerBottomSpace += 30
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > startPoint + 200){
                isJumping = false
                fall()
            }
        },30)
    }

    function fall(){
        clearInterval(upTimerId)
        downTimerId = setInterval(() => {
            isJumping = false
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0){
                gameOver()
            }
            platforms.forEach(platform =>{
                if(
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= (platform.bottom + 15)) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    (!isJumping)
                ){
                    startPoint = doodlerBottomSpace
                    jump()
                }
            })
        }, 30);
    }

    function gameOver(){
        console.log("GAME OVER!")
        isGameOver = true
        while (grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = "GAME OVER!\n" + "Score:" + score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
        startButton.addEventListener('click',()=>location.reload())
    }

    function control(e){
        if (e.key === "ArrowLeft"){
            moveLeft()
        }
        else if (e.key === "ArrowRight"){
            moveRight()
        }
        else if (e.key === "ArrowUp"){
            moveStraight()
        }
    }

    function moveLeft(){
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
        isGoingRight = false
        isGoingLeft = true
        doodler.style.backgroundImage = "url('doodler-guy2.png')"
        leftTimerId = setInterval(function (){
            if (doodlerLeftSpace >= 0){
                console.log('going left')
                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + 'px'
            }else { // Doddler appears on other side after reaching and side
                doodlerLeftSpace = 335
            }
        },20)
    }

    function moveRight(){
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
        isGoingLeft = false
        isGoingRight = true
        doodler.style.backgroundImage = "url('doodler-guy.png')"
        rightTimerId = setInterval(function (){
            if (doodlerLeftSpace <= 335){
                console.log('going right')
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            }else {// Doddler appears on other side after reaching and side
                doodlerLeftSpace = 0
            }
        },20)
    }

    function moveStraight(){
        isGoingLeft = false
        isGoingRight = true
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }

    function start (){
        grid.textContent = ""
        if (!isGameOver) {
            createPlatforms()
            createDoodler()
            scoreOutput.value = score
            setInterval(movePlatforms,30)
            jump()
            document.addEventListener('keyup',control)
        }
    }
    startButton.addEventListener('click',start)
})