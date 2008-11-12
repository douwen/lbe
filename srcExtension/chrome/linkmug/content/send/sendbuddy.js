var Linkmug_SendBuddy = {
	data:'',
	receiver:null,
    onLoad: function() {
    
    sizeToContent();
    this.strings = Linkmug_Utils.$("sendbuddy-strings");
    
    //Linkmug_Utils.loadJS("chrome://linkmug/content/jslib/json.js");
    	
    this.father = window.opener.Linkmug;
   
    var url = window.arguments[0];
    var title = window.arguments[1]; 
    this.receiver = window.arguments[2];
    if(window.arguments[3])
      this.data = window.arguments[3]; 
    
    Linkmug_Utils.a$('send-to-who','value',this.receiver.name);  
    Linkmug_Utils.$('linkmug-url-textbox').value = url;
    Linkmug_Utils.$('linkmug-url-title').value = title;
    Linkmug_Utils.$("linkmug-url-desc").focus();
    
    var msg_first = Linkmug_Utils.checkSendBuddyMsgFrist();
    if(!msg_first)
    {
      msg_first = Linkmug_Utils.getLastBuddySendSwitcher();      
    };    
    Linkmug_Utils.$("linkmug-just-send-message").checked = msg_first; 
    this.switchUI();
    
    
  },
    
  doSend: function() {
    var _url           =  Linkmug_Utils.$("linkmug-url-textbox").value;
    var _title         =  Linkmug_Utils.$("linkmug-url-title").value;
    var _desc          =  Linkmug_Utils.$("linkmug-url-desc").value;    
    var _message       =  Linkmug_Utils.$("linkmug-attach-message").value;    
    var _tags          =  Linkmug_Utils.$("linkmug-tags-textbox").value;
    var _justmsg       =  Linkmug_Utils.$("linkmug-just-send-message").checked;
    
      
    if((_justmsg)&&(Linkmug_Utils.trim(_message) == ""))
    {
    	Linkmug_Utils.a$("error_message","value",Linkmug_SendBuddy.strings.getString("empty-msg"));    	
    	return false;
    };
    if((!_justmsg)&&(Linkmug_Utils.trim(_url) == ""))
    {
    	Linkmug_Utils.a$("error_message","value",Linkmug_SendBuddy.strings.getString("empty-link"));    	
    	return false;
    };
    if((!_justmsg) && !Linkmug_Utils.isUrl(_url))
    {
    	Linkmug_Utils.a$("error_message","value",Linkmug_SendMug.strings.getFormattedString("illegal-url",[_url]));    	
    	return false;
    }
    var send_message = null;
    if(!_justmsg)
    {
       send_message = Linkmug_Message.createBdyLnkMessage(
                                       _url,
                                       _title,
                                       _desc,
                                       _message,                                      
                                       _tags,
                                       this.receiver.fid,
                                       Linkmug_SendBuddy.data
                                      );
    }else
    {
    	send_message = Linkmug_Message.createBdyChatMessage(                                      
                                       _message,                                                                            
                                       this.receiver.fid
                                      );
    }
    this.father.SQ.add(send_message);
    Linkmug_Utils.setLastBuddySendSwitcher(Linkmug_Utils.$("linkmug-just-send-message").checked);
    Linkmug_Utils.setLastTalkedBuddy(this.receiver.name,this.receiver.fid);
        
    return true;
      
    
  },
    
  doCancel: function() {
     
  },
  onUnload: function() {               
     this.father.LockWizard = false;
  },
  switchLinkMsg: function()
  {  	 
  	 if(Linkmug_Utils.$("linkmug-just-send-message").checked)
  	 {
  	 	Linkmug_Utils.a$("send-link-vbox","style",'display:block');
  	 	Linkmug_Utils.$("linkmug-url-desc").focus();
  	 }  	  
  	 else
  	 {  	   	 	
  	 	Linkmug_Utils.a$("send-link-vbox","style",'display:none');
  	 	Linkmug_Utils.$("linkmug-attach-message").focus();
  	 };  	 
  },
  switchUI: function()
  {  	 
  	 if(Linkmug_Utils.$("linkmug-just-send-message").checked)
  	 {
  	 	
  	 	Linkmug_Utils.a$("send-link-vbox","style",'display:none');  	 	
  	 	Linkmug_Utils.$("linkmug-attach-message").focus();
  	 }  	  
  	 else
  	 {  	   	 	
  	 	Linkmug_Utils.a$("send-link-vbox","style",'display:block');  	 	
  	 	Linkmug_Utils.$("linkmug-url-desc").focus();
  	 };  	 
  }
};
window.addEventListener("load", function(e) { Linkmug_SendBuddy.onLoad(e); }, false);
window.addEventListener("unload", function(e) { Linkmug_SendBuddy.onUnload(e); }, false);
