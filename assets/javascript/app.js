$(document).ready(function() {
 
    // Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCSC8RasJgR4eNTZC7XWEAdH_n12uEqh2Q",
    authDomain: "train-scheduler-19ea1.firebaseapp.com",
    databaseURL: "https://train-scheduler-19ea1.firebaseio.com",
    projectId: "train-scheduler-19ea1",
    storageBucket: "train-scheduler-19ea1.appspot.com",
    messagingSenderId: "697777173367",
    appId: "1:697777173367:web:04c4233d28dc1cb182e772",
    measurementId: "G-CGGPXH66VL"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();

    var trainName = "";
    var destination = "";
    var time = {};
    var frequency = "";

  //capture button click
  $("#add-train").on("click", function(){
      event.preventDefault();

      //grab data from input fields
      trainName = $(".train").val().trim();
      destination = $(".destination").val().trim();
      time = $(".time").val().trim(); //is string
      frequency = $(".frequency").val().trim();

      //push all info to database
      database.ref().push({
        trainName,
        destination,
        time,
        frequency,
      });

      //clear data from input fields
      $(".train").val("");
      $(".destination").val("");
      $(".time").val("");
      $(".frequency").val("");

    });

  //Firebase watcher & initial loader
  database.ref().on("child_added", function(childSnapshot){
    //store childSnapshot value for ease
    var csv = childSnapshot.val();

    //log snapshot data
    console.log("=================");
    console.log("train Name:", csv.trainName);
    console.log("destination:",csv.destination);
    console.log("first train time:",csv.time);
    console.log("frequency:",csv.frequency);

    //console.log("snapshot time is type:", typeof(csv.time));

    //calculate new train's minutes away
    //current time
    var currentTime = moment().format("HH:mm");
    //console.log("current time is:",currentTime);
    
    //converts database time value (string) into a moment object
    var firstTime = moment(csv.time, "HH:mm");

    //finds difference in time between current time and train's first time
    var difference =  moment().diff(moment(firstTime), "minutes");
    //console.log(difference);

    //calculate time remaining until next train
    var f = parseInt(csv.frequency);
    var remain = difference % f;
    //console.log("remainder:", remain);

    var minsAway = f - remain;
    //console.log("minutes until next train:", minsAway);

    //calculate new train's next arrival time
    var nextArrival = moment().add(minsAway, "minutes").format("HH:mm");
    //console.log("the next train will arrive at", nextArrival);
    
    //append row to table in DOM
     $("#trainTable").append("<tr><td>"+csv.trainName+"</td><td>"+ csv.destination+ "</td><td>"+csv.frequency+ "</td><td>"+nextArrival+"</td><td>"+minsAway+"</td></tr>");

  });

});