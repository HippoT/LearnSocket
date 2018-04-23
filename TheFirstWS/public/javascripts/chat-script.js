var websocket;     

//-- No use time. It is a javaScript effect.
function insertChat(who, text, time){
    let username = $('#txtUsername').val() ? $('#txtUsername').val() : 'Anonymous';
    if (who == username){
        control = control = '<p class="text-right">' +
                                        text +
                                        '<strong> :' 
                                           + who +
                                        '</strong>' +                      
                            '</p>';                 
    }else{
        control = '<p class="text-left">' +
                            '<strong>' + 
                                who + ": " +
                            '</strong>' + 
                            text +                   
                  '</p>';
    }
    setTimeout(
        function(){                        
            $(".jumbotron").append(control).scrollTop($("body").prop('scrollHeight'));
        }, 100);
    
}

function resetChat(){
    $("ul").empty();
}

$("#txtMessage").on("keydown", function(e){
    if (e.which == 13){
        var text = $(this).val();
        if (text !== ""){
            sendMessage();      
            $(this).val('');
        }
    }
});

$('a').click(function(){
    $("#txtMessage").trigger({type: 'keydown', which: 13, keyCode: 13});
})



$('form').submit(function() {
    let room = $("#txtRoomname").val();
    let username = $('#txtUsername').val() ? $('#txtUsername').val() : 'Anonymous';
    $('#txtMessage').focus();
    console.log(JSON.stringify({room: room, username: username}));
    beginSocket(room, username);
    resetChat();
    return false;
});

function beginSocket(room, username){

    websocket = new WebSocket("ws://localhost:8080/" + room + "/" + username);

    websocket.onmessage = function(evt) {
        let data = JSON.parse(evt.data);
        if(data.action === "msg"){
            insertChat(data.name, data.message);
        }
    };

    websocket.onclose = function(evt){
        alert("Your connect socket is close");
    };

    websocket.onerror = function(evt) {
        console.log('<span style="color: red;">ERROR:</span> ' + evt.data);
    };
}

function closeWebsocket(){
  websocket.close();
  return false;
}

function sendMessage(){
    websocket.send($('#txtMessage').val());
}