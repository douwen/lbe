var Linkmug_Comment = {
	
    onLoad: function() {
    sizeToContent();
    Linkmug_Utils.loadJS("chrome://linkmug/content/jslib/json.js");
    	
    this.father = window.opener.Linkmug;  
    this.public_comment   = window.arguments[0]; 
    this.message   = window.arguments[1];
    this.strings = Linkmug_Utils.$("linkmug-comment-strings");       
          
  },  
  doComment: function() {
  	           
    var comment_content = Linkmug_Utils.$("linkmug-comment-content").value;
    if(Linkmug_Utils.trim(comment_content) == '')
     {
     	Linkmug_Utils.$("comment-status").value = Linkmug_Comment.strings.getString("not-empty");
     	return false;
     };
    var comment = null;
    if(this.public_comment)
       comment = Linkmug_Message.createPubCmntMessage(
                                       this.message.urlhash,
                                       this.message.mugs_intersection,
                                       comment_content
                                       );
                        
    else
       comment = Linkmug_Message.createMugCmntMessage(
                                       this.message.urlhash,
                                       this.message.mugs_intersection,
                                       comment_content
                                       );
    this.father.SQ.add(comment);
    
    return true;
               
  },
  doCancel: function() {
  	this.flag.comment = false;                 
  }
};
window.addEventListener("load", function(e) { Linkmug_Comment.onLoad(e); }, false);
