/**
 * Created by isp on 9/3/17.
 */

let events = require('events');

module.exports = class DataGenerator {
    constructor() {
        let self = this;
        this.dataType = {
            random: 'random'
        };
        this.options = {
            min: 1,
            max: 10,
            amount: 10
        };
        this.events = {
            onUpdate: 'onUpdate'
        };
        this.eventEmitter = new events.EventEmitter();
        //this.eventEmitter.on(self.events.onUpdate, self.update);
    }

    _getRandomData(min, max, amount) {
        let data = [];
        
        for (let i = 0; i < amount; i++) {
            data.push(
                Math.floor(Math.random() * (max - min + 1)) + min
            );
        }
        //return Math.floor(Math.random() * (max - min + 1)) + min;
        
        //return data;

        this.eventEmitter.emit(this.events.onUpdate, data);
    }

    start(type, refreshRate, options) {
        let self = this;
        let min = options.min || this.options.min;
        let max = options.max || this.options.max;
        let amount = options.amount || this.options.amount;

        this.eventEmitter.on(self.events.onUpdate, self.update);

        switch (type) {
            case this.dataType.random:
                return setInterval(
                    self._getRandomData
                        .bind(self, min, max, amount), refreshRate);
            break;
        }
    }

    stop(timerId) {
        clearInterval(timerId);
    }

    /**
     * Subscribe on generator update event
     * @param data
     */
    /*onUpdate(data) {
        let self = this;
//console.log(data);
        this.eventEmitter.on(self.events.onUpdate, self.update.bind(data));
    }*/

    /**
     * Subscribe once on generator events
     * @param event
     * @param callback
     */
    /*onceUpdate(event, callback) {
        this.eventEmitter.once(event, callback);
    }*/

    update(data) {
//console.log(data);
    };
};
