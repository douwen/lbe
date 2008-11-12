var Linkmug_Config = {
  LINKMUG_HOST                 :   "www.linkmug.com",
  LINKMUG_ADMIN_MAIL           :   "douwen@linkmug.com",
  //LINKMUG_HOST               :   "localhost",
  LINKMUG_DEBUG                :   "",
  //LINKMUG_DEBUG              :   "?DBGSESSID=1@localhost:10001",
  LINKMUG_TIMEOUT              :   60,
  LINKMUG_BOOT_DELAY           :   5,
  LINKMUG_FAILEDCHECK_INTERVAL :   3,
  LINKMUG_FIRSTCHECK_INTERVAL  :   1,
  LINKMUG_CYCLECHECK_INTERVAL  :   3,//also used to bar-displaying interval
  LINKMUG_SENDCHECK_INTERVAL   :   2,
  MAXPLUGINPACKETSIZE          :   1024,
  MAXPLUGINS                   :   10,
  MAXPLUGINDATASIZE            :   this.MAXPLUGINS  * this.MAXPLUGINPACKETSIZE,
  PING_INTERVAL                :   20
};
