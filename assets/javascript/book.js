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

})


