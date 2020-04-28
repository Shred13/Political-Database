$(document).ready(function(){
    $('input.fname').autocomplete({
        limit: 5
    });
    $('input.lname').autocomplete({
        limit: 5
    });
    $('input.address').autocomplete({
        limit: 5
    });
});

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
    downloadObjectAsJson(json_to_fill, "Political_Json");
}

function download_json() {
    let oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "data.csv");
    oReq.send();
}

function toJSON() {
    let json_to_fill = make_json(this.responseText);
    let final_fnameJSON = {};
    let final_lnameJSON = {};
    let final_addJSON = {};
    for(let i = 0; i<json_to_fill.length; i++){
        final_fnameJSON[json_to_fill[i]["FirstName"]] = null;
        final_lnameJSON[json_to_fill[i]["LastName"]] = null;
        final_addJSON[json_to_fill[i]["ResAddressLine2"]] = null;
    }
    const fname_input = document.querySelector('input.fname');
    let instance = M.Autocomplete.getInstance(fname_input);
    instance.updateData(final_fnameJSON);

    const lname_input = document.querySelector('input.lname');
    let lname_instance = M.Autocomplete.getInstance(lname_input);
    lname_instance.updateData(final_lnameJSON);

    const add_input = document.querySelector('input.address');
    let add_instance = M.Autocomplete.getInstance(add_input);
    add_instance.updateData(final_addJSON);
}
//todo combine first name and last name to make it better and more accurate.
//todo also make a json with firstname and json based on address, not numbers.
function read_csv() {
    let oReq = new XMLHttpRequest();
    oReq.addEventListener("load", toJSON);
    oReq.open("GET", "data.csv");
    oReq.send();
}

read_csv();