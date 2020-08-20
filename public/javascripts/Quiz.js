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

/* init global vars */
var timer = new Timer(120, "#timerContainer"); // quiz timer
var questions = 20; // questions remaining
var score = 0; // quiz score
var randomIndices = genRandomIndices(99); // random indices for question generation

console.log(timer);

init();

function Timer(seconds, containerID) { // test timer class

    this.seconds = seconds;
    this.timerHandler;

    this.displayTime = function() {
        var displayMin = Math.floor(this.seconds / 60);
        var displaySec = this.seconds - displayMin * 60;

        if (displaySec < 10) {displaySec = "0" + displaySec; }

        $( containerID ).text("Time: " + displayMin + ":" + displaySec);
    }

    this.start = function() {
        console.log("start");
        this.timerHandler = setInterval(() => {
            this.step();
        }, 1000);
    };

    this.pause = function() {
        console.log("pause");
        clearInterval(this.timerHandler);
    };

    this.done = function() {
        console.log("complete");
        clearInterval(this.timerHandler);
        done();
    };

    this.reset = function() {
        console.log("reset");
        clearInterval(this.timerHandler);
        this.seconds = seconds;
        console.log(this.seconds);
        this.displayTime(this.seconds); // display new time
    };

    this.step = function() {
        console.log("step ", this.seconds);

        this.displayTime(seconds);

        if (this.seconds < 1) {
            this.done();
        }        

        this.seconds--;
    };
}

function init() {
    $( "#controlButton" ).text("Start"); // init controlButton
    console.log("changed text");
    $( "#controlButton" ).click( function() {
        setTimeout(() => { start(); }, 300);
    });
    
    timer.displayTime(); // init info
    $( "#questionsContainer" ).text("Questions: " + questions.toString());
    $( "#scoreContainer" ).text("Score: " + score.toString());
    console.log("changed text");

    nextQuestion(); // init question and hide
    $( "#questionAnswersContainer" ).hide();
}

function start() {
    timer.start();
    console.log("start");
    $( "#controlButton" ).text("Pause"); // change controlButton
    $( "#controlButton" ).off("click");
    $( "#controlButton" ).click( function() {
        setTimeout(() => { pause(); }, 300);
    });

    $( "#questionAnswersContainer").show(); // show question

     // start timer
}

function pause() {

    timer.pause(); // pause timer
    console.log(timer);
    $( "#controlButton" ).text("Resume"); // change controlButton
    $( "#controlButton" ).off("click");
    $( "#controlButton" ).click( function() {
        setTimeout(() => { start(); }, 300);
    });

    $( "#questionAnswersContainer").hide(); // hide question

    
}

function done() {
    alert("Congratulations your final score was: " + score.toString()); // print final score

    timer.reset(); // reset global vars
    questions = 20;
    score = 0;
    randomIndices = genRandomIndices(99);

    var controlButton = // reset controlButton
    // remove click necessary?
    $( "#controlButton" ).text("Start");
    $( "#controlButton" ).off("click");
    $( "#controlButton" ).click( function() {
        setTimeout(() => { start(); }, 300);
    });

    //$( "#timerContainer" ).text(timer.getTime()); // re-init info
    $( "#questionsContainer" ).text("Questions: " + questions.toString());
    $( "#scoreContainer" ).text("Score: " + score.toString());

    nextQuestion(); // reset question and hide
    $( "#questionAnswersContainer").hide(); // hide question
}

async function nextQuestion() { // async as answers data fetched from JSON files
    // next question
    var questionIndex = randomIndices[randomIndices.length-1]; // last index
    var questionSource = "images/" + questionIndex.toString() + ".png";
    $( "#question" ).attr("src", questionSource);

    // next answers
    var answerIndices = [ // last three indices
        randomIndices[randomIndices.length-1],
        randomIndices[randomIndices.length-2],
        randomIndices[randomIndices.length-3]
    ];

    var answerFilenames = [ // JSON filenames
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

    var answerContents = [ // access chemical names in JSONS
        answerJSONS[0]['PC_Compounds']['0']['props']['6']['value']['sval'],
        answerJSONS[1]['PC_Compounds']['0']['props']['6']['value']['sval'],
        answerJSONS[2]['PC_Compounds']['0']['props']['6']['value']['sval']
    ];

    // answer buttons, random button is correct

    var answerAssigner = [ // map correct answer with correct function
        [answerContents[0], correct], // correct answer
        [answerContents[1], wrong],
        [answerContents[2], wrong]
    ];
    
    console.log(answerAssigner);
    
    var shuffledAnswerAssigner = shuffleArray(answerAssigner); // shuffle map

    console.log(shuffledAnswerAssigner);

    
    $( "#answerButtonOne" ).text(shuffledAnswerAssigner[0][0]);
    $( "#answerButtonOne" ).off("click");
    $( "#answerButtonOne" ).click( shuffledAnswerAssigner[0][1] );

    $( "#answerButtonTwo" ).text(shuffledAnswerAssigner[1][0]);
    $( "#answerButtonTwo" ).off("click");
    $( "#answerButtonTwo" ).click( shuffledAnswerAssigner[1][1] );

    $( "#answerButtonThree" ).text(shuffledAnswerAssigner[2][0]);
    $( "#answerButtonThree" ).off("click");
    $( "#answerButtonThree" ).click( shuffledAnswerAssigner[2][1] );
     
}

function correct() {
    // dec, done if 0
    questions--;
    $( "#questionsContainer" ).text("Questions: " + questions.toString());
    if (questions == 0) { return done(); }

    // inc score
    score++;
    $( "#scoreContainer" ).text("Score: " + score.toString());

    // pop indices
    randomIndices.pop();
    randomIndices.pop();
    randomIndices.pop();

    // next question
    nextQuestion();
}

function wrong() {
    // dec questions, done if 0
    questions--;
    $( "#questionsContainer" ).text("Questions: " + questions.toString());
    if (questions == 0) { return done(); }

    // pop indices
    randomIndices.pop();
    randomIndices.pop();
    randomIndices.pop();

    // next question
    nextQuestion();
}

function genRandomIndices(maxVal) { // generate 60 random indices
    var randomIndices = [];
    for (let i = 0; i < 60; i++) {
        let randomIndex = Math.floor(Math.random()*maxVal) + 1;
        randomIndices.push(randomIndex);
    }
    return randomIndices;
}

function shuffleArray(array) { // fisher-yates shuffle
    var m = array.length, t, i;

    while(m) {
        i = Math.floor(Math.random() * m--);

        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}