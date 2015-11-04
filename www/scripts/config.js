(function (global) {
 app = global.app = global.app || {};
 
 app.configService = {
     //defaultImage_url: 'http://casnet.dyndns-office.com/dev-coaservice.ais.co.th/usr/user_image/', //@Office
     //imageUrl: 'http://casnet.dyndns-office.com/dev-coaservice.ais.co.th', //@Office
     //serviceUrl: 'http://192.168.1.99/dev-coaservice.ais.co.th/', //@Office

     //defaultImage_url: 'http://192.168.1.99/dev-coaweb.ais.co.th/usr/user_image/', //@Office
     //imageUrl: 'http://192.168.1.99/dev-coaweb.ais.co.th', //@Office
     //serviceUrl: 'http://192.168.1.99/dev-coaweb.ais.co.th/', //@Office

     defaultImage_url: 'http://dev-ccis.ais.co.th/coaweb/usr/user_image/', //@AIS
     imageUrl: 'http://dev-ccis.ais.co.th/coaweb', //@AIS
     serviceUrl: 'http://dev-ccis.ais.co.th/coaweb/', //@AIS

     //serviceUrl: '',
     
    //fingerprint: 'E5 32 A9 68 C6 E2 51 54 3B 6A E9 5D 1C 34 22 8D 51 DD 56 B3',//TTSDEV
	//fingerprint: '96 07 D6 E6 78 8B F7 26 A0 DA 2A D2 09 39 1A 4C F1 E6 48 0C',//TTSM production
	version: "1.0"
 };
 })(window);