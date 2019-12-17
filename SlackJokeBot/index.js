var slackbot = require("slackbots");
var axios = require("axios");
var mongoose = require("mongoose");

//connecting to Database SlackApp
mongoose.connect("mongodb://localhost/SlackApp", { useUnifiedTopology: true, useNewUrlParser: true});

var SlackMessagesSchema = new mongoose.Schema({
    notes: String,
    createdAt: {type: Date, default: Date.now},
});

//Basically this line creates a interface between Javascript variable and Database table
var SlackMessage = mongoose.model("SlackMessage", SlackMessagesSchema);

//Created a Bot
var bot = new slackbot({
    token: "xoxb-876009906854-863539763681-gZYysOelMIzBHBppBPbMifTR",
    name: 'cap_vin'
});

//Handler
bot.on('start', () => {
    const params = {
        icon_emoji: ':cat:'
    };
    
    bot.postMessageToChannel('general', "Bot of Vineet", params);
});

//Message Handler
bot.on('message', (data) => {
    if(data.type !== 'message'){
        return;
    }
    
    // console.log("From SLAk APP");
    // console.log(data);
    
    
    //Checking the message is from bot or from different user
    if(data.username === 'cap_vin'){
        return;
    }else{
        handleMessage(data.text);
    }
});

//handle Message
function handleMessage(message){
    // if (message.includes(" hello")){
    //  const params = {
    // icon_emoji: ':laughing:'
    //  };
        
    //  SlackMessage.create({
    //      notes: message.slice(13)
    //  }, (err, note) => {
    //      if(err){
    //          console.log("Cannot enter into database");
    //      }else{
    //          console.log("From Database");
    //          console.log(note);
    //      }
    //  });

    //  bot.postMessageToChannel('general', "Hello Awesome Person Get Ready to laugh with @JokeBOT", params);
    
    // } 
    
    // else if (message.includes(" chucknorris")){
    //  chuckJoke(message);
    // }
    
    // else if(message.includes(" yomama")){
    //  yoMamaJoke(message);
    // } 
    
    // else if (message.includes(' random')) {
    // randomJoke(message);
    // }
    
    // else if (message.includes(' help')) {
    // runHelp(message);
    // }
    
    // else if(message.includes(' show')){
    //  showAllMessages();
    // }
    
    // else{
    //  if(message.slice(13) === ''){
    //      return;
    //  }else{
    //      saveToDB(message);  
    //  }
    // }
    
//Checking user wants to display all the message of today's date or not      
    if (message.includes(" show")){
        showAllMessages();
    }
    else{
        SlackMessage.create({
            notes: message
            }, (err, note) => {
                if(err){
                    console.log("Cannot enter into database");
                }else{
                    console.log("From Database");
                    console.log(note);
                }
        });
    }
}

// function chuckJoke(message){
//  axios.get('http://api.icndb.com/jokes/random').then(res => {
//     var joke = res.data.value.joke;

//     const params = {
//       icon_emoji: ':laughing:'
//     };
        
//  SlackMessage.create({
//      notes: message.slice(13)
//      }, (err, note) => {
//          if(err){
//              console.log("Cannot enter into database");
//          }else{
//              console.log("From DataBase Chuck Command");
//              console.log(note);
//          }
//      });

//     bot.postMessageToChannel('general', `Chuck Norris: ${joke}`, params);
//   });
// }

// Tell a Yo Mama Joke
// function yoMamaJoke(message) {
//      axios.get('http://api.yomomma.info').then(res => {
//     var joke = res.data.joke;

//     const params = {
//       icon_emoji: ':laughing:'
//     };
// 
//  SlackMessage.create({
//      notes: message.slice(13)
//      }, (err, note) => {
//          if(err){
//              console.log("Cannot enter into database");
//          }else{
//              console.log("From DataBase Yomama Command");
//              console.log(note);
//          }
//  });
      
//     bot.postMessageToChannel('general', `Yo Mama: ${joke}`, params);
//   });
// }

// Tell a Random Joke
// function randomJoke(message) {
//  const rand = Math.floor(Math.random() * 2) + 1;
//  if (rand === 1) {
//      chuckJoke(message);
//  }
//  else if (rand === 2) {
//      yoMamaJoke(message);
//  }
// }

// Show Help Text
// function runHelp(message) {
//  const params = {
//      icon_emoji: ':question:'
//  };

//  SlackMessage.create({
//      notes: message.slice(13)
//      }, (err, note) => {
//          if(err){
//              console.log("Cannot enter into database");
//          }else{
//              console.log("From DataBase Help Command");
//              console.log(note);
//          }
//  });

//  bot.postMessageToChannel('general', `Type @jokebot with either 'chucknorris', 'yomama' or 'random' to get a joke`, params);
// }

function showAllMessages(){
    var allMessage = [];
    const params = {
        icon_emoji: ':cat:'
    };
    
    // db.collection.find( { $where: function() { 
    //  today = new Date(); //
    //  today.setHours(0,0,0,0);
    //  return (this._id.getTimestamp() >= today)
    // } } );
    
    
    //Logic to check that messages is of today's date or not
    SlackMessage.find({
            $where: function() { 
                today = new Date(); 
                //console.log(today);
                today.setHours(0,0,0,0);
                return (this._id.getTimestamp() >= today)
        } 
    }, (err, messages) => {
        if(err){
            console.log(err);
        }else{
            messages.forEach(function(message){
                //console.log(message);
                //bot.postMessageToChannel('general', message.notes, params);
                allMessage.push(message.notes);
            });
        }
        
        bot.postMessageToChannel('general', allMessage, params);
        
    });
}
    // const params = {
    // icon_emoji: ':question:'
    // };
    // // console.log(allMessage);
    // // console.log("Vinet");
    // bot.postMessageToChannel('general', allMessage, params);
    // console.log("Vinet");

//function saveToDB(message){
//  const params = {
//     icon_emoji: ':question:'
//      };
    
//  SlackMessage.create({
//      notes: message.slice(13)
//      }, (err, note) => {
//          if(err){
//              console.log("Cannot enter into database");
//          }else{
//              console.log("From DataBase Anyother Command");
//              console.log(note);
//          }
//  }); 
    
//  bot.postMessageToChannel('general', '', params);
// }








