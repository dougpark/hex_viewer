// this runs when page is finished loading
$(document).ready(function () {

    // set text
    //$("#main").html("Hello World");

    // button click
    // $("#btn1").click(function () {
    //     changeBackgroundColor();
    // });
})


function loadFile() {

    $.ajax({
        url: "./sample.txt",
        method: "GET",
        success: function (response) {

            processText(response);



        }
    });
}

function processText(str) {
    var header = {
        'header': []
    };
    koanList.push(header);

    // put each line into an array
    var input = str.split("\n");

    // parse each line of input filej - pass 1
    input.forEach(parse);

    // final cleanup phase - pass 2
    koanList.forEach(parse2);

    koanList.forEach(disp);


    console.log(koanList);

}

function disp(row, index, array) {

    if (row.header) {
        let text = row.header;
        text.forEach(function (row) {
            $("#about-header").append('<h6 class="comment-1 text-justify">' + row + '</h6>');
        });
    }

    if (row.title) {

        let title = row.title;

        var patt = new RegExp("[0-9]+\\.");
        var result = patt.exec(title);
        if (result != null) {
            title = title.replace(result, "");
            var patt = new RegExp("[0-9]{1,}");
            var result = patt.exec(result);

            $("#main").append('<h2 class="title-1 text-center text-uppercase">&#9866; ' + result + ' &#9866;</h2>');
        }

        $("#main").append('<h2 class="title-1 text-center text-uppercase">' + title + '</h2><br>');
    }

    if (row.body) {
        let text = row.body;
        let drop = "drop-cap";
        text.forEach(function (row) {
            $("#main").append('<h6 class="body-1 text-justify ' + drop + '">' + row + '</h6>');
            drop = "";
        })

    }
    let spaceAfter = 2;

    if (row.comment) {
        $("#main").append('<hr style="width:50%;text-align:center;"></hr>');

        let text = row.comment;
        text.forEach(function (row) {
            //var res = str.charCodeAt(4).toString(16);
            //$("#hex").append('<span style="font-family: monospace">');
            //$("#hex").append('<pre style="font-family: monospace" > ');

            //for (var i = 0; i < row.length; i = i + 28) {

            let newHex = '';
            let newAscii = '';
            let s = row; //.substring(0, row.length);
            for (var j = 0; j < s.length; j++) {
                let c = s.charCodeAt(j).toString(16);
                if (j % 2 == 0) {
                    newHex += '<z>' + c + '</z>';
                } else {
                    newHex += '<y>' + c + '</y>';
                }
                if (spaceAfter > 0) {
                    if ((j + 1) % spaceAfter == 0) {
                        newHex += '&nbsp;';
                    }
                }
            }
            //$("#hex").append('<br>');
            for (var j = 0; j < s.length; j++) {
                let c = s.charAt(j)
                let cc = s.charCodeAt(j);
                if (cc <= 32 || cc >= 127) {
                    c = '_'
                }
                if (j % 2 == 0) {
                    newAscii += '<z>' + c + '&nbsp;</z>';
                } else {
                    newAscii += '<y>' + c + '&nbsp;</y>';
                }
                if (spaceAfter > 0) {
                    if ((j + 1) % spaceAfter == 0) {
                        newAscii += '&nbsp;';
                    }
                }
            }

            newAscii = '<div class="div-break" >' + newAscii + '</div>';

            //}
            $("#hex").append(newHex + '<div class="break-height"></div>');
            $("#hex").append(newAscii);
            //$("#hex").append('<br>');
            //$("#main").append(row);
            //$("#hex").append('</pre>');
            //$("#hex").append('</span>');
        })

    }
    if (row.verse) {
        let line = '<blockquote><h6 class="verse-1 text-justify">';
        let text = row.verse;
        let count = 0;
        text.forEach(function (row) {
            if (count > 0) {
                line += '&nbsp;'
            }
            line += row + '</br>';
            count++;
        })
        line += '</h6 > </blockquote><br>';

        $("#main").append(line);

    }

}

function parse2(row, index, array) {

    if (row.comment) {
        let com = row.comment;
        let index = com.length - 1;
        let last = com[index];
        com.splice(index, 1); // remove from com array

        row.verse.unshift(last); // add to beginning of verse array

    }


}

var koanList = [];
var koanCount = 0;

// detected on previous loops so have to keep alive
var comment = 0;
var bodyStart = 0;
var body = 0;

function parse(row, index, array) {

    // detected each loop so start fresh
    var skip = 0;
    var title = 0;
    var verse = 0;

    // title 
    var patt = new RegExp("[0-9]+\\.");
    var result = patt.exec(row);
    if (result != null) {

        // reset trackers
        title = 1;
        body = 0;
        bodyStart = 1; // body starts on next loop
        verse = 0;

        koanCount += 1;

        var koan = {
            'koan': koanCount,
            'title': "",
            'body': [],
            'comment': [],
            'verse': [],
        };

        koan.title = row;
        koanList.push(koan);
    }

    //body
    // starts after title is found

    // comment
    var patt2 = new RegExp("comment:");
    var result2 = patt2.exec(row);
    if (result2 != null) {
        comment = 1;
        if (body == 1) {
            bodyStart = 0;
            body = 0;
        }
    }

    //verse
    var patt3 = new RegExp("^ ");
    var result3 = patt3.exec(row);
    if (result3 != null) {
        verse = 1;
        comment = 0;
    }


    // carriage-return - check for 1 or more spaces before \r
    var patt02 = new RegExp('^[ ]{0,}\r');
    var result02 = patt02.exec(row);
    if (result02 != null) {
        skip = 1;
    }

    var patt02a = new RegExp('^[ ]{0,}\n');
    var result02a = patt02a.exec(row);
    if (result02a != null) {
        skip = 1;
    }
    if (row.length < 10) {
        skip = 1;
    }

    // remove end \r here
    var patt03 = new RegExp('\r');
    row = row.replace(patt03, '');
    var patt03a = new RegExp('\n');
    row = row.replace(patt03a, '');



    if (skip == 0) {
        if (body == 1) {
            //$("#main").append('<p class="body-1">' + 'body-> ' + row + '</p>');
            koanList[koanList.length - 1].body.push(row);
        } else
        if (verse == 1) {
            //$("#main").append('<p class="verse-1">' + 'verse-> ' + row + '</p>');
            koanList[koanList.length - 1].verse.push(row);
        } else

        if (comment == 1) {
            //$("#main").append('<p class="comment-1">' + 'comment-> ' + row + '</p>');
            koanList[koanList.length - 1].comment.push(row);
        } else

        if (title == 1) {
            //$("#main").append('<p class="title-1">' + 'title-> ' + row + '</p>');
        } else {
            //$("#main").append('<p class="unknown">' + 'header-> ' + row + '</p>');

            if (row) {
                koanList[koanList.length - 1].header.push(row);
            }
        }

        // bodyStart is set in Title, so start body next round
        if (bodyStart == 1) {
            body = 1;
        }

    }





}