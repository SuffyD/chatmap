'use strict';
const CityData = require('../CityData');
const ViewerData = require('./ViewerData')
const chart_mod = require('./chart');
const TooltipManager = require('./tooltip');


module.exports = class {

    #cityData = null;
    #viewerData = null;
    #chart = null;
    #tip = null;
    #newTip = false;

    constructor() {
        return (async () => {
            this.#cityData = await new CityData();
            this.#viewerData = new ViewerData(this.#cityData);
            this.#chart = chart_mod.create();
            this.#tip = new TooltipManager(this.#chart);
            return this;
        })();
    }

    addViewer(cityName) {
        if (!this.#cityData.exists(cityName)) {
            console.log(`Undefined city "${cityName}"!`);
            return;
        }

        this.#viewerData.addViewer(cityName);
        this.#newTip = true;
    }

    update() {
        window.rawData = this.#viewerData.generate();
        this.#chart.setOption({
            dataset: {
                source: window.rawData
            }
        });
        if (this.#newTip == true) {
            this.#tip.show(this.#viewerData.lastAddedIndex);
            this.#newTip = false;
        }
    }

    backup() {
        return this.#viewerData.backup();
    }

    restore(backup) {
        this.#viewerData.restore(backup);
    }

};
