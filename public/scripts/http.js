if (!this.http) {
    function http(url, method, body, resJson, next) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4) { // 'DONE'
                if (xmlHttp.status == 200) {
                    var resText = this.responseText;
                    if (resJson) {
                        try {
                            resText = JSON.parse(resText);
                        } catch (err) {
                            next(err, null);
                        }
                        next(null, resText);
                    } else
                        global.showError();
                }
            }
            xmlHttp.open(method.toUpperCase(), url, true); // true = async
            xmlHttp.send(body);
        }
    }
} else {
    console.error("http already exists");
}
