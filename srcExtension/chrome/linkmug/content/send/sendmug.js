var Linkmug_SendMug = {
	data:'',
	post_level:'PUBLIC',
    onLoad: function() {
    
    sizeToContent();	
    this.strings = Linkmug_Utils.$("sendmug-strings");
    
    Linkmug_Utils.a$("postlevel-info","href","http://"+Linkmug_Config.LINKMUG_HOST + '/about#postlevel');
    
    Linkmug_Utils.loadJS("chrome://linkmug/content/jslib/json.js");
    	
    this.father = window.opener.Linkmug;
   
    var url = window.arguments[0];
    var title = window.arguments[1]; 
    if(window.arguments[2])
      this.data = window.arguments[2]; 
    
    Linkmug_Utils.$('linkmug-url-textbox').value = url;
    Linkmug_Utils.$('linkmug-url-title').value = title;
    Linkmug_Utils.$("linkmug-url-desc").focus();
        
    Linkmug_Utils.$('linkmug-send-wizard').getButton("finish").label = Linkmug_SendMug.strings.getString("send-it");
    Linkmug_Utils.$('linkmug-send-wizard').getButton("finish").setAttribute('accesskey','s');
    
    var msg_first = Linkmug_Utils.checkSendMugMsgFrist();
    if(!msg_first)
    {
      msg_first = Linkmug_Utils.getLastMugSendSwitcher();      
    };    
    Linkmug_Utils.$("linkmug-just-send-message").checked = msg_first; 
    this.switchUI();
    this.showMug();
    
  },
    
  onFinish: function() {
    var _url           =  Linkmug_Utils.$("linkmug-url-textbox").value;
    var _title         =  Linkmug_Utils.$("linkmug-url-title").value;
    var _desc          =  Linkmug_Utils.$("linkmug-url-desc").value; 
    var _post_level    =  this.post_level;
    var _message       =  Linkmug_Utils.$("linkmug-attach-message").value;    
    var _tags          =  Linkmug_Utils.$("linkmug-tags-textbox").value;
    var _justmsg       =  Linkmug_Utils.$("linkmug-just-send-message").checked;
    
    var _receivers = this.father.MUGs.genReceivers();
    if((!_receivers)&&(_post_level=='MUG'))
    {
    	Linkmug_Utils.a$("error_message","value",Linkmug_SendMug.strings.getString("select-one"));    	
    	return false;
    };
    if((!_receivers)&&(_justmsg))
    {
    	Linkmug_Utils.a$("error_message","value",Linkmug_SendMug.strings.getString("select-one"));    	
    	return false;
    };
    if(!_receivers)
      _receivers = '';
      
    if((_justmsg)&&(Linkmug_Utils.trim(_message) == ""))
    {
    	Linkmug_Utils.a$("error_message","value",Linkmug_SendMug.strings.getString("empty-msg"));    	
    	return false;
    };
    if((!_justmsg)&&(Linkmug_Utils.trim(_url) == ""))
    {
    	Linkmug_Utils.a$("error_message","value",Linkmug_SendMug.strings.getString("empty-link"));    	
    	return false;
    };
    if((!_justmsg) && !Linkmug_Utils.isUrl(_url))
    {
    	Linkmug_Utils.a$("error_message","value",Linkmug_SendMug.strings.getFormattedString("illegal-url",[_url]));    	
    	return false;
    }
    var send_message = null;
    if((_post_level =='PUBLIC')&&(!_justmsg))
    {
        send_message = Linkmug_Message.createPubLnkMessage(
                                       _url,
                                       _title,
                                       _desc,
                                       _message,                                      
                                       _receivers,
                                       _tags,
                                       Linkmug_SendMug.data
                                       );	
    }else if((_post_level =='MUG')&&(!_justmsg)){
    	
    	send_message = Linkmug_Message.createMugLnkMessage(
                                       _url,
                                       _title,
                                       _desc,
                                       _message,                                      
                                       _receivers,
                                       _tags,
                                       Linkmug_SendMug.data
                                       );
    }else if((_post_level =='PRIVATE')&&(!_justmsg)){
    	
    	send_message = Linkmug_Message.createPrvtLnkMessage(
                                       _url,
                                       _title,
                                       _desc,
                                       _message,                                      
                                       _receivers,
                                       _tags,
                                       Linkmug_SendMug.data
                                       );
    }else{
    	send_message = Linkmug_Message.createMugChatMessage(                                       
                                       _message,                                      
                                       _receivers                                       
                                       );
    }
    
    
    this.father.SQ.add(send_message);
    Linkmug_Utils.setLastMugSendSwitcher(Linkmug_Utils.$("linkmug-just-send-message").checked);
        
    return true;
      
    
  },
  
  checkRecvMug:function(){
  	    var receivers = this.father.MUGs.genReceivers();
    	if(!receivers)
    	{
    	  Linkmug_Utils.a$("error_message","value",Linkmug_SendMug.strings.getString("select-one"));
    	  
    	  return false;
    	}
  },
  onCancel: function() {
     
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
  },
  showMug:function()
  {
  	 var mugs = this.father.MUGs;
  	 //         
  	 for(var i = 0;i<mugs.length();i++){
  	  var mug = mugs.Q[i];  	  
  	  var listitem = document.createElement("listitem");
  	  
  	  var listcell_mug_name = document.createElement("listcell");
  	  var checkbox = document.createElement("checkbox");  	  
  	  checkbox.setAttribute("label",mug.mug_alias);
  	  checkbox.setAttribute("class","mug_name");
  	  checkbox.setAttribute("tooltiptext",mug.description); 
  	  if(mug.checked){
  	     checkbox.setAttribute("checked","true");
  	     listitem.setAttribute("status","select");
  	  }else{
  	     checkbox.setAttribute("checked","false");
  	     listitem.removeAttribute("status");
  	  };
  	  listcell_mug_name.appendChild(checkbox);
  	  listitem.appendChild(listcell_mug_name);
  	    	  
  	  var listcell_mug_owner = document.createElement("listcell");
  	  var owner = document.createElement("label");
  	  owner.setAttribute("value",mug.owner);  	  
  	  listcell_mug_owner.appendChild(owner);
  	  listitem.appendChild(listcell_mug_owner);
  	  
  	  var listcell_mug_feature = document.createElement("listcell");
  	  var feature = document.createElement("label");
  	  feature.setAttribute("value",mug.feature);
  	  listcell_mug_feature.appendChild(feature);
  	  listitem.appendChild(listcell_mug_feature);
  	  
  	  
  	  var listcell_mug_usernum = document.createElement("listcell");
  	  var user_num = document.createElement("label");
  	  user_num.setAttribute("value",mug.user_num);
  	  listcell_mug_usernum.appendChild(user_num);
  	  listitem.appendChild(listcell_mug_usernum);
  	    	  
  	  listitem.setAttribute("value",mug.mug_id);
  	  listitem.setAttribute("tooltiptext",mug.description);
  	  listitem.addEventListener("click",function(e){Linkmug_SendMug.clickMug(e);},false);
  	  
  	  Linkmug_Utils.$("mugs_list_box").appendChild(listitem);
  	 };
         var selected = this.father.MUGs.selected();
         Linkmug_Utils.$("selected_mug_num").setAttribute("value",""+selected);
  },
  clickMug:function(e)
  {
  	 var mug_id = e.target.getAttribute("value");
  	 var checked = e.target.firstChild.firstChild.getAttribute("checked");
  	 if(checked=="true"){
  	     e.target.firstChild.firstChild.setAttribute("checked","false");
  	     e.target.removeAttribute("status");
  	     
  	 }
  	 else if(checked=="false"){  	 	  
  	      e.target.firstChild.firstChild.setAttribute("checked","true");
  	      e.target.setAttribute("status","select");
  	 }
  	 var father = this.father;
  	 father.MUGs.toogle(mug_id);
         
         var selected = this.father.MUGs.selected();
         this.father.MUGs.sort();
         Linkmug_Utils.$("selected_mug_num").setAttribute("value",""+selected);
  	 
  	 
  },
  
  updatePostLevel:function()
  {
     var sindex = Linkmug_Utils.$("post-level-group").selectedIndex;
     if (sindex == 0)
     {
        this.post_level = 'PUBLIC';
     }else if (sindex == 1)
     {
        this.post_level = 'MUG';
     }else if (sindex == 2)
     {
        this.post_level = 'PRIVATE';
     };
  },
  selectAll:function()
  {
     
     var listbox = Linkmug_Utils.$("mugs_list_box");     
     var childNodes = listbox.childNodes;
     for(var i=0;i< childNodes.length;i++)
     {
        var childNode = childNodes[i];
        if(childNode.nodeName == 'listitem'){          
           childNode.firstChild.firstChild.setAttribute("checked","true");
  	       childNode.setAttribute("status","select");  
        };                
     };          
     this.father.MUGs.selectall();
     var selected = this.father.MUGs.selected();
     this.father.MUGs.sort();
     Linkmug_Utils.$("selected_mug_num").setAttribute("value",""+selected);     
     
  },
  selectNone:function()
  {
     
     var listbox = Linkmug_Utils.$("mugs_list_box");     
     var childNodes = listbox.childNodes;
     for(var i=0;i< childNodes.length;i++)
     {
        var childNode = childNodes[i];
        if(childNode.nodeName == 'listitem'){          
           childNode.firstChild.firstChild.setAttribute("checked","false");
  	       childNode.removeAttribute("status");
        };
                
     };          
     this.father.MUGs.unselectall();
     var selected = this.father.MUGs.selected();
     this.father.MUGs.sort();
     Linkmug_Utils.$("selected_mug_num").setAttribute("value",""+selected);     
     
  }
};
window.addEventListener("load", function(e) { Linkmug_SendMug.onLoad(e); }, false);
window.addEventListener("unload", function(e) { Linkmug_SendMug.onUnload(e); }, false);
