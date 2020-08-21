export { Timer };

function Timer(seconds, containerID, onComplete) { // test timer class

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
            console.log("done");
            //this.reset();
            onComplete();
        }        

        this.seconds--;
    };
}

