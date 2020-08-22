/*
Quiz.js
This script generates chemquizr content and mediates user interactions through the quiz
through button clicks.

In this instance ths quiz consists of 20 questions which the user is given two minutes to
answer. Specifically, from 100 chemical images, names, 20 random, unique chemical images are
presented to the user one-by-one, each with three random, unique answer choices, one of which
matches the chemical structure and is the correct answer. 

A Timer class is imported from Timer.js and a timer is constructed for the quiz.

Start, pause, resume methods are defined to allow the user to control the quiz, as
are answer choices and associated correct / wrong answer methods to progress through the
quiz.

Various fields are updated as appropriate as the user interacts with the quiz to
visually indicate present controller methods available to the user, information relevant
to the present quiz session, and generate new questions after answers are selected.

Upon completion of the quiz the user's score from the immediate quiz session is printed as
an alert, and the quiz is reset.
*/

import { Timer } from "/javascripts/Timer.js"; // import timer class

/* initialize global variables */
var timer = new Timer(120, "#timerContainer", finish); // quiz timer
var questions = 20; // quiz questions remaining
var score = 0; // quiz score
var randomIndices = genRandomIndices(99); // 60 random indices (0-99) to access random questions

/* intialize quiz */
init();

/**
 * intialize quiz
 */
function init() {
    /* initialize control button to start */
    $( "#controlButton" ).text("Start"); // display text
    $( "#controlButton" ).click( function() { // add start click method
        setTimeout(() => { start(); }, 100);
    });
    
    /* initialize quiz info */
    timer.displayTime(); // time
    $( "#questionsContainer" ).text("Questions: " + questions.toString()); // display questions remaining
    $( "#scoreContainer" ).text("Score: " + score.toString()); // display score

    /* initialize question */
    newQuestion(); // generate question
    $( "#questionAnswersContainer" ).hide(); // hide question
}

/**
 * start quiz
 */
function start() {
    timer.start(); // start timer

    /* change control button to pause */
    $( "#controlButton" ).text("Pause"); // display text
    $( "#controlButton" ).off("click"); // remove previous click method
    $( "#controlButton" ).click( function() { // add pause click method
        setTimeout(() => { pause(); }, 100);
    });

    $( "#questionAnswersContainer").show(); // show question
}

/**
 * pause quiz
 */
function pause() {
    timer.pause(); // pause timer

    /* change control button to resume */
    $( "#controlButton" ).text("Resume"); // display text
    $( "#controlButton" ).off("click"); // remove previous click method
    $( "#controlButton" ).click( function() { // add start click method
        setTimeout(() => { start(); }, 100);
    });

    $( "#questionAnswersContainer").hide(); // hide question
}

/**
 * finish quiz
 */
function finish() {
    alert("Congratulations your final score was: " + score.toString()); // print final score

    /* reset global variables */
    timer.reset(); // timer
    questions = 20; // questions remaining
    score = 0; // score
    randomIndices = genRandomIndices(99); // random indices to access random questions

    /* reset control button to start */
    $( "#controlButton" ).text("Start"); // display text
    $( "#controlButton" ).off("click"); // remove previous click method
    $( "#controlButton" ).click( function() { // add start click method
        setTimeout(() => { start(); }, 100);
    });

    /* reset quiz info */
    $( "#questionsContainer" ).text("Questions: " + questions.toString()); // display questions remaining
    $( "#scoreContainer" ).text("Score: " + score.toString()); // display score

    /* reset question */
    newQuestion(); // generate new question
    $( "#questionAnswersContainer").hide(); // hide question
}

/**
 * generate new quiz question
 */
