let blackjackgame = {
    'you' : { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5,'6': 6, '7': 7, '8':8 ,'9': 9, '10':10, 'J':10, 'Q': 10, 'K': 10, 'A': [1,11] },
    'wins':0,
    'losses':0,
    'draws':0,
    'isStand':false,
    'turnsOver': false,

};

const YOU = blackjackgame['you']
const DEALER = blackjackgame['dealer']

const hitsound = new Audio('/assets/sounds/swish.m4a');
const winSound = new Audio('/assets/sounds/cash.mp3');
const lossSound = new Audio('/assets/sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener("click", blackjackhit);
document.querySelector('#blackjack-deal-button').addEventListener('click',blackjackdeal);
document.querySelector('#blackjack-stand-button').addEventListener('click',dealerLogic);

function blackjackhit(){
    if(blackjackgame['isStand'] === false ){
        
    let card = randomCard();
    showCard(card,YOU);
    updateScore(card,YOU);
    showScore(YOU);
    if(YOU['score'] > 21){
        
        updateScore(card,YOU);
        blackjackgame['turnsOver'] = true;
        showResult(computeWinner());
        
        
    }
}
}

function randomCard(){
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackgame['cards'][randomIndex];
}

function showCard(card,activePlayer){
    if(activePlayer['score'] <= 21){

    let cardImage = document.createElement('img');
    cardImage.src = `/assets/images/${card}.png`;
    cardImage.setAttribute('width','100px');
    cardImage.setAttribute('height','100px')
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitsound.play();
    }

}

function blackjackdeal(){
    if(blackjackgame['turnsOver'] === true){
        blackjackgame['isStand'] = false;
        
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');


        for(let i = 0; i <yourImages.length; i++){
            yourImages[i].remove();
        }
        for (let i = 0; i < dealerImages.length;i++){
            dealerImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        //document.querySelector(activePlayer['scoreSpan']).textContent = 0;
        document.getElementById('your-blackjack-result').textContent = 0;
        document.getElementById('your-blackjack-result').style.color = 'white';

        document.getElementById('dealer-blackjack-result').textContent = 0;
        document.getElementById('dealer-blackjack-result').style.color = 'white';
        
        document.querySelector('#black-jack-result').textContent = "lets play";
        document.querySelector('#black-jack-result').style.color = 'black';

        blackjackgame['turnsOver'] = true;
    }
}

function updateScore(card,activePlayer)
    {
    if(card === 'A'){
    //if addings 11 keeps me below 21, add 11. otherwise, add 1
    if(activePlayer['score'] + blackjackgame['cardsMap'][card][1] <=21 ){

        activePlayer['score'] += blackjackgame['cardsMap'][card][1];
        
    }else{
        activePlayer['score'] += blackjackgame['cardsMap'][card][0];
    }
} else {
    activePlayer['score'] += blackjackgame['cardsMap'][card];
}

    }

function showScore(activePlayer)   
{
    if(activePlayer['score'] > 21 )
    {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'Bust';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
            }
}

    function sleep(ms){
        return new Promise (resolve => setTimeout(resolve,ms))
    }

async function dealerLogic(){
    blackjackgame['isStand'] = true;
    blackjackgame['turnsOver'] = false;

    while(DEALER['score'] < 18 && blackjackgame['isStand'] === true )
    {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card,DEALER);
        showScore(DEALER);
        await sleep(800);
    }
        
        if(DEALER['score'] >= 16)
        {
            blackjackgame['turnsOver'] = true;
            let winner = computeWinner();
            showResult(winner);
        }
}
//compute winner
//update wins draws losses
function computeWinner(){
    let winner;

    if(YOU['score'] <=21){
        if(YOU['score'] > DEALER['score'] || (DEALER['score'] > 21 )){
            blackjackgame['wins']++;
            winner = YOU;
        }else if(YOU['score'] < DEALER['score']){
            blackjackgame['losses']++;
            winner = DEALER;
        }else if(YOU['score']=== DEALER['score']){
            blackjackgame['draws']++;
        }

        //condition: when user busts but dealer doesnt
    }else if (YOU['score'] > 21 && DEALER['score'] <= 21){

        blackjackgame['losses']++;
        winner = DEALER;
        //when both bust
    }else if (YOU['score'] > 21 && DEALER['score'] >21){

        blackjackgame['draws']++;
    }

    //console.log(blackjackgame);
    return winner;
}

function showResult(winner){

    let message, messageColor;

    if(blackjackgame['turnsOver'] === true){

        if(winner === YOU){
            document.querySelector('#wins').textContent = blackjackgame['wins'];
            message = ' You Won';
            messageColor = 'blue';
            winSound.play();
        }else if(winner === DEALER){
            document.querySelector('#losses').textContent = blackjackgame['losses'];
            message = ' You lost';
            messageColor = 'red';
            lossSound.play();
        }else {
            document.querySelector('#draws').textContent = blackjackgame['draws'];
            message = 'you drew';
            messageColor = 'black';
        }
        document.querySelector('#black-jack-result').textContent = message;
        document.querySelector('#black-jack-result').style.color= messageColor;
    }
}



