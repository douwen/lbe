var Linkmug_Login = {

  passwordMgr      : null,
  ff3              : false,
// Get Password Manager (does not exist in Firefox 3)
  passwordManager  : Components.classes["@mozilla.org/passwordmanager;1"],
  loginManager     : Components.classes["@mozilla.org/login-manager;1"],


  onLoad : function() {
	
	Linkmug_Login.strings = Linkmug_Utils.$("linkmug-login-strings");
	
	window.sizeToContent();
	
	Linkmug_Utils.a$("signup-link","href","https://"+Linkmug_Config.LINKMUG_HOST + '/signup');	
    
    Linkmug_Utils.loadJS("chrome://linkmug/content/jslib/json.js");
    
    if (this.passwordManager != null) {//ff2
     this.passwordMgr = Components.classes["@mozilla.org/passwordmanager;1"]
                                .getService(Components.interfaces.nsIPasswordManager);
    }else if (this.loginManager!= null) {//ff3
     this.passwordMgr = Components.classes["@mozilla.org/login-manager;1"]
                         .getService(Components.interfaces.nsILoginManager);
     this.ff3 = true;
    };
	
	Linkmug_Utils.$("linkmug-login-name").focus();
	
	if(!Linkmug_Login.ff3)
	{//ff2
	  var queryString = 'linkmug';
	  var e = Linkmug_Login.passwordMgr.enumerator;
	  while (e.hasMoreElements()) {
    	  try {
      	      var pass = e.getNext().QueryInterface(Components.interfaces.nsIPassword);
        	  if (pass.host == queryString) {
                 Linkmug_Utils.$('linkmug-login-name').value = pass.user; // the username
                 Linkmug_Utils.$('linkmug-login-password').value = pass.password; // the password
                 break;
              };
    	  } catch (ex) {
       
          };
	  };
    }else{//ff3
      
      try{   
      	 var logins = Linkmug_Login.passwordMgr.findLogins({}, 'chrome://linkmug', 'linkmug', null);
         if(logins.length > 0)
         {
           	 Linkmug_Utils.$('linkmug-login-name').value = logins[0].username; // the username
             Linkmug_Utils.$('linkmug-login-password').value = logins[0].password; // the password            
         };
      }catch (ex) {
         Linkmug_Utils.dd$("read");
      };	
    };
    
  },

  doLogin : function(){

   var callback = function(response){
            Linkmug_Login.checkLogin(response); 
      };
      var options={
         timeout:Linkmug_Utils.getTimeoutTreshold(),
         parameters:{
           email:Linkmug_Utils.$('linkmug-login-name').value,
           password:Linkmug_Utils.$('linkmug-login-password').value,
           remember:"on"
         }        
      };
      
      Linkmug_Utils.a$("linkmug-progressmeter","status","show");
      var acceptButt = document.documentElement.getButton("accept");
      acceptButt.setAttribute("disabled",true);
      Linkmug_Utils.$("login-status").value="";
      
      var login_url = "https://" + Linkmug_Config.LINKMUG_HOST + "/browser/login.php" + Linkmug_Config.LINKMUG_DEBUG;     
      
      Linkmug_HTTP.post(login_url, callback, options);  
      return false;
  },
  checkLogin  : function(resp){
	     
      var msg = Linkmug_Login.strings.getString("unknow-error");
      window.opener.Linkmug.MUGs.empty();
      window.opener.Linkmug.Friends.empty();
      window.opener.Linkmug.initCheck(resp);       
      switch(resp.status)
      {      	
      	case "success": 
      	   if(!Linkmug_Login.ff3)
      	   {
      	       var queryString = 'linkmug';
	           var e = Linkmug_Login.passwordMgr.enumerator;
	           while (e.hasMoreElements()) {
    	         try {
      	            var pass = e.getNext().QueryInterface(Components.interfaces.nsIPassword);
        	        if (pass.host == queryString) {
        	     	   Linkmug_Login.passwordMgr.removeUser( pass.host , pass.user);                                        
                    };
    	         } catch (ex) {
       
                 };
	           };	       
               Linkmug_Login.passwordMgr.addUser('linkmug', 
                                        Linkmug_Utils.$('linkmug-login-name').value, 
                                        Linkmug_Utils.$('linkmug-login-password').value
                                       );
    	    }else{
    	       try{  
    	         
                 var myLoginInfo = Components.classes["@mozilla.org/login-manager/loginInfo;1"]
                                   .createInstance(Components.interfaces.nsILoginInfo);
    	         
                 myLoginInfo.init('chrome://linkmug', 'linkmug', null, Linkmug_Utils.$('linkmug-login-name').value, Linkmug_Utils.$('linkmug-login-password').value, null, null);
                 
                 var logins = Linkmug_Login.passwordMgr.findLogins({}, 'chrome://linkmug', 'linkmug', null);
                 
                 for (var i = 0; i < logins.length; i++) {
                    Linkmug_Login.passwordMgr.removeLogin(logins[i]);
                 };
                 
                 Linkmug_Login.passwordMgr.addLogin(myLoginInfo);
    	       }catch(ex) {
                  
               };
               
    	    };    	   
            setTimeout("window.close()", 0);      	   
            return;
        case "timeout":
             msg = Linkmug_Login.strings.getString("server-timeout");             
             break;
        case "srverror":
             msg = Linkmug_Login.strings.getString("server-error");
             break;   
        case "error":
             msg = resp.error;
             break;
      };
      
      Linkmug_Utils.$("login-status").value=msg;
      Linkmug_Utils.a$("linkmug-progressmeter","status","hide");
      var acceptButt = document.documentElement.getButton("accept");
      acceptButt.setAttribute("label",Linkmug_Login.strings.getString("retry"));
      acceptButt.removeAttribute("disabled");
      
  }
     
};

