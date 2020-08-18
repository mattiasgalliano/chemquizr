/*
this program generates chemquizr content and mediates user interactions with the quiz.

the quiz consists of 20 quesions which the user has 2 minutes to answer.

start, pause, resume buttons are placed in a container and show / hide the quiz content
and pause / run the quiz timer appropriately.

a timer object in its own container is set to two minutes for the duration of the quiz.

stats (number answers correct, number answers remaining) are placed in unique containers
and updated accordingly as the user interacts with the quiz.

questions (chemical images as png files) are placed in a unique container and updated as the user
proceeds through the quiz.

answers (chemical names as buttons) are placed in a unique container and updated as the user
proceeds through the quiz. clicking the buttons which represent either correct or incorrect
answers in relation to the question (image) modifies the quiz stats accordingly.

upon completion of the quiz a pop up window prints the users score.
*/

/* intantiate global timer div container and timer */
var timerBox;
var quizTimer;

/**
 * builds timer object for use in quiz
 * @param {int} initialCount 
 * @param {html element} container 
 */
function returnTimer(seconds, containerID) { // change to class

    var initialSeconds = seconds;
    var timerHandler;

    console.log("init secs are " + initialSeconds);

    obj = {};

    obj.init = function() {
        console.log("init");
        var timerHandler;
        seconds = initialSeconds;
        displayTime(initialSeconds, containerID);
    }

    obj.start = function() {
        console.log("start");
        timerHandler = setInterval(obj.step, 1000);
    }

    obj.pause = function() {
        console.log("pause");
        clearInterval(timerHandler);
    }

    obj.resume = function() {
        console.log("resume");
        timerHandler = setInterval(obj.step, 1000);
    }

    obj.complete = function() {
        console.log("complete");
        finishQuiz();
    }

    obj.reset = function() {
        clearInterval(timerHandler);
        second = initialSeconds;
    }

    obj.step = function() {

        if (seconds < 1) {
            clearInterval(timerHandler);
            obj.complete();
            return obj;
        }

        seconds--;
        displayTime(seconds, containerID);
    }

    function displayTime(displaySeconds, containerID) {

        var time = displaySeconds;
        var m = Math.floor(time/60);
        var s = (function() {
            let temp = time - m*60;
            if (temp < 10) {return ("0" + temp.toString());}
            else {return temp.toString();}
        })();
        m = m.toString();

        time = ("Time: " + m + ":" + s);

        $( "#" + containerID ).text(time);
        console.log("displaying..." + displaySeconds + " seconds");
        return;
    }

    return obj;
}

/* quiz */
/**
 * Initialize start button. Generate button box container and start button
 * @param {} containerID 
 */
function initializeStartButton(containerID) {
    let buttonBox = // define buttonBox container
    $("<div/>", {
        class: "container",
        id: "buttonBox"
    });
    
    $( "#" + containerID).append(buttonBox); // append buttonBox

    let startButton = // define startButton button
    $("<button/>", {
        class: "btn btn-light",
        id: "startButton",
        text: "Start",
        click: function () { startQuiz(); }
    });
    
    $( buttonBox ).append(startButton); // append startButton
}

/**
 * Replace start button with pause button
 * @param {*} containerID 
 */
function replaceStartButton(containerID) { // replace start button with pause button
    $( "#startButton" ).remove(); // remove startButton

    let pauseButton = // build pause button
    $('<button/>', {
        class: "btn btn-light",
        id: "pauseButton",
        text: "Pause",
        click: function () { pauseQuiz(); }
    });

    $( "#" + containerID ).append( pauseButton ); // append pause
}

/**
 * build start button as child of parent node
 * @param {html element} parent 
 */
