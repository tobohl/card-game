function houseCards(cards, amount) {
    const selected = new Set();
    var cardNum = 0;

    while (selected.size != amount) {
        cardNum = Math.floor((Math.random() * cards.length));
        selected.add(cards[cardNum]);
    }

    return selected;
}

function isWin(player, house) {
    for (let card of player) {
        if (!house.has(card)) {
            return false;
        }
    }
    return true;
}

function show(element) {
    var el = document.querySelector(element);
    if (el.classList.contains('hidden')) {
        el.classList.remove('hidden');
    }
}

function hide(element) {
    var el = document.querySelector(element);
    if (el.classList.contains('hidden') == false) {
        el.classList.add('hidden');
    }
}

function status(message = 'example', color = false) {
    var container = document.querySelector('#messages');
    var div = document.createElement('div');
    div.classList.add('message', 'animation');
    if (color) {
        switch(color) {
            case 'red':
                div.classList.add('color-red');
                break;
            case 'green':
                div.classList.add('color-green');
                break;
            case 'yellow':
                div.classList.add('color-yellow');
                break;
        }
    }
    div.append(message);
    container.prepend(div);
    setTimeout(function () {
        div.classList.add('fade');
        setTimeout(function () {
            div.remove();
        }, 1000);
    }, 1000);
    return message;
}

function activeCard(card) {
    if (card.style.position != 'relative') {
        card.style.position = 'relative';
        card.style.top = '80px';
        playerCards.add(card.innerHTML);
        availableCards.delete(card.innerHTML);
        return true;
    } else {
        card.removeAttribute('style');
        playerCards.delete(card.innerHTML);
        availableCards.add(card.innerHTML);
        return false;
    }
}

function deactivateCard(card) {
    unused = document.querySelector('#card' + card);
    unused.classList.add('disabled');
    unused.removeEventListener('click', cardState);
}

function activateCard(card) {
    reuse = document.querySelector('#card' + card);
    reuse.classList.remove('disabled');
    reuse.addEventListener('click', cardState);
}

function cardState(card) {

    if (activeCard(card.target)) {
        if (playerCards.size == 0) {
            status('Pick a card.');
        }

        if (playerCards.size == 1) {
            status('Pick a second card.');
            hide('#sliderContainer');
            availableCards.forEach(activateCard);
        }

        if (playerCards.size == 2) {
            status('Place your bet.');
            show('#sliderContainer');
            availableCards.forEach(deactivateCard);
        }

    } else {
        if (playerCards.size == 0) {
            status('Pick a card.');
        }

        if (playerCards.size == 1) {
            status('Pick a second card.');
            hide('#sliderContainer');
            availableCards.forEach(activateCard);
        }

        if (playerCards.size == 2) {
            status('Place your bet.');
            show('#sliderContainer');
            deactivateCard(card.target.innerHTML);
        }
    }
}

function setupDeck(card) {
    document.querySelector('#card' + card).addEventListener('click', cardState);
}

function game(e) {
    cards.forEach(setupDeck);
    setTimeout(function () { status('Pick a card.'); }, 200);
}

function updateBet(e) {
    e.target.max = funds;
    displayBet.innerHTML = 'Bet: ' + e.target.value;
    displayFunds.innerHTML = funds - e.target.value;
    bet = Number(e.target.value);
}

function casinoPicks(cards) {
    casinoPicked = [];
    cards.forEach(function (card) {
        casinoPicked.push(card);
    });
    return casinoPicked;
}

function play(e) {
    bet = slider.value;

    if (isWin(playerCards, correctCards)) {
        funds += Math.floor((bet * winMultiplier));
        setTimeout(function () { status('Win ' + Math.floor((bet * winMultiplier)) + '.', 'green'); }, 100);
    } else {
        funds -= Math.floor(bet);
        var chosenCards = casinoPicks(correctCards);
        setTimeout(function () { status('Loss ' + Math.floor(bet) + '.', 'red'); }, 100);
        setTimeout(function () { status('The casino picked ' + chosenCards[0] + 
            ' and ' + chosenCards[1] + '.', 'yellow'); }, 200);
    }

    displayFunds.innerHTML = Number(funds);
    bet = defaultBet;
    slider.value = defaultBet;
    displayBet.innerHTML = 'Bet: ' + Number(defaultBet);

    resetGame();
}

function resetGame() {
    correctCards = houseCards(cards, 2);
    availableCards = new Set(cards);
    playerCards = new Set();
    cards.forEach(function (card) {
        c = document.querySelector('#card' + card);
        c.addEventListener('click', cardState);
        c.removeAttribute('style');
        c.classList.remove('disabled');
    });
    hide('#sliderContainer');
    if (funds < 1) {
        cards.forEach(function (card) {
            deactivateCard(card);
        });
        fundsVal.style.fontSize = '3rem';
        fundsVal.style.textTransform = 'uppercase';
        fundsVal.style.userSelect = 'none';
        fundsVal.innerHTML = 'Game Over';
    } else {
        setTimeout(function () {
            status('Pick a card.');
        }, 300)
    }
}

const cards = ['A', 'B', 'C', 'D', 'E'];
const displayFunds = document.querySelector('#fundsVal');
const displayBet = document.querySelector('#sliderVal');
const slider = document.querySelector('#slider');
const buttonPlay = document.querySelector('#buttonPlay');

const winMultiplier = 8.5;
const defaultFunds = 100;
const defaultBet = 1;
var funds = defaultFunds;
var bet = defaultBet;

displayFunds.innerHTML = Number(defaultFunds) - Number(defaultBet);
displayBet.innerHTML = 'Bet: ' + Number(defaultBet);

var correctCards = houseCards(cards, 2);
var availableCards = new Set(cards);
var playerCards = new Set();

document.addEventListener('DOMContentLoaded', game)
slider.addEventListener('input', updateBet);
buttonPlay.addEventListener('click', play);