/* jshint esversion:6 */
let sign;
let nr1;
let nr2;
let expression;
let expressionToShow;
let correctAnswer;
let playing = false;
let correctAnswers = 0, wrongAnswers = 0;
let timer = 0;

window.onload = function (){
    $('#startGame').html('Alusta mängu').on('click', startGame);
};

function startGame(){
    playing = true ;
    createExpression();
    
}
function createExpression(){
    nr1 = makeRandom(10);
    nr2 = makeRandom(10);
    let randomSign = makeRandom(1);
    if(randomSign == 0){ 
        sign = "+"; 
        correctAnswer = nr1 + nr2;
    } else { 
        sign = "-"; 
        correctAnswer = nr1 - nr2;
    }
    expression = nr1 + sign + nr2;
    console.log(expression);
    
    expressionToShow = nr1 + " " + nr2 + " = " + correctAnswer;
    $('#mathExpression').html(expressionToShow);
}
function makeRandom(e){
    let nr = Math.round(Math.random()*e);
    return nr;
}

function checkAnswer(nr){
    let answer;
    if(nr == 1){
        answer = nr1 + nr2;
    } else if (nr == 2){
        answer = nr1 - nr2;
    }

    if(correctAnswer == answer){
        console.log("tubli");
        createExpression();
        correctAnswers++;
        $("#correctCount").html('Õigeid: ' + correctAnswers);
        
    } else {
        console.log("Proovi paremini");
        wrongAnswers++;
        $("#wrongCount").html('Valesid: ' + wrongAnswers);
        
    }
    
}
function showStats(){
    console.log("kohal");
    
}
