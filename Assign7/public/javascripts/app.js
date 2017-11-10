 $(document).ready(function() {
  "use strict";


    $("#addUserBtn").on("click", function() {
        var newName = $("input[name='userName']").val();
    	var newEmail = $("input[name='userEmail']").val();
        var newItem = {'user' : {
                name: newName,
                email: newEmail
            }};
        $.ajax({
        	    url: "http://localhost:3000/users",
                type: "POST",
                data: JSON.stringify(newItem),
                contentType: "application/json",
                success: function(newItem, status) {
                	// $itemList.append(buildItemEl(newItem));
                    var $output = $("<p>");
                    $output.text("New userID: " + newItem.id);
                    $(".addUserOutput").html($output);
                }
        });
    });

    /* get userID */
    $("#getUserBtn").on("click", function() {
        var userID = $("input[name='userid']").val();
        
        $.ajax({
                url: "http://localhost:3000/users/" + userID,
                type: "GET",
                success: function(userInfo, status) {
                    // just put output to a simple div as paragraph
                    var $output = $("<p>");
                    $(".getUserOutput").html($output);
                }
        });
    });


    /* add reminder */
    $("#addRemBtn").on("click", function() {
        var userID = $("input[name='userID']").val();
        var newTitle = $("input[name='userTitle']").val();
        var newDesc = $("input[name='userDesc']").val();
        var newReminder  =   {"reminder" : {
                "title" : newTitle,
                "description" : newDesc
            }};
        $.ajax({
                url: "http://localhost:3000/users/" + userID + "/reminders",
                type: "POST",
                data: JSON.stringify(newReminder),
                contentType: "application/json",
                success: function(newItem, status) {
                    // $itemList.append(buildItemEl(newItem));
                    var $output = $("<p>");
                    $output.text("New ReminderID: " + newItem.reminderid);
                    $(".addRemOutput").html($output);
                }
        });
    });


    /* get single reminder */
    $("#getRemBtn").on("click", function() {
        var userID = $("input[name='userID2']").val();
        var reminderID = $("input[name='reminderID2']").val();
        
        $.ajax({
                url: "http://localhost:3000/users/" + userID + "/reminders/" + reminderID,
                type: "GET",
                success: function(reminderInfo, status) {
                    // just put output to a simple div as paragraph
                    var $output = $("<p>");
                    $output.text("Title: " + reminderInfo.title + " | " +
                                 " Description: " + reminderInfo.description + " | " +
                                 " Created: " + reminderInfo.created);
                    $(".getRemOutput").html($output);
                }
        });
    });

    /* get all reminder */
    $("#getAllRemBtn").on("click", function() {
        var userID = $("input[name='userID3']").val();
        
        $.ajax({
                url: "http://localhost:3000/users/" + userID + "/reminders/",
                type: "GET",
                success: function(allReminders, status) {
                    // just put output to a simple div as List
                    $(".getAllRemOutput").empty();
                     allReminders.forEach(function (reminders) {
                        var $output = $("<li>");
                        $output.text("Title: " + reminders.title + " | " +
                                " Description: " + reminders.description + " | " +
                                " Created: " + reminders.created);
                        $(".getAllRemOutput").append($output);
                    });

                }
        });
    });


    /* delete single user */
    $("#delUserBtn").on("click", function() {
        var userID = $("input[name='delUserID']").val();
        
        $.ajax({
                url: "http://localhost:3000/users/" + userID,
                type: "DELETE",
                success: function(status) {
                    // just put output to a simple div as List
                     var $output = $("<p>");
                    $output.text("UserID " + userID + " has been deleted");
                    $(".delUserOutput").html($output);
            }
        });
    });


    /* delete single reminder */
    $("#delRemBtn").on("click", function() {
        var userID = $("input[name='delUserID2']").val();
        var remID = $("input[name='delRemID']").val();
        
        $.ajax({
                url: "http://localhost:3000/users/" + userID + "/reminders/" + remID,
                type: "DELETE",
                success: function(status) {
                    // just put output to a simple div as List
                    $(".delRemOutput").empty();
                     var $output = $("<p>");
                    $output.text("ReminderID " + remID + " has been deleted" +
                                 " for userID: " + userID);
                    $(".delRemOutput").html($output);
            }
        });
    });


    /* delete ALL reminders */
    $("#delAllRemBtn").on("click", function() {
        var userID = $("input[name='delRemUser']").val();
        
        $.ajax({
                url: "http://localhost:3000/users/" + userID + "/reminders/",
                type: "DELETE",
                success: function(status) {
                    // just put output to a simple div as List
                    $(".delAllRemOutput").empty();
                     var $output = $("<p>");
                    $output.text("All Reminders for userID " + userID + " have been deleted");
                    $(".delAllRemOutput").html($output);
            }
        });
    });

}); 