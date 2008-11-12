var Linkmug = {
  Loaded           :  false,
  init_level       :  0,
  PUBLNKBOX        :  0,
  MUGLNKBOX        :  1,
  PVTLNKBOX        :  2,  
  MUGMSGBOX        :  3,  
  BDYLNKBOX        :  4,
  BDYMSGBOX        :  5,
  REPLYBOX         :  6,
  INVITEBOX        :  7,
  INFOBOX          :  8,  
  
  CurrentMessage   : null,
  Lock             : 0,
  LockWizard       : false,
  mugstatus        : 'INIT',
  buddystatus      : 'INIT',
  flashMugTimer    :null,
  flashBuddyTimer  :null,  
  switchMugLight   :1,
  switchBuddyLight :1,
  onlineStatus     :'ONLINE',
  sendTimer        :null,
  liveTimer        :null,
  cycleTimer       :null,
  initTimer        :null,
  Friends: {
  	Q: new Array(),
  	length:function(){
  		return this.Q.length;
  	},
  	add:function(friend){  		   	  
   	  for(var i = 0;i< this.length();i++){
   	  	if(friend.fid == this.Q[i].fid){
   	  	   return;
   	  	};
   	  };
   	  this.Q.push(friend);   	  
   	  this.renderBuddyList();
  	},
  	renderBuddyList:function()
    {
    	this.sort();
    	
    	var buddylist = Linkmug_Utils.$('linkmug-buddy-list');
    	while(buddylist.childNodes.length != 0)
          buddylist.removeChild(buddylist.childNodes[0]);
        if(this.length() == 0)
        {
        	                 var menuitem = document.createElement('menuitem'); 
        	                 menuitem.setAttribute('class',"buddy-menuitem");
        	                  menuitem.setAttribute('tooltiptext',Linkmug.strings.getString("nobuddy"));
        	                 
        	                 var hbox = document.createElement('hbox');
        	                 hbox.setAttribute('align',"center");
        	                 hbox.setAttribute('pack',"start");        	                         	                 
        	                 menuitem.appendChild(hbox);
        	                 
        	                 buddylist.appendChild(menuitem);
        	                         	                         	                 
        	                 var buddy_label  = document.createElement('label');        	
        	                 buddy_label.setAttribute('class',"nobuddy");        	                         	                       	                 	
        	                 hbox.appendChild(buddy_label);        	                         	                 
        	                 buddy_label.setAttribute('value', Linkmug.strings.getString("nobuddy"));
        	                 return;
        	                 
        };
        this.Q.forEach(function(element, index, array)
      	   	            {
                             var menuitem = document.createElement('menuitem'); 
                             menuitem.setAttribute('class',"buddy-menuitem");
                             menuitem.setAttribute('tooltiptext',element.name);
                             
        	                 var hbox = document.createElement('hbox');
        	                 hbox.setAttribute('align',"center");
        	                 hbox.setAttribute('pack',"start");
        	                 
        	                 //hbox.setAttribute('flex',"1");
        	                 menuitem.appendChild(hbox);
        	                 
        	                 buddylist.appendChild(menuitem);
        	                 
        	                 var image        = document.createElement('image');
        	                 hbox.appendChild(image);
        	                 image.setAttribute('id',element.imgid);
        	                 var img_cls = this.getBuddyIconStatus(element.ols);        	                 
        	                 image.setAttribute('class',img_cls);
        	                 
        	                 var buddy_label  = document.createElement('label');        	
        	                 buddy_label.setAttribute('class',"buddyname");        	                         	                       	                 	
        	                 hbox.appendChild(buddy_label);        	                         	                 
        	                 buddy_label.setAttribute('value',element.name);
        	                 
        	                 var status_label  = document.createElement('label');        	
        	                 status_label.setAttribute('class',"buddystatus");        	                         	                       	                 	
        	                 hbox.appendChild(status_label); 
        	                 status_label.setAttribute('id',element.lblid);
        	                 var textstatus = this.getBuddyTextStatus(element.ols);        	                 
        	                 status_label.setAttribute('value',"("+textstatus+")");
        	                 
        	                 menuitem.addEventListener("command", function(e) { Linkmug.sendtoBuddy(element); }, true);
        	                 
      	                },
      	                this
      	               );
        
    },
    getBuddyIconStatus:function(status)
    {
    	
    	var imgcls = 'buddy_offline';
        switch(status)
        {
        	case "ONLINE":
        	  imgcls = 'buddy_online';
        	break;
        	case "IDLE":
        	  imgcls = 'buddy_idle';
        	break;
        	case "BUSY":
        	  imgcls = 'buddy_busy';
        	break;
        	case "LEAVE":
        	  imgcls = 'buddy_leave';
        	break;
        	case "OFFLINE":
        	  imgcls = 'buddy_offline';
        	break;
        	default:
        	break;
        };
        return imgcls;
    },
    getBuddyTextStatus:function(status)
    {
    	
    	var txtstatus = Linkmug.strings.getString("offline");
        switch(status)
        {
        	case "ONLINE":
        	  txtstatus = Linkmug.strings.getString("online");
        	break;
        	case "IDLE":
        	 txtstatus = Linkmug.strings.getString("idle");
        	break;
        	case "BUSY":
        	  txtstatus = Linkmug.strings.getString("busy");
        	break;
        	case "LEAVE":
        	  txtstatus = Linkmug.strings.getString("leave");
        	break;
        	case "OFFLINE":
        	  txtstatus = Linkmug.strings.getString("offline");
        	break;
        	default:
        	break;
        };
        return txtstatus;
    },
  	changeStatus :function(friend)
  	{
  	  this.Q.forEach(function(element, index, array)
      	   	           {
                                    if((element.fid == friend.fid)&&(element.ols != friend.ols)){
                                      element.ols = friend.ols;
                                      var buddy_status_img = Linkmug_Utils.$(element.imgid);
                                      var img_cls = this.getBuddyIconStatus(element.ols);
                                      buddy_status_img.setAttribute('class',img_cls);
                                                                                                                         	                 
        	                          var status_label = Linkmug_Utils.$(element.lblid);
                                      var txtstatus = this.getBuddyTextStatus(element.ols);
                                      status_label.setAttribute('value',"("+txtstatus+")");
                                    };                                 
      	               },
      	               this
      	            );
  	},
  	remove :function(fid)
  	{
  	  this.Q.forEach(function(element, index, array)
      	   	                   {
                                    if(element.fid == fid){
                                     this.splice(index,1);   
                                    };                                 
      	                       },
      	                       this.Q
      	            );
      this.renderBuddyList();	            
  	},
  	empty:function(){
  		this.Q = new Array();
  		this.renderBuddyList();
  	},
  	sort:function(){
           this.Q.sort(function(e1,e2)
                        {
                          if(e1.name > e2.name)
                              return 1;
                            if(e1.name == e2.name)
                              return 0;
                            if(e1.name < e2.name)
                              return -1;
                        }
                      );
    }
  	
  },
  Plugins: {
  	Q: new Array(),
  	length:function(){
  		return this.Q.length;
  	},
  	add:function(plugin){  		   	  
   	  for(var i = 0;i< this.length();i++){
   	  	if(plugin.lmpID == this.Q[i].lmpID){
   	  	   return;
   	  	};
   	  };
   	  this.Q.push(plugin);  
  	},
  	getPString :function()
  	{
  	  var plen = this.length();
  	  var pstring = '';
  	  var length_size = Linkmug_Config.MAXPLUGINPACKETSIZE.toString(16).length;
  	  for(var i = 0;i< plen;i++){
  	  	try{
  	  	    var p_data = this.Q[i].getLinkmugData();
  	  	    if((p_data == null)||(p_data == ''))
  	  	      continue;
  	  	    var packetlen = this.Q[i].lmpID.length + length_size + p_data.length;
  	  	    if(packetlen > Linkmug_Config.MAXPLUGINPACKETSIZE)
  	  	    {
  	  		  continue;
  	  	    };
  	  	
  	  	    var packet_lenstr = p_data.length.toString(16);
  	  	    var dummy_prefix_len = length_size - packet_lenstr.length;
  	  	    var packet_len_string = Linkmug_Utils.str_rep('0',dummy_prefix_len) + packet_lenstr;
  	  	 
   	  	    var packet = this.Q[i].lmpID + packet_len_string + p_data;
   	  	    if((pstring.length + packet.length)> Linkmug_Config.MAXPLUGINDATASIZE)
   	  	      return pstring;
   	  	    pstring += packet;
  	  	}catch(e){
  	  	    continue;
  	  	};  	  	
   	  };
   	  return pstring;
  	},
  	renderAll:function(currentDoc,pstring)
  	{
  	  var plen = this.length();  	  
  	  for(var i = 0;i< plen;i++){
  	  	try{
   	  	   var piece = this.getPiece(this.Q[i].lmpID,pstring);
   	  	   if(piece == null)
   	  	       continue;
   	  	   //alert(piece);
   	  	   this.Q[i].renderLinkmugPage(currentDoc,piece);
  	  	}catch(e){
  	  		
  	  	};
   	  };
  	},
  	getPiece:function(plugin_id,pstring){
  		var piece = null;
  		var t = pstring.indexOf(plugin_id);
  		if(t>=0)
  		{  			
  			var plen_len = Linkmug_Config.MAXPLUGINPACKETSIZE.toString(16).length;
  			var l_start = t + plugin_id.length;
  			var lenstr = pstring.substr(l_start,plen_len);
  			var piece_len = parseInt(lenstr, 16);
  			piece = pstring.substr(l_start+plen_len,piece_len);
  			return piece;
  		};
  		return piece;
  	}
  },  
  MQ: {  	
  	Q: new Array(),  	
  	length:function(){
  		return this.Q.length;
  	},
  	add:function(msg){
  		this.Q.push(msg);
  	},
  	addHead:function(msg){
  		this.Q.splice(0, 0, msg);
  	},
  	next:function(){  		
  		return this.Q.splice(0,1)[0];
  	},
  	last:function(){  		
  		return this.Q.splice(this.Q.length-1,1)[0];
  	},
    msg_len :function(){
  		var num = 0;
        this.Q.forEach(function(element, index, array)
      	   	           {
                             num += this.calcNeedNotice(element);
      	               },
      	               Linkmug
      	        );
                return num;
  	},
  	remove:function(msg){
  		this.Q.forEach(function(element, index, array)
      	   	                   {
                                    if(element.id == msg.id){
                                     this.splice(index,1);   
                                    };                                 
      	                       },
      	                       this.Q
      	              );
  	},
  	fetch:function(msg){
  		var q_length = this.length();
  		for(var i = 0;i < q_length;i++)
  		{
  			if(this.Q[i].id == msg.id){
                          return this.Q.splice(i,1)[0];
  			};
  		};
  		return null;
  	},
  	empty:function(){
  		this.Q = new Array();
  	}
  },  
  MUGs:{
    Q:new Array(),
    length:function(){
  		return this.Q.length;
  	},
  	toogle :function(mug_id){
  		this.Q.forEach(function(element, index, array)
      	   	                   {
                                    if(element.mug_id == mug_id){                                      
                                       element.checked = !element.checked;
                                    }
      	                       }
      	              );
  	},
    selectall :function(){
  		this.Q.forEach(function(element, index, array)
      	   	               {
                                    element.checked = true;
      	                       }
      	        );
  	},
    unselectall :function(){
  		this.Q.forEach(function(element, index, array)
      	   	               {
                                    element.checked = false;
      	                       }
      	        );
  	},
    selected :function(){
  		var num = 0;
                this.Q.forEach(function(element, index, array)
      	   	               {
                                    if(element.checked){
                                      num++;
                                    };
      	                       }
      	        );
                return num;
  	},
  	add:function(mug){
  		this.Q.push(mug);
                this.sort();                
  	},
    sort:function(){
           this.Q.sort(function(e1,e2)
                        {
                          if((e1.checked)&&(e2.checked)){
                            if(e1.mug_alias > e2.mug_alias)
                              return 1;
                            if(e1.mug_alias == e2.mug_alias)
                              return 0;
                            if(e1.mug_alias < e2.mug_alias)
                              return -1;
                          };                          
                          if(e1.checked)
                             return -1;
                          if(e2.checked)
                             return 1;
                          if(e1.mug_alias > e2.mug_alias)
                            return 1;
                          if(e1.mug_alias == e2.mug_alias)
                            return 0;
                          if(e1.mug_alias < e2.mug_alias)
                            return -1;
                        }
                      );
        },
        getMug:function(mug_id){
              var val = null;
              this.Q.forEach(function(element, index, array)
      	   	             {
                                    if(element.mug_id == mug_id){                                      
                                       val = element;
                                    };
      	                     }
      	              );
              return val;
        },
  	genReceivers:function(){
  		
  		var recvs = new Array();
  		this.Q.forEach(function(element, index, array)
      	   	                   {
                                    if(element.checked ){                                      
                                       recvs.push(element.mug_id);
                                    }
      	                       }
      	              );
      	if(recvs.length>0)
      	  return recvs.join();
      	else
      	  return null;
  	},
  	empty:function(){
  		this.Q = new Array();
  	},
  	have :function(mug_id){
  		
  		var exist = false;
  		this.Q.forEach(function(element, index, array)
      	   	                   {
                                    if(element.mug_id == mug_id){                                      
                                       exist = true;
                                    };
      	                       }
      	              );
      	return exist;
  	},  	
  	remove:function(mug_id){
  		this.Q.forEach(function(element, index, array)
      	   	                   {
                                    if(element.mug_id == mug_id){
                                      this.splice(index,1);      
                                    };                              
      	                       },
      	                       this.Q
      	              );                
  	}
  	
  },
  SQ: {  	
  	Q: new Array(),  	
  	length:function(){
  		return this.Q.length;
  	},
  	add:function(msg){
  		this.Q.push(msg);
  	},
  	addHead:function(msg){
  		this.Q.splice(0, 0, msg);
  	},
  	next:function(){
  		return this.Q.splice(0,1)[0];
  	},
  	remove:function(msg){
  		this.Q.forEach(function(element, index, array)
      	   	                   {
                                    if(element.id == msg.id){
                                      this.splice(index,1);
                                    };
      	                       },
      	                       this.Q
      	              );
  	},
  	empty:function(){
  		this.Q = new Array();
  	}
  },     
  onLoad: function(event) {
  	
    this.strings = Linkmug_Utils.$("linkmug-strings");
  	  	  	
    Linkmug_Utils.loadJS("chrome://linkmug/content/jslib/json.js");
    this.firstStart();      	
    Linkmug_Utils.showToolbarButton("linkmug-toolbar-send-button","urlbar-container");
    Linkmug_Utils.showToolbarButton("linkmug-toolbar-buddy-button","urlbar-container");
    window.setTimeout(function(){Linkmug.addLinkmugBar();}, Linkmug_Config.LINKMUG_BOOT_DELAY*1000);
    this.Loaded = true;//A Signal for Plugins                  
    
  },
  firstStart:function(){
     var normal = Linkmug_Utils.checkNormalStart();
     if(!normal)
     {        
        this.gotoURL("http://"+Linkmug_Config.LINKMUG_HOST+"/about");        
     };
  },
  init :function() {
  	 
  	  this.setMugConnecting();
  	  
  	  if(this.sendTimer !=null)
  	  {
  	  	  window.clearTimeout(this.sendTimer);
  	  	  this.sendTimer = null;
  	  };
  	  if(this.liveTimer !=null)
  	  {
  	  	  window.clearTimeout(this.liveTimer); 
  	  	  this.liveTimer = null;
  	  };
  	  if(this.cycleTimer !=null)
  	  {
  	  	  window.clearTimeout(this.cycleTimer);
  	  	  this.cycleTimer = null;
  	  };    	 
  	  var callback = function(response){
            Linkmug.initCheck(response); 
      };
      var level = this.init_level;
      var options={
         timeout:Linkmug_Utils.getTimeoutTreshold(),
         parameters:{           
           level    :  level           
         }        
      };      
      var login_check_url = "http://" + Linkmug_Config.LINKMUG_HOST +"/browser/init.php"+Linkmug_Config.LINKMUG_DEBUG;      
      Linkmug_HTTP.post(login_check_url, callback, options);
      
  },
  initCheck:function(resp){
  	  if(this.healthCheck(resp) == 'success')
  	  {
  	  	   this.setMugLogin();
           this.setBuddyLogin();
           
           var mugs = resp.data.mugs;
           var friends = resp.data.friends;
           mugs.forEach(        function(element, index, array)
      	   	                    {                                       
                                       if(!this.MUGs.have(element.mug_id))
                                          this.MUGs.add(Linkmug_Class.createMug(element));     	   	                                  
      	                        },
      	                        this
      	                );
      	   this.Friends.renderBuddyList();
      	   friends.forEach(   function(element, index, array)
      	   	                    {                                       
                                       this.Friends.add(Linkmug_Class.createBuddy(element.name,element.id,element.ols));
                                               	   	                                  
      	                        },
      	                        this
      	                    );                   	   
           this.startCheck();   
  	  };	
  },
  healthCheck :function(resp) {  	  
  	  var status = this.checkResponse(resp);   	  
  	  if((status == 'timeout')||(status == 'error')||(status == 'srverror')){
  	  	
  	  	   this.resetTimers();
  	  	   this.initTimer =  window.setTimeout(function(){Linkmug.init();}, Linkmug_Config.LINKMUG_FAILEDCHECK_INTERVAL*1000);
  	  	   
  	  }else if(status == 'logout')
  	  {  	  	   
  	  	   this.resetLinkmug();
  	  };
  	  return status;
      
  },
  resetTimers:function(){
  	  	  
      if(this.flashMugTimer){
        window.clearInterval(this.flashMugTimer);
        this.flashMugTimer = null;
      };
      if(this.flashBuddyTimer){
        window.clearInterval(this.flashBuddyTimer);
        this.flashBuddyTimer = null;
      }; 
      this.switchMugLight = 1;
      this.switchBuddyLight  = 1;
      
      if(this.sendTimer !=null)
  	  {
  	  	  window.clearTimeout(this.sendTimer);
  	  	  this.sendTimer = null;
  	  };
  	  if(this.liveTimer !=null)
  	  {
  	  	  window.clearTimeout(this.liveTimer); 
  	  	  this.liveTimer = null;
  	  };
  	  if(this.cycleTimer !=null)
  	  {
  	  	  window.clearTimeout(this.cycleTimer);
  	  	  this.cycleTimer = null;
  	  };    	 
      if(this.initTimer != null){
  	  	      window.clearTimeout(this.initTimer);
  	  	      this.initTimer = null;
  	  };
  	  
  },
  resetLinkmug:function(){
  	
  	  this.Friends.empty();
  	  this.MUGs.empty();
  	  this.MQ.empty();
  	  this.SQ.empty();
  	  this.Lock = 0;   	  
  	  this.CurrentMessage = null;
  	  Linkmug_Utils.a$('linkmug-bar','hidden','true');
  	  this.init_level = 0;
  	  
      this.resetTimers();
  	  
  },
  checkResponse:function(resp){
  	  
  	  var send_btn_tooltip = Linkmug.strings.getString("send-btn-tp-default");
  	    	 
      switch(resp.status)
      {
      	case "timeout":
      	    	
           this.setMugTimeout();                  	
           this.setBuddyTimeout(); 
           
           send_btn_tooltip = Linkmug.strings.getString("send-btn-tp-timeout");
                                        
      	   break;
      	case "srverror":
      	case "error":
      	
           this.setMugError(); 
           this.setBuddyError();
           send_btn_tooltip = Linkmug.strings.getString("send-btn-tp-error");
           
      	   break;      	
      	case "logout":      	   
           this.setMugLogout(); 
           this.setBuddyLogout();
           send_btn_tooltip = Linkmug.strings.getString("send-btn-tp-logout");
          
      	   break;
      	
      	case "success":      	              
      	   break;
      	default:
      	   break;
      }; 	
      Linkmug_Utils.a$("linkmug-toolbar-send-button","tooltiptext",send_btn_tooltip);      
      Linkmug_Utils.a$("linkmug-stbpanel","tooltiptext",send_btn_tooltip);  
      return resp.status;
  },
  startCheck:function(){  
  	
      window.setTimeout(function(){Linkmug.firstCheck();}, Linkmug_Config.LINKMUG_FIRSTCHECK_INTERVAL*1000);
      var sendcheck_interval = Linkmug_Utils.getSendCheckInterval();
      if(this.sendTimer != null)
         window.clearTimeout(this.sendTimer);
      this.sendTimer = window.setTimeout(function(){Linkmug.sendCheck();},  sendcheck_interval*1000);
      if(this.liveTimer != null)
         window.clearTimeout(this.liveTimer);
      this.liveTimer = window.setTimeout(function(){Linkmug.live();},  Linkmug_Config.PING_INTERVAL*1000);
  
  },
  live:function(){
  	  var callback = function(response){
        Linkmug.liveComplete(response);
      };
       
      var options={
         timeout:Linkmug_Utils.getTimeoutTreshold(),
         parameters:{
           _online_status   : Linkmug.onlineStatus
         }        
      };
           
      var url = "http://" + Linkmug_Config.LINKMUG_HOST + "/browser/live.php" + Linkmug_Config.LINKMUG_DEBUG;     
      
      Linkmug_HTTP.post(url, callback, options);
  },
  liveComplete:function(resp){
  	  if(this.healthCheck(resp) == 'success'){  	     
  	     var friends_ol = resp.data;
  	     friends_ol.forEach(function(element, index, array)
      	   	                {
                              Linkmug.Friends.changeStatus(element);
      	                    }
      	                   );
  	     if(this.liveTimer != null){
  	        window.clearTimeout(this.liveTimer);
  	        this.liveTimer = null;
  	     };
  	     this.liveTimer = window.setTimeout(function(){Linkmug.live();},  Linkmug_Config.PING_INTERVAL*1000);
  	  };
  	  
  },
  sendCheck:function(){
  	  if(this.SQ.length() > 0)
  	  {  	 	  	 	  	 	
  	 	var message = this.SQ.next();  	 	
  	 	this.sendMessage(message);
  	 	return;
  	  };
  	  
  	  var sendcheck_interval = Linkmug_Utils.getSendCheckInterval();
  	  if(this.sendTimer != null)
  	     window.clearTimeout(this.sendTimer);
  	  this.sendTimer = window.setTimeout(function(){Linkmug.sendCheck();},  sendcheck_interval*1000);
  },
  addMug :function(message) {
  	  
      if(!this.MUGs.have(message.mug_id))
           this.MUGs.add(Linkmug_Class.createMug(message));
      this.removeMessage(message);     
      
  }, 
  
  updateMugFeature :function(message) {
  	  
      var newmug = this.MUGs.getMug(message.mug_id);
      if(newmug){  	          
              newmug.feature = message.feature;
      };
      this.removeMessage(message);
      
  }, 
  updateMugName :function(message) {
  	  
      var newmug = this.MUGs.getMug(message.mug_id);
      if(newmug){  	          
              newmug.mug_alias = message.name;
      };
      this.removeMessage(message);
  }, 
  removeMug :function(message) {
  	  this.MUGs.remove(message.mug_id);  
  	  this.removeMessage(message);
  }, 
  
  incUserNum :function(message) {
  	    	  
      var mug = this.MUGs.getMug(message.mug_id);
      if(mug)
  	    mug.user_num++;
      this.removeMessage(message);
      
      
      
  }, 
  decUserNum :function(message) {
  	    	  
      var mug = this.MUGs.getMug(message.mug_id);
      if(mug)
  	     mug.user_num--;
      
      this.removeMessage(message);
      
      
      
  }, 
  sendLink: function(e) {
  	  
      if(this.flashMugTimer)
      {
         this.stopFlashingMugBtn();
         return;
      };  
      switch(this.mugstatus)
      {
       case "LOGOUT" :             
         //this.setMugDisable();
         window.openDialog("chrome://linkmug/content/login/login.xul", "","chrome,modal,centerscreen");
         return;
      
       case "ERROR" :              
         window.openDialog("chrome://linkmug/content/info/error.xul","","chrome,modal,centerscreen");
         return;
      
       case "TIMEOUT" :              
         window.openDialog("chrome://linkmug/content/info/timeout.xul","","chrome,modal,centerscreen");
         return;       
       case "CONNECTING" :           
         return;
       case "INIT" :           
         return;
      };
      
      if(this.LockWizard)
         return;
      this.LockWizard = true;           
      
      var link_info = Linkmug_Utils.getCurrentPageInfo();
            
      var pstrings = this.Plugins.getPString();
            
      window.openDialog("chrome://linkmug/content/send/sendmug.xul", 
                        "",
                        "chrome,centerscreen,width=600,height=400",
                        link_info.share_url,
                        link_info.share_title,                        
                        pstrings);   
     
  },
  sendItemLink : function(element) {
	  
	  switch(this.mugstatus)
      {
       case "LOGOUT" :             
         //this.setMugDisable();
         window.openDialog("chrome://linkmug/content/login/login.xul", "","chrome,modal,centerscreen");
         return;
      
       case "ERROR" :              
         window.openDialog("chrome://linkmug/content/info/error.xul","","chrome,modal,centerscreen");
         return;
      
       case "TIMEOUT" :              
         window.openDialog("chrome://linkmug/content/info/timeout.xul","","chrome,modal,centerscreen");
         return;       
       case "CONNECTING" :           
         return; 
      };
  	  if(!element)
  	  {
  	    Linkmug_Utils.d$("could not capture!");
  	    return;
  	  };
  	  var url = '';
	  if((element.href)&&(Linkmug_Utils.isUrl(element.href))) 
	  {		 
		  url = element.href;
	  }else if((element.src)&&(Linkmug_Utils.isUrl(element.src)))
	  {	     
		  url = element.src;
	  }else
          {		  	
		 return;
	  };
          
          if(this.LockWizard)
            return;
          this.LockWizard = true;           
          
	  var share_url = url;
	  var share_title = url;
	  window.openDialog("chrome://linkmug/content/send/sendmug.xul", 
	                    "Send Link",
	                    "chrome,centerscreen,width=600,height=400",
	                    share_url,
	                    share_title,
	                    null
	                   );
  },    
    
  goHome:function()
  {
  	    	    	  
  	  this.gotoURL("http://"+Linkmug_Config.LINKMUG_HOST);  	    
              	 
  },
  goMyStuff:function()
  {
  	    	    	  
  	  this.gotoURL("http://"+Linkmug_Config.LINKMUG_HOST+"/my");  	    
              	 
  },
  goWriter:function()
  {
  	    	    	  
  	  this.gotoURL("http://"+Linkmug_Config.LINKMUG_HOST+"/writer");  	    
              	 
  },
  gotoURL:function(url)
  {
  	    	    	  
  	  
  	  var tbrowser = window.getBrowser();
      
      var newTab = tbrowser.addTab(url);
      
      tbrowser.selectedTab = newTab;
                             
      tbrowser.loadURI(url);   
              	 
  },
  
  sendMessage:function(message){
  	  
  	  var callback = function(response){
        Linkmug.sendComplete(response);
      };        
  	  var options={
         timeout:Linkmug_Utils.getTimeoutTreshold(),
         parameters:{           
           packet         :  JSON.stringify(message)           
         }        
      };               
      var url = "http://" + Linkmug_Config.LINKMUG_HOST + "/browser/send.php" + Linkmug_Config.LINKMUG_DEBUG;     
      
      Linkmug_HTTP.post(url, callback, options); 
  },
  sendComplete:function(resp)
  {  	    	  
  	  if(this.healthCheck(resp) == 'success'){ 
  	     var sendcheck_interval = Linkmug_Utils.getSendCheckInterval();
  	     if(this.sendTimer != null)
  	        window.clearTimeout(this.sendTimer);
         this.sendTimer = window.setTimeout(function(){Linkmug.sendCheck();},  sendcheck_interval*1000);
  	  }else{
  	  	 this.reportBug(resp);
  	  };
  	  
      return; 
       
       
  },
  
  firstCheck:function(){
  	
     
      var callback = function(response){
           Linkmug.checkIncoming(response); 
      };
      
      var level = this.init_level;
      var options={
         timeout:Linkmug_Utils.getTimeoutTreshold(),
         parameters:{
         	level:level 
         }        
      };
                   
      var url = "http://" + Linkmug_Config.LINKMUG_HOST + "/browser/firstcheck.php" + Linkmug_Config.LINKMUG_DEBUG;             
      Linkmug_HTTP.post(url, callback, options);  
      
      return false;
      
      
  },
  cycleCheck:function(){
  	
     
      var callback = function(response){
           Linkmug.checkIncoming(response); 
      };
      
      var level = this.init_level;
      var options={
         timeout:Linkmug_Utils.getTimeoutTreshold(),
         parameters:{
            level:level
         }        
      };
                   
      var url = "http://" + Linkmug_Config.LINKMUG_HOST + "/browser/cyclecheck.php" + Linkmug_Config.LINKMUG_DEBUG;             
      Linkmug_HTTP.post(url, callback, options);  
      return false;
      
      
  },
  checkIncoming:function(resp)
  {
         
      if(this.healthCheck(resp) == 'success'){
      	
      	   this.init_level++;
      	   var incoming_msgs = resp.data;
           var lmi_msg_count = 0;
      
           incoming_msgs.forEach(function(element, index, array)
      	   	                     {                                    
                                    var message = Linkmug_Message.parseIncomingMessage(element);
                                    if(message == null )
                                      return;
                                      
                                    this.MQ.add(message);
                                    lmi_msg_count += this.calcNeedNotice(message);   	   	                                  
      	                         },
      	                         this
      	                        );
           this.notifyUser(lmi_msg_count);
      };
      
               
  },
  notifyUser : function(lmi_msg_count)
  {
  	 Linkmug_Utils.a$("linkmug-have-msgs",'value',''+this.MQ.msg_len());
  	   	   	 
  	 if(this.MQ.length() > 0)
  	 {  	 	  	 	  	 	  	 	
  	 	var message = this.MQ.next();  
  	 	
  	 	switch(message.type)
  	 	{
  	 		case 'PUBLNK': 	   	  
 	   	    case 'MUGLNK': 	   	 
 	   	    case 'PVTLNK': 	   	   	   	     	   	   
 	   	    case 'BDYLNK': 
 	   	      var auto_open = Linkmug_Utils.checkAutoOpen();
  	 		  if(auto_open)
  	 		     this.openLinkTab(message);
  	 		  else
  	 		     this.showNotification(message);
  	 		break;
  	 		case 'MUGCHAT':     
  	 		case 'BDYCHAT': 	   	    
 	   	    case 'REPLY': 	   	    
 	   	    case 'INVITE': 	   	    
 	   	    case 'INFO':    	   	    
 	   	         this.showNotification(message);
  	 		break;
  	 		case 'ADDBUDDY':
  	 		     this.addNewBuddy(message);  	 		    
  	 		break;
  	 		case 'UPDMUGFET':
  	 		     this.updateMugFeature(message);
  	 		break;
  	 		case 'UPDMUGNAM':
  	 		     this.updateMugName(message);
  	 		break;
  	 		case 'RMVMUG':
  	 		     this.removeMug(message);
  	 		break;
  	 		case 'USRADD':
  	 		     this.incUserNum(message);
            break;
            case 'USRGONE':
  	 		     this.decUserNum(message);
            break;
            case 'RMVBDY':
  	 		     this.removeBuddy(message);
            break;            
  	 		case 'ADDMUG':
  	 		     this.addMug(message);
            break;            
  	 		default:  	 		  
  	 		break;
  	 	};
  	 	
  	 };         
     if(lmi_msg_count > 0)
     {               
         var get_browser_attention = Linkmug_Utils.checkAttention();
         if(get_browser_attention){
            window.getAttention();
         };
               
     };         
  	 var interval = Linkmug_Utils.getSetupCycleCheckInterval();
  	 if(this.cycleTimer != null)
  	     window.clearTimeout(this.cycleTimer);
  	 this.cycleTimer = window.setTimeout(function(){Linkmug.cycleCheck();}, interval*1000);
  },
  openLinkTab:function(message)
  {
  	  
  	  var callback = function(response){
           Linkmug.checkRemove(response); 
      };
      
      
      var options={
         timeout:Linkmug_Utils.getTimeoutTreshold(),
         parameters:{
         	id: message.id            
         }        
      };
                   
      var url = "http://" + Linkmug_Config.LINKMUG_HOST + "/browser/remove_msg.php" + Linkmug_Config.LINKMUG_DEBUG;             
      Linkmug_HTTP.post(url, callback, options);  
  	  
  	        
      var link_url = message.url;
            
      var lmBrowser = window.getBrowser();
      if(!lmBrowser)
      {
      	lmBrowser = gBrowser;
      };
      
      var newTab = lmBrowser.addTab(link_url);
      
                                
      var browser = lmBrowser.getBrowserForTab(newTab);
      
                                  
      browser.loadURI(link_url); 
      
      browser.addEventListener("DOMContentLoaded", function(e) { Linkmug.onTabLoad(e,message,this); }, true);
      
	  	  
  },
  flashingMugButton:function()
  {
        if(this.switchMugLight == 1){
          this.switchMugLight = 2;
          Linkmug_Utils.a$("linkmug_mug_status",'status','flashing1');   
        }else{
          this.switchMugLight = 1;
          Linkmug_Utils.a$("linkmug_mug_status",'status','flashing2');   
        } ;
  },
  stopFlashingMugBtn:function()
  {
      if(this.flashMugTimer){
        window.clearInterval(this.flashMugTimer);
        this.flashMugTimer = null;
      };
      this.setMugEnable();
      var omsg = this.CurrentMessage;
      this.showNotificationBar(omsg);   
  },
  startMugBtnFlashing:function()
  {
          this.flashMugTimer = window.setInterval(function(){Linkmug.flashingMugButton();}, 1000);
  },
  flashingBuddyButton:function()
  {
        if(this.switchBuddyLight == 1){
          this.switchBuddyLight = 2;
          Linkmug_Utils.a$("linkmug_buddy_status",'status','flashing1');   
        }else{
          this.switchBuddyLight = 1;
          Linkmug_Utils.a$("linkmug_buddy_status",'status','flashing2');   
        } ;
  },
  stopFlashingBuddyBtn:function()
  {
      if(this.flashBuddyTimer){
        window.clearInterval(this.flashBuddyTimer);
        this.flashBuddyTimer = null;
      };
      this.setBuddyEnable();
      var omsg = this.CurrentMessage;
      this.showNotificationBar(omsg);   
  },
  startBuddyBtnFlashing:function()
  {
          this.flashBuddyTimer = window.setInterval(function(){Linkmug.flashingBuddyButton();}, 1000);
  },
  showNotification:function(omsg)
  {	
  	  if(this.Lock)
  	  {
  	  	 this.MQ.addHead(omsg);
  	  	 return;
  	  };
  	  this.Lock = 1;
  	  this.CurrentMessage = omsg;
  	  var showbar_directly = Linkmug_Utils.checkShowBarDirectly();
      if(showbar_directly)
      {
  	        this.showNotificationBar(omsg);
      }else
      {            
            switch(omsg.type){
            	case 'BDYLNK': 	   	   
 	   	        case 'BDYCHAT':
 	   	           this.startBuddyBtnFlashing();
 	   	        break;
 	   	        default:
 	   	           this.startMugBtnFlashing();     
 	   	        break;
            };
            
      };
  },
  showNotificationBar:function(omsg)
  {	
  	    	  
      switch(omsg.type)
      {
       	 case "PUBLNK" :
       	     Linkmug_Utils.a$("linkmugbar-publink-who",'value',omsg.sender_name);
       	     Linkmug_Utils.a$("linkmugbar-publink-time",'value',omsg.sendtime);       	     
       	     Linkmug_Utils.a$("linkmugbar-publink-title",'value',omsg.title);
       	            	     
       	     if((omsg.message != null)&&(Linkmug_Utils.trim(omsg.message)!=''))
       	     {
       		     Linkmug_Utils.a$("linkmugbar-publink-said",'value',Linkmug.strings.getString("and-said"));
                 var firstChild = Linkmug_Utils.$("linkmugbar-publink-saidwhat").firstChild;
                 if(firstChild)
                   Linkmug_Utils.$("linkmugbar-publink-saidwhat").removeChild(firstChild);                     
                 var txtnode = document.createTextNode("\""+omsg.message+"\"");
                 Linkmug_Utils.$("linkmugbar-publink-saidwhat").appendChild(txtnode);       		 
       	     }else
       	     {
       	     	Linkmug_Utils.a$("linkmugbar-publink-said",'value','');
       	        var firstChild = Linkmug_Utils.$("linkmugbar-publink-saidwhat").firstChild;
                if(firstChild)
                  Linkmug_Utils.$("linkmugbar-publink-saidwhat").removeChild(firstChild);
       	     };
       	     
       	     Linkmug_Utils.$('linkmugbar-deckbox').selectedIndex=Linkmug.PUBLNKBOX;
             Linkmug_Utils.a$('linkmug-bar','hidden','false');
         	 break;
         case "MUGLNK" :
       	     Linkmug_Utils.a$("linkmugbar-muglink-who",'value',omsg.sender_name);
       	     Linkmug_Utils.a$("linkmugbar-muglink-time",'value',omsg.sendtime);       	     
       	     Linkmug_Utils.a$("linkmugbar-muglink-title",'value',omsg.title);
       	            	     
       	     if((omsg.message != null)&&(Linkmug_Utils.trim(omsg.message)!=''))
       	     {
       		     Linkmug_Utils.a$("linkmugbar-muglink-said",'value',Linkmug.strings.getString("and-said"));
                 var firstChild = Linkmug_Utils.$("linkmugbar-muglink-saidwhat").firstChild;
                 if(firstChild)
                   Linkmug_Utils.$("linkmugbar-muglink-saidwhat").removeChild(firstChild);                     
                 var txtnode = document.createTextNode("\""+omsg.message+"\"");
                 Linkmug_Utils.$("linkmugbar-muglink-saidwhat").appendChild(txtnode);       		 
       	     }else
       	     {
       	     	Linkmug_Utils.a$("linkmugbar-muglink-said",'value','');
       	        var firstChild = Linkmug_Utils.$("linkmugbar-muglink-saidwhat").firstChild;
                if(firstChild)
                  Linkmug_Utils.$("linkmugbar-muglink-saidwhat").removeChild(firstChild);
       	     };
       	     
       	     Linkmug_Utils.$('linkmugbar-deckbox').selectedIndex=Linkmug.MUGLNKBOX;
             Linkmug_Utils.a$('linkmug-bar','hidden','false');
         	 break;	 
         case "PVTLNK" :
       	     Linkmug_Utils.a$("linkmugbar-pvtlink-who",'value',omsg.sender_name);
       	     Linkmug_Utils.a$("linkmugbar-pvtlink-time",'value',omsg.sendtime);       	     
       	     Linkmug_Utils.a$("linkmugbar-pvtlink-title",'value',omsg.title);
       	            	     
       	     if((omsg.message != null)&&(Linkmug_Utils.trim(omsg.message)!=''))
       	     {
       		     Linkmug_Utils.a$("linkmugbar-pvtlink-said",'value',Linkmug.strings.getString("and-said"));
                 var firstChild = Linkmug_Utils.$("linkmugbar-pvtlink-saidwhat").firstChild;
                 if(firstChild)
                   Linkmug_Utils.$("linkmugbar-pvtlink-saidwhat").removeChild(firstChild);                     
                 var txtnode = document.createTextNode("\""+omsg.message+"\"");
                 Linkmug_Utils.$("linkmugbar-pvtlink-saidwhat").appendChild(txtnode);       		 
       	     }else
       	     {
       	     	Linkmug_Utils.a$("linkmugbar-pvtlink-said",'value','');
       	        var firstChild = Linkmug_Utils.$("linkmugbar-pvtlink-saidwhat").firstChild;
                if(firstChild)
                  Linkmug_Utils.$("linkmugbar-pvtlink-saidwhat").removeChild(firstChild);
       	     };
       	     
       	     Linkmug_Utils.$('linkmugbar-deckbox').selectedIndex=Linkmug.PVTLNKBOX;
             Linkmug_Utils.a$('linkmug-bar','hidden','false');
         	 break;	
         case "MUGCHAT" :        		       	
       	    
            Linkmug_Utils.a$("linkmugbar-mugmessage-who",'value',omsg.sender_name);
       	    Linkmug_Utils.a$("linkmugbar-mugmessage-time",'value',omsg.sendtime);
            
            var firstChild = Linkmug_Utils.$("linkmugbar-mugmessage-content").firstChild;
            if(firstChild)
              Linkmug_Utils.$("linkmugbar-mugmessage-content").removeChild(firstChild);
            var txtnode = document.createTextNode(omsg.message);
            Linkmug_Utils.$("linkmugbar-mugmessage-content").appendChild(txtnode);
       	           	         	    
       	    Linkmug_Utils.$('linkmugbar-deckbox').selectedIndex=Linkmug.MUGMSGBOX;
            Linkmug_Utils.a$('linkmug-bar','hidden','false');       	    
         	break; 
         case "BDYLNK" :
         
             
       	     Linkmug_Utils.a$("linkmugbar-buddylink-who",'value',omsg.sender_name);
       	     Linkmug_Utils.a$("linkmugbar-buddylink-time",'value',omsg.sendtime);       	     
       	     Linkmug_Utils.a$("linkmugbar-buddylink-title",'value',omsg.title);
       	            	     
       	     if((omsg.message != null)&&(Linkmug_Utils.trim(omsg.message)!=''))
       	     {
       		     Linkmug_Utils.a$("linkmugbar-buddylink-said",'value',Linkmug.strings.getString("and-said"));
                 var firstChild = Linkmug_Utils.$("linkmugbar-buddylink-saidwhat").firstChild;
                 if(firstChild)
                   Linkmug_Utils.$("linkmugbar-buddylink-saidwhat").removeChild(firstChild);                     
                 var txtnode = document.createTextNode("\""+omsg.message+"\"");
                 Linkmug_Utils.$("linkmugbar-buddylink-saidwhat").appendChild(txtnode);       		 
       	     }else
       	     {
       	     	Linkmug_Utils.a$("linkmugbar-buddylink-said",'value','');
       	        var firstChild = Linkmug_Utils.$("linkmugbar-buddylink-saidwhat").firstChild;
                if(firstChild)
                  Linkmug_Utils.$("linkmugbar-buddylink-saidwhat").removeChild(firstChild);
       	     };
       	     
       	     Linkmug_Utils.$('linkmugbar-deckbox').selectedIndex=Linkmug.BDYLNKBOX;
             Linkmug_Utils.a$('linkmug-bar','hidden','false');
         	 break;	
         case "BDYCHAT" :        		       	
       	    
            Linkmug_Utils.a$("linkmugbar-buddymessage-who",'value',omsg.sender_name);
       	    Linkmug_Utils.a$("linkmugbar-buddymessage-time",'value',omsg.sendtime);
            
            var firstChild = Linkmug_Utils.$("linkmugbar-buddymessage-content").firstChild;
            if(firstChild)
              Linkmug_Utils.$("linkmugbar-buddymessage-content").removeChild(firstChild);
            var txtnode = document.createTextNode(omsg.message);
            Linkmug_Utils.$("linkmugbar-buddymessage-content").appendChild(txtnode);
       	           	         	    
       	    Linkmug_Utils.$('linkmugbar-deckbox').selectedIndex=Linkmug.BDYMSGBOX;
            Linkmug_Utils.a$('linkmug-bar','hidden','false');       	    
         	break; 	 
         case "REPLY" :        		       	
       	    Linkmug_Utils.a$("linkmug-reply-reply",'value',""); 
            Linkmug_Utils.a$("linkmugbar-reply-quote",'value',"");
            var replystr = Linkmug.strings.getString("reply");
            Linkmug_Utils.a$("linkmug-reply-reply",'value',replystr+":"); 
            Linkmug_Utils.a$("linkmugbar-reply-quote",'value',Linkmug_Utils.crop_str(omsg.quote_message,10));
            Linkmug_Utils.a$("linkmugbar-reply-who",'value',omsg.sender_name);
       	    Linkmug_Utils.a$("linkmugbar-reply-time",'value',omsg.sendtime);
            
            var firstChild = Linkmug_Utils.$("linkmugbar-reply-content").firstChild;
            if(firstChild)
              Linkmug_Utils.$("linkmugbar-reply-content").removeChild(firstChild);
            var txtnode = document.createTextNode(omsg.message);
            Linkmug_Utils.$("linkmugbar-reply-content").appendChild(txtnode);
       	           	         	    
       	    Linkmug_Utils.$('linkmugbar-deckbox').selectedIndex=Linkmug.REPLYBOX;
            Linkmug_Utils.a$('linkmug-bar','hidden','false');       	    
         	break;    	 
       	 case "INVITE" : 
       	     Linkmug_Utils.a$("linkmugbar-invite-who",'value',omsg.sender_name);
       	     Linkmug_Utils.a$("linkmugbar-invite-time",'value',omsg.sendtime);
       	     Linkmug_Utils.a$("linkmugbar-invite-mug",'value',omsg.mug_name);
       	     
             Linkmug_Utils.$('linkmugbar-deckbox').selectedIndex=Linkmug.INVITEBOX;
             Linkmug_Utils.a$('linkmug-bar','hidden','false');
             break;
      
         case "INFO" :            
       	    Linkmug_Utils.a$("linkmugbar-info-time",'value',omsg.sendtime);
            Linkmug_Utils.a$("linkmugbar-info-title",'value','');
            if((omsg.url)&&(omsg.url!='')&&(Linkmug_Utils.isUrl(omsg.url))){
              if(omsg.title){
                Linkmug_Utils.a$("linkmugbar-info-title",'value',omsg.title);
              }else
              {
                Linkmug_Utils.a$("linkmugbar-info-title",'value','link');
              };
            };
            
            var firstChild = Linkmug_Utils.$("linkmugbar-info-message").firstChild;
            if(firstChild)
              Linkmug_Utils.$("linkmugbar-info-message").removeChild(firstChild);
            var txtnode = document.createTextNode(omsg.message);
            Linkmug_Utils.$("linkmugbar-info-message").appendChild(txtnode);       		 
  
             
       	    Linkmug_Utils.$('linkmugbar-deckbox').selectedIndex=Linkmug.INFOBOX;
            Linkmug_Utils.a$('linkmug-bar','hidden','false');
            break;          
       	default :        		
            break; 
      };
  },  
  gotoTarget:function(nextbar)
  {
  	  
  	  var message = this.CurrentMessage;
  	  this.gotoLink(message);
  	  if(nextbar){  	    
  	    this.nextBar();
  	  };
  	  
  },
  gotoLink:function(message)
  {
  	  
  	 
     var callback = function(response){
           Linkmug.checkRemove(response); 
     };
      
      
     var options={
          timeout:Linkmug_Utils.getTimeoutTreshold(),
          parameters:{
         	id: message.id            
          }        
     };
                   
     var url = "http://" + Linkmug_Config.LINKMUG_HOST + "/browser/remove_msg.php" + Linkmug_Config.LINKMUG_DEBUG;             
     Linkmug_HTTP.post(url, callback, options);  
      
    
     var link_url = message.url;
            
     var lmBrowser = window.getBrowser();
     if(!lmBrowser)
     {
      	lmBrowser = gBrowser;
     };
      
     var newTab = lmBrowser.addTab(link_url);
      
      
      
     lmBrowser.selectedTab = newTab;
      
     var browser = lmBrowser.getBrowserForTab(newTab);
      
                                  
     browser.loadURI(link_url); 
     
     var loadfunc = function(e) { Linkmug.onTabLoad(e,message,this); };
     message.loadfunc = loadfunc;                 
     browser.addEventListener("DOMContentLoaded", loadfunc, true);     	 
  },
  nextBar:function()
  {
       if(this.MQ.length()>0)
       {
    	  var message = this.MQ.next();    	  
    	  this.CurrentMessage = message;
    	  this.showNotificationBar(message);
       }else
       {
  	      Linkmug_Utils.a$('linkmug-bar','hidden','true');  	   
  	      this.Lock = 0;
       };
  },  
  reportBug:function(resp)
  {
      
      if((status == 'timeout')||(status == 'error')||(status == 'srverror')){
      	 var error_txt = 'Unknown Error';
         switch(resp.status){
      	   case 'timeout':
      	     error_txt ="timeout";
      	   break;
      	   case 'error':
      	     error_txt =resp.error;
      	   break;
      	   case 'srverror':
      	     error_txt ='Server Error';
      	   break;      	
      	   default:      	   
      	   break;
         };
      
         var callback = function(response){
           
         };            
         var options={
            timeout:Linkmug_Utils.getTimeoutTreshold(),
            parameters:{
         	  bug_msg: error_txt           
            }        
         };
                   
         var url = "http://" + Linkmug_Config.LINKMUG_HOST + "/browser/report_bug.php" + Linkmug_Config.LINKMUG_DEBUG;       
         Linkmug_HTTP.post(url, callback, options);    
      };    
  },
  replyUser:function(clear)
  {
  	 
  	 var message = this.CurrentMessage;
  	 var reply = this.replyMessage(message,false);
  	 if(reply){
           if(clear){
           	 this.removeMessage(message);
  	         this.nextBar();
           };
           
  	 };
           	   
  },
  replyAll:function(clear)
  {
  	 
  	 var message = this.CurrentMessage;
  	 var reply = this.replyMessage(message,true);
  	 if(reply){
           if(clear){
           	 this.removeMessage(message);
  	         this.nextBar();
           };
  	 };
           	   
  },
  replyMessage:function(omsg,all)
  {
  	  var flag = new Object;
  	  flag.reply = false;
  	  window.openDialog("chrome://linkmug/content/reply/reply.xul", "","chrome,modal,centerscreen",omsg,flag,all);
  	  return flag.reply;
  },
  
  removeMessage:function(message)
  {
  	  var callback = function(response){
           Linkmug.checkRemove(response); 
      };
      
      
      var options={
         timeout:Linkmug_Utils.getTimeoutTreshold(),
         parameters:{
         	id: message.id            
         }        
      };
                   
      var url = "http://" + Linkmug_Config.LINKMUG_HOST + "/browser/remove_msg.php" + Linkmug_Config.LINKMUG_DEBUG;       
      Linkmug_HTTP.post(url, callback, options); 
  },
  checkRemove:function(resp)
  {
  	   if(this.healthCheck(resp) == 'success'){
      	  return;
       }else{
       	   this.reportBug(resp);
       };  	   
  },  
  onTabLoad:function(event,message,browser)
  {
        
       var currentDoc = Linkmug_Utils.getDocumentOfEvent(event);
       if(!currentDoc)
          return; 
       switch(message.type)
 	   {
 	   	  case 'PUBLNK': 	   	  
 	   	  case 'MUGLNK': 	   	 
 	   	  case 'PVTLNK': 	   	   	    	   	   
 	   	  case 'BDYLNK': 	   	   
 	   	     this.Plugins.renderAll(currentDoc,message.page_data);
 	   	  break;
 	   	  default: 	   	  
 	   	  break;  
 	   }   
                       
  },
  blockUser:function()
  {
  	 
  	 var message = this.CurrentMessage;  	 
  	 var block = this.blockSender(message);
  	 if(block){
  	    this.nextBar();
  	 };
  },
  blockSender:function(message)
  {
  	 var flag = new Object;
  	 flag.block = false;  	 
  	 window.openDialog("chrome://linkmug/content/block/block.xul", "","chrome,modal,centerscreen",message,flag);  	 
  	 return flag.block;
  },
  setMugDisable:function()
  {    
    
   	Linkmug_Utils.a$("linkmug_mug_status",'status','disable');    
    Linkmug_Utils.a$("linkmug-send-mug-cmd",'disabled','true');
    Linkmug_Utils.a$("context-linkmug-senditem",'disabled','true');            
  },
  setMugEnable:function()
  {    
    Linkmug_Utils.r$("linkmug-send-mug-cmd",'disabled');
    Linkmug_Utils.r$("context-linkmug-senditem",'disabled');
    var current_status = "disable";
    switch(this.mugstatus)
    {
    	case "LOGIN":
    	  current_status = "login";
    	break;
    	case "LOGOUT":
    	  current_status = "logout";
    	break;
    	case "TIMEOUT":
    	  current_status = "timeout";
    	break;
    	case "ERROR": 
    	  current_status = "error";    	
    	break;
    };
    Linkmug_Utils.a$("linkmug_mug_status",'status',current_status);
        
  },  
  setMugLogin:function()
  {
  	 this.mugstatus = "LOGIN";
  	 Linkmug_Utils.a$('linkmug_mug_status',"status", "login");  
         
         
     var send_btn_tooltip = Linkmug.strings.getString("send-btn-tp-default");  	 
     Linkmug_Utils.a$("linkmug-toolbar-send-button","tooltiptext",send_btn_tooltip);      
     Linkmug_Utils.a$("linkmug-stbpanel","tooltiptext",send_btn_tooltip);             	
  },
  setMugLogout:function()
  {
  	 this.mugstatus = "LOGOUT";
  	 Linkmug_Utils.a$('linkmug_mug_status',"status", "logout");   	 
  },  
  setMugError:function()
  {
  	this.mugstatus = "ERROR";
  	Linkmug_Utils.a$('linkmug_mug_status',"status", "error");   	
  },
  setMugTimeout:function()
  {
  	this.mugstatus = "TIMEOUT";
  	Linkmug_Utils.a$('linkmug_mug_status',"status", "timeout");   	
  },
  setMugConnecting:function()
  {
  	 this.mugstatus = "CONNECTING";
  	 Linkmug_Utils.a$('linkmug_mug_status',"status", "connecting");    	 
  	 Linkmug_Utils.a$("linkmug-toolbar-send-button","tooltiptext",Linkmug.strings.getString("connecting"));
     
  },
  
  hideMugButton: function()
  {
	   Linkmug_Utils.a$("linkmug-toolbar-send-button","status","hide");
  },
  
  setBuddyDisable:function()
  {    
    
   	Linkmug_Utils.a$("linkmug_buddy_status",'status','disable');    
    Linkmug_Utils.a$("linkmug-sendtoallbuddy-cmd",'disabled','true');
    Linkmug_Utils.a$("linkmug-changestatus-popup",'disabled','true');            
  },
  setBuddyEnable:function()
  {    
    Linkmug_Utils.r$("linkmug-changestatus-popup",'disabled');
    Linkmug_Utils.r$("linkmug-sendtoallbuddy-cmd",'disabled');
    var current_status = "disable";
    switch(this.buddystatus)
    {
    	case "LOGIN":
    	  current_status = this.switchOnlineStatus();
    	break;
    	case "LOGOUT":
    	  current_status = "logout";
    	break;
    	case "TIMEOUT":
    	  current_status = "timeout";
    	break;
    	case "ERROR": 
    	  current_status = "error";    	
    	break;
    };
    Linkmug_Utils.a$("linkmug_buddy_status",'status',current_status);
        
  },  
  setBuddyLogin:function()
  {
  	 this.buddystatus = "LOGIN";
  	 var current_status = this.switchOnlineStatus();
  	 Linkmug_Utils.a$('linkmug_buddy_status',"status", current_status);  
         
         
     var send_btn_tooltip = Linkmug.strings.getString("send-buddybtn-tp-default");  	 
     Linkmug_Utils.a$("linkmug-toolbar-buddy-button","tooltiptext",send_btn_tooltip);                        	
  },
  setBuddyLogout:function()
  {
  	 this.buddystatus = "LOGOUT";
  	 Linkmug_Utils.a$('linkmug_buddy_status',"status", "logout");   	 
  },  
  setBuddyError:function()
  {
  	this.buddystatus = "ERROR";
  	Linkmug_Utils.a$('linkmug_buddy_status',"status", "error");   	
  },
  setBuddyTimeout:function()
  {
  	this.buddystatus = "TIMEOUT";
  	Linkmug_Utils.a$('linkmug_buddy_status',"status", "timeout");   	
  },
  setBuddyConnecting:function()
  {
  	 this.buddystatus = "CONNECTING";
  	 Linkmug_Utils.a$('linkmug_buddy_status',"status", "connecting");    	 
  	 Linkmug_Utils.a$("linkmug-toolbar-buddy-button","tooltiptext",Linkmug.strings.getString("connecting"));
     
  },
  
  hideBuddyButton: function()
  {
	   Linkmug_Utils.a$("linkmug_buddy_status","status","hide");
  },
  showAbout:function()
  {
	   window.open("chrome://linkmug/content/about/about.xul", "","chrome,centerscreen");
  },
  setPreference:function()
  {
	   window.open("chrome://linkmug/content/option/options.xul", "","chrome,centerscreen");
  },	
  popupShow :function(e)
  {    	
    	var element = document.popupNode;
    	if(!element)
    	  return;
    	if((this.mugstatus != 'LOGIN')||(this.buddystatus != 'LOGIN'))
    	  return;
    	if(((element.href)&&(Linkmug_Utils.isUrl(element.href)))||((element.src)&&(Linkmug_Utils.isUrl(element.src)))) 
	    {
		      Linkmug_Utils.a$('context-linkmug-senditem','status','login'); 
		      Linkmug_Utils.r$('context-linkmug-senditem','disabled');
	    }else
	    {
	         
	          Linkmug_Utils.a$('context-linkmug-senditem','status','disable'); 
		      Linkmug_Utils.a$('context-linkmug-senditem','disabled','true');
	    };     
   },
   addLinkmugBar :function()
   {
        var bar = Linkmug_Utils.$("linkmug-bar");	
        var barParent = bar.parentNode;
        barParent.removeChild(bar);
        barParent.appendChild(bar);        
        this.init();
   },
   hideBar:function()
   {
    	var hidden = Linkmug_Utils.$("linkmug-bar").hidden;
    	if(!hidden){
    	  Linkmug_Utils.$("linkmug-bar").hidden = true;
    	  Linkmug_Utils.a$("linkmug-showbar-menuitem","disabled","false");
    	};
   },
   showBar:function()
   {
    	var hidden = Linkmug_Utils.$("linkmug-bar").hidden;
    	if(hidden){
    	  Linkmug_Utils.$("linkmug-bar").hidden = false;
    	  Linkmug_Utils.a$("linkmug-showbar-menuitem","disabled","true");
    	};
   },
   nextItem:function() //always in Lock condition
   {
    	if(this.MQ.length()>0)
    	{
    	  var message = this.MQ.next();
    	  this.MQ.add(this.CurrentMessage);
    	  this.CurrentMessage = message;
    	  this.showNotificationBar(message);
    	};
   },
   lastItem:function() //always in Lock condition
   {
    	if(this.MQ.length()>0)
    	{
    	  var message = this.MQ.last();
    	  this.MQ.addHead(this.CurrentMessage);
    	  this.CurrentMessage = message;
    	  this.showNotificationBar(message);
    	};
   },
   removeMsg:function() //always in Lock condition
   {
  	   var msg = this.CurrentMessage;
       this.removeMessage(msg);
  	   this.nextBar();
   },      
   genPopupMenu:function()//always in Lock condition
   {
    	var asbox = Linkmug_Utils.$('linkmug-arrowscrollbox');
    	while(asbox.childNodes.length != 0)
            asbox.removeChild(asbox.childNodes[0]);
        var m_length = this.MQ.length();
        for(var i = 0; i < m_length;i++)
        {
        	var menuitem = document.createElement('menuitem');        	       	
        	var hbox = document.createElement('hbox');
        	hbox.setAttribute('align',"center");
        	hbox.setAttribute('pack',"start");
        	hbox.setAttribute('class',"menuitem");
        	//hbox.setAttribute('flex',"1");
        	menuitem.appendChild(hbox);
        	asbox.appendChild(menuitem);
        	
        	var image        = document.createElement('image');
        	var label_sender = document.createElement('label');
        	var label_info   = document.createElement('label');
        	label_sender.setAttribute('crop',"right");
        	label_sender.setAttribute('class',"the_sender");
        	
        	label_info.setAttribute('crop',"right");
        	label_info.setAttribute('class',"abrv-info");
        	hbox.appendChild(image);
        	hbox.appendChild(label_sender);
        	hbox.appendChild(label_info);
        	
        	var message = this.MQ.Q[i];
        	var outobj = new Object;
        	this.setupMenuitem(message,menuitem,outobj);
        	
        	image.setAttribute('class',outobj.img_cls);
        	label_sender.setAttribute('value',outobj.label_sender_val);   
        	label_info.setAttribute('value',outobj.label_info_val); 
        };
   },
   setupMenuitem:function(message,menuitem,outobj)
   {
    	outobj.img_cls = null;
        outobj.label_val = null;
        var msg = message;
        switch(msg.type)
        {
       	      case "PUBLNK":
       	      case "MUGLNK":
       	      case "PVTLNK":
       	      case "BDYLNK":
       	         outobj.img_cls = 'link';
       	         outobj.label_sender_val = msg.sender_name;  
       	         outobj.label_info_val = Linkmug_Utils.crop_str(message.title,10); 
         	  break; 
         	  case "MUGCHAT" : 
         	  case "BDYCHAT" :
         	  case "REPLY" :
       		     outobj.img_cls = 'message';
       		     outobj.label_sender_val = msg.sender_name;  
       	         outobj.label_info_val = Linkmug_Utils.crop_str(msg.message,10);       		     
         	  break;
       	      case "INVITE" : 
       	         outobj.img_cls = 'invite';
       	         outobj.label_sender_val = msg.sender_name;  
       	         outobj.label_info_val = Linkmug.strings.getString("invitation");
              break;             	                             	                    
              case "INFO" :
                 outobj.img_cls = 'info';
                 outobj.label_sender_val = '';  
       	         outobj.label_info_val = Linkmug_Utils.crop_str(msg.message,10);               
         	  break;
              case "ERROR" :
                 outobj.img_cls = 'error';
                 outobj.label_sender_val = '';  
       	         outobj.label_info_val = Linkmug_Utils.crop_str(msg.message,10);               
         	  break;
       	      default :        		
         	  break; 
        };
        
        menuitem.addEventListener("command", function(e) { Linkmug.switchMessage(msg); }, true);
   },
   switchMessage:function(message)//always in Lock condition
   {
    	
    	var msg = this.MQ.fetch(message);
    	if(!msg)
    	  return;    	
    	this.MQ.addHead(this.CurrentMessage);
    	this.CurrentMessage = msg;
    	this.showNotificationBar(msg);
   },
   clearAllMessage:function()//always in Lock condition
   {
    	
    	var callback = function(response){
           Linkmug.checkRemove(response); 
        };
      
      
        var options={
         timeout:Linkmug_Utils.getTimeoutTreshold(),
         parameters:{
         	all: 1            
         }        
        };
                   
        var url = "http://" + Linkmug_Config.LINKMUG_HOST + "/browser/remove_all.php" + Linkmug_Config.LINKMUG_DEBUG;       
        Linkmug_HTTP.post(url, callback, options); 
      
    	this.MQ.Q = new Array();
    	Linkmug_Utils.a$('linkmug-bar','hidden','true');
  	    this.CurrentMessage = null;  	   
  	    this.Lock = 0;
    	
   },   
  checkRenderLock:function(){
   	  return this.LockWizard;
  },
  registerPlugin:function(plugin){
   	  this.Plugins.add(plugin); 
  },
  doAddBuddy:function(buddy)
  {
  	 var flag = new Object;
  	 flag.add = false;  	 
  	 window.openDialog("chrome://linkmug/content/addbuddy/addbuddy.xul", "","chrome,modal,centerscreen",buddy,flag);  	 
  	 return flag.add;
  },
  addBuddy :function(){  
  	
   	  var msg = this.CurrentMessage;
   	  var friend = Linkmug_Class.createBuddy(msg.sender_name,msg.sender_id,'ONLINE');
   	  if(!this.doAddBuddy(friend))
   	     return;
   	  this.Friends.add(friend);   
   	     
   	  var callback = function(response){
        Linkmug.addBuddyComplete(response);
      };
      var options={
         timeout:Linkmug_Utils.getTimeoutTreshold(),
         parameters:{
           _friend_id   : msg.sender_id
         }        
      };
           
      var url = "http://" + Linkmug_Config.LINKMUG_HOST + "/browser/addbuddy.php" + Linkmug_Config.LINKMUG_DEBUG;     
      
      Linkmug_HTTP.post(url, callback, options); 
     
  },
  addBuddyComplete:function(resp)
  {
  	   if(this.healthCheck(resp) == 'success'){  	     
  	     return;
  	   }else{
  	   	 this.reportBug(resp);
  	   };
  },
  addNewBuddy:function(message)
  {
  	    this.Friends.add(Linkmug_Class.createBuddy(message.buddy_name,message.buddy_id,message.ols));
  	    this.removeMessage(message);
  },
  removeBuddy:function($message)
  {  	   
  	   this.Friends.remove($message.buddy_id);
  	   this.removeMessage($message);
  	   
  },
 setOnlineStatus:function(status)
 {
  	   if(this.onlineStatus == status){
  	      return;  
  	   };
  	   this.onlineStatus = status;
  	   this.setBuddyEnable();  	     	   
  	   
 },
 switchOnlineStatus:function()
 {
 	var cls = 'offline';
 	switch(this.onlineStatus)
 	{
 		case "ONLINE":
 		cls = 'online';
 		break;
 		case "OFFLINE":
 		cls = 'offline';
 		break;
 		case "BUSY":
 		cls = 'busy';
 		break;
 		case "IDLE":
 		cls = 'idle';
 		break;
 		case "LEAVE":
 		cls = 'leave';
 		break;
 		default:
 		break;
 	};
 	return cls;
 },
 sendtoBuddy:function(buddy)
 {
      var receiver = buddy;
      if(buddy == null){
    	receiver = Linkmug_Utils.getLastTalkedBuddy();
      };
      if(this.flashBuddyTimer)
      {
         this.stopFlashingBuddyBtn();
         return;
      };  
      switch(this.buddystatus)
      {
       case "LOGOUT" :             
         //this.setMugDisable();
         window.openDialog("chrome://linkmug/content/login/login.xul", "","chrome,modal,centerscreen");
         return;
      
       case "ERROR" :              
         window.openDialog("chrome://linkmug/content/info/error.xul","","chrome,modal,centerscreen");
         return;
      
       case "TIMEOUT" :              
         window.openDialog("chrome://linkmug/content/info/timeout.xul","","chrome,modal,centerscreen");
         return;       
       case "CONNECTING" :           
         return;
       case "INIT" :           
         return;
      };
      
      if(this.LockWizard)
         return;
      this.LockWizard = true;           
      
      var link_info = Linkmug_Utils.getCurrentPageInfo();
            
      var pstrings = this.Plugins.getPString();
            
      window.openDialog("chrome://linkmug/content/send/sendbuddy.xul", 
                        "",
                        "chrome,centerscreen,width=700,height=610",
                        link_info.share_url,
                        link_info.share_title,
                        receiver,
                        pstrings);
 },
 calcNeedNotice:function(message)
 {
 	   var need_notice = 0;
 	   switch(message.type)
 	   {
 	   	  case 'PUBLNK': 	   	  
 	   	  case 'MUGLNK': 	   	 
 	   	  case 'PVTLNK': 	   	  
 	   	  case 'MUGCHAT': 	   	   
 	   	  case 'BDYLNK': 	   	   
 	   	  case 'BDYCHAT': 	   	    
 	   	  case 'REPLY': 	   	    
 	   	  case 'INVITE': 	   	    
 	   	  case 'INFO':
 	   	  case 'ERROR':
 	   	    need_notice = 1;
 	   	  break;
 	   	  default:
 	   	    need_notice = 0;
 	   	  break;  
 	   }
 	   return need_notice;
 },	
 addComment:function(public_comment)
 {
 	  var message = this.CurrentMessage;
 	  window.openDialog("chrome://linkmug/content/comment/comment.xul", 
                        "",
                        "chrome,centerscreen,width=500",
                        public_comment,message);
 }

};
window.addEventListener("load", function(e) { Linkmug.onLoad(e); }, false);
window.addEventListener("popupshowing", function(e) { Linkmug.popupShow(e); }, false);
