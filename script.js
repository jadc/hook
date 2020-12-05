let counter = 0;

const params = new URLSearchParams(window.location.search);

$(document).ready(_ => {
    if(params.get("url") != null){
        $("input")[0].value = params.get("url");
    }
    if(params.get("msg") != null){
        $("input")[1].value = params.get("msg");
    }
});

let save = _ => {
    window.location.search = "?msg="+$("input")[1].value+"&url="+$("input")[0].value;
}

let url;
let msg;
let rate;
let cooldown;

let submit = _ => {
    url = $("input")[0].value;
    msg = $("input")[1].value;
    rate = $("input")[2].value;
    cooldown = $("input")[3].value;

    log("Attempting to send '" + msg + "' to '" + url + "' every " + rate + "ms")
    send();
}

let send = _ => { 
    $("button")[1].disabled = true;

    $.ajax({
        type: "POST",
        url: url,
        async: true,
        data: { content: msg },
        complete: e => {
            if(e.status == 204){
                counter++;
                log("["+e.status+"] Sent " + counter.toLocaleString() + " messages");
                setTimeout(send, rate);
            }else{
                log("["+e.status+"] Error! (typically rate limit) Taking a " + cooldown + "ms break...");
                setTimeout(send, cooldown);
            }
        }
    });
}

let log = l => {
    let day = new Date().toString().split(" ")[4];
    $("code").prepend("<p><b>" + day + "</b> -- " + l + "</p>");
}
