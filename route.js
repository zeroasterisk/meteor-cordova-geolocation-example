Router.configure({
  layoutTemplate: 'masterLayout'
});
Router.map(function() {
  this.route('geolog', {
    path: '/',
    data: function () {
      return {
        geologs: GeoLog.find({})
      };
    }
  });
});

if (Meteor.isServer) {
  Router.map(function() {
    // REST(ish) API
    // Cordova background/foreground can post GPS data HERE
    //
    // POST data should be in this format
    //   {
    //     location: {
    //       latitude: Number,
    //       longitude: Number,
    //       accuracy: Match.Optional(Number),
    //       speed: Match.Optional(Number),
    //       recorded_at: Match.Optional(String)
    //     },
    //     userId: Match.Optional(String),
    //     uuid: Match.Optional(String),
    //     device: Match.Optional(String)
    //   }
    this.route('GeolocationBGRoute', {
      path: '/api/geolocation',
      where: 'server',
      action: function() {

        this.response.setHeader("Access-Control-Allow-Origin", "*");
        this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        if (this.request.method == 'OPTIONS') {
          this.response.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
          this.response.end("OPTIONS Response");
        }

        // GET, POST, PUT, DELETE
        var requestMethod = this.request.method;
        // Data from a POST request
        var requestData = this.request.body;

        // Require a shared API key so only authorized clients can post data
        var apiKey = this.request.headers['x-api-key'];
        if (!Meteor.settings.geolocationApiKey || apiKey !== Meteor.settings.geolocationApiKey) {
          console.log('GeolocationBG unauthorized request');
          this.response.writeHead(401, {'Content-Type': 'application/json'});
          this.response.end('unauthorized');
          return;
        }

        // log stuff
        console.log('GeolocationBG post: ' + requestMethod);
        console.log(JSON.stringify(requestData));

        // Can insert into a Collection from the server (or whatever)
        if (GeoLog.insert(requestData)) {
          console.log('GeolocationBG inserted');
          this.response.writeHead(200, {'Content-Type': 'application/json'});
          this.response.end('ok');
          return;
        }

        // if we end up with an error case, you can return 500
        console.log('GeolocationBG failed to insert');
        this.response.writeHead(500, {'Content-Type': 'application/json'});
        this.response.end('failure');
      }
    });
  });
}
