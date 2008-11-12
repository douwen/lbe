var Linkmug_AddBuddy = {
	
    onLoad: function() {
    
    
    	
    this.father = window.opener.Linkmug;    
    this.buddy = window.arguments[0];  
    this.flag = window.arguments[1];    
    Linkmug_Utils.$("buddy-name").value = this.buddy.name;
          
  },  
  doAdd: function() {
  	
    this.flag.add = true;
               
  },
  doCancel: function() {
  	this.flag.add = false;                 
  }
};
window.addEventListener("load", function(e) { Linkmug_AddBuddy.onLoad(e); }, false);
