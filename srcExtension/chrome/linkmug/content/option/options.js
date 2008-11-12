var Linkmug_Option = {
  strings    :  Linkmug_Utils.$("linkmug-options-strings"),
  onLoad : function() {
  	var pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);
    try{
       var autopen = pref.getBoolPref("linkmug.auto.open");
       Linkmug_Utils.$("linkmug-autopen-checkbox").checked = autopen;
       
       var mugmsg_first = pref.getBoolPref("linkmug.mugmsg.first");
       Linkmug_Utils.$("linkmug-msgmugsend-checkbox").checked = mugmsg_first;
       
       var buddymsg_first = pref.getBoolPref("linkmug.buddymsg.first");
       Linkmug_Utils.$("linkmug-msgbuddysend-checkbox").checked = buddymsg_first;

       var get_attention = pref.getBoolPref("linkmug.browser.attention");
       Linkmug_Utils.$("linkmug-attention-checkbox").checked = get_attention;

       var get_showbar = pref.getBoolPref("linkmug.showbar.direct");
       Linkmug_Utils.$("linkmug-showbardirect-checkbox").checked = get_showbar;
       
       var sync_interval = pref.getIntPref("linkmug.sync.interval");
       Linkmug_Utils.$("sync-value").value = sync_interval;
              
       var send_interval = pref.getIntPref("linkmug.send.interval");
       Linkmug_Utils.$("sendcheck-interval").value = send_interval;
       
       var timeout_threshold = pref.getIntPref("linkmug.timeout.threshold");
       Linkmug_Utils.$("timeout-threshold").value = timeout_threshold;
    }catch(e){
               
        Linkmug_Utils.$("linkmug-autopen-checkbox").checked = false;
        pref.setBoolPref("linkmug.auto.open", Linkmug_Utils.$("linkmug-autopen-checkbox").checked);
        
        Linkmug_Utils.$("linkmug-msgmugsend-checkbox").checked = false;
        pref.setBoolPref("linkmug.mugmsg.first", Linkmug_Utils.$("linkmug-msgmugsend-checkbox").checked);
        
        Linkmug_Utils.$("linkmug-msgbuddysend-checkbox").checked = true;
        pref.setBoolPref("linkmug.buddymsg.first", Linkmug_Utils.$("linkmug-msgbuddysend-checkbox").checked);

        Linkmug_Utils.$("linkmug-attention-checkbox").checked = true;
        pref.setBoolPref("linkmug.browser.attention", Linkmug_Utils.$("linkmug-attention-checkbox").checked);

        Linkmug_Utils.$("linkmug-showbardirect-checkbox").checked = true;
        pref.setBoolPref("linkmug.showbar.direct", Linkmug_Utils.$("linkmug-showbardirect-checkbox").checked);
        
        Linkmug_Utils.$("sync-value").value = Linkmug_Config.LINKMUG_CYCLECHECK_INTERVAL;
        pref.setIntPref("linkmug.sync.interval", Linkmug_Config.LINKMUG_CYCLECHECK_INTERVAL);
        
        Linkmug_Utils.$("sendcheck-interval").value = Linkmug_Config.LINKMUG_SENDCHECK_INTERVAL;
        pref.setIntPref("linkmug.send.interval", Linkmug_Config.LINKMUG_SENDCHECK_INTERVAL);
        
        Linkmug_Utils.$("timeout-threshold").value = 0;
        pref.setIntPref("linkmug.timeout.threshold", 0);
                
   };
  },
  optionApply: function(){  
     var pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);
     
    
     
     pref.setBoolPref("linkmug.auto.open",Linkmug_Utils.$("linkmug-autopen-checkbox").checked);
     
     pref.setBoolPref("linkmug.mugmsg.first",Linkmug_Utils.$("linkmug-msgmugsend-checkbox").checked);
     
     pref.setBoolPref("linkmug.buddymsg.first",Linkmug_Utils.$("linkmug-msgbuddysend-checkbox").checked);

     pref.setBoolPref("linkmug.browser.attention", Linkmug_Utils.$("linkmug-attention-checkbox").checked);

     pref.setBoolPref("linkmug.showbar.direct", Linkmug_Utils.$("linkmug-showbardirect-checkbox").checked);
     
     var sync_interval = Linkmug_Utils.$("sync-value").value;
     if(!Linkmug_Utils.isUnsignedInteger(sync_interval))
     {
     	Linkmug_Utils.$("err-message").value = Linkmug_Option.strings.getString("sync-value-illegal");
     	return true;
     };
     sync_interval = parseInt(sync_interval);
     if(sync_interval <  Linkmug_Config.LINKMUG_CYCLECHECK_INTERVAL)
        sync_interval = Linkmug_Config.LINKMUG_CYCLECHECK_INTERVAL;
     pref.setIntPref("linkmug.sync.interval",sync_interval);
     
     var sendcheck_interval = Linkmug_Utils.$("sendcheck-interval").value;
     if(!Linkmug_Utils.isUnsignedInteger(sendcheck_interval))
     {
     	Linkmug_Utils.$("err-message").value = Linkmug_Option.strings.getString("send-value-illegal");
     	return true;
     };
          
     sendcheck_interval = parseInt(sendcheck_interval);
     if(sendcheck_interval <  Linkmug_Config.LINKMUG_SENDCHECK_INTERVAL)
        sendcheck_interval = Linkmug_Config.LINKMUG_SENDCHECK_INTERVAL;
     pref.setIntPref("linkmug.send.interval",sendcheck_interval);
     
     
     var timeout_threshold = Linkmug_Utils.$("timeout-threshold").value;
     if(!Linkmug_Utils.isUnsignedInteger(timeout_threshold))
     {
     	Linkmug_Utils.$("err-message").value = Linkmug_Option.strings.getString("timeout-value-illegal");
     	return true;
     };
          
     timeout_threshold = parseInt(timeout_threshold);
     if((timeout_threshold <  Linkmug_Config.LINKMUG_TIMEOUT)&&((timeout_threshold > 0)))
        timeout_threshold = 0;
     pref.setIntPref("linkmug.timeout.threshold",timeout_threshold);
     
     setTimeout("window.close()", 0);
  },
  optionDefault: function(){	
      Linkmug_Utils.$("linkmug-autopen-checkbox").checked = false; 
      Linkmug_Utils.$("linkmug-msgmugsend-checkbox").checked = false;
      Linkmug_Utils.$("linkmug-msgbuddysend-checkbox").checked = true;
      Linkmug_Utils.$("linkmug-attention-checkbox").checked = true;
      Linkmug_Utils.$("linkmug-showbardirect-checkbox").checked = true;
      Linkmug_Utils.$("sync-value").value = Linkmug_Config.LINKMUG_CYCLECHECK_INTERVAL;   
      Linkmug_Utils.$("sendcheck-interval").value = Linkmug_Config.LINKMUG_SENDCHECK_INTERVAL;
      Linkmug_Utils.$("timeout-threshold").value = 0; 
       
  }
};
  
