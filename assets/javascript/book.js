
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
    var timesimageArr = [];
    var isValidated = false;


    ////On Click Submit Button//////////////////////////////////////////////
    $("#sign-on").on("click", function (event) {
        event.preventDefault();

        // Grabbed values from text boxes
        UserName = $("#name-input").val().trim();
        Password = $("#psw-input").val().trim();
        ConfirmPass = $("#confpsw-input").val().trim();

        $("#lblmessage").empty();

        ///Validate Input Call validate function/////
        if (isValidateUserID(UserName)) {
            if (isValidatePassword(Password)) {
                //Check if password is matching with confirm password
                if (Password == ConfirmPass) {
                    // Code for handling the push data in firebase realtime DB
                    database.ref("/users").push({
                        UserName: UserName,
                        Password: Password,
                        ConfirmPassword: ConfirmPass,
                        dateAdded: firebase.database.ServerValue.TIMESTAMP
                    });
                    $("#lblmessage").text("SignUp successfull..Enjoy book reading");
                      emptyUIElement();
                } else {
                    $("#lblmessage").text("Password and Confirm password did not match.Please enter password again..");
                }
            } else {
                isValidated = false;
                $("#lblmessage").text("SignUp Fail..Password should contain 8 character and atleast one special character and one number....");
            }
        } else {
            isValidated = false;
            $("#lblmessage").text("SignUp Fail..UserId should contain only character and number, UserID should be a valid e-mail id....");
        }//User id validation




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
                if (loginid == childData.UserName) {
                    if (loginpassword == childData.Password) {

                        // break;
                    }
                } else {
                    console.log("user login Not match!! Try again");
                    // continue;
                }
            });
        });
    });////On Click SignIn Ends

    //Adding API For Newyork Times best sallers
    //Creating URL - Ajex call to get cover pictures
    function CreateQUeryURLTimes() {
        var apiKey = "b7dc6a76033341b184c4c50f44c13cca"
        var url = "https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=" + apiKey;
        return url;
    }

    function NewyorkBookSaller(bookcover) {
        var queryURL = CreateQUeryURLTimes();
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            var result = response.results;
            console.log(result);
            var img
            for (var i = 0; i < result.lists.length; i++) {
                timesimageArr[i] = result.lists[i].list_image;
                console.log(timesimageArr[i]);
            }

        }).fail(function () {
            console.log("error");
            $('.results').html('This feature is not working. :-(');
        });
    };
    ////////////////ADDING VALIDATIONS/////////////////////////
    function isValidateUserID(username) {
        var format = /[ !#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

        if (format.test(username)) {
            console.log("FAIL");
            return false;
        } else {
            console.log("PASS");
            return true;
        }
    }
    function isValidatePassword(password) {
        var format = /[ !#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

        if (format.test(password)) {
            console.log("FAIL");
            return true;
        } else {
            console.log("PASS");
            return false;
        }
    }
    ////////////Clear and empty all HTML elements/////////////
    function emptyUIElement() {
        $("#name-input").empty();
        $("#psw-input").empty();
        $("#confpsw-input").empty();
    }
    /////////////Firebase Auth////////////////////////////////
    // var actionCodeSettings = {
    //     // URL you want to redirect back to. The domain (www.example.com) for this
    //     url: 'https://shilpipawar.github.io/SWDTeamProject',
    //     // This must be true.
    //     handleCodeInApp: true,
    // };
    // firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
    //     .then(function () {
    //         // The link was successfully sent. Inform the user.
    //         // Save the email locally so you don't need to ask the user for it again
    //         // if they open the link on the same device.
    //         window.localStorage.setItem('emailForSignIn', email);
    //     })
    //     .catch(function (error) {
    //         // Some error occurred, you can inspect the code: error.code
    //     });

    // // Confirm the link is a sign-in with email link.
    // if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    //     // Additional state parameters can also be passed via URL.
    //     // This can be used to continue the user's intended action before triggering
    //     // the sign-in operation.
    //     // Get the email if available. This should be available if the user completes
    //     // the flow on the same device where they started it.
    //     var email = window.localStorage.getItem('emailForSignIn');
    //     if (!email) {
    //         // User opened the link on a different device. To prevent session fixation
    //         // attacks, ask the user to provide the associated email again. For example:
    //         email = window.prompt('Please provide your email for confirmation');
    //     }
    //     // The client SDK will parse the code from the link for you.
    //     firebase.auth().signInWithEmailLink(email, window.location.href)
    //         .then(function (result) {
    //             // Clear email from storage.
    //             window.localStorage.removeItem('emailForSignIn');
    //             // You can access the new user via result.user
    //             // Additional user info profile not available via:
    //             // result.additionalUserInfo.profile == null
    //             // You can check if the user is new or existing:
    //             // result.additionalUserInfo.isNewUser
    //         })
    //         .catch(function (error) {
    //             // Some error occurred, you can inspect the code: error.code
    //             // Common errors could be invalid email and invalid or expired OTPs.
    //         });
    // }
    //////////////FIrebase Auth Code Ends////////////////////////////////////////////
    //Search COde////
    $("#searchButton").on("click", function(event) {

        event.preventDefault();
        console.log("text");
        var getSearch = $("#formId").val().trim();
    
        console.log("Search String" + getSearch);
        
        //var bookName = "The Notebook";
        //var apikey= "AIzaSyARl6WereIzo_hkzX98ao7MV1SgzfLpYno"
        var queryUrl = "https://www.googleapis.com/books/v1/volumes?q=" + getSearch;
            console.log(queryUrl);
         $.ajax({
                url: queryUrl,
                method: "GET"
            }).done(function (response) {
                console.log("ARR", response);
                for (var i = 0; i < response.items.length; i++) {
                    
                    var bookTitle = response.items[i].volumeInfo.title;
                    var bookAuthor= response.items[i].volumeInfo.authors;  
                    var bookImage = response.items[i].volumeInfo.imageLinks.smallThumbnail;
                    var bookBuy = response.items[i].saleInfo.buyLink;
        
                    console.log(bookTitle);
                    console.log(bookAuthor);
                    console.log(bookImage);
                    console.log(bookBuy);
                    printOut();
                };
                    //make for loop for authors after variables 
        
        
                    function printOut() {
                        
                            // $("#tBody").empty();
                            var tRow = $("<tr>");
                            var title = $("<td>").text(bookTitle);
                            var author =   $("<td>").text(bookAuthor);
                            var image = $("<td> <img src='" + bookImage + "'></td>");
                            var buy;
                            
                                if (bookBuy != undefined) { 
                                    buy = $("<td> <button><a href='" + bookBuy + "'>Buy</a></button></td>");
                                    // <button class="btn btn-primary" onclick="window.location.href='/page2'">Continue</button>
                              } else {
                                    buy = $("<td></td>");
                                };
                              
                            tRow
                              .append(title)
                              .append(author)
                              .append(image)
                              .append(buy)
                              $("#tBody").append(tRow);
        
                        
                    }
                
                    // printOut();
                    
            });
        });///search ends her
    ////////////////////
    //NewYork Best Book Salers API to get book cover images for carasole//
    NewyorkBookSaller();

})


