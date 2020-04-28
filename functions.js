// Your web app's Firebase configuration


function make_json(csv) {
    let lines = csv.split("\n");
    let result = [];

    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    let headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {

        let obj = {};
        let currentline = lines[i].split(",");

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }
    //return result; //JavaScript object
    let json_final = JSON.parse(JSON.stringify(result, function (key, value) {
        // key = key.replace("/", "_");
        // let new_val = "";
        // if (key === "Language \n") {
        //     console.log(key);
        // }
        // if (value.length === 0 || value === " " || value == null) {
        //     new_val = "null";
        // } else {
        //     new_val = value;
        // }
        // return new_val
        return value
    }));//JSON
    // return result;
    let keys = Object.keys(json_final);
    for (let i in keys) {
        let len = json_final[i][Object.keys(json_final[i]).pop()].length;
        let len2 = Object.keys(json_final[i]).pop().length;
        let new_key = Object.keys(json_final[i]).pop().substr(0, len2);
        json_final[i][new_key] = json_final[i][Object.keys(json_final[i]).pop()];
        delete json_final[i][Object.keys(json_final[i]).pop()];
        if (json_final[i][Object.keys(json_final[i]).pop()].charCodeAt(len-1) === 13) {
            json_final[i][Object.keys(json_final[i]).pop()] = "null"
        }
    }
    return json_final;

}

function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function reqListener() {
    let json_to_fill = make_json(this.responseText);
    downloadObjectAsJson(json_to_fill, "Political_Json")

}

function update_database() {
    let oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "data.csv");
    oReq.send();
}