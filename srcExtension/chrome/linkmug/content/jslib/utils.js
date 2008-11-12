/*

This is a Javascript implementation of the C implementation of the CRC-32
algorithm available at http://www.w3.org/TR/PNG-CRCAppendix.html

Usage License at
http://www.w3.org/Consortium/Legal/2002/copyright-software-20021231

Copyright (C) W3C

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Permission to copy, modify, and distribute this software and its
documentation, with or without modification, for any purpose and without
fee or royalty is hereby granted, provided that you include the
following on ALL copies of the software and documentation or portions
thereof, including modifications:

1. The full text of this NOTICE in a location viewable to users of
the redistributed or derivative work.
2. Any pre-existing intellectual property disclaimers, notices, or
terms and conditions. If none exist, the W3C Software Short Notice
should be included (hypertext is preferred, text is permitted)
within the body of any redistributed or derivative code.
3. Notice of any changes or modifications to the files,
including the date changes were made. (We recommend you provide
URIs to the location from which the code is derived.)

THIS SOFTWARE AND DOCUMENTATION IS PROVIDED "AS IS," AND
COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR WARRANTIES,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO, WARRANTIES OF
MERCHANTABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT
THE USE OF THE SOFTWARE OR DOCUMENTATION WILL NOT INFRINGE ANY
THIRD PARTY PATENTS, COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS.

COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT,
SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE
SOFTWARE OR DOCUMENTATION.

The name and trademarks of copyright holders may NOT be used in
advertising or publicity pertaining to the software without
specific, written prior permission. Title to copyright in this
software and any associated documentation will at all times
remain with copyright holders.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*/

var Linkmug_crc32 = {
    table: [
            0x0, 0x77073096, 0xee0e612c, 0x990951ba, 0x76dc419, 0x706af48f,
            0xe963a535, 0x9e6495a3, 0xedb8832, 0x79dcb8a4, 0xe0d5e91e,
            0x97d2d988, 0x9b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91,
            0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de, 0x1adad47d,
            0x6ddde4eb, 0xf4d4b551, 0x83d385c7, 0x136c9856, 0x646ba8c0,
            0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9, 0xfa0f3d63,
            0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172,
            0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b, 0x35b5a8fa,
            0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75,
            0xdcd60dcf, 0xabd13d59, 0x26d930ac, 0x51de003a, 0xc8d75180,
            0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599, 0xb8bda50f,
            0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924, 0x2f6f7c87,
            0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190, 0x1db7106,
            0x98d220bc, 0xefd5102a, 0x71b18589, 0x6b6b51f, 0x9fbfe4a5,
            0xe8b8d433, 0x7807c9a2, 0xf00f934, 0x9609a88e, 0xe10e9818,
            0x7f6a0dbb, 0x86d3d2d, 0x91646c97, 0xe6635c01, 0x6b6b51f4,
            0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed, 0x1b01a57b,
            0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950, 0x8bbeb8ea,
            0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65,
            0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541,
            0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a, 0x346ed9fc,
            0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5, 0xaa0a4c5f,
            0xdd0d7cc9, 0x5005713c, 0x270241aa, 0xbe0b1010, 0xc90c2086,
            0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f, 0x5edef90e,
            0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81,
            0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6, 0x3b6e20c,
            0x74b1d29a, 0xead54739, 0x9dd277af, 0x4db2615, 0x73dc1683,
            0xe3630b12, 0x94643b84, 0xd6d6a3e, 0x7a6a5aa8, 0xe40ecf0b,
            0x9309ff9d, 0xa00ae27, 0x7d079eb1, 0xf00f9344, 0x8708a3d2,
            0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb, 0x196c3671,
            0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc,
            0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5, 0xd6d6a3e8,
            0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767,
            0x3fb506dd, 0x48b2364b, 0xd80d2bda, 0xaf0a1b4c, 0x36034af6,
            0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef, 0x4669be79,
            0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236, 0xcc0c7795,
            0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe, 0xb2bd0b28,
            0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b,
            0x5bdeae1d, 0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x26d930a,
            0x9c0906a9, 0xeb0e363f, 0x72076785, 0x5005713, 0x95bf4a82,
            0xe2b87a14, 0x7bb12bae, 0xcb61b38, 0x92d28e9b, 0xe5d5be0d,
            0x7cdcefb7, 0xbdbdf21, 0x86d3d2d4, 0xf1d4e242, 0x68ddb3f8,
            0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777,
            0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff,
            0xf862ae69, 0x616bffd3, 0x166ccf45, 0xa00ae278, 0xd70dd2ee,
            0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7, 0x4969474d,
            0x3e6e77db, 0xaed16a4a, 0xd9d65adc, 0x40df0b66, 0x37d83bf0,
            0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9, 0xbdbdf21c,
            0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693,
            0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8, 0x5d681b02,
            0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d, 
            ],
    
    crc: function(data)
    {
        var crc = 0xffffffff;

        for(var i = 0; i < data.length; i++) {
            crc = this.table[(crc ^ data.charCodeAt(i)) & 0xff] 
                ^ (crc >> 8);
        }

        crc = crc ^ 0xffffffff;
        return crc;
    }
};

