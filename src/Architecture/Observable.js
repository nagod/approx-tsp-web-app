//
//
//
//
//
//
//
// Observer pattern
//

export default class Observable {

    constructor() {
        this.observers = []
        this.subscribe = this.subscribe.bind(this)
    }

    subscribe(subscriber) {
        this.observers.push(subscriber)
    }

    unsubscribe(subscriber) {
        this.observers = this.observers.filter(observer => observer !== subscriber);
    }

    notify(identifier, data) {
        this.observers.forEach(observer => observer.notify(identifier, data));
    }

}