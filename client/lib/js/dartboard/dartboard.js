/**
 * Class to draw a dartboard as a html5 canvas and mark hits by clicking on the board
 *
 * @param htmlContainer - the html container the canvas is wrapped in
 * @param canvasContainer - the <canvas/> element
 * @param callbackFunction - a optional callback. being called after every throw
 *
 * @author Magnus Buk <MagnusBuk@gmx.de>
 */
Dartboard = function (htmlContainer, canvasContainer, callbackFunction) {

    /**
     * The html container of the canvas element
     */
    this.htmlContainer = htmlContainer;

    /**
     * the canvas container
     */
    this.canvasContainer = canvasContainer;

    /**
     * Optional callback method to provide statistical data to external consumers
     */
    this.callback = callbackFunction;

    /**
     * The canvas element
     *
     * @type {CanvasRenderingContext2D}
     */
    this.canvas = null;

    /**
     * Distance in mm from the center position to the boards edge
     *
     * @type {number}
     */
    this.distBoardEdge = 224;

    /**
     * Distance in mm from the center position to the outer double circle
     *
     * @type {number}
     */
    this.distOuterDouble = 169;

    /**
     * Distance in mm from the center position to the inner double circle
     * @type {number}
     */
    this.distInnerDouble = 160;

    /**
     * Distance in mm from the center position to the outer triple circle
     *
     * @type {number}
     */
    this.distOuterTriple = 107;

    /**
     * Distance in mm from the center position to the inner triple circle
     * @type {number}
     */
    this.distInnerTriple = 96;

    /**
     * Distance in mm from the center position to the single bull circle
     * @type {number}
     */
    this.distSingleBull = 17;

    /**
     * Distance in mm from the center position to the bulls eye circle
     *
     * @type {number}
     */
    this.distDoubleBull = 7;

    /**
     * Increase factor to increase size of the dartboard
     *
     * @type {number}
     */
    this.increaseFactor = 2;

    /**
     * init() called?
     *
     * @type {boolean}
     */
    this.initCalled = false;

    /**
     * draw() called?
     */
    this.boardDrawn = false;

    /**
     * Width of the html container element
     *
     * @type {number}
     */
    this.width = 0;

    /**
     * Height of the html container element
     *
     * @type {number}
     */
    this.height = 0;

    /**
     * The amount of currently thrown darts
     *
     * @type {number}
     */
    this.thrownDarts = 0;

    /**
     * Coordinates of the dartboard center
     * @type {Array}
     */
    this.coordinatesCenter = [];

    /**
     * Default values
     */
    this.defaultHitAmounts = {
        'BULLSEYE': 0,
        'SINGLEBULL': 0,
        'INNERSINGLE': 0,
        'TRIPLE': 0,
        'OUTERSINGLE': 0,
        'DOUBLE': 0,
        'MISSEDSCORES': 0,
        'MISSEDBOARD': 0
    };

    /**
     * Stores all scores
     *
     * @type {Array}
     */
    this.scores = [];

    /**
     * Stores positional data of all hits
     *
     * @type {Array}
     */
    this.hits = [];

    /**
     * Hit amounts grouped by area
     */
    this.hitAmounts = {};

    /**
     * The board numbers in clockwise direction starting with 20
     * @type {number[]}
     */
    this.boardNumbers = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

    /**
     * If set to true the dartboard will automatically size to its containers width
     * @type {boolean}
     */
    this.manuallyScaledScale = false;

    /**
     * Define fields with their angle periods to evaluate the hit number
     *
     * @type {*[]}
     */
    this.angles = [
        [-99.01, -81], // 20
        [-81, -63], // 1
        [-63, -44.98], // 18
        [-44.98, -26.97], // 4
        [-26.97, -8.98], // 13
        [-8.98, 9.02], // 6
        [9.02, 27.03], // 10
        [27.03, 45.03], // 15
        [45.03, 63.04], // 2
        [63.04, 81.02], // 17
        [81.02, 99.00], // 3
        [99.00, 116.98], // 19
        [116.98, 134.98], // 7
        [134.98, 152.98], // 16
        [152.98, 170.96], // 8
        [170.96, -171.04], // 11
        [-171.04, -153.03], // 14
        [-153.03, -135.03], // 9
        [-135.03, -117.02], // 12
        [-117.02, -99.01] // 5
    ];

    this.manualScale = function (width) {
        this.manuallyScaledScale = true;
        this.increaseFactor = ((width / this.distBoardEdge) * 0.5).toFixed(2);
    };

    /**
     * Initial calculations
     */
    this.init = function () {

        this.initCalled = true;

        // Calculate the height and width of our html container
        this.width = this.height = 2 * (this.increaseFactor * this.distBoardEdge);

        // Set the coordinates of the dartboard center point
        this.coordinatesCenter = [
            Math.round(this.width / 2), // X
            Math.round(this.width / 2) // Y
        ];

        this.canvas = this.canvasContainer.getContext("2d");

        var ref = this;

        // Handle the click event in the hit function
        this.canvasContainer.addEventListener("click", function (e) {
            ref.hit(e);
        });

        this.resetHitAmounts();

        // Site the html container and the canvas element to fit into the given dimensions
        this.sizeElements();
    };

    /**
     * Set the width properties to the html container and canvas element
     */
    this.sizeElements = function () {
        if (this.initCalled) {
            this.htmlContainer.style.width = this.width + "px";
            this.htmlContainer.style.height = this.height + "px";
            this.canvasContainer.width = this.width;
            this.canvasContainer.height = this.height;
        }
    };

    /**
     * Draws the dartboard
     */
    this.draw = function () {
        if (!this.initCalled) {
            alert('Please call the init() method before you start with the dartboard drawing!');
        } else {
            this.drawCircles();
            this.drawLines();
            this.drawNumbers();
            this.boardDrawn = true;
        }
    };

    /**
     * Draws the circles of the dartboard
     */
    this.drawCircles = function () {
        var data = [
            [
                "#000000",
                this.distBoardEdge
            ],
            [
                "#bb0a02",
                this.distOuterDouble
            ],
            [
                "#ffffff",
                this.distInnerDouble
            ],
            [
                "#069136",
                this.distOuterTriple
            ],
            [
                "#fdf6ae",
                this.distInnerTriple
            ],
            [
                "#069136",
                this.distSingleBull
            ],
            [
                "#bb0a02",
                this.distDoubleBull
            ]
        ];
        for (var i = 0; i < data.length; i++) {
            this.canvas.beginPath();
            this.canvas.fillStyle = data[i][0];
            this.canvas.arc(this.coordinatesCenter[0], this.coordinatesCenter[1], (this.increaseFactor * data[i][1]), 0, 2 * Math.PI);
            this.canvas.fill();
            this.canvas.closePath();
        }
    };

    /**
     * Draws the lines of the dartboard
     */
    this.drawLines = function () {

        var outerDouble = this.increaseFactor * this.distBoardEdge;
        var singleBull = this.increaseFactor * this.distSingleBull;
        this.canvas.lineHeight = 1;

        // We have to draw 20 lines (10 * 2)
        for (var i = 0; i < 10; i++) {

            var th = Math.PI * 11 / 20 - i * Math.PI / 10;

            // As we have to interrupt the line to not cross the bull fields draw 2 separate lines
            for (var j = 0; j <= 1; j++) {

                // Draw the first part of the line until the single bull circle
                var startPoint = [
                    Math.round((outerDouble - 1) + (outerDouble * Math.cos((0 == j) ? th : th + Math.PI))), // X
                    Math.round((outerDouble + 1) - (outerDouble * Math.sin((0 == j) ? th : th + Math.PI))) // Y
                ];

                var endPoint = [
                    Math.round((outerDouble - 1) + singleBull * Math.cos((0 == j) ? th : th + Math.PI)), // X
                    Math.round((outerDouble + 1) - singleBull * Math.sin((0 == j) ? th : th + Math.PI)) // Y
                ];

                this.canvas.beginPath();
                this.canvas.moveTo(startPoint[0], startPoint[1]);
                this.canvas.lineTo(endPoint[0], endPoint[1]);
                this.canvas.stroke();
                this.canvas.closePath();
            }

        }
    };

    /**
     * Draws the numbers into the areas
     */
    this.drawNumbers = function () {

        this.canvas.fillStyle = "#ffffff";
        this.canvas.font = 30 * this.increaseFactor + "px Arial";

        // Numbers with their positions
        var data = [
            [20, 205, 50], [1, 270, 55], [18, 315, 80], [4, 365, 125],
            [13, 390, 180], [6, 400, 235], [10, 390, 295], [15, 365, 345], [2, 325, 390],
            [17, 260, 415], [3, 215, 430], [19, 145, 415], [7, 100, 390],
            [16, 50, 345], [8, 40, 295], [11, 15, 235], [14, 20, 180],
            [9, 60, 125], [12, 85, 80], [5, 155, 55]
        ];

        this.canvas.beginPath();
        for (var i = 0; i < data.length; i++) {
            this.canvas.fillText(data[i][0], (this.increaseFactor * data[i][1]), (this.increaseFactor * data[i][2]));
        }
        this.canvas.closePath();
    };

    /**
     * Marks a hit on the dartboard and evaluates the hit field/score
     *
     * @param e
     */
    this.hit = function (e) {

        if (!this.boardDrawn) {
            return false;
        }

        this.thrownDarts++;

        this.canvas.beginPath();
        this.canvas.fillStyle = "#00ccff";
        this.canvas.arc(e.layerX, e.layerY, 2, 0, 2 * Math.PI);
        this.canvas.fill();
        this.canvas.closePath();

        // Now we'll calculate the distance between the center of the board and the hit
        var middle = [
            this.coordinatesCenter[0],
            this.coordinatesCenter[1]
        ];

        var hit = [
            e.layerX,
            e.layerY
        ];

        // get distance in mm between hit point and center
        var d =
            Math.round(
                Math.sqrt((Math.pow(middle[0] - hit[0], 2) + Math.pow(middle[1] - hit[1], 2)))
            ) / this.increaseFactor;

        var number = this.getField(e.layerX, e.layerY, d);
        var score = this.getScore(d, number);

        this.hits.push({
            x: hit[0].toFixed(0),
            y: hit[1].toFixed(0),
            distance: d
        });

        this.scores.push(score);

        this.notify();

    };

    /**
     * Calculates the scores field of the current hit
     *
     * @param x
     * @param y
     * @param distance distance between x and y
     */
    this.getField = function (x, y, distance) {
        // First check for single bull, bullseye or 0
        if (distance <= this.distDoubleBull) {
            return 50;
        } else if (distance <= this.distSingleBull) {
            return 25;
        } else if (distance > this.distOuterDouble) {
            return 0;
        } else {
            var cY = y - this.coordinatesCenter[1];
            var cX = x - this.coordinatesCenter[0];
            var r = Math.atan2(cY, cX);
            var deg = r * 180 / Math.PI;
            for (var i = 0; i < this.angles.length; i++) {
                var from = this.angles[i][0];
                var to = this.angles[i][1];
                if (deg >= from && deg < to) {
                    return this.boardNumbers[i];
                }
            }
            // No match until here? Then it must be 11
            return 11;
        }
    };

    /**
     * Get the score of the current throw/hit
     *
     * @param distance
     * @param field
     */
    this.getScore = function (distance, field) {
        if (distance <= this.distDoubleBull) {
            this.hitAmounts.BULLSEYE++;
            return {field: 25, multiplier: 2, score: 50, fieldName: "Bullseye", fieldType: 'D'};
        } else if (distance <= this.distSingleBull) {
            this.hitAmounts.SINGLEBULL++;
            return {field: 25, multiplier: 1, score: 25, fieldName: "Single Bull", fieldType: 'S'};
        } else if (distance <= this.distInnerTriple) {
            this.hitAmounts.INNERSINGLE++;
            return {field: field, multiplier: 1, score: field, fieldName: "S" + field, fieldType: 'S'};
        } else if (distance <= this.distOuterTriple) {
            this.hitAmounts.TRIPLE++;
            return {field: field, multiplier: 3, score: field * 3, fieldName: "T" + field, fieldType: 'T'};
        } else if (distance <= this.distInnerDouble) {
            this.hitAmounts.OUTERSINGLE++;
            return {field: field, multiplier: 1, score: field, fieldName: "S" + field, fieldType: 'S'};
        } else if (distance <= this.distOuterDouble) {
            this.hitAmounts.DOUBLE++;
            return {field: field, multiplier: 2, score: field * 2, fieldName: "D" + field, fieldType: 'D'};
        } else if (distance <= this.distBoardEdge) {
            this.hitAmounts.MISSEDSCORES++;
            return {score: 0, fieldName: "Missed Scores", fieldType: 'N'};
        } else {
            this.hitAmounts.MISSEDBOARD++;
            return {score: 0, fieldName: "Missed Board", fieldType: 'N'};
        }
    };

    /**
     * Call callback method (if given)
     */
    this.notify = function () {
        if ('function' === typeof this.callback) {
            var lastScore = this.scores[this.scores.length - 1];
            var lastPosition = this.hits[this.hits.length - 1];
            this.callback(this.hitAmounts, this.thrownDarts, this.scores, lastScore, lastPosition);
        }
    };

    /**
     * Redraws the dartboard and resets statistics
     */
    this.reset = function () {
        // Remove canvas
        this.canvas.beginPath();
        this.canvas.clearRect(0, 0, this.width, this.height);
        this.canvas.closePath();
        // Redraw the dartboard!
        this.thrownDarts = 0;
        this.scores = [];
        this.hits = [];
        this.resetHitAmounts();
        this.draw();
    };

    /**
     * Method to reset the hit amounts
     */
    this.resetHitAmounts = function () {
        // Quick n dirty solution to clone an object
        this.hitAmounts = JSON.parse(JSON.stringify(this.defaultHitAmounts));
    };
};