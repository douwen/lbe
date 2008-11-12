var Linkmug_Block = {
	
    onLoad: function() {
    
    Linkmug_Utils.loadJS("chrome://linkmug/content/jslib/json.js");
    	
    this.father = window.opener.Linkmug;    
    this.message = window.arguments[0];  
    this.flag = window.arguments[1];    
    Linkmug_Utils.$("block-username").value = this.message.sender_name;
          
  },  
  doBlock: function() {
  	           
    var block = Linkmug_Message.createBlockMessage(this.message.sender_id,this.message.id);
                        
          
    this.father.SQ.add(block);
    
    this.flag.block = true;
               
  },
  doCancel: function() {
  	this.flag.block = false;                 
  }
};
window.addEventListener("load", function(e) { Linkmug_Block.onLoad(e); }, false);
