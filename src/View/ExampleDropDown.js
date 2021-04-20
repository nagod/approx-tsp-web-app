import React, { Component } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import 'bootstrap/dist/css/bootstrap.min.css'
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
export default class ExampleDropDown extends Component {
    constructor() {
        super();
        this.data = [
            //"Beispiel2(280).json",
            "Beispiel3(52).json",
            "Beispiel4(127).json",
            //"Beispiel5(14051).json",
            "Beispiel6(130).json",
            "Beispiel7(150).json",
            //"Beispiel10(18512).json",
            "Beispiel15(101).json",
            "Beispiel16(51).json",
            "Beispiel17(76).json",
            //"Beispiel22(4461).json",
            //"Beispiel23(262).json",
            "Beispiel24(100).json",
            "Beispiel25(150).json",
            //"Beispiel26(200).json",
            "Beispiel27(100).json",
            "Beispiel28(150).json",
            //"Beispiel29(200).json",
            "Beispiel30(100).json",
            "Beispiel31(100).json",
            "Beispiel32(100).json",
            //"Beispiel33(105).json",
            //"Beispiel34(318).json",
            //"Beispiel35(1379nrw).json",
        ]
        this.sendData = this.sendData.bind(this)
    }
    sendData(data) {
        this.props.action(data)
    }
    render() {
        return (
            <div>
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{ maxWidth: '186px', minWidth: '186px', maxHeight: '45px', minHeight: '45px' }}>
                        Examples
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ height: "411px", width: "204px", overflow: "scroll" }} >
                        {this.data.map((entry, index) => <DropdownItem key={index} onClick={() => this.sendData(entry)}> {`Example ${index + 1} (${entry.split("(")[1].split(")")[0]})`}</DropdownItem>)}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        )
    }
}
