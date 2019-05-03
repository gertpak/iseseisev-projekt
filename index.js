/*jslint evil: true */
/* jshint esversion:6 */
let timer;
let maxRandom = 20;

let expression;
let correctAnswer;
let playing = false;
let correctAnswers = 0, wrongAnswers = 0;
let test = [];
let mathArray = [];
let numbersToPlay;
let timerWidth = 1;
let score = 0;

window.onload = function (){
    $('#startGame').html('Alusta mängu').on('click', startGame);
    $('#mathExpression').html("Matemaatiline mäng!");

};

function startGame(){
    score = -100;
    correctAnswers = 0;
    wrongAnswers = 0;
    timerWidth = 1;
    innerInfoToHTML();
    numbersToPlay = $('#numbersToPlay').val();
    numbersToPlay = Number(numbersToPlay);
    numbersToPlay += numbersToPlay-1;
    if(playing != true){
        createButton('#mathAnswer',' ', "answer1Btn", "checkAnswer(this.value)");
        createButton('#mathAnswer',' ', "answer2Btn", "checkAnswer(this.value)");
        createButton('#mathAnswer',' ', "answer3Btn", "checkAnswer(this.value)");
        $("#startGame").remove();
        $("#numbersToPlay").remove();
    }
    playing = true;
    createExpression();
    loop();
    
}
function createExpression(){
    $('#mathExpression').html(" ");
    score = score + (100 - timerWidth);
    timerWidth = 1;
    mathArray = [];
    for (let i = 0; i < numbersToPlay; i++) {
        if(i % 2 != 0){
            let randomS = makeRandom(3);
            randomS = randomSign(randomS);
            mathArray.push(randomS);
        } else {
            let randomNr = makeRandom(10);
            mathArray.push(randomNr);
        }
        $('#mathExpression').append(mathArray[i]);
        
    }
    console.log(mathArray);
    correctAnswer = roundToTwo(eval($('#mathExpression').html()));
    console.log(correctAnswer);

    if(correctAnswer == "Infinity" || isNaN(correctAnswer) == true){
        console.log("uus");
        createExpression();
        
    }
    
    expression = $('#mathExpression').html();
    console.log(expression);

    setValues();
}

function setValues(){
    let randomMethod = makeRandom(2);
    let randomAnswer1 = roundToTwo(eval(correctAnswer +  randomSign(makeRandom(3)) + makeRandom(maxRandom)));
    let randomAnswer2 = roundToTwo(eval(correctAnswer +  randomSign(makeRandom(3)) + makeRandom(maxRandom)));
    console.log(correctAnswer +  randomSign(makeRandom(3)) + makeRandom(maxRandom));
    
    if(isNaN(randomAnswer1) == false && isNaN(randomAnswer2) == false && correctAnswer != randomAnswer1 && correctAnswer != randomAnswer2 && randomAnswer1 != randomAnswer2){
        if(randomMethod == 0){
            $('#answer1Btn').attr("value", correctAnswer);
            $('#answer2Btn').attr("value", randomAnswer2);
            $('#answer3Btn').attr("value", randomAnswer1);
        } else if(randomMethod == 1){
            $('#answer1Btn').attr("value", randomAnswer2);
            $('#answer2Btn').attr("value", correctAnswer);
            $('#answer3Btn').attr("value", randomAnswer1);
        } else if(randomMethod == 2){
            $('#answer1Btn').attr("value", randomAnswer1);
            $('#answer2Btn').attr("value", randomAnswer2);
            $('#answer3Btn').attr("value", correctAnswer);
        }
    } else {
        setValues();
    }
}
function endGame(){
    playing = false;
    $('#mathExpression').html("LÕPP! Skoor: " + score);
    $('#answer1Btn').remove();
    $('#answer2Btn').remove();
    $('#answer3Btn').remove();
    createButton('#buttons','Alusta uuesti', "startGame", "startGame()");
    let arr = [
        {val : 2, text: '2'},
        {val : 3, text: '3'},
        {val : 4, text: '4'},
        {val : 5, text: '5'}
      ];
      
      let sel = $('<select id = "numbersToPlay">').appendTo('#buttons');
      $(arr).each(function() {
       sel.append($("<option>").attr('value',this.val).text(this.text));
      });
      

}

//Generate functions
function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

function makeRandom(e){
    let nr = Math.round(Math.random()*e);
    return nr;
}
function createElem(name, className, idName, val, func) {
    let elt = document.createElement(name);
    $(elt).attr({
        type: "submit",
        class: className,
        id: idName,
        value: val,
        onclick: func
    });
    return elt;
}

function createButton(where, type, idButton, func) {
    let button = createElem('input', 'btn', idButton, type, func);
    $(where).append(button);
}
function randomSign(nr){
    if(nr == 0){ nr = "-"; }
    else if(nr == 1){ nr = "+"; }
    else if(nr == 2){ nr = "*"; }
    else if(nr == 3){ nr = "/"; }
    return nr;
}

//Important functsions
function checkAnswer(nr){
    console.log(nr);
    
    if(correctAnswer == nr){
        console.log("tubli");
        createExpression();
        correctAnswers++;        
    } else {
        console.log("Proovi paremini");
        wrongAnswers++;
        if(wrongAnswers > 5){
            clearInterval(timer);
            endGame();
        }
    }
    innerInfoToHTML();
}

function showStats(){
    console.log("kohal");
    
}
function innerInfoToHTML(){
    $("#correctCount").html(correctAnswers);
    $("#score").html(score);
    $("#wrongCount").html(wrongAnswers + '/5');
}
function loop() {
    timer = setInterval(frame, 70);
    console.log(timerWidth);
    function frame(){
        if (timerWidth >= 100) {
            clearInterval(timer);
            endGame();
            
        } else {
            timerWidth++; 
            $("#myBar").css( "width", timerWidth + "%");
        }
    }
}