
//
// FileService.js
//
// Created by Deniz Dogan and Timo Kilb
// 2020 © All rights reserved.
//

import Examples from "../Resources/Examples/Examples";

export default class FileService {
    static readFileAsText(file) {
        const reader = new FileReader();
        return reader.readAsText(file);
    }

    static getAllExamples() {
        return Examples;
    }

    static getExampleByKey(key) {
        return Examples[key].data;
    }

    static saveToJSON(nodes) {
        let array = []
        for (let node of nodes) {
            let obj = {
                id: node.id,
                xPos: node.xPos,
                yPos: node.yPos
            }
            array.push(obj)
        }
        let result = JSON.stringify(array)
        var filename = "Graph.txt"
        var file = new Blob([result], { type: "text/plain" })
        var link = document.createElement("a");
        link.download = filename;
        link.innerHTML = "Download File";
        link.href = window.URL.createObjectURL(file);
        //document.body.appendChild(link);
        link.click()
    }

}