function initializeQuiz() {

    

    /* start button */
    initializeStartButton("quizBox"); // initialize start button

    /* info box */
    let infoBox = [ // 1x5 info box container
        '<div class="container py-4" id="infoBox">',
            '<div class="row">',
                '<div class="col-sm"></div>',
                '<div class="col-sm" id="timerBox"></div>', // timer box container
                '<div class="col-sm" id="questionsBox"></div>', // questions remaining box container
                '<div class="col-sm" id="scoreBox"></div>', // score box container
                '<div class="col-sm"></div>',
            '</div>',
        '</div>'
    ];
    $( infoBox.join('')).appendTo( "#quizBox" ); // append info box

    /* info box items */
    let timer = // build timer container
    $("<div/>", {
        class: "container",
        id: "timer"
    });

    $( "#timerBox" ).append( timer ); // append timer container

    quizTimer = returnTimer(12, "timer"); // build timer in timer container

    quizTimer.init(); // initialize timer

    let questions = // build questions remaining container
    $("<div/>", {
        class: "container",
        id: "questions",
    });
    $( questions ).data('value', '20'); // init questions remaining data-value
    let questionsInitString = "Questions: " + questions.data('value'); // build init questions remaining text
    $( questions ).text(questionsInitString); // init questions remaining text
    $( "#questionsBox" ).append( questions ); // append questions remaining container

    let score = // build score container
    $("<div/>", { // init
        class: "container",
        id: "score",
    });
    $( score ).data('value', '0'); // init score data-value
    let scoreInitString = "Score: " + score.data('value'); // build init score text
    $( score ).text(scoreInitString); // init score text
    $( "#scoreBox" ).append( score ); // append score container
}

/**
 * start quiz
 * @param {html element} parent 
 */
function startQuiz() {

    var randomIndices = generateRandomIndices(98); // generate 60 random indices <= 98
    console.log("set new indices... last..." + randomIndices[randomIndices.length-1]);

    quizTimer.start(); // start timer box

    replaceStartButton("buttonBox"); // replace start button with pause button

    /* questionanswerbox */
    let questionAnswerBox = [ // 5x9 question answer box container
        '<div class="container py-2" id="questionAnswerBox">',
            '<div class="row align-items-center">',
                '<div class="col" id="answerBox">',
                    '<div class="row" id="answerOne"/></div>',
                    '<div class="row" id="answerTwo"/></div>',
                    '<div class="row" id="answerThree"/></div>',
                '</div>',
                '<div class="col" id="questionBox"></div>',
            '</div>',
        '</div>',
    ];
    $( questionAnswerBox.join('')).appendTo( "#quizBox" ); // append question answer box

    generateQuestion(randomIndices); // generate questions

    generateAnswers(randomIndices); // generate answers
}

function replaceStartButton(containerID) { // replace start button with pause button
    $( "#startButton" ).remove(); // remove start

    let pauseButton = // build pause
    $('<button/>', {
        class: "btn btn-light",
        id: "pauseButton",
        text: "Pause",
        click: function () { pauseQuiz(); }
    });

    $( "#" + containerID ).append( pauseButton ); // append pause
}

/**
 * pause quiz
 * @param {html element} parent 
 */
function pauseQuiz() {
    console.log("paused");

    quizTimer.pause(); // pause timer

    replacePauseButton("buttonBox"); // replace pause button with resume button

    $( "#questionAnswerBox" ).hide(); // hide question and answers
}

function replacePauseButton(containerID) { // replace pause button with resume button
    $( "#pauseButton" ).remove(); // remove pause

    let resumeButton = // build resume
    $('<button/>', {
        class: "btn btn-light",
        id: "resumeButton",
        text: "Resume",
        click: function () { resumeQuiz(); }
    });

    $( "#" + containerID ).append( resumeButton ); // append resume
}

function replaceResumeButton(containerID) { // replace resume button with pause button
    $( "#resumeButton" ).remove(); // remove resume

    let pauseButton = // build pause
    $('<button/>', {
        class: "btn btn-light",
        id: "pauseButton",
        text: "Pause",
        click: function () { pauseQuiz(); }
    });

    $( "#" + containerID ).append( pauseButton ); // append pause
}

/**
 * resume quiz
 * @param {html element} parent 
 */
