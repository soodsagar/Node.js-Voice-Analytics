$(function() {
    var doughnutData = [
        {
            value: 250,
            color:"#bf616a",
            highlight: "#FF5A5E",
            label: "Red"
        },
        {
            value: 50,
            color: "#a3be8c",
            highlight: "#5AD3D1",
            label: "Green"
        },
        {
            value: 100,
            color: "#ebcb8b",
            highlight: "#FFC870",
            label: "Yellow"
        },
        {
            value: 40,
            color: "#949FB1",
            highlight: "#A8B3C5",
            label: "Grey"
        },
        {
            value: 120,
            color: "#b48ead",
            highlight: "#616774",
            label: "Blue"
        }

    ];

    var ctx = document.getElementById("doughnut-area").getContext("2d");
    window.myDoughnut = new Chart(ctx).Doughnut(doughnutData, {
            responsive : true,
            animateRotate: true,
            animationSteps: 70,
            animationEasing: "easeOutQuart",
            legendTemplate : "<ul class='<%=name.toLowerCase()%>-legend'><% for (var i=0; i<segments.length; i++){%><li><span style='background-color:<%=segments[i].fillColor%>'></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

    });





    var graphData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Garage Door",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "Bedroom Lights",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 50, 55, 50, 59, 63]
            },
            {
                label: "Front Door Lock",
                fillColor: "rgba(192,151,205, 0.2)",
                strokeColor: "#C997CD",
                pointColor: "#C997CD",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [10, 14, 30, 26, 40, 42, 80]
            }
        ]
    };

    //var ctx5 = document.getElementById("graph-area").getContext("2d");
    //var myLineChart = new Chart(ctx5).Line(graphData, {reponsive: true});





});


