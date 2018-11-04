$(document).ready(function () {
    // Initialize Firebase/////////////////////////////////////////
    var config = {
        apiKey: "AIzaSyAEx3x76nthT00U_D9it7TeiWtdg8YXrHM",
        authDomain: "swdteamproject.firebaseapp.com",
        databaseURL: "https://swdteamproject.firebaseio.com",
        projectId: "swdteamproject",
        storageBucket: "swdteamproject.appspot.com",
        messagingSenderId: "446597298610"
    };
    firebase.initializeApp(config);
    //   Initialization Done ////////////////////////////////////////////////

    // Create a variable to reference the database.///////////////////////
    var database = firebase.database();

    var UserName = "";
    var Password;
    var ConfirmPass;
    var copySnapshot;
    var loginid;
    var loginpassword;

    ////On Click Submit Button//////////////////////////////////////////////
    $("#sign-on").on("click", function (event) {
        event.preventDefault();

        // Grabbed values from text boxes
        UserName = $("#name-input").val().trim();
        Password = $("#psw-input").val().trim();
        ConfirmPass = $("#confpsw-input").val().trim();

        //Check if password is matching with confirm password
        if (Password == ConfirmPass) {
            // Code for handling the push data in firebase realtime DB
            database.ref("/users").push({
                UserName: UserName,
                Password: Password,
                ConfirmPassword: ConfirmPass,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
        } else {
            document.write("Password missmatch please try login again");
        }

    });////On Click SignUp Ends

    ///Reading Stored Data from DB///////////////////////////////////////////
    // Firebase watcher .on("child_added"
    database.ref("/users").on("child_added", function (snapshot) {
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();

        // Console.loging the last user's data
        console.log(sv.UserName);
        console.log(sv.Password);

        // Change the HTML to reflect

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    ////////////SignIn////Method///////////////////////////////////////////////
    $("#sign-in").on("click", function (event) {
        event.preventDefault();

        //Performing match
loginid = $("#uname-input").val().trim();
loginpassword = $("#upsw-input").val().trim();
        
//Reading Login Data from DB
        database.ref("/users").on('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
            
                console.log("ChildData" + childData.Password + loginid + loginpassword);
                if(loginid == childData.UserName)
                {
                    if(loginpassword == childData.Password){
                        alert("found Match redirect to Shelf member site");
                        // break;
                    }
                }else{
                    console.log("user login Not match!! Try again");
                    // continue;
                }

            });
        });




    });////On Click SignIn Ends
//Denise-branch start here


var bookName = "The Notebook";
//var apikey= "AIzaSyARl6WereIzo_hkzX98ao7MV1SgzfLpYno"
var queryUrl = "https://www.googleapis.com/books/v1/volumes?q=" + bookName;
    console.log(queryUrl);
 $.ajax({
        url: queryUrl,
        method: "GET"
    }).done(function (response) {
        console.log(response);
            var bookTitle = response.items[0].volumeInfo.title;
            var bookAuthor= response.items[0].volumeInfo.authors;  
            var bookImage = response.items[0].volumeInfo.imageLinks.smallThumbnail;
            var bookBuy = response.items[0].saleInfo.buyLink;

            console.log(bookTitle);
            console.log(bookAuthor);
            console.log(bookImage);
            console.log(bookBuy);

            //make for loop for authors after variables 
            
    });
})










    // var getBooksApi = $(this).text();
    // var queryUrl = "https://www.googleapis.com/books/v1/volumes?q=" + getBooksApi + "&api_key=AIzaSyARl6WereIzo_hkzX98ao7MV1SgzfLpYno";
    //     //console.log(queryUrl);
 
    // $.ajax({
    //     url: queryUrl,
    //     method: "GET"
    // }).done(function (response) {
    //     console.log(response.items[0].volumeInfo);
    //         var bookTitle = response.items[i].volumeInfo.title;
    //         var bookAuthor= response.items[i].volumeInfo.authors[i];
    //         var bookImage = response.items[i].imageLinks.smallThumbnail.url;
    //         var bookBuy = response.items[i].buyLink.url

           
           
           
    //        $("#postImages").attr("data-still", stillImg);
    //         $("#postImages").attr("data-animate", animateImg);
    //         $("#postImages").attr("data-state", "still");

    //     $("#postImages").prepend("<img src='" +stillImg+ "'>");
    //     $("#postImages").prepend("<p> Rating: " +ratingImg + "</p>");
    //     //$("#postImages").prepend("<img src='" +animateImg+ "'>");
    //     };

    //     $("img").on("click", function() {
    //         var isState = $(this).attr("data-state");
    //         if (isState === "still") {
    //             $(this).attr("data-animate", $(this).data("animate"));
    //             $(this).attr("data-state", "animate");
    //         };
    //         if (isState !== "still") {
    //             $(this).attr("data-still", $(this).data("still"));
    //             $(this).attr("data-state", "still");
    //         };
    //     })

    // });



