var Linkmug_Class = {
   createMug :function(element)
   {
	var obj = new Object;
	obj.mug_id      = element.mug_id;
	obj.mug_alias   = element.mug_alias;	
	obj.owner       = element.owner;	
	obj.feature     = element.feature;
	obj.description = element.description;
	obj.user_num    = element.user_num;
	obj.checked     = false;
	return obj;
  },
  createBugMessage:function(err_msg)
  {
      
       var obj = new Object;
       obj.id           =   new Linkmug_UUID();
       obj.type         =   'ERROR';
       obj.message      =   err_msg;       
       return obj;
 },
 createBuddy:function(fname,fid,ols)
 {
      
       var obj = new Object;
       var id            = new Linkmug_UUID();
       obj.imgid         =   'buddy_img' + new Linkmug_UUID(); 
       obj.lblid         =   'buddy_lbl' + new Linkmug_UUID(); 
       obj.fid            =   fid;
       obj.name           =   fname;
       obj.ols            =   ols;
       return obj;
 }
};