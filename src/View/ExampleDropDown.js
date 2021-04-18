import React, { Component } from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import 'bootstrap/dist/css/bootstrap.min.css'
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
export default class ExampleDropDown extends Component {
    constructor() {
        super();
        this.data = [
            "Beispiel2(280).txt",
            "Beispiel3(52).txt",
            "Beispiel4(127).txt",
            "Beispiel5(14051).txt",
            "Beispiel6(130).txt",
            "Beispiel7(150).txt",
            "Beispiel10(18512).txt",
            "Beispiel15(101).txt",
            "Beispiel16(51).txt",
            "Beispiel17(76).txt",
            "Beispiel22(4461).txt",
            "Beispiel23(262).txt",
            "Beispiel24(100).txt",
            "Beispiel25(150).txt",
            "Beispiel26(200).txt",
            "Beispiel27(100).txt",
            "Beispiel28(150).txt",
            "Beispiel29(200).txt",
            "Beispiel30(100).txt",
            "Beispiel31(100).txt",
            "Beispiel32(100).txt",
            "Beispiel33(105).txt",
            "Beispiel34(318).txt",
            "Beispiel35(1379nrw).txt",
        ]
    }
    render() {
        return (
            <div>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Dropdown Button
                    </Dropdown.Toggle>
                    <Dropdown.Menu >
                        {this.data.map((entry) => <DropdownItem> {entry}</DropdownItem>)}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        )
    }
}
/*
                <Dropdown>
                    < DropdownButton
                        as={'myDropdown'}
                        key={'left'}
                        id={`dropdown-button-drop-${'down'}`
                        }
                        menuAlign={`right`}
                        drop={'left'}
                        variant="primary"
                        title={` Drop ${'left'} `
                        }
                    >
                        <Dropdown.Item eventKey="1">Example with X Nodes</Dropdown.Item>
                        <Dropdown.Item eventKey="2">Example with X Nodes</Dropdown.Item>
                        <Dropdown.Item eventKey="3">Example with X Nodes</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="4">Example with X Nodes</Dropdown.Item>
                    </DropdownButton >
                </Dropdown>
                */