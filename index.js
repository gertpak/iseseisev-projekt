/*jslint evil: true */
/* jshint esversion:6 */
let timer;
let maxRandom = 20;

let expression;
let correctAnswer;
let playing = false;
let firstTime = true;
let correctAnswers = 0, wrongAnswers = 0;
let mathArray = [];
let numbersToPlay;
let timerWidth = 1;
let score = 0;
let nextLevel;
let playerName = "";
let arrows;
let content;
let pressing;
window.onload = function (){
    makeAnimation('#mathExpression');
    makeAnimation('#mathAnswer');
    makeAnimation('#myProgress');
    
    createButton('#mathAnswer','Alusta!', "startGame", "startGame()", "submit");
    $('#mathExpression').html("Matemaatiline mäng!");
    showStats();

};

function startGame(){
    console.log("mäng algas");
    
    $('#myProgress').css('display', 'block');
    $('#arrows').css('display', 'flex');
    makeOpacity('#mathExpression');
    makeOpacity('#mathAnswer');
    makeOpacity('#scoreTable');
    makeOpacity('#myProgress');
    makeOpacity('#arrows');

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
    window.addEventListener('keydown', arrowAnswer);
    
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
    correctAnswer = roundToTwo(eval($('#mathExpression').html()));

    if(correctAnswer == "Infinity" || isNaN(correctAnswer) == true){
        createExpression(); 
    }
    
    expression = $('#mathExpression').html();

    setValues();
            

}
function arrowAnswer(e){
    if(e.keyCode == 37) {
        checkAnswer($('#answer1Btn').val());
        
    }//Left
    else if(e.keyCode == 40){
        checkAnswer($('#answer2Btn').val());
        
    }//down
    else if(e.keyCode == 39){
        checkAnswer($('#answer3Btn').val());
        
    }//right
}

function setValues(){
    let randomMethod = makeRandom(2);
    let randomAnswer1 = roundToTwo(eval(correctAnswer +  randomSign(makeRandom(3)) + makeRandom(maxRandom)));
    let randomAnswer2 = roundToTwo(eval(correctAnswer +  randomSign(makeRandom(3)) + makeRandom(maxRandom)));
    //console.log(correctAnswer +  randomSign(makeRandom(3)) + makeRandom(maxRandom));
    
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
    console.log("mäng läbi");
    
    playing = false; 
    if(pressing == true){
        window.removeEventListener('keypress', sendToEnd);
    } 
    pressing = false;
    playerName = $('#playerName').val();
    if(playerName == ""){ playerName = "Võõras"; }
    $('#myProgress').css('display', 'none');
    $.post("server.php?function=save", {name: playerName, score: score, correct: correctAnswers, wrong: wrongAnswers}).done(setTimeout(300));
    
    makeAnimation('#mathExpression');
    makeAnimation('#mathAnswer');
    $('#playerName').remove();
    $('#sendName').remove();
    $('#mathExpression').html(playerName  + "! <br>Sinu skoor: " + score);
    $('#answer1Btn').remove();
    $('#answer2Btn').remove();
    $('#answer3Btn').remove();
    createButton('#mathAnswer','Uuesti!', "startGame", "startGame()", "submit");
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
        console.log("õige");
        
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
                arrows = false;
            }, 2000);
            numbersToPlay += 2;
            nextLevel = 0;

        } else {
            createExpression();
            arrows = false;
        }
        

    } else {
        console.log("vale");
        
        if($('#answer1Btn').val() == nr){
            document.querySelector("#answer1Btn").classList.add("bounce");
            setTimeout(function(){ document.querySelector("#answer1Btn").classList.remove("bounce"); }, 1000);
        } else if($('#answer2Btn').val() == nr){
            document.querySelector("#answer2Btn").classList.add("bounce");
            setTimeout(function(){ document.querySelector("#answer2Btn").classList.remove("bounce"); }, 1000);
        } else if($('#answer3Btn').val() == nr){
            document.querySelector("#answer3Btn").classList.add("bounce");
            setTimeout(function(){ document.querySelector("#answer3Btn").classList.remove("bounce"); }, 1000);
        }
        wrongAnswers++;
        if(wrongAnswers >= 5){
            clearInterval(timer);
            window.removeEventListener('keydown', arrowAnswer);
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
        saveInLocalStorage();
    });
    setTimeout(function(){ $('#scoreTable').append('</table>');}, 1000);
    
    
}
function saveInLocalStorage(){
    window.localStorage.setItem('content', JSON.stringify(content));
}
function innerInfoToHTML(){
    $("#correctCount").html(correctAnswers);
    $("#score").html(score);
    $("#wrongCount").html(wrongAnswers + '/5');
}
function loop() {
    timer = setInterval(frame, 70);
    //console.log(timerWidth);
    function frame(){
        if (timerWidth >= 100) {
            document.querySelector("#myProgress").classList.add("bounce");
            setTimeout(function(){ document.querySelector("#myProgress").classList.remove("bounce"); }, 1000);
            if(wrongAnswers < 4){
                wrongAnswers++;
                firstTime = true;
                createExpression();
            } else {
                clearInterval(timer);
                wrongAnswers++;
                window.removeEventListener('keydown', arrowAnswer);
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
    console.log("sisesta nimi");
    $('#answer1Btn').remove();
    $('#answer2Btn').remove();
    $('#answer3Btn').remove();
    makeOpacity('#arrows');
    $('#arrows').css('display', 'none');
    $('#mathExpression').html('Sisesta oma nimi!');
    createButton('#mathAnswer','Sinu nimi', "playerName", playerName, "text");
    createButton('#mathAnswer','Saada!', "sendName", "endGame()", "submit");
    $('#playerName').focus();
    window.addEventListener('keypress', sendToEnd);
    pressing = true;
}
function sendToEnd(e) {
    if(pressing == true){
        if(e.keyCode == 13){
            window.removeEventListener('keypress', sendToEnd); 
            endGame();
            pressing = false;
        } else {
            return;
        }
    }
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
    $(id).animate({
        opacity: 0.5,
    }, 1 ); 
    $(id).animate({
        opacity: 1,
    }, 100 );
}