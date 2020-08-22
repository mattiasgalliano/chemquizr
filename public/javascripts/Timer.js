/*
Timer.js
Timer class provides timing functionality to quiz scripy. Class constructed with starting seconds,
container id, and method to execute on timer completion; seconds == 0.
*/

export { Timer }; // export timer class

function Timer(seconds, containerID, finish) {

    this.seconds = seconds; // running seconds
    this.containerID = containerID // container to display time
    this.finish = finish // method to execute on timer finish
    this.timerHandler; // handler for set interval

    /**
     * convert running seconds to display time and display in container
     */
    this.displayTime = function() {
        var displayMin = Math.floor(this.seconds / 60);
        var displaySec = this.seconds - displayMin * 60;

        if (displaySec < 10) {displaySec = "0" + displaySec; }

        $( containerID ).text("Time: " + displayMin + ":" + displaySec);
    }

    /**
     * start timer by setting handler
     */
    this.start = function() {
        this.timerHandler = setInterval(() => {
            this.step();
        }, 1000);
    };

    /**
     * pause timer by clearing handler interval
     */
    this.pause = function() {
        clearInterval(this.timerHandler);
    };

    /**
     * reset timer by clearing handler interval, reset running seconds
     * to initial passed seconds, display new time
     */
    this.reset = function() {
        clearInterval(this.timerHandler);
        this.seconds = seconds;
        this.displayTime(this.seconds);
    };

    /**
     * step function to be executed by handler every 1000 ms. display
     * time, execute finish method if running seconds < 1, dec running
     * seconds
     */
    this.step = function() {
        this.displayTime(seconds);

        if (this.seconds < 1) {
            finish();
        }        

        this.seconds--;
    };
}