async function newQuestion() { // async as answers data fetched from JSON files
    /* generate new question */
    var questionIndex = randomIndices[randomIndices.length-1]; // last random index
    var questionSource = "images/" + questionIndex.toString() + ".png"; // build question source path string
    $( "#question" ).attr("src", questionSource); // update question source path
    
    /* generate three new answers */

    /* get answers data */
    var answerIndices = [ // last random indices
        randomIndices[randomIndices.length-1],
        randomIndices[randomIndices.length-2],
        randomIndices[randomIndices.length-3]
    ];

    var answerFilenames = [ // build answer source path strings
        "jsons/" + answerIndices[0] + ".json",
        "jsons/" + answerIndices[1] + ".json",
        "jsons/" + answerIndices[2] + ".json"
    ];

    var answerResponses = await Promise.all([ // fetch JSON files
        fetch(answerFilenames[0]),
        fetch(answerFilenames[1]),
        fetch(answerFilenames[2])
    ]);

    var answerJSONS = await Promise.all([ // resolve JSON responses
        answerResponses[0].json(),
        answerResponses[1].json(),
        answerResponses[2].json()
    ]);

    var answerContents = [ // access chemical names in JSON files
        answerJSONS[0]['PC_Compounds']['0']['props']['6']['value']['sval'],
        answerJSONS[1]['PC_Compounds']['0']['props']['6']['value']['sval'],
        answerJSONS[2]['PC_Compounds']['0']['props']['6']['value']['sval']
    ];

    /* update answers */
    var answerAssigner = [ // build array associating chemical names with appropriate onCorrect / onWrong methods
        [answerContents[0], onCorrect], // correct answer
        [answerContents[1], onWrong],
        [answerContents[2], onWrong]
    ];
    
    var shuffledAnswerAssigner = shuffleArray(answerAssigner); // shuffle association array

    /* assign each answer button random chemical name / method pair */
    $( "#answerButtonOne" ).text(shuffledAnswerAssigner[0][0]); // update chemical name
    $( "#answerButtonOne" ).off("click"); // remove previous click method
    $( "#answerButtonOne" ).click( shuffledAnswerAssigner[0][1] ); // add chemical name-associated click method

    $( "#answerButtonTwo" ).text(shuffledAnswerAssigner[1][0]); // repeat...
    $( "#answerButtonTwo" ).off("click");
    $( "#answerButtonTwo" ).click( shuffledAnswerAssigner[1][1] );

    $( "#answerButtonThree" ).text(shuffledAnswerAssigner[2][0]);
    $( "#answerButtonThree" ).off("click");
    $( "#answerButtonThree" ).click( shuffledAnswerAssigner[2][1] );

    /* remove random indices used for question */
    randomIndices.pop();
    randomIndices.pop();
    randomIndices.pop();
}

/**
 * on correct answer
 */
function onCorrect() {
    /* update questions remaining */
    questions--; // dec questions remaining
    $( "#questionsContainer" ).text("Questions: " + questions.toString()); // update questions remaining display
    if (questions == 0) { return finish(); } // if 0 questions remaining, finish quiz

    /* update score */
    score++; // inc score
    $( "#scoreContainer" ).text("Score: " + score.toString()); // update score display

    /* generate new question */
    newQuestion();
}

/**
 * on wrong answer
 */
function onWrong() {
    /* update questions remaining */
    questions--; // dec questions remaining
    $( "#questionsContainer" ).text("Questions: " + questions.toString()); // update questions remaining display
    if (questions == 0) { return finish(); } // if 0 questions remaining, finish quiz

    /* generate new question */
    newQuestion();
}

/**
 * helper method to generate 60 random indices for random question access
 * @param {int} maxVal 
 */
function genRandomIndices(maxVal) {
    var randomIndices = [];

    for (let i = 0; i < 60; i++) {
        let randomIndex = Math.floor(Math.random()*maxVal) + 1;
        randomIndices.push(randomIndex);
    }

    return randomIndices;
}

/**
 * helper method to shuffle array for random answer display based on fisher-yates method
 * @param {array} array 
 */
function shuffleArray(array) {
    var m = array.length, t, i;

    while(m) {
        i = Math.floor(Math.random() * m--);

        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}