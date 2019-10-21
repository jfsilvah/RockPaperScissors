var firebaseConfig = {
    apiKey: "AIzaSyCvxkizPRReIQWzHFvPMORhompyicUMhjg",
    authDomain: "rockpaperscissors-e912e.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-e912e.firebaseio.com",
    projectId: "rockpaperscissors-e912e",
    storageBucket: "rockpaperscissors-e912e.appspot.com",
    messagingSenderId: "1017040407263",
    appId: "1:1017040407263:web:c31dd6d7270b329bd6f76a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var player1_active = false;
var player2_active = false;
var player1 = {name: "Player1",
               wins: 0,
               looses: 0,
               movement:-1};
var player2 = {name: "Player2",
               wins: 0,
               looses: 0,
               movement:-1};

function reset(){
    $("#sel_p1").attr("src","assets/images/animation.gif");
    $("#sel_p2").attr("src","assets/images/animation.gif");
}

connectedRef.on("value", function(snap) {
    if (snap.val()) {
       // Add user to the connections list.
       var con = connectionsRef.push(true);
       // Remove user from the connection list when they disconnect.
       con.onDisconnect().remove();
    }
});

connectionsRef.on("value", function(snapshot) {
    if (snapshot.numChildren() === 1 && player2_active === false){
        player1_active = true;
        player2_active = false;
        database.ref("/player1").set({
            name: player1.name,
            wins: 0,
            looses: 0,
            movement: -1
        });
        database.ref("/player2").set({looses: 0});
        $("#player2_name").text("Waiting for Player2");
        $("#sel_p1").attr("src","assets/images/animation.gif");
        $("#sel_p2").attr("src","assets/images/animation.gif");
        player2.name = "";
        player2.wins = 0;
        player2.looses = 0;
        player2.movement = -1;
        player1.wins = 0;
        player1.looses = 0;
        $("#buttons_p1").empty();
        $("#buttons_p2").empty();
        $("#wins_p1").text("Wins: "+player1.wins);
        $("#looses_p1").text("Looses: "+player1.looses);
        $("#wins_p2").text("Wins: "+player2.wins);
        $("#looses_p2").text("Looses: "+player2.looses);
    }
    if (snapshot.numChildren() === 1 && player1_active === false){
        player1_active = true;
        player2_active = false;
        database.ref("/player2").set({looses: 0});
        $("#player2_name").text("Waiting for Player2");
        player1.name = player2.name;
        player1.wins = 0;
        player1.looses = 0;
        player1.movement = -1;
        database.ref("/player1").set({
            name: player1.name,
            wins: 0,
            looses: 0,
            movement: -1
        });
        $("#player1_name").text(player1.name);
        $("#sel_p1").attr("src","assets/images/animation.gif");
        $("#sel_p2").attr("src","assets/images/animation.gif");
        $("#buttons_p1").empty();
        $("#buttons_p2").empty();
        player2.name = "";
        player2.wins = 0;
        player2.looses = 0;
        player2.movement = -1;
        player1.wins = 0;
        player1.looses = 0;
        $("#wins_p1").text("Wins: "+player1.wins);
        $("#looses_p1").text("Looses: "+player1.looses);
        $("#wins_p2").text("Wins: "+player2.wins);
        $("#looses_p2").text("Looses: "+player2.looses);
    }
    else if (snapshot.numChildren() === 2 && player1_active === false){
        player2_active = true;
        player1_active = false;
    }
});

database.ref("/player1").on("value", function(snapshot) {
    if (snapshot.child("name").exists()) {
        if (player2_active){
            $("#player1_name").text(snapshot.val().name);
            $("#wins_p1").text("Wins: "+snapshot.val().wins);
            $("#looses_p1").text("Looses: "+snapshot.val().looses);
            if (snapshot.val().movement !== -1){
                player1.name = snapshot.val().name;
                player1.wins = snapshot.val().wins;
                player1.looses = snapshot.val().looses;
                player1.movement = snapshot.val().movement;
                $("#buttons_p2").empty();
                $("#buttons_p2").html('<button href="#" class="btn btn-lg btn-dark" id="rock_p2"><i class="far fa-hand-rock"></i></button><button href="#" class="btn btn-lg btn-dark" id="paper_p2"><i class="far fa-hand-paper"></i></button><button href="#" class="btn btn-lg btn-dark" id="scissors_p2"><i class="far fa-hand-scissors"></i></button>');
            }
        }
        if (player1_active){
            player1.name = snapshot.val().name;
            player1.wins = snapshot.val().wins;
            player1.looses = snapshot.val().looses;
            player1.movement = snapshot.val().movement;
            $("#wins_p1").text("Wins: "+player1.wins);
            $("#looses_p1").text("Looses: "+player1.looses);
        }
    }
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});
  
database.ref("/player2").on("value", function(snapshot) {

    if (snapshot.child("name").exists()) {
        if (player2_active){
            player2.name = snapshot.val().name;
            player2.wins = snapshot.val().wins;
            player2.looses = snapshot.val().looses;
            player2.movement = snapshot.val().movement;

            $("#wins_p2").text("Wins: "+player2.wins);
            $("#looses_p2").text("Looses: "+player2.looses);
        }
        if (player1_active){
            $("#player2_name").text(snapshot.val().name);
            $("#wins_p2").text("Wins: "+snapshot.val().wins);
            $("#looses_p2").text("Looses: "+snapshot.val().looses);
            if (snapshot.val().movement === -1){
                $("#buttons_p1").empty();
                $("#buttons_p1").html('<button class="btn btn-lg btn-dark" id="rock_p1"><i class="far fa-hand-rock"></i></button><button href="#" class="btn btn-lg btn-dark" id="paper_p1"><i class="far fa-hand-paper"></i></button><button class="btn btn-lg btn-dark" id="scissors_p1"><i class="far fa-hand-scissors"></i></button>');
            }
            else{
                player2.name = snapshot.val().name;
                player2.wins = snapshot.val().wins;
                player2.looses = snapshot.val().looses;
                player2.movement = snapshot.val().movement;
                if (player2.movement === 1){
                    $("#sel_p2").attr("src","assets/images/piedra.jpg");
                }
                else if (player2.movement === 2){
                    $("#sel_p2").attr("src","assets/images/papel.jpg");
                }
                else if (player2.movement === 3){
                    $("#sel_p2").attr("src","assets/images/tijeras.jpg");
                }
                setTimeout(reset,3000);
                database.ref("/player1").set({
                    name: player1.name,
                    wins: player1.wins,
                    looses: player1.looses,
                    movement: -1
                });
                database.ref("/player2").set({
                    name: player2.name,
                    wins: player2.wins,
                    looses: player2.looses,
                    movement: -1
                });
                
            }
        }
    }
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

$("#buttons_p1").on("click","button",function(event){

    if (this.id === "rock_p1"){
        $("#sel_p1").attr("src","assets/images/piedra.jpg");
        player1.movement = 1;
    }
    else if (this.id === "paper_p1"){
        $("#sel_p1").attr("src","assets/images/papel.jpg");
        player1.movement = 2;
    }
    else if (this.id === "scissors_p1"){
        $("#sel_p1").attr("src","assets/images/tijeras.jpg");
        player1.movement = 3;
    }
    $("#buttons_p1").empty();
    database.ref("/player1").set({
        name: player1.name,
        wins: player1.wins,
        looses: player1.looses,
        movement: player1.movement
    });
});

$("#buttons_p2").on("click","button",function(event){
    if (this.id === "rock_p2"){
        $("#sel_p2").attr("src","assets/images/piedra.jpg");
        player2.movement = 1;
    }
    else if (this.id === "paper_p2"){
        $("#sel_p2").attr("src","assets/images/papel.jpg");
        player2.movement = 2;
    }
    else if (this.id === "scissors_p2"){
        $("#sel_p2").attr("src","assets/images/tijeras.jpg");
        player2.movement = 3;
    }
    $("#buttons_p2").empty();
    if (player1.movement === 1){
        $("#sel_p1").attr("src","assets/images/piedra.jpg");
    }
    if (player1.movement === 2){
        $("#sel_p1").attr("src","assets/images/papel.jpg");
    }
    if (player1.movement === 3){
        $("#sel_p1").attr("src","assets/images/tijeras.jpg");
    }

    if (player2.movement === player1.movement){
        console.log("partida empatada");
    }
    else if (player2.movement === 1 && player1.movement === 2){
        player1.wins++;
        player2.looses++;
    }
    else if (player2.movement === 1 && player1.movement === 3){
        player1.looses++;
        player2.wins++;
    }
    else if (player2.movement === 2 && player1.movement === 1){
        player1.looses++;
        player2.wins++;
    }
    else if (player2.movement === 2 && player1.movement === 3){
        player1.wins++;
        player2.looses++;
    }
    else if (player2.movement === 3 && player1.movement === 1){
        player1.wins++;
        player2.looses++;
    }
    else if (player2.movement === 3 && player1.movement === 2){
        player1.looses++;
        player2.wins++;
    }
    $("#wins_p1").text("Wins: "+player1.wins);
    $("#looses_p1").text("Looses: "+player1.looses);
    $("#wins_p2").text("Wins: "+player2.wins);
    $("#looses_p2").text("Looses: "+player2.looses);
    setTimeout(reset,3000);
    database.ref("/player1").set({
        name: player1.name,
        wins: player1.wins,
        looses: player1.looses,
        movement: -1
    });
    database.ref("/player2").set({
        name: player2.name,
        wins: player2.wins,
        looses: player2.looses,
        movement: player2.movement
    });
    
});

$("#btn-pname").on("click",function(event){

    event.preventDefault();
    $("#player1").show();
    $("#player2").show();
    $("#nameForm").hide();
    if (player1_active || player2_active){
        if (player1_active){
            $("#buttons_p2").text(" ");
            $("#player1_name").text($("#playerName").val());
            $("#player2_name").text("Waiting for Player2");
            player2.name = "";
            player2.wins = 0;
            player2.looses = 0;
            player2.movement = -1;
            player1.wins = 0;
            player2.looses = 0;
            $("#wins_p1").text("Wins: "+player1.wins);
            $("#looses_p1").text("Looses: "+player1.looses);
            $("#wins_p2").text("Wins: "+player2.wins);
            $("#looses_p2").text("Looses: "+player2.looses);
            player1.name = $("#playerName").val();
            database.ref("/player1").set({
                name: $("#playerName").val(),
                wins: player1.wins,
                looses: player1.looses,
                movement: -1
            });
        }
        if (player2_active){
            $("#buttons_p1").text(" ");
            $("#player2_name").text($("#playerName").val());
            player2.name = $("#playerName").val();
            $("#wins_p2").text("Wins: "+player2.wins);
            $("#looses_p2").text("Looses: "+player2.looses);
            database.ref("/player2").set({
                name: $("#playerName").val(),
                wins: player2.wins,
                looses: player2.looses,
                movement: -1
            });
        }
    }
});

window.onload = function () {
    $("#nameForm").show();
    $("#player1").hide();
    $("#player2").hide();
};