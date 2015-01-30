

function get_command_count(response){
    var cnt_lights = 0, cnt_thermo = 0, cnt_audio = 0, cnt_video = 0, cnt_google = 0;
    $.each(response.result, function(i, item){
        var command_code = item.substr(0,2);
        switch(command_code){
            case "01":
                cnt_lights++;
                break;
            case "03":
                cnt_thermo++;
                break;
            case "08":
                cnt_audio++;
                break;
            case "09":
                cnt_video++;
                break;
            case "10":
                cnt_google++;
                break;
        }

    });

    var ret = '{ "Lights": "'+cnt_lights + '",' +
        '"Thermostat": "'+cnt_thermo + '",' +
        '"Audio Controls": "'+cnt_audio + '",' +
        '"Video & TV": "'+cnt_video + '",' +
        '"Google Search": "'+cnt_google +
        '" }';
    return ret
}


function generate_graph(dates_and_count){
    var x = [];
    var y = [];
    $.each(dates_and_count, function(date, count){
        x.push(date);
        y.push(count);
    });

    var graphData = {
        labels: x,
        datasets: [
            {
                fillColor: "rgba(192,151,205, 0.2)",
                strokeColor: "#C997CD",
                pointColor: "#C997CD",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: y
            }
        ]
    };


    var ctx2 = document.getElementById("graph-area-bar").getContext("2d");
    var ctx3 = document.getElementById("graph-area-line").getContext("2d");
    var myBarChart = new Chart(ctx2).Bar(graphData, {scaleBeginAtZero : true,barStrokeWidth : 2});
    var myLineChart = new Chart(ctx3).Line(graphData, {scaleBeginAtZero : true});
}

function generate_donut(command, total){

    var k = 0;
    var doughnutData = [];
    var colorme = ["#bf616a","#a3be8c","#ebcb8b","#949FB1", "#b48ead"];
    var highlightme = ["#FF5A5E","#5AD3D1","#FFC870","#A8B3C5", "#616774"];
    var command_arr = json_to_array(command);

    while (k < parseInt(total)){
        doughnutData.push({
            value: parseInt(command_arr[k]),
            color: colorme[k],
            highlight: highlightme[k]
        });
        k++;
    }


    var ctx = document.getElementById("doughnut-area").getContext("2d");
    window.myDoughnut = new Chart(ctx).Doughnut(doughnutData, {
        responsive : true,
        animateRotate: true,
        animationSteps: 70,
        animationEasing: "easeOutQuart",
        legendTemplate : "<ul class='<%=name.toLowerCase()%>-legend'><% for (var i=0; i<segments.length; i++){%><li><span style='background-color:<%=segments[i].fillColor%>'></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
    });
}

function populate_command_table(data, homeid){
    $('#command_table').html("<tr><th>#</th><th>Home ID</th><th>Command</th><th>Total Usage</th></tr>");
    var count = 1;
    $.each(data, function(command, command_count){
        if (command_count > "0"){
            $('#command_table').append(
                "<tr>" +
                    "<td>"+count+"</td>"+
                    "<td>"+homeid+"</td>"+
                    "<td>"+command+"</td>"+
                    "<td>"+command_count+"</td>"+
                    "</tr>"
            );
            count++;
        }
    });
}


function populate_donut_table(command, total){
    $(".donut-breakdown").html("");

    var colorme = ["#bf616a","#a3be8c","#ebcb8b","#949FB1", "#b48ead"];
    var k = 0;

    for (key in command){
        $(".donut-breakdown").append(
            "<tr>  <td class='small-block-td' style='background: "+colorme[k]+"'></td>  <td> &nbsp;&nbsp;"+key+" </td>  </tr>"
        );
        k++
    }

}



function populate_graph_table(dates_with_count, homeid, timeframe){
    if (timeframe == "week"){
        $('#graph-table').html("<tr><th>#</th><th>Home ID</th><th>Date</th><th>Total Usage</th></tr>");
        var k = 1;
        $.each(dates_with_count, function(date, count){
            $('#graph-table').append(
                "<tr>" +
                    "<td>"+k+"</td>"+
                    "<td>"+homeid+"</td>"+
                    "<td>"+date+"</td>"+
                    "<td>"+count+"</td>"+
                "</tr>"
            );
            k++;
        });

    }

    if (timeframe == "month"){
        $('#graph-table').html("<tr><th>#</th><th>Home ID</th><th>Date</th><th>Total Usage</th></tr>");
        var k = 1;
        $.each(dates_with_count, function(date, count){
            $('#graph-table').append(
                "<tr>" +
                    "<td>"+k+"</td>"+
                    "<td>"+homeid+"</td>"+
                    "<td>"+date+"</td>"+
                    "<td>"+count+"</td>"+
                    "</tr>"
            );
            k++;
        });

    }
    if (timeframe == "3months"){
        $('#graph-table').html("<tr><th>#</th><th>Home ID</th><th>Date</th><th>Total Usage</th></tr>");
        var k = 1;
        $.each(dates_with_count, function(date, count){
            $('#graph-table').append(
                "<tr>" +
                    "<td>"+k+"</td>"+
                    "<td>"+homeid+"</td>"+
                    "<td>"+date+"</td>"+
                    "<td>"+count+"</td>"+
                    "</tr>"
            );
            k++;
        });

    }
    if (timeframe == "6months"){
        $('#graph-table').html("<tr><th>#</th><th>Home ID</th><th>Date</th><th>Total Usage</th></tr>");
        var k = 1;
        $.each(dates_with_count, function(date, count){
            $('#graph-table').append(
                "<tr>" +
                    "<td>"+k+"</td>"+
                    "<td>"+homeid+"</td>"+
                    "<td>"+date+"</td>"+
                    "<td>"+count+"</td>"+
                    "</tr>"
            );
            k++;
        });

    }

}


function parse_dates(data, timeframe){
    var dates = [];
    var today = new Date();
    $.each(data.result, function(timestamp, command){
        timestamp = timestamp.replace(/Z.*T/, '');
        var date = new Date(timestamp);

        if (timeframe == "week"){
            if (days_between(today, date) <= 7){
                var thedate = date.getMonth()+1+"/"+date.getDate()+"/2014";
                dates.push(thedate);
            }

        }
        if (timeframe == "month"){
            if (days_between(today, date) <= 30){
                var thedate = date.getMonth()+1+"/"+date.getDate()+"/2014";
                dates.push(thedate);
            }
        }
        if (timeframe == "3months"){
            if (days_between(today, date) <= 90){
                var thedate = date.getMonth()+1+"/"+date.getDate()+"/2014";
                dates.push(thedate);
            }
        }
        if (timeframe == "6months"){
            if (days_between(today, date) <= 180){
                var thedate = date.getMonth()+1+"/"+date.getDate()+"/2014";
                dates.push(thedate);
            }
        }

    });
    var counts = {};
    dates.forEach(function(x) { counts[x] = (counts[x] || 0)+1; })
    return counts;

}


function days_between(date1, date2) {
    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24
    // Convert both dates to milliseconds
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()
    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms)
    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)

}




function json_to_array(json){
    var arr = [];
    for (var prop in json) {
        arr.push(json[prop]);
    }
    return arr;
}