function resumeQuiz() {
    console.log("resumed");

    quizTimer.resume(); // resume timer

    replaceResumeButton("buttonBox"); // replace resume button with pause button

    $( "#questionAnswerBox" ).show(); // show question and answers
}

/**
 * finish quiz
 */
function finishQuiz() {

    /* increment score */
    let score = ($( "#score" ).data('value')); // get current score
    alert("Congratulations your score was: " + score);

    quizTimer.reset();


    $( "#buttonBox" ).remove();
    $( "#infoBox" ).remove();
    $( "#questionAnswerBox").remove();

    initializeQuiz();
    return;
}

/**
 * generate stats as children of stats div container
 * @param {html element} parent 
 */
function generateInfo(containderID) {
    /* build number correct counter element */
    let questions =
    $("<div/>", { // init
        class: "container",
        id: "questions",
    });
    $( questions ).data('value', '20'); // init data
    console.log(questions);
    console.log($( questions ).data('value'));
    let questionsInitString = "Questions: " + questions.data('value'); // build init text
    $( questions ).text(questionsInitString); // init text
    
    console.log($( questions ).text());

    $( "#questionsBox" ).append( questions ); // append
    

    /* build number remaining counter element */
    let numberRemaining = '<div class="div" type="div" id="numberRemaining" value="0">test</div>';

    $( numberRemaining ).appendTo( "#remainingBox" );
}

/**
 * generate question element (img) as child of question div container
 * with random indices
 * @param {html element} parent 
 * @param {int list} randomIndices 
 */
function generateQuestion(randomIndices) {
    let index = randomIndices[randomIndices.length-1]; // get last index

    let qString = String.raw`<img src="images/` + index + String.raw`.png" class="img-fluid rounded" id = "question" alt="Responsive image" />`; // build jQuery string w index

    console.log("qstring " + qString);

    $( "#questionBox" ).append( qString );
}

/**
 * generate answer elements (buttons) as children of answer div container
 * with random indices
 * @param {html element} parent 
 * @param {int list} randomIndices 
 */
async function generateAnswers(randomIndices) {
    let indices = [ // get last three indices
        randomIndices[randomIndices.length-1],
        randomIndices[randomIndices.length-2],
        randomIndices[randomIndices.length-3]
    ];

    console.log("last index is " + indices[0]);

    let filenames = [ // use indices to build json filenames
        "jsons/" + indices[0] + ".json",
        "jsons/" + indices[1] + ".json",
        "jsons/" + indices[2] + ".json"
    ];


    let responses = await Promise.all([ // fetch json files
        fetch(filenames[0]),
        fetch(filenames[1]),
        fetch(filenames[2])
    ]);

    let jsons = await Promise.all([ // resolve fetch promises
        responses[0].json(),
        responses[1].json(),
        responses[2].json()        
    ]);

    let answers = [ // access chemical names in json files
        jsons[0]['PC_Compounds']['0']['props']['6']['value']['sval'],
        jsons[1]['PC_Compounds']['0']['props']['6']['value']['sval'],
        jsons[2]['PC_Compounds']['0']['props']['6']['value']['sval']
    ];

    displayAnswers(answers, randomIndices) // build buttons with chemical names
}

/**
 * build answer buttons with chemical names and add as children to answer div container
 * @param {html element} parent 
 * @param {string list} answers 
 * @param {int list} randomIndices 
 */
