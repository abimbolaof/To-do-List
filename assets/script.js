$(document).ready(function(){  
    
    var data = [];
    
    $('form').on('submit', function(){
        
        var url = "/todo";
        var itemInput = $('#item').val();
        
        //check if something was entered
        var patt = /\w+/g;
        if (!patt.test(itemInput)){
            alert("Please enter an event");
            return false;
        }
        
        var todo = {
            item : itemInput
        };
        
        $.ajax({
            url : '/todo',
            type : 'POST',
            data : todo,
            success : function(d){
                location.reload();
            }
        });
    });
    
    //delete item
    $('li').click(function(){
        
        var index = $(this).attr('id');
        var dat = {
          index : index  
        };
        
        $.ajax({
            url : '/todo',
            type : 'DELETE',
            data : dat,
            success : function(d){
                location.reload();
            }
        });
    });
    
    
    //save item to calendar
    $('button').click(function(){
        
        var patt = /\d{4}-\d{2}-\d{2}/g;
        var dateInput = document.getElementById('date').value;
        
        if (!patt.test(dateInput)){
            alert("Please enter a valid date (yyyy-mm-dd)");
            return false;
        }
        
        
        handleAuthClick();
    });
          
    var apiKey = 'your apiKey';
    var clientId = 'your clientId';
    var scopes = 'https://www.googleapis.com/auth/calendar';
    var date, resource = {}, eventsToDo="";
    
    
    function loadData(){
        date = document.getElementById('date').value;

        data.forEach(function(item){
            eventsToDo += item.item + '\n';
        });

        resource = {
            "summary": "My To-do List",
            "start": {
                "date": date
            },
            "end": {
                "date": date
            },
            "description": eventsToDo,
            "location":"US",
        };
    }
    
    function handleClientLoad() {
      gapi.client.setApiKey(apiKey);
      window.setTimeout(checkAuth,1);
      checkAuth();
    }

    function checkAuth() {
      gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true},
          handleAuthResult);
    }

    function handleAuthResult(authResult) {
      if (authResult) {
          //retrieve items from server
          $.getJSON('/todo/items', function(dat){
              data = dat;
              loadData();
              makeApiCall();
          });
      }
    }

    function handleAuthClick(event) {
      gapi.auth.authorize(
          {client_id: clientId, scope: scopes, immediate: false},
          handleAuthResult);
      return false;
    }
    
    function makeApiCall() {
      gapi.client.load('calendar', 'v3', function() {
        var request = gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: resource 	// above resource will be passed here
        });

        request.execute(function(resp) {
            var statusLabel = document.getElementById('status');
            statusLabel.innerHTML = "Your items have been saved to Google Calendar.";
            setTimeout(function(){
                statusLabel.innerHTML = "";
            }, 3000);
            console.log(resp);
        });
      });
    }
});