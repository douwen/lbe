function LOG(text)
{
        var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
        consoleService.logStringMessage(text);
}

function linkmugHTTPListener() { }

linkmugHTTPListener.prototype = {
    
  observe: function(subject, topic, data)
  {
      if (topic == "http-on-modify-request") {

         
          try{
            var httpChannel = subject.QueryInterface(Components.interfaces.nsIHttpChannel);
            //httpChannel.setRequestHeader('X-Linkmug','YES',true);
            var host = httpChannel.getRequestHeader('Host');
            //LOG(host);
            
            if(host.indexOf("linkmug.com") >=0)
            {            	
            	httpChannel.setRequestHeader('X-LINKMUG','Firefox/0.2.0.5.20080106',true);
            	
            };
                      
          }catch(e){};
          return;
      };


      if (topic == "app-startup") {
         
          var os = Components.classes["@mozilla.org/observer-service;1"]
                             .getService(Components.interfaces.nsIObserverService);

          os.addObserver(this, "http-on-modify-request", false);
          return;
      };
  },
 
  QueryInterface: function (iid) {
        if (iid.equals(Components.interfaces.nsIObserver) ||
            iid.equals(Components.interfaces.nsISupports))
            return this;
        
        Components.returnCode = Components.results.NS_ERROR_NO_INTERFACE;
        return null;
    },
};

var lmHTTPListenerModule = {
    registerSelf: function (compMgr, fileSpec, location, type) {

        var compMgr = compMgr.QueryInterface(Components.interfaces.nsIComponentRegistrar);
        compMgr.registerFactoryLocation(this.myCID,
                                        this.myName,
                                        this.myProgID,
                                        fileSpec,
                                        location,
                                        type);


       

        var catMgr = Components.classes["@mozilla.org/categorymanager;1"].getService(Components.interfaces.nsICategoryManager);
        catMgr.addCategoryEntry("app-startup", this.myName, this.myProgID, true, true);
    },


    getClassObject: function (compMgr, cid, iid) {

        
        return this.myFactory;
    },

    myCID: Components.ID("{5b0e749e-556e-11dc-8314-0800200c9a66}"),

    myProgID: "@linkmug/linkmugHTTPListener;1",

    myName:   "Linkmug HTTP Listener",

    myFactory: {
        QueryInterface: function (aIID) {
            if (!aIID.equals(Components.interfaces.nsISupports) &&
                !aIID.equals(Components.interfaces.nsIFactory))
                throw Components.results.NS_ERROR_NO_INTERFACE;
            return this;
        },

        createInstance: function (outer, iid) {
         

          return new linkmugHTTPListener();
        }
    },

    canUnload: function(compMgr) {
        return true;
    }
};

function NSGetModule(compMgr, fileSpec) {
    return lmHTTPListenerModule;
}
