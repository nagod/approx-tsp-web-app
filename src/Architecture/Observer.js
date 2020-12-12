//
//
//
//
//
// Observer "interface-like" class

export default class Observer {

    notify(identifier, data) {
        console.log("received notification with identifier: ", identifier, "and data", data)
    }

}