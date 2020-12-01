//
// Presenter for main module
// Takes care of module logic and communication between Model, Views and
// Services i.e. reading files, fetching data and so on.
//

export default class MainPresenter{

    constructor(viewController){
        this.viewController = viewController
        this.handleTurnRedButtonClicked = this.handleTurnRedButtonClicked.bind(this)
        this.handleTurnBlueButtonClicked = this.handleTurnBlueButtonClicked.bind(this)
    }

    handleTurnRedButtonClicked(){
        this.viewController.turnViewRed()
    }

    handleTurnBlueButtonClicked(){
        this.viewController.turnViewBlue()
    }


}