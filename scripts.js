const cards = document.querySelectorAll(".card");

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

let moves = 0;


let initialTime = Date.now();
let interval;
setTime();

function setTime(){
    interval = setInterval(calcTime, 1000);
}

function calcTime() {
    let currentTime = Date.now();
    let diffTime = currentTime - initialTime;
    setTimeHTML(diffTime);
}

function setTimeHTML(diffTime) {
    let diffTimeHTML = document.querySelector(".time-lapse");
    diffTimeHTML.innerHTML = new Date(diffTime).toISOString().substring(14, 19);
}

function flipCard() {
    if (lockBoard) {
        return
    };

    if (this === firstCard) {
        return
    };

    this.classList.add("flipped");
    
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;

        return;
    }
    
    hasFlippedCard = false;
    secondCard = this;
    
    checkForMatch();   
}

function checkForMatch() {
    moves += 1;
    document.querySelector(".moves-counts").innerText = moves
    const isMatched = firstCard.dataset.cardname === secondCard.dataset.cardname;

    isMatched ? disableCards() : unFlipCards();
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    lockBoard = true; //fix another bug
    
    setTimeout(() => {
        firstCard.classList.add("hidden");
        secondCard.classList.add("hidden");
        
        reloadGame();
        
        resetBoard();
    }, 1000);
    
}

function unFlipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");

        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null]
}

function reloadGame() {
    let invisibleCards = document.querySelectorAll(".hidden");
    if (invisibleCards.length === cards.length) {
        let resetBtn = document.querySelector(".reset");
        resetBtn.classList.add("visible");

        clearInterval(interval);
        interval = null;

        resetBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.location.reload();
        })
    }
}

cards.forEach((card) => {
    card.addEventListener("click", flipCard);

    let randomOrder = Math.floor(Math.random() * cards.length);
    card.style.order = randomOrder;
});