var Linkmug_Utils = {

    /* delimiter used to separate parameters in fragment ID, using '+'
     * has advantages.  It does not change on url-encoding, no other
     * part of the fragment ID generated by LinkmugPlugin_Highlight_Fragment will have a +
     * except for the start string to identify which we use the length
     * and not the delimiter.
     */
	BG_ST :
	"background-color: #220000; " +
	"height: 100%; " +
	"left: 0; " +
	"margin: 0; " +
	"opacity: 0.8; " +
	"position: fixed; " +
	"top: 0; " +
	"width: 100%; " +
	"z-index: 2147483646;",

    TX_ST :
	"position: fixed; " +
	"text-align: center; " +
	"top: 30%; " +
	"width: 100%; " +
	"z-index: 2147483647;",
	
    delim : "+",
    
    /* these characters are not used while calculating the checksum */
    unWantedChars: /[\n\t\r\ \~\`\!\@\#\$\%\^\&\*\(\)\-\+\=\[\]\{\}\:\;\"\'\<\,\>\.\?\/\\\|]+/g,

    /* common utility functions used by both "Search" and "DOM" based
     * approaches 
     */

    /* does nothing */
    cleanStrings: function(str)
    {
        /* we remove a pre-determined set of unwanted characters from
         * the text nodes that we consider
         */

        str = str.replace(Linkmug_Utils.unWantedChars, "");
        return str;
    },
    getCurrentPageInfo:function()
    {
    	var obj = new Object;
    	var share_url, share_title;
        var browser = window.getBrowser();
        var webNav = browser.webNavigation;
        if(webNav.currentURI)
          share_url = webNav.currentURI.spec;
        else
          share_url = gURLBar.value;  
      
        if(webNav.document.title){
          share_title = webNav.document.title;
        }else
          share_title = share_url;
        obj.share_url = share_url;
        obj.share_title = share_title;
        return obj;
    },
    /* Adds a given range to the current window selection */
    selectRange: function(range)
    {
        var selection = 
            Linkmug_Utils.getTabOfDocument().contentWindow.getSelection();
        if(selection.rangeCount > 0)
            selection.removeAllRanges();
        selection.addRange(range);
    },

    /* Displays only the given range, stripping out all the other DOM nodes */
    displayRange: function(range)
    {
        var fragment = range.cloneContents();
        var body =
            content.document.getElementsByTagName("body").item(0);

        body.parentNode.replaceChild(fragment, body);
    },

    /* To test if a DOM node is a true TEXT node */
    isTextNode: function(aNode) 
    {
        return ((aNode.nodeType == aNode.TEXT_NODE)
        && (aNode.nodeType != aNode.CDATA_SECTION_NODE)
        && (aNode.nodeType != aNode.PROCESSING_INSTRUCTION_NODE));
    },

    /* To test if a DOM node is a TEXT type node */
    isTextTypeNode: function(aNode) 
    {
        return ((aNode.nodeType == aNode.TEXT_NODE)
            || (aNode.nodeType == aNode.CDATA_SECTION_NODE)
            || (aNode.nodeType == aNode.PROCESSING_INSTRUCTION_NODE));
    },

    /* debugging function, see output in Javascript Console window of
     * Firefox
     */
    output: function(text) 
    {
        var consoleService =  
            Components.classes['@mozilla.org/consoleservice;1'].
            getService(Components.interfaces.nsIConsoleService);
        consoleService.logStringMessage(text);
    },
     
    /* Checks for text nodes with only white space characters and
     * rejects them.
     * The following function has been generously re-used from the
     * Scrapbook extension for Firefox
     * http://amb.vis.ne.jp/mozilla/scrapbook/
     */
    acceptNode: function(aNode)
    {
        /* If aNode is a TEXT_NODE and it contains only whitespace
         * characters, we reject it
         */
        if ( aNode.nodeType == aNode.TEXT_NODE
        && ! ( /[^\t\n\r ]/.test( aNode.nodeValue )) 
        ) {
            return NodeFilter.FILTER_REJECT;
        };

        return NodeFilter.FILTER_ACCEPT;
    },

    copyToClipboard: function(liveURL)
    {
        const gClipboardHelper = 
                Components.classes["@mozilla.org/widget/clipboardhelper;1"].
                getService(Components.interfaces.nsIClipboardHelper);
        gClipboardHelper.copyString(liveURL);
    },

    bookmarkURL: function(liveURL)
    {
        var aDocShell =
            document.getElementById('content').webNavigation;
        var url = liveURL;
        var title, charSet = null;
        var description;
        try {
            title = aDocShell.document.title || url;
            charSet = aDocShell.document.characterSet;
            description = 
                BookmarksUtils.getDescriptionFromDocument(aDocShell.document);
        }
        catch (e) {
            title = url;
        };
        BookmarksUtils.addBookmark(url, title, charSet, false, description);
    },

    getTabOfDocument: function(currentDoc)
    {
        
        var index = gBrowser.getBrowserIndexForDocument(currentDoc);
        if(index < 0) {
            return null;
        } else {
            return gBrowser.getBrowserAtIndex(index);
        };
    },

    isTextSelected: function(currentDoc)
    {
        var currentTab = Linkmug_Utils.getTabOfDocument(currentDoc);
        var selectionLen = 
            currentTab.contentWindow.getSelection().toString().length;

        return (selectionLen > 0) ? true : false;
    },   
    getCurrentTab: function()
    {
        return gBrowser.getBrowserAtIndex(gBrowser.mTabContainer.selectedIndex);
    },

    getDocumentOfEvent: function(event)
    {
        var currentDoc = null;
        if(event.originalTarget instanceof HTMLDocument) {
            if(event.originalTarget.defaultView.frameElement) {
                currentDoc = event.originalTarget;
                while (currentDoc.defaultView.frameElement) {
                    currentDoc =
                        currentDoc.defaultView.frameElement.ownerDocument;
                };
            } else {
                currentDoc = event.originalTarget;
            };
        };

        return currentDoc;
    },
    getSetupCycleCheckInterval: function()
    {
    	var sync_interval = Linkmug_Config.LINKMUG_CYCLECHECK_INTERVAL;
    	
        try{
           var pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);      
           sync_interval = pref.getIntPref("linkmug.sync.interval");
           
        }catch(e){
          sync_interval = Linkmug_Config.LINKMUG_CYCLECHECK_INTERVAL;
                
        };
        return sync_interval;
    },
    getSendCheckInterval: function()
    {
    	var sendcheck_interval = Linkmug_Config.LINKMUG_SENDCHECK_INTERVAL;
    	
        try{
           var pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);      
           sendcheck_interval = pref.getIntPref("linkmug.send.interval");
           
        }catch(e){
          sendcheck_interval = Linkmug_Config.LINKMUG_SENDCHECK_INTERVAL;
                
        };
        return sendcheck_interval;
    },
    getTimeoutTreshold: function()
    {
    	var timeout_threshold = 0;
    	
        try{
           var pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);      
           timeout_threshold = pref.getIntPref("linkmug.timeout.threshold");
           
        }catch(e){
          timeout_threshold = 0;
                
        };
        return timeout_threshold;
    },
    checkNormalStart: function()
    {
        var normal_start = true;
    	var pref = null;
        try{
           pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);      
           normal_start = pref.getBoolPref("linkmug.normal.start");
           if(!normal_start)
           {
             pref.setBoolPref("linkmug.normal.start", true);                     
             normal_start = false; 
           };
                         
        }catch(e){//first start
          
          normal_start = false;     
          pref.setBoolPref("linkmug.normal.start", true);                     
        };
        
        return normal_start;
    },
    checkAttention: function()
    {
        var get_attention = true;
    	var pref = null;
        try{
           pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);      
           get_attention = pref.getBoolPref("linkmug.browser.attention");
                         
        }catch(e){
          
          get_attention = true;     
          pref.setBoolPref("linkmug.browser.attention", true);                     
        };
        
        return get_attention;
    },
    checkShowBarDirectly: function()
    {
        var get_showbar = true;
    	var pref = null;
        try{
           pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);      
           get_showbar = pref.getBoolPref("linkmug.showbar.direct");
                         
        }catch(e){
          
          get_showbar = true;     
          pref.setBoolPref("linkmug.showbar.direct", true);                     
        };
        
        return get_showbar;
    },
    checkAutoOpen: function()
    {
    	var auto_open = false;
    	
        try{
           var pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);      
           auto_open = pref.getBoolPref("linkmug.auto.open"); 
           
        }catch(e){
          auto_open = false;                
        };
        return auto_open;
        
    },
    checkSendMugMsgFrist: function()
    {
    	var msg_first = false;
    	
        try{
           var pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);      
           msg_first = pref.getBoolPref("linkmug.mugmsg.first"); 
           
        }catch(e){
          msg_first = false;                
        };
        return msg_first;
        
    },
    checkSendBuddyMsgFrist: function()
    {
    	var msg_first = false;
    	
        try{
           var pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);      
           msg_first = pref.getBoolPref("linkmug.buddymsg.first"); 
           
        }catch(e){
          msg_first = true;                
        };
        return msg_first;
        
    },
    getLastMugSendSwitcher: function()
    {
        var msg_first = false;
    	
        try{
           var pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);      
           msg_first = pref.getBoolPref("linkmug.last.mugsendswitch"); 
           
        }catch(e){
          msg_first = false;                
        };
        return msg_first;  
    },    
    setLastMugSendSwitcher: function(msg_first)
    {
    	    	
        try{
           var pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);      
           pref.setBoolPref("linkmug.last.mugsendswitch", msg_first);
           
        }catch(e){
                    
        };
       
    },
    getLastBuddySendSwitcher: function()
    {
        var msg_first = false;
    	
        try{
           var pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);      
           msg_first = pref.getBoolPref("linkmug.last.buddysendswitch"); 
           
        }catch(e){
          msg_first = false;                
        };
        return msg_first;  
    },    
    setLastBuddySendSwitcher: function(msg_first)
    {
    	    	
        try{
           var pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);      
           pref.setBoolPref("linkmug.last.buddysendswitch", msg_first);
           
        }catch(e){
                    
        };
       
    },
    getLastTalkedBuddy:function()
    {
    	var last_talker = new Object;
    	
        try{
           var pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);      
           last_talker.name = pref.getCharPref("linkmug.last.talkername"); 
           last_talker.fid  = pref.getCharPref("linkmug.last.talkerid");
        }catch(e){
           last_talker.name = 'Dou Wen'; 
           last_talker.fid  = 'douwen@gmail.com';                
        };
        return last_talker;
    },
    setLastTalkedBuddy: function(name,id)
    {
    	    	
        try{
           var pref = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefBranch);      
           pref.setCharPref("linkmug.last.talkername", name);
           pref.setCharPref("linkmug.last.talkerid", id);
        }catch(e){
                    
        };
       
    },
    loadJS: function(js)
    {
	   var jsLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
	                         getService(Components.interfaces.mozIJSSubScriptLoader);
       jsLoader.loadSubScript(js);
    },    
    isUnsignedInteger: function(s) {
       return (s.toString().search(/^[0-9]+$/) == 0);
    },
    $: function(id)
    {	
	   return  document.getElementById(id);
    },
    a$: function(id,attr,val)
    {
	  Linkmug_Utils.$(id).setAttribute(attr,val);
    },
    r$: function(id,attr)
    {
	  Linkmug_Utils.$(id).removeAttribute(attr);
    },
    d$: function(message)
    {
	  var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                  .getService(Components.interfaces.nsIPromptService);
		promptService.alert(window, "info",message);
    },
    dd$: function(message)
    {
	    Components.classes['@mozilla.org/consoleservice;1']
	        .getService(Components.interfaces.nsIConsoleService)
	        .logStringMessage(message);
    },
    trim: function(stringToTrim) {
	  return stringToTrim.replace(/^\s+|\s+$/g,"");
    },
    ltrim: function(stringToTrim) {
	   return stringToTrim.replace(/^\s+/,"");
    },
    rtrim: function(stringToTrim) {
	   return stringToTrim.replace(/\s+$/,"");
    },
    crop_str: function(str,limit)
    {
       if(str.length<=limit)
         return str;
       else
         return (str.substring(0,limit)+"...");
    }, 
    isUrl: function(s) {
      var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ ;
      return regexp.test(s);
    },
    openURL: function(aUrl){

      if("@mozilla.org/xre/app-info;1" in Components.classes)      
       return;
      else{
     //for pre 1.5 version
        window.opener.openURL(aUrl); 
      };
    },
    showToolbarButton: function(id, before)
	{
		try {
			var nbr = document.getElementById("nav-bar");

			if (!nbr || nbr.currentSet.indexOf(id) != -1) {
				return;
			}

			var box = document.getElementById("navigator-toolbox");

			if (!box) {
				return;
			}

			var bar = box.firstChild;

			while (bar) {
				if (bar.currentSet && bar.currentSet.indexOf(id) != -1) {
					return;
				}
				bar = bar.nextSibling;
			}

			var target = document.getElementById(before);

			/* The before element might not exist in the nav-bar */
			var elem = nbr.firstChild;

			while (elem) {
				if (elem == target) {
					break;
				}
				elem = elem.nextSibling;
			}

			nbr.insertItem(id, elem, null, false);
			document.persist("nav-bar", "currentset");
		} catch (e) {
			Linkmug_Utils.d$("Linkmug::showToolbarButton");
		};
	},
	str_rep:function (c,n) {
      var s = '';
      t = c;
      while (n-- > 0) 
       s += t;
      return s;
    },
    timespan:function(stime)
    {
	  var span = stime.slice(0,stime.length-1);
	  var s = stime.slice(stime.length-1);
	  switch(s)
	  {
		case 'W':
		  span += (' '+Linkmug.strings.getString("weeks-ago"));
		break;
		case 'D':
		  span += (' '+Linkmug.strings.getString("days-ago"));
		break;
		case 'H':
		  span += (' '+Linkmug.strings.getString("hours-ago"));
		break;
		case 'M':
		  span += (' '+Linkmug.strings.getString("miniutes-ago"));
		break;
		case 'S':
		  span += (' '+Linkmug.strings.getString("seconds-ago"));
		break;
		default:
		break;
        };
	  return span;
    }

};


