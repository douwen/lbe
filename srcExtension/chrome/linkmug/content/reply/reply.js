var Linkmug_Reply = {
	
    onLoad: function() {
    
    this.strings = Linkmug_Utils.$("linkmug-reply-strings");
    Linkmug_Utils.loadJS("chrome://linkmug/content/jslib/json.js");
    	
    this.father = window.opener.Linkmug;
    var father = this.father;
    this.message = window.arguments[0];
    this.flag = window.arguments[1];
    this.all = window.arguments[2];
    if(this.all){
    	Linkmug_Utils.$("message-receiver_label").value = Linkmug_Reply.strings.getString("all-mugs");
    }else	
      Linkmug_Utils.$("message-receiver_label").value = this.message.sender_name;
    Linkmug_Utils.$("reply-message-textbox").focus();
    
    
  },
  
  doSend: function() {
  	        
     var msg = Linkmug_Utils.$("reply-message-textbox").value;
     if(Linkmug_Utils.trim(msg) == '')
     {
     	Linkmug_Utils.$("reply-status").value = Linkmug_Reply.strings.getString("not-empty");
     	return false;
     };
     var quote = '';
     switch(this.message.type)
 	 {
 	   	  case 'PUBLNK': 	   	  
 	   	  case 'MUGLNK': 	   	 
 	   	  case 'PVTLNK': 	   	   	   	    	   
 	   	  case 'BDYLNK':
 	   	     quote = this.message.title;
 	   	  break;   
 	   	  case 'MUGCHAT': 	
 	   	  case 'BDYCHAT': 	   	    
 	   	  case 'REPLY': 	   	    
 	   	     quote = this.message.message;
 	   	  break;
 	   	  default: 	   	  
 	   	  break;  
 	 }
     var reply = null;
     if(!this.all)
        reply = Linkmug_Message.createRplyMessage(
                                       this.message.id,
                                       this.message.sender_id,
                                       Linkmug_Utils.trim(msg),
                                       Linkmug_Utils.trim(quote)
                        );
     else
         reply = Linkmug_Message.createRplyAllMessage(
                                       this.message.id,
                                       this.message.sender_id,
                                       this.message.mugs_intersection,
                                       Linkmug_Utils.trim(msg),
                                       Linkmug_Utils.trim(quote)
                        );                       
     this.father.SQ.add(reply);
     this.flag.reply = true; 
    
  }
};
window.addEventListener("load", function(e) { Linkmug_Reply.onLoad(e); }, false);
