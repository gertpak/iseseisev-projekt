/*jslint evil: true */
/* jshint esversion:6 */
let timer;
let maxRandom = 20;

let expression;
let correctAnswer;
let playing = false;
let firstTime = true;
let correctAnswers = 0, wrongAnswers = 0;
let test = [];
let mathArray = [];
let numbersToPlay;
let timerWidth = 1;
let score = 0;
let nextLevel;
let playerName = "";

window.onload = function (){
    makeAnimation('#mathExpression');
    makeAnimation('#mathAnswer');
    makeAnimation('#myProgress');
    
    createButton('#mathAnswer','Alusta!', "startGame", "startGame()", "submit");
    $('#mathExpression').html("Matemaatiline mäng!");
    showStats();

};

function startGame(){
    makeOpacity('#mathExpression');
    makeOpacity('#mathAnswer');
    makeOpacity('#scoreTable');
    makeOpacity('#myProgress');
    $('#scoreTable').html('<table><tr><td>Õigeid: <span id="correctCount">0</span></td><td>Valesid: <span id="wrongCount">0/5</span></td><td>Skoor: <span id="score">0</span></td></tr></table>');
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    timerWidth = 1;
    nextLevel = 0;
    firstTime = true;
    innerInfoToHTML();
    numbersToPlay = 3;
    if(playing != true){
        $('#startGame').remove();
        createButton('#mathAnswer',' ', "answer1Btn", "checkAnswer(this.value)","submit");
        createButton('#mathAnswer',' ', "answer2Btn", "checkAnswer(this.value)","submit");
        createButton('#mathAnswer',' ', "answer3Btn", "checkAnswer(this.value)","submit");

    }
    playing = true;
    createExpression();
    loop();
    
}
function createExpression(){
    $('#mathExpression').html(" ");
    if(firstTime == true){
        firstTime = false;
    } else {
        makeOpacity('#mathExpression');
        makeOpacity('#mathAnswer');
        score = score + (100 - timerWidth);
    }
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
    playerName = $('#playerName').val();
    if(playerName == ""){ playerName = "Võõras"; }
    $.post("server.php?function=save", {name: playerName, score: score, correct: correctAnswers, wrong: wrongAnswers}).done(setTimeout(200));
    
    makeAnimation('#mathExpression');
    makeAnimation('#mathAnswer');
    $('#playerName').remove();
    $('#sendName').remove();
    $('#mathExpression').html(playerName + "! <br>Sinu skoor: " + score);
    $('#answer1Btn').remove();
    $('#answer2Btn').remove();
    $('#answer3Btn').remove();
    createButton('#mathAnswer','Uuesti!', "startGame", "startGame()", "submit");
/*     let arr = [
        {val : 2, text: '2'},
        {val : 3, text: '3'},
        {val : 4, text: '4'},
        {val : 5, text: '5'}
      ];
      
      let sel = $('<select id = "numbersToPlay">').appendTo('#buttons');
      $(arr).each(function() {
       sel.append($("<option>").attr('value',this.val).text(this.text));
      }); */
    showStats();
      

}

//Generate functions
function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

function makeRandom(e){
    let nr = Math.round(Math.random()*e);
    return nr;
}
function createElem(name, className, idName, val, func, type) {
    let elt = document.createElement(name);
    if(type != "text"){
    $(elt).attr({
        type: type,
        class: className,
        id: idName,
        value: val,
        onclick: func
    });
    } else {
        $(elt).attr({
            type: type,
            class: className,
            id: idName,
            placeholder: val,
            value: func
        });
    }
    return elt;
}

function createButton(where, type, idButton, func, types) {
    let button = createElem('input', 'btn', idButton, type, func, types);
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
    if(correctAnswer == nr){
        correctAnswers++;
        nextLevel++;
        if(nextLevel >= 10){
            makeOpacity('#mathExpression');
            makeOpacity('#mathAnswer');
            $('#mathExpression').html("JÄRGMINE TASE!");
            clearInterval(timer);
            $('#answer1Btn').remove();
            $('#answer2Btn').remove();
            $('#answer3Btn').remove();
            setTimeout(function (){
                createButton('#mathAnswer',' ', "answer1Btn", "checkAnswer(this.value)","submit");
                createButton('#mathAnswer',' ', "answer2Btn", "checkAnswer(this.value)","submit");
                createButton('#mathAnswer',' ', "answer3Btn", "checkAnswer(this.value)","submit");
                loop();
                createExpression();
            }, 2000);
            numbersToPlay += 2;
            nextLevel = 0;
        } else {
            createExpression();
        }
        

    } else {
        console.log("Proovi paremini");
        wrongAnswers++;
        if(wrongAnswers >= 5){
            clearInterval(timer);
            askName();
        }
    }
    innerInfoToHTML();
}

function showStats(){
    makeAnimation('#scoreTable');
    $('#scoreTable').html("").append('<table id = "scoreboard">');
    $('#scoreTable').append('<caption>TOP 15</caption><thead><tr><th>Jrk</th><th>Nimi</th><th>Skoor</th><th>Õigeid</th></tr></thead>');
    $.get("server.php?function=data", function (data) {
        content = JSON.parse(data).content;
        let jrk = 0;

        content.forEach(function (detail) {
            jrk++;
            if(playerName == detail.name && score == detail.score && score != 0 && correctAnswers == detail.correct){
                $('#scoreTable').append('<tbody><tr style="color: red;"><td>'+ jrk +'</td><td>'+ detail.name +'</td><td>'+ detail.score +'</td><td>'+ detail.correct +'</td></tr></tbody>');
            } else {
                $('#scoreTable').append('<tbody><tr><td>'+ jrk +'</td><td>'+ detail.name +'</td><td>'+ detail.score +'</td><td>'+ detail.correct +'</td></tr></tbody>');
            }
        });
    });
    setTimeout(function(){ $('#scoreTable').append('</table>'); console.log("ennem"); }, 1000);
    
    
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
            if(wrongAnswers < 4){
                wrongAnswers++;
                firstTime = true;
                createExpression();
            } else {
                clearInterval(timer);
                wrongAnswers++;
                askName();
            }
            innerInfoToHTML();
        } else {
            timerWidth++; 
            $("#myBar").css( "width", timerWidth + "%");
        }
    }
}
function askName(){
    $('#answer1Btn').remove();
    $('#answer2Btn').remove();
    $('#answer3Btn').remove();
    $('#mathExpression').html('Sisesta oma nimi!');
    createButton('#mathAnswer','Sinu nimi', "playerName", playerName, "text");
    createButton('#mathAnswer','Saada!', "sendName", "endGame()", "submit");
}
function makeAnimation(id){
    $(id).css('opacity', '0');
    $(id).animate({
        marginLeft: "-0.15in",
    }, 500 ); 
    $(id).animate({
        opacity: 1,
        marginLeft: "0in",
    }, 500 );
}
function makeOpacity(id){
    //$(id).css('opacity', '0');
    $(id).animate({
        opacity: 0.5,
    }, 1 ); 
    $(id).animate({
        opacity: 1,
    }, 100 );
}
