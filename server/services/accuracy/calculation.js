/**
 * Class handles calculation of a players accuracy
 *
 * @type {AccuracyCalculation}
 */
AccuracyCalculation = class AccuracyCalculation {

    constructor(throws) {
        this.throws = throws;
        this.throws.sort(this.sortThrows);
        this.throws.unshift({x: 0, y: 0, distance: 0});
        this.throws.push({x: 0, y: 0, distance: -1});
    }

    /**
     * Helper method to sort the hits by distance
     *
     * @param a
     * @param b
     * @returns {number}
     */
    sortThrows(a,b) {
        if (a.distance < b.distance) {
            return -1;
        }
        if (a.distance > b.distance) {
            return 1;
        }
        return 0;
    }

    /**
     * Calculates the players accuracy
     *
     * @returns {number}
     */
    calculate() {
        let s = 100;
        let iterations = 100;
        for (let i = 0; i < iterations; i++) {
            s = this.step(s);
        }
        return Math.sqrt(s).toFixed(2);
    }

    step(s) {

        let a = [];

        for (let i = 0; i < this.throws.length - 1; i++) {

            hit = parseFloat(this.throws[i].distance);
            nextHit = parseFloat(this.throws[i + 1].distance);

            a[i] = ((hit*hit+2*s)*Math.exp(-hit*hit/(2*s)) - (nextHit == -1 ? 0 : (nextHit * nextHit+2*s)*Math.exp(-nextHit*nextHit/(2*s)))) /
                (Math.exp(-hit*hit/(2*s)) - (nextHit==-1 ? 0 : Math.exp(-nextHit*nextHit/(2*s))));
        }

        let e = 0;
        let n = this.throws.length - 2;

        for (let i = 1; i < this.throws.length - 1; i++) {
            if (!isNaN(a[i])) {
                e += a[i];
            }
        }

        return e/(2 * n);

    }
};