var LinkmugAbout = {	
    onLoad: function() {
    	Linkmug_Utils.a$("linkmug-homepage","href","http://"+Linkmug_Config.LINKMUG_HOST);
    	Linkmug_Utils.a$("mailto-linkmug-author","href","mailto:"+Linkmug_Config.LINKMUG_ADMIN_MAIL+"?subject=I like Linkmug");
    }
};
