var Linkmug_HTTP = {
   _factories    :   [
                       function() { return new XMLHttpRequest(); }   
                     ],
   _factory      :   null,
   newRequest    :   function() {
      if (this._factory != null) return this._factory();

      for(var i = 0; i < this._factories.length; i++) {
        try {
            var factory = this._factories[i];
            var request = factory();
            if (request != null) {
                this._factory = factory;
                return request;
            };
        }catch(e) {
            continue;
        };
      };
    
      this._factory = function() {
        throw new Error("XMLHttpRequest not supported");
      };
      this._factory(); // Throw an error
   },
   _getResponse : function(request) {
    
        return request.responseText;
    
   },
   post  :  function(url, callback, options) {
      var request = this.newRequest();
      var n = 0;
      var trigger_timeout = false;
      var timer = null;    
      if ((options.timeout)&&(options.timeout >0))
      {    
        timer = setTimeout(  function(){
                               try{                                   	                                    
                                  trigger_timeout = true;
                                  request.abort();                                
                               }catch(e){};
                               callback(JSON.parse("{\"status\":\"timeout\"}"));
                              },
                              options.timeout*1000
                           );
      };
      request.onreadystatechange = function() {
        try{
      	
          if (request.readyState == 4) {
                    
            if (timer) 
               clearTimeout(timer); 
            
            if (request.status == 200) {
            	            	              	
            	var resp =JSON.parse("{\"status\":\"srverror\"}");            	
            	try{
            		resp = JSON.parse(Linkmug_HTTP._getResponse(request));            	
            	}catch(e){
                                       
            	    resp =JSON.parse("{\"status\":\"srverror\"}"); 
            	};            	
                callback(resp);
            	
            }
            else {                                
                            	   
                callback(JSON.parse("{\"status\":\"srverror\"}"));
            }
          }else if (options.progressHandler) {
            options.progressHandler(++n);
          };
      }catch(e){
         if (!trigger_timeout) {    
         	
            callback(JSON.parse("{\"status\":\"timeout\"}"));
         }
      };
    };
    /*  the JSON way
    var target = url;
    var p= "p=" + {}.toJSONString();
    if (options.parameters)
        p="p=" + options.parameters.toJSONString();
    request.open("POST", target,true);
    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
    request.send(data);   
    */
    var target = url;
    var data =null;
    if (options.parameters)
        data = this.encodeFormData(options.parameters);
    request.open("POST", target,true);
    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
    request.send(data);
  },
  encodeFormData  : function(data) {
    var pairs = [];
    var regexp = /%20/g; // A regular expression to match an encoded space

    for(var name in data) {
        var value = data[name].toString();
        // Create a name/value pair, but encode name and value first
        // The global function encodeURIComponent does almost what we want,
        // but it encodes spaces as %20 instead of as "+". We have to
        // fix that with String.replace()
        var pair = encodeURIComponent(name).replace(regexp,"+") + '=' +
            encodeURIComponent(value).replace(regexp,"+");
        pairs.push(pair);
    }

    // Concatenate all the name/value pairs, separating them with &
    return pairs.join('&');
  }
   
};
