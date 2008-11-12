var Linkmug_Message = {
   createPubLnkMessage :function(
                                     url,
                                     title,
                                     desc,
                                     message,                                     
                                     mugs,
                                     tags,
                                     data
                            )
   {
	   var obj = new Object;
       obj.type       = 'PUBLNK';
       obj.url        = url;
       obj.title      = title;
       obj.desc       = desc;
       obj.message    = message;         
       obj.mugs       = mugs;
       obj.tags       = tags;
       obj.data       = data;
       return obj;
  },
  createMugLnkMessage :function(
                                     url,
                                     title,
                                     desc,
                                     message,                                     
                                     mugs,
                                     tags,
                                     data
                            )
   {
	   var obj = new Object;
       obj.type       = 'MUGLNK';
       obj.url        = url;
       obj.title      = title;
       obj.desc       = desc;
       obj.message    = message;         
       obj.mugs       = mugs;
       obj.tags       = tags;
       obj.data       = data;
       return obj;
  },
  createPrvtLnkMessage :function(
                                     url,
                                     title,
                                     desc,
                                     message,                                     
                                     mugs,
                                     tags,
                                     data
                            )
   {
	   var obj = new Object;
       obj.type       = 'PRVTLNK';
       obj.url        = url;
       obj.title      = title;
       obj.desc       = desc;
       obj.message    = message;         
       obj.mugs       = mugs;
       obj.tags       = tags;
       obj.data       = data;
       return obj;
  },
  createMugChatMessage :function(                                     
                                     message,                                     
                                     mugs
                                )
  {
	   var obj = new Object;
       obj.type       = 'MUGCHAT';       
       obj.message    = message;         
       obj.mugs       = mugs;       
       return obj;
  },
  
  createBdyLnkMessage:function(
                                url,
                                title,
                                desc,
                                message,                              
                                tags,
                                who,
                                data
                             )
  {
      
       var obj = new Object;
       obj.type      = 'BDYLNK';
       obj.url       = url;
       obj.title     = title;
       obj.desc      = desc;
       obj.message   = message;                                      
       obj.tags      = tags;
       obj.data      = data;
       obj.who       = who;
       return obj;
 },
 createBdyChatMessage:function(                               
                                message,                                                             
                                who
                              )
 {
      
       var obj = new Object;
       obj.type      = 'BDYCHAT';       
       obj.message   = message; 
       obj.who       = who;
       return obj;
 },
 createRplyMessage:function(
                               message_id,
                               replyto_id,
                               message,
                               quote
                            )           
 {
      
       var obj = new Object;
       obj.type      = 'REPLY';
       obj.mid       = message_id;
       obj.who       = replyto_id;
       obj.message   = message;                         
       obj.quote     = quote;                 
       return obj;
 },
 createRplyAllMessage:function(
                               message_id,
                               replyto_id,
                               mugs,
                               message,
                               quote
                            )           
 {
      
       var obj = new Object;
       obj.type      = 'REPLYALL';
       obj.mid       = message_id;
       obj.who       = replyto_id;
       obj.mugs      = mugs;
       obj.message   = message;                         
       obj.quote     = quote;                 
       return obj;
 },
 createBlockMessage:function(
                               user_id,
                               message_id
                            )           
 {
      
       var obj = new Object;
       obj.type      = 'BLOCK';
       obj.who       = user_id;
       obj.mid       = message_id;
       return obj;
 },
 createPubCmntMessage:function(
                                urlhash,
                                mugs,                               
                                comment
                             )
 {
      
       var obj = new Object;
       obj.type      = 'PUBCMNT';
       obj.urlhash   = urlhash;
       obj.mugs      = mugs;      
       obj.comment   = comment;       
       return obj;
 },
 createMugCmntMessage:function(
                                urlhash,
                                mugs,                                
                                comment
                             )
  {
      
       var obj = new Object;
       obj.type      = 'MUGCMNT';
       obj.urlhash   = urlhash;
       obj.mugs      = mugs;      
       obj.comment   = comment;       
       return obj;
 },
 parseIncomingMessage:function(
                                packet
                              )
 {
      
       var obj = null;
       try{
         
          var obj = packet.content;          
          obj.id  = packet.id;         
          obj.sendtime = Linkmug_Utils.timespan(packet.sendtime); //ugly
       }catch(e){
       	  Linkmug_Utils.dd$("parseing packet error");
       	  obj = null;
       };
       return obj;
 }
};