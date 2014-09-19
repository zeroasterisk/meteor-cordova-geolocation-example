GeoLog = new Mongo.Collection('geo_log');

if (Meteor.isServer) {
  Meteor.publish('basic', function () {
    return GeoLog.find({}, {
      fields: {userId: 0},
      sort: {created: 1},
      limit: 100
    });
  });
}

if (Meteor.isClient) {
  Meteor.subscribe('basic');
  Template.footer.events({
    'click #getNow': function() {
      if (Meteor.isCordova) {
        // cordova
        GeolocationFG.get(function(location) {
          GeoLog.insert({
            location: location,
            uuid: GeolocationBG.uuid(),
            device: GeolocationBG.device(),
            userId: Meteor.userId(),
            created: new Date()
          });
        });
        return;
      }
      // browser
      GeolocationFG.get(function(location) {
        GeoLog.insert({
          location: location.coords,
          uuid: 'browser',
          device: 'browser',
          userId: Meteor.userId(),
          created: new Date()
        });
      });
    },
    'click #getBackground': function(event) {
      var btn = event.currentTarget;
      var dest = document.getElementById('btnFeedback');
      if (!Meteor.isCordova) {
        dest.innerHTML = 'Not Available, Not Cordova';
        return;
      }
      if (!GeolocationBG.avail()) {
        dest.innerHTML = 'ERROR: Not Available, is Cordova (should be available)';
        return;
      }
      if (!GeolocationBG.isStarted) {
        if (!GeolocationBG.start()) {
          dest.innerHTML = 'ERROR: Not Started, unable to start';
          return;
        }
        if (!GeolocationBG.isStarted) {
          dest.innerHTML = 'ERROR: Not Started, status = false';
          return;
        }
        dest.innerHTML = 'Started (every few minutes there should be an update)';
        btn.innerHTML = 'Stop';
        return;
      }
      if (!GeolocationBG.stop()) {
        dest.innerHTML = 'ERROR: Not Stopped, unable to stop';
        return;
      }
      if (GeolocationBG.isStarted) {
        dest.innerHTML = 'ERROR: Not Stopped, status = true';
        return;
      }
      dest.innerHTML = 'Stopped';
      btn.innerHTML = 'Start';
      return;
    }
  });
}

if (Meteor.isCordova) {
  GeolocationBG.config({
    url: 'https://geolocationbackgroundexample.meteor.com/api/geolocation',
    debug: true
  });
  // triggered by a start button
  // GeolocationBG.start();
}

