
var wikiAPI = null;
var googleSearchAPI = null;
var wordnickDefinationAPI = null;
var getLocationPoint = null;
var weatherAPI = null;
let api_key = 'AIzaSyC02URANwpMffw5rvgQRlre-XNfpDVpPYE';


function TextToSpeech(msg){
    TTS.speak({
        text: msg,
        locale: 'en-UK',
        rate: 0.92
    }, function () {
        //alert('success');
    }, function (reason) {
        alert(reason);
    });    
}

function setup(){

	//wikipedia API
	wikiAPI = function(term,msgObject){
		let searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
		//let contentUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';
		loadJSON(searchUrl+term,function(response){
			console.log("Got response",response);
			wikiTemplate(response,msgObject);
		},"jsonp");
	}
	function wikiTemplate(data,myMessages){
		console.log("template",data,myMessages);
		if(data[1].length > 0){
			var title = data[1][0];
			var desc = data[2][0];
			sendMessage(myMessages,
				`<div class="card">
					<div class="card-header">${title}</div>
					<div class="card-content">
						<div class="card-content-inner">${desc}</div>
					</div>
				</div>`
			);		
			TextToSpeech(desc);	
		} else {
			// google search
		}
	}


	// google search API
	googleSearchAPI = function(term,msgObject,image){
		let number = 5;
		let searchUrl = "";
		if(!image) {
			searchUrl = 'https://www.googleapis.com/customsearch/v1?cx=012900217122796657555%3Art5stxtpnzk&num='+number+'&key='+api_key+'&q=';
		} else {
			number = 9; 
			searchUrl = 'https://www.googleapis.com/customsearch/v1?cx=012900217122796657555%3Art5stxtpnzk&searchType=image&num='+number+'&key='+api_key+'&q=';
		}
		console.log(searchUrl);
		loadJSON(searchUrl+term,function(response){
			console.log("Got response",response);
			googleSearchTemplate(response,msgObject,image);
		},"jsonp");
	}
	function googleSearchTemplate(data,myMessages,image){
		console.log("template",data,myMessages);
		if(data.items.length > 0){
			var htmlcode = "";
			if(!image){
				for(var i=0;i<data.items.length;i++){
					htmlcode += 				
							`<li onclick="window.location.assign('${data.items[i].link}')">
								<a href="${data.items[i].link}" class="item-link item-content">
									<div class="item-inner">
										<div class="item-title-row">
											<div class="item-title">${data.items[i].title}</div>
										</div>
										<div style="margin-top:6px" class="item-subtitle">${data.items[i].displayLink}</div>
										<div class="item-text">${data.items[i].snippet.substr(0,49)}</div>
									</div>
								</a>
							</li>`;
				}
				htmlcode = '<div class="list-block media-list"><ul>'+htmlcode+'</ul></div>';
			} else {
				for(var i=0;i<data.items.length;i++){
					htmlcode +=
							`<div class="col-33" style="text-align:center;">
								<img style="object-fit:cover;height:117px !important;" src="${data.items[i].link}" alt="${data.items[i].title}" />
							</div>`;
				}
				htmlcode = '<div class="row no-gutter" style="width="100%">'+htmlcode+'</div>';
				TextToSpeech("Here are some images which i found on web");
			}
			sendMessage(myMessages,htmlcode);			
		} else {
			// google search
		}
	}


	//wordnick API
	wordnickDefinationAPI = function(term,msgObject){
		let searchUrl = 'http://api.wordnik.com:80/v4/word.json/'+term+'/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
		loadJSON(searchUrl,function(response){
			console.log("Got response",response);
			wordnickDefinationTemplate(response,msgObject);
		},"jsonp");
	}
	function wordnickDefinationTemplate(data,myMessages){
		console.log("template",data,myMessages);
		if(data.length > 0){
			var type = data[0].partOfSpeech;
			var desc = data[0].text;
			var word = data[0].word;
			sendMessage(myMessages,
				`<div class="card">
					<div class="card-header">${word}</div>
					<div class="card-content">
						<div class="card-content-inner">${desc}</div>
					</div>
					<div class="card-footer">${type}</div>
				</div>`
			);	
			TextToSpeech(desc);		
		} else {
			// google search
		}
	}



	//wikipedia API
	weatherAPI = function(loc,msgObject){
		let searchUrl = 'http://api.openweathermap.org/data/2.5/weather?lat='+loc.lat+'&lon='+loc.lng+'&APPID=0442e553754e22dd2e70deb96cfcf1ae';
		//let contentUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';
		loadJSON(searchUrl,function(response){
			console.log("Got response",response);
			weatherTemplate(response,msgObject);
		},"jsonp");
	}
	function weatherTemplate(data,myMessages){
		console.log("template",data,myMessages);
		if(data.weather != undefined || data.main != undefined){
			var status = data.weather[0].description;
			var temp = parseInt(data.main.temp) - 273.15;
			sendMessage(myMessages,
				`<div class="card">
					<div class="card-header">${status}</div>
					<div class="card-content">
						<div class="card-content-inner">
							<div class="list-block">
								<ul>
									<li>
										<div class="item-content">
											<div class="item-media"><i class="icon icon-f7"></i></div>
											<div class="item-inner">
												<div class="item-title">${temp}</div>
											</div>
										</div>
									</li>
									<li>
										<div class="item-content">
											<div class="item-media"><i class="icon icon-f7"></i></div>
											<div class="item-inner">
												<div class="item-title">${data.main.pressure}</div>
											</div>
										</div>
									</li>	
									<li>
										<div class="item-content">
											<div class="item-media"><i class="icon icon-f7"></i></div>
											<div class="item-inner">
												<div class="item-title">${data.main.humidity}</div>
											</div>
										</div>
									</li>	
									<li>
										<div class="item-content">
											<div class="item-media"><i class="icon icon-f7"></i></div>
											<div class="item-inner">
												<div class="item-title">${data.main.temp_min}</div>
											</div>
										</div>
									</li>
									<li>
										<div class="item-content">
											<div class="item-media"><i class="icon icon-f7"></i></div>
											<div class="item-inner">
												<div class="item-title">${data.main.temp_max}</div>
											</div>
										</div>
									</li>									
								</ul>
							</div>
						</div>
					</div>
				</div>`
			);			
		} else {
			// google search
		}
	}


	// Get location points
	getLocationPoint = function(name,funcname,msgObject){
		let searchUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='+name+'&key='+api_key;
		console.log("Invoked "+name,searchUrl);
		loadJSON(searchUrl,function(response){
			console.log("Got response",response);
			if(response.results.length > 0){
				funcname(data.results[0].geometry.location,msgObject);
			} else {
				funcname({
					"lat": 18.5204303,
					"lng": 73.8567437
				},msgObject);
			}
		},"jsonp");
	}

	// Send Message
	function sendMessage(myMessages,htmcode){
		console.log(myMessages,htmcode);
        	var newmsgNode = myMessages.addMessage({
                text: htmcode,
                type: 'received',
            });
            newmsgNode.classList.add("card-message");
	}
}

