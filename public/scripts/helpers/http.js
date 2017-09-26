if (!this.http) {
    function http(url, method, body, reqJson, resJson, next) {
        next = next || function() {};
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
                    }
                    next(null, resText);
                }
            }
        }
        xmlHttp.open(method.toUpperCase(), url, true); // true = async
        if (reqJson) {
            xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlHttp.send(JSON.stringify(body));
        } else
            xmlHttp.send(body);

    }
} else {
    console.error("http already exists");
}