function displayAnswers(answers, randomIndices) {

    //$( "<p>a1</p>" ).appendTo( "#answerBox" );
    //$( "<p>a2</p>" ).appendTo( "#answerBox" );
    //$( "<p>a3</p>" ).appendTo( "#answerBox" );
    /*
    /* build answer buttons */

    let answerButtonOne =
    $("<button/>", {
        class: "btn btn-light py-2",
        id: "answerButtonOne",
        text: answers[0],
        click: function () { correctAnswer(randomIndices); }
    });

    let answerButtonTwo =
    $("<button/>", {
        class: "btn btn-light py-2",
        id: "answerButtonTwo",
        text: answers[1],
        click: function () { wrongAnswer(randomIndices); }
    });

    let answerButtonThree =
    $("<button/>", {
        class: "btn btn-light py-2",
        id: "answerButtonThree",
        text: answers[2],
        click: function () { wrongAnswer(randomIndices); }
    });

    console.log(answerButtonOne);

    /* append to answer div container in random order */
    let answerButtons = [answerButtonOne, answerButtonTwo, answerButtonThree]; // build list with answer buttons

    let randomIndexOne = Math.floor(Math.random()*3); // create random index 0-2

    $( "#answerOne" ).append(answerButtons.splice(randomIndexOne, 1)[0]) // append random from first random index

    let randomIndexTwo = Math.floor(Math.random()*2); // create random index 0-1

    $( "#answerTwo" ).append(answerButtons.splice(randomIndexTwo, 1)[0]); // append random from second random index

    $( "#answerThree" ).append(answerButtons.pop()); // append last
}

/**
 * if correct answer chosen, modify stats, step through quiz
 * @param {html element} parent 
 * @param {int list} randomIndices 
 */
function correctAnswer(randomIndices) {

    /* increment score */
    let score = ($( "#score" ).data('value')); // get current questions
    score++; // increment
    $( "#score" ).data('value', score.toString()); // update data-value
    let scoreString = "Score: " + score.toString(); // build updated text
    $( "#score" ).text(scoreString); // update text

    /* decrement questions */
    let questions = ($( "#questions" ).data('value')); // get current questions
    questions--; // decrement
    $( "#questions" ).data('value', questions.toString()); // update data-value
    let questionsString = "Questions: " + questions.toString(); // build updated text
    $( "#questions" ).text(questionsString); // update text
    if (questions == 0) {return finishQuiz();} // if 0 finish
    else {
            randomIndices.pop(); // pop three indices to access new questions, answers
            randomIndices.pop();
            randomIndices.pop();

            nextQuestion(randomIndices); // generate next question
            nextAnswers(randomIndices); // generate next answers
    }
}

/**
 * if wrong answer, modify stats, step through quiz
 * @param {html element} parent 
 * @param {int list} randomIndices 
 */
function wrongAnswer(randomIndices) {

    /* decrement questions */
    let questions = ($( "#questions" ).data('value')); // get current questions
    questions--; // decrement
    $( "#questions" ).data('value', questions.toString()); // update data-value
    let questionsString = "Questions: " + questions.toString(); // build updated text
    $( "#questions" ).text(questionsString); // update text
    if (questions == 0) {return finishQuiz();} // if 0 finish
    else {
            randomIndices.pop(); // pop three indices to access new questions, answers
            randomIndices.pop();
            randomIndices.pop();

            nextQuestion(randomIndices); // generate next question
            nextAnswers(randomIndices); // generate next answers
    }
}

/**
 * generate next question
 * @param {int list} randomIndices 
 */
function nextQuestion(randomIndices) {
    /* remove old question child from parent container */
    $( "#question" ).remove(); // remove question

    generateQuestion(randomIndices);
}

/**
 * generate next answers
 * @param {int list} randomIndices 
 */
function nextAnswers(randomIndices) {
    /* remove old answer children from parent container */
    $( "#answerButtonOne" ).remove();
    $( "#answerButtonTwo" ).remove();
    $( "#answerButtonThree" ).remove();

    generateAnswers(randomIndices);
}

/**
 * generate 60 random indices <= max value
 * @param {int} max 
 */
function generateRandomIndices(max) {
    let randomIndices = [];
    for (let i = 0; i < 60; i++) {
        let randomIndex = Math.floor(Math.random()*max) + 1;
        randomIndices.push(randomIndex);
    }
    return randomIndices;
}

/* run quiz program */
let quizBox = document.getElementById("quizBox"); // select parent node
console.log(quizBox);

$( ".quizBox" ).append( "<p>Test</p>");
console.log("success?");

initializeQuiz(quizBox); // intialize quiz under parent node

