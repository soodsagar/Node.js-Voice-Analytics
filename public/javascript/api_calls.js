

$(function(){


    $("#search-home").click(function(){

        var homeprofile = $("#homeid").val();
        $.ajax({
            url: "http://sample.whataremindsfor.com:45001/apiv1/voiceAnalyticsHomeProfile/",
            method: "POST",
            data: {HPDL_ID: homeprofile, appkey: "59cddd076cf2a00b9f5555585c177276d8a49873", appsecret: "01d3cb9455722c2f6760e11f14a0571179649873", conkey: "09326eefff2cad2ae9f4c0fd5d4c7b71db249873", consecret: "7092379b31cd621c2c1b574e47ec956733f49873"},
            success: function(result){
                var json_data = $.parseJSON(result);
                if (json_data.response_code == "2"){
                    $(".error").html("");
                    console.log(result);
                    $("#data-content-1").fadeIn();
                    window.setTimeout(function (){$("#data-content-2").fadeIn();}, 220);
                    window.setTimeout(function (){$("#data-content-3").fadeIn();}, 440);

                    // insert here timeout for live data feed
                    var command_count_json = $.parseJSON(get_command_count(json_data));
                    populate_command_table(command_count_json, homeprofile);
                    $(".total-commands-details").html("<h5>Total Count: "+json_data.total_results+"</h5>");

                    var total_commands = Object.keys(command_count_json).length;
                    generate_donut(command_count_json, total_commands);
                    populate_donut_table(command_count_json, total_commands);

                    $(".periodic-content").html("<p align='center'><b>Select your range from above</b></p>");
                    $("#graph-table").html("");
                    $("#graph-holder").hide();

                    // GRAPH AND ITS TABLE
                    $("#7-days").click(function(){
                        $(".day-btn").removeClass("btn-success").addClass("btn-info");
                        $(this).removeClass("btn-info").addClass("btn-success");
                        var dates_with_count = parse_dates(json_data, "week");
                        $(".periodic-content").html("");
                        $("#graph-holder").show();
                        populate_graph_table(dates_with_count, homeprofile, "week");
                        generate_graph(dates_with_count);
                    });
                    $("#30-days").click(function(){
                        $(".day-btn").removeClass("btn-success").addClass("btn-info");
                        $(this).removeClass("btn-info").addClass("btn-success");
                        var dates_with_count = parse_dates(json_data, "month");
                        $(".periodic-content").html("");
                        $("#graph-holder").show();
                        populate_graph_table(dates_with_count, homeprofile, "month");
                        generate_graph(dates_with_count);
                    });
                    $("#90-days").click(function(){
                        $(".day-btn").removeClass("btn-success").addClass("btn-info");
                        $(this).removeClass("btn-info").addClass("btn-success");
                        var dates_with_count = parse_dates(json_data, "3months");
                        $(".periodic-content").html("");
                        $("#graph-holder").show();
                        populate_graph_table(dates_with_count, homeprofile, "3months");
                        generate_graph(dates_with_count);
                    });
                    $("#180-days").click(function(){
                        $(".day-btn").removeClass("btn-success").addClass("btn-info");
                        $(this).removeClass("btn-info").addClass("btn-success");
                        var dates_with_count = parse_dates(json_data, "6months");
                        $(".periodic-content").html("");
                        $("#graph-holder").show();
                        populate_graph_table(dates_with_count, homeprofile, "6months");
                        generate_graph(dates_with_count);
                    });
                }
                if (json_data.response_code == "0" || json_data.response_code == "1"){
                    $(".error").html("<br><div class='alert alert-danger'> <i class='fa fa-exclamation-triangle'></i> There was an error, please make sure you entered the correct search query</div>")
                }


            },
            error: function(xhr){
                console.log("Error: "+ xhr.status);
            }

        });



    });




    $("#search-user").click(function(){

        var userid = $("#userid").val();
        $.ajax({
            url: "http://sample.whataremindsfor.com:45001/apiv1/voiceAnalyticsUser/",
            method: "POST",
            data: {appkey: "59cddd076cf2a00b9f5555585c177276d8a49873", appsecret: "01d3cb9455722c2f6760e11f14a0571179649873", conkey: "09326eeeee2cad2ae9f4c0fd5d4c7b71db2b0e48", consecret: "7092379b31cd621c2c1b574e47ec956733f49873"},
            success: function(result){
                var json_data = $.parseJSON(result);
                if (json_data.response_code == "2"){
                    $(".error").html("");
                    console.log(result);
                    $("#data-content-1").fadeIn();
                    window.setTimeout(function (){$("#data-content-2").fadeIn();}, 220);
                    window.setTimeout(function (){$("#data-content-3").fadeIn();}, 440);

                    // insert here timeout for live data feed

                    var command_count_json = $.parseJSON(get_command_count(json_data));
                    populate_command_table(command_count_json, userid);
                    $(".total-commands-details").html("<h5>Total Count: "+json_data.total_results+"</h5>");

                    var total_commands = Object.keys(command_count_json).length;
                    generate_donut(command_count_json, total_commands);
                    populate_donut_table(command_count_json, total_commands);

                    $(".periodic-content").html("<p align='center'><b>Select your range from above</b></p>");
                    $("#graph-table").html("");
                    $("#graph-holder").hide();

                    // GRAPH AND ITS TABLE
                    $("#7-days").click(function(){
                        $(".day-btn").removeClass("btn-success").addClass("btn-info");
                        $(this).removeClass("btn-info").addClass("btn-success");
                        var dates_with_count = parse_dates(json_data, "week");
                        $(".periodic-content").html("");
                        $("#graph-holder").show();
                        populate_graph_table(dates_with_count, userid, "week");
                        generate_graph(dates_with_count);
                    });
                    $("#30-days").click(function(){
                        $(".day-btn").removeClass("btn-success").addClass("btn-info");
                        $(this).removeClass("btn-info").addClass("btn-success");
                        var dates_with_count = parse_dates(json_data, "month");
                        $(".periodic-content").html("");
                        $("#graph-holder").show();
                        populate_graph_table(dates_with_count, userid, "month");
                        generate_graph(dates_with_count);
                    });
                    $("#90-days").click(function(){
                        $(".day-btn").removeClass("btn-success").addClass("btn-info");
                        $(this).removeClass("btn-info").addClass("btn-success");
                        var dates_with_count = parse_dates(json_data, "3months");
                        $(".periodic-content").html("");
                        $("#graph-holder").show();
                        populate_graph_table(dates_with_count, userid, "3months");
                        generate_graph(dates_with_count);
                    });
                    $("#180-days").click(function(){
                        $(".day-btn").removeClass("btn-success").addClass("btn-info");
                        $(this).removeClass("btn-info").addClass("btn-success");
                        var dates_with_count = parse_dates(json_data, "6months");
                        $(".periodic-content").html("");
                        $("#graph-holder").show();
                        populate_graph_table(dates_with_count, userid, "6months");
                        generate_graph(dates_with_count);
                    });


                }
                if (json_data.response_code == "0" || json_data.response_code == "1"){
                    $(".error").html("<br><div class='alert alert-danger'> <i class='fa fa-exclamation-triangle'></i> There was an error, please make sure you entered the correct search query</div>")
                }



            },
            error: function(xhr){
                console.log("Error: "+ xhr.status);
            }

        });



    });



    $("#search-all").click(function(){

        $.ajax({
            url: "http://sample.whataremindsfor.com:45001/apiv1/voiceAnalyticsAverage/",
            method: "POST",
            data: {appkey: "59cddd076cf2a00b9f5555585c177276d8a49873", appsecret: "01d3cb9455722c2f6760e11f14a0571179649873", conkey: "09326eeeee2cad2ae9f4c0fd5d4c7b71db2b0e48", consecret: "7092379b31cd621c2c1b574e47ec956733f49873"},
            success: function(result){
                var json_data = $.parseJSON(result);
                if (json_data.response_code == "2"){
                    $(".error").html("");
                    console.log(result); 
                    var homeid = json_data.homeid;
                    $("#data-content-1").fadeIn();
                    window.setTimeout(function (){$("#data-content-2").fadeIn();}, 220);
                    window.setTimeout(function (){$("#data-content-3").fadeIn();}, 440);

                    // insert here timeout for live data feed

                    var command_count_json = $.parseJSON(get_command_count(json_data));
                    populate_command_table(command_count_json, homeid);
                    $(".total-commands-details").html("<h5>Total Count: "+json_data.total_results+"</h5>");

                    var total_commands = Object.keys(command_count_json).length;
                    generate_donut(command_count_json, total_commands);
                    populate_donut_table(command_count_json, total_commands);


                    $(".periodic-content").html("<p align='center'><b>Select your range from above</b></p>");
                    $("#graph-table").html("");
                    $("#graph-holder").hide();

                    // GRAPH AND ITS TABLE
                    $("#7-days").click(function(){
                        $(".day-btn").removeClass("btn-success").addClass("btn-info");
                        $(this).removeClass("btn-info").addClass("btn-success");
                        var dates_with_count = parse_dates(json_data, "week");
                        $(".periodic-content").html("");
                        $("#graph-holder").show();
                        populate_graph_table(dates_with_count, homeid, "week");
                        generate_graph(dates_with_count);
                    });
                    $("#30-days").click(function(){
                        $(".day-btn").removeClass("btn-success").addClass("btn-info");
                        $(this).removeClass("btn-info").addClass("btn-success");
                        var dates_with_count = parse_dates(json_data, "month");
                        $(".periodic-content").html("");
                        $("#graph-holder").show();
                        populate_graph_table(dates_with_count, homeid, "month");
                        generate_graph(dates_with_count);
                    });
                    $("#90-days").click(function(){
                        $(".day-btn").removeClass("btn-success").addClass("btn-info");
                        $(this).removeClass("btn-info").addClass("btn-success");
                        var dates_with_count = parse_dates(json_data, "3months");
                        $(".periodic-content").html("");
                        $("#graph-holder").show();
                        populate_graph_table(dates_with_count, homeid, "3months");
                        generate_graph(dates_with_count);
                    });
                    $("#180-days").click(function(){
                        $(".day-btn").removeClass("btn-success").addClass("btn-info");
                        $(this).removeClass("btn-info").addClass("btn-success");
                        var dates_with_count = parse_dates(json_data, "6months");
                        $(".periodic-content").html("");
                        $("#graph-holder").show();
                        populate_graph_table(dates_with_count, homeid, "6months");
                        generate_graph(dates_with_count);
                    });

                }
                if (json_data.response_code == "0" || json_data.response_code == "1"){
                    $(".error").html("<br><div class='alert alert-danger'> <i class='fa fa-exclamation-triangle'></i> There was an error, please make sure you entered the correct search query</div>")
                }



            },
            error: function(xhr){
                console.log("Error: "+ xhr.status);
            }

        });



    });


});

