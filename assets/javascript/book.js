
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
    //////////Initialization Done /////////////////////////////////////////

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
                    //Code for handling the push data in firebase realtime DB
                    var mdPass = MD5(Password);
                    console.log(MD5(Password));
                    ///////////////////////////////////////////////////////////
                    database.ref("/users").push({
                        UserName: UserName,
                        Password: mdPass,
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
    ////////////SignIn////Method///////////////////////////////////////////////
    $("#sign-in").on("click", function (event) {
        event.preventDefault();

        //Performing match
        loginid = $("#uname-input").val().trim();
        loginpassword = $("#upsw-input").val().trim();

        //Empty the input box
        $("#uname-input").empty();
        $("#upsw-input").empty();
        // $("#lblmessage").empty();

        //Reading Login Data from DB
        database.ref("/users").on('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                if (loginid == childData.UserName) {
                    var userPsw = MD5(loginpassword);
                    if (userPsw == childData.Password) {
                        window.location = "index2.html"
                    }
                    else {
                        $("#lblmessage1").text("User Login/Password not match!!Try again");
                    }
                } else {
                    console.log("ChildData" + childData.Password + loginid + loginpassword);//for test
                    $("#lblmessage1").text("User Login/Password not match!!Try again");
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
            var img;
            for (var i = 0; i < result.lists.length; i++) {
                timesimageArr[i] = result.lists[i].list_image;
                console.log(timesimageArr[i]);

                $('.carousel-inner').append('<div class="maybe"> </div>');
                $('.maybe').append($('<div class="carousel-item item "><img class="d-block w-100 img-fluid" src=' + result.lists[i].list_image + '></div>'));
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

    //Search COde////
    $("#searchButton").on("click", function (event) {

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
                var bookImage = response.items[i].volumeInfo.imageLinks.smallThumbnail;
                var bookTitle = response.items[i].volumeInfo.title;
                var bookAuthor = response.items[i].volumeInfo.authors;
                var bookBuy = response.items[i].saleInfo.buyLink;

                console.log(bookImage);
                console.log(bookTitle);
                console.log(bookAuthor);
                console.log(bookBuy);
                printOut();
            };
            //make for loop for authors after variables 
            function printOut() {

                // $("#tBody").empty();
                var tRow = $("<tr>");
                var Rowcount = $("<th>");
                var image = $("<td> <img src='" + bookImage + "'></td>");
                var title = $("<td>").text(bookTitle);
                var author = $("<td>").text(bookAuthor);

                var buy;

                if (bookBuy != undefined) {
                    buy = $("<td> <button><a href='" + bookBuy + "'>Buy</a></button></td>");
                    // <button class="btn btn-primary" onclick="window.location.href='/page2'">Continue</button>
                } else {
                    buy = $("<td></td>");
                };
                tRow
                    .append(image)
                    .append(title)
                    .append(author)
                    .append(buy)
                $("#tBody").append(tRow);
            }
            // printOut();
        });
    });///search ends her

    //NewYork Best Book Salers API to get book cover images for carasole//
    NewyorkBookSaller();

    /**************************MD5******************************************/
    var MD5 = function (string) {

        function RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F(x, y, z) { return (x & y) | ((~x) & z); }
        function G(x, y, z) { return (x & z) | (y & (~z)); }
        function H(x, y, z) { return (x ^ y ^ z); }
        function I(x, y, z) { return (y ^ (x | (~z))); }

        function FF(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        function WordToHex(lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        };

        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

        string = Utf8Encode(string);

        x = ConvertToWordArray(string);

        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

        for (k = 0; k < x.length; k += 16) {
            AA = a; BB = b; CC = c; DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }

        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

        return temp.toLowerCase();
    }
    /********************************************************************* */
})