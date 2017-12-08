var torchStatus = "off";
function _sendMessage(myMessages,htmcode){
	myMessages.addMessage({
	    text: htmcode,
	    type: 'received',
    });
}
function ramUsage(ansref) {
    chrome.system.memory.getInfo(function(data){
        var ramper = Math.trunc((data.availableCapacity*100)/data.capacity);
        if(ramper < 25){
            status = "critical";
        } else if(ramper > 25 && ramper < 50) {
            status = "fine";
        } else {
            status = "excellent";
        }
        ansref.innerHTML +=
        '<div class="ans ram"><div class="list"><div class="item-divider">Basic Information</div><div class="item"><div>Total RAM</div><div>'+bytesToSize(data.capacity)+'</div></div><div class="item"><div>Available RAM</div><div>'+bytesToSize(data.availableCapacity)+'</div></div><div class="item"><div>Running RAM</div><div>'+bytesToSize(data.capacity-data.availableCapacity)+'</div></div><div class="item-divider">RAM Statistics</div><div class="item"><div id="raminfocircle"><div id="avram"></div><div id="usram"></div></div></div></div></div>';
    });
}
function torch(myMessages){
	window.plugins.flashlight.available(function(isAvailable) {
    	if (isAvailable) {
        	if(torchStatus=="off") {
            	window.plugins.flashlight.switchOn();
            	torchStatus = "on";
        	} else {
            	window.plugins.flashlight.switchOff();
            	torchStatus = "off";
        	}
    	} else {
        	_sendMessage(myMessages,"Flashlight not available on this device");
    	}
	});
}



function lastSMS(myMessage) {
    if(SMS) SMS.listSMS({}, function(data){
			var html = "";
	    var prepareSMS = "";
	    if(Array.isArray(data)) {
		    for(var i in data) {
		        var sms = data[i];
		        html = `
							<div class="card">
								<div class="card-header">${sms.address}</div>
								<div class="card-content">
									<div class="card-content-inner">${sms.body}</div>
								</div>
							</div>
						`;
		        prepareSMS += sms.address + "wants to message you that " + sms.body;
		        break;
		    }
			}
			_sendMessage(myMessage,htmcode);
	    textToSpeech(prepareSMS);
    }, function(err){
			alert('error list sms: ' + err);
	});
}
