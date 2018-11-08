
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
            console.log(response);
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
                        
                            if (bookBuy != undefined) { buy = $("<td> <button href='" + bookBuy + "'>Buy</button></td>");
                        } else {buy = $("<td></td>");};
                          
                        tRow
                          .append(title)
                          .append(author)
                          .append(image)
                          .append(buy)
                          $("#tBody").append(tRow);
    
                    
                }
            
                // printOut();
                
        });
    });///search ends here

//     Adding API For Newyork Times best sallers
//    Creating URL - Ajex call to get cover pictures
   function CreateQUeryURLTimes(){
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
        
    }).fail(function() {
        console.log("error");
        $('.results').html('This feature is not working. :-(');
    });
};

NewyorkBookSaller();

});


