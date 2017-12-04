var myApp = new Framework7({
    modalTitle: 'Framework7',
    material: true,
});
var $$ = Dom7;
var mainView = myApp.addView('.view-main', {
});


function JSONtoWork(obj,myMessages){
    console.log(obj);
    if(obj.task == "noprocess") {
        myMessages.addMessage({
            text: obj.term,
            type: 'received',
        });
    } else if(obj.task == "googleimagesearch") {
        googleSearchAPI(obj.term,myMessages,true);
    } else if(obj.task == "wordnicksearch") {
        wordnickDefinationAPI(obj.term,myMessages);
    } else if(obj.task == "wikisearch") {
        wikiAPI(obj.term,myMessages);
    }
}


// var rightView = myApp.addView('.view-right', {
//     name: 'right'
// });
var msgNode = null,newmsgNode=null;
/* ===== Messages Page ===== */
myApp.onPageInit('messages', function (page) {
    var conversationStarted = false;
    var answers = [
        'Yes!',
        'No',
        'Hm...',
        'I am not sure',
        'And what about you?',
        'May be ;)',
        'Lorem ipsum dolor sit amet, consectetur',
        'What?',
        'Are you sure?',
        'Of course',
        'Need to think about it',
        'Amazing!!!',
    ];
    // var people = [
    //     {
    //         name: 'Kate Johnson',
    //         avatar: 'http://lorempixel.com/output/people-q-c-100-100-9.jpg'
    //     },
    //     {
    //         name: 'Blue Ninja',
    //         avatar: 'http://lorempixel.com/output/people-q-c-100-100-7.jpg'
    //     },

    // ];
    var answerTimeout, isFocused;

    // Initialize Messages
    var myMessages = myApp.messages('.messages');

    // Initialize Messagebar
    var myMessagebar = myApp.messagebar('.messagebar');

    $$('.messagebar a.send-message').on('touchstart mousedown', function () {
        isFocused = document.activeElement && document.activeElement === myMessagebar.textarea[0];
    });
    $$('.messagebar a.send-message').on('click', function (e) {
        // Keep focused messagebar's textarea if it was in focus before
        if (isFocused) {
            e.preventDefault();
            //myMessagebar.textarea[0].focus();
        }
        var messageText = myMessagebar.value().trim();
        if (messageText.length === 0) {
            return;
        }
        // Clear messagebar
        myMessagebar.clear();

        // Add Message
        myMessages.addMessage({
            text: messageText,
            avatar: 'http://lorempixel.com/output/people-q-c-200-200-6.jpg',
            type: 'sent',
            date: 'Now'
        });
        conversationStarted = true;
        // Add answer after timeout
        if (answerTimeout) clearTimeout(answerTimeout);
        answerTimeout = setTimeout(function () {
        	//var htmcode = getLocationPoint(messageText,weatherAPI,myMessages,true);
            var reply = bot.reply("local-user", messageText);
            JSONtoWork(JSON.parse(reply),myMessages);
            // console.log(htmcode);
            // var answerText = answers[Math.floor(Math.random() * answers.length)];
            // //var person = people[Math.floor(Math.random() * people.length)];
            // msgNode = myMessages.addMessage({
            //     text: answers[Math.floor(Math.random() * answers.length)],
            //     type: 'received',
            //     name: "person.name",
            //     avatar: "person.avatar",
            //     date: 'Just now'
            // });

        }, 10);
    });
});



