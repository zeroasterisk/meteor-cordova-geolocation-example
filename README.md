# Meteor Cordova Geolocation Example

This is an Example Meteor Application using and demonstrating the following
packages:

* https://github.com/zeroasterisk/meteor-cordova-geolocation-background
* https://github.com/zeroasterisk/meteor-cordova-geolocation-foreground

It utilizes

* https://www.meteor.com/ (MeteorJS)
* http://cordova.apache.org/ (Cordova / PhoneGap)

And the Cordova Plugins

* http://plugins.cordova.io/#/package/org.apache.cordova.device
* http://plugins.cordova.io/#/package/org.apache.cordova.geolocation
* http://plugins.cordova.io/#/package/com.romainstrock.cordova.background-geolocation

## How to Run Yourself

NOTE: this example uses Meteor + Cordova, which downloads a LOT of extra stuff.
You may first want to familiarize yourself with
[Meteor Cordova Inetration (wiki)](https://github.com/meteor/meteor/wiki/Meteor-Cordova-Phonegap-integration)
from the Meteor project wiki.

```
git clone https://github.com/zeroasterisk/meteor-cordova-geolocation-example.git
cd meteor-cordova-geolocation-example
meteor update
meteor run android-device -p 192.168.0.25:3000
```

*(change the IP address to whatever your development machine's IP is, you can also try with ios)*

## Testing the REST(ish) handling

At the bottom of `app.js` you configure the URL to which we post the REST for
background Geolocation data.

You can test this with curl, you don't even have to fire up Cordova.

```
curl -v -H "Content-Type: application/json" -X PUT --data '{"device":"curl","location":{"longitude":"-85.70906639098872","recorded_at":"Thu Sep 25 01:07:35 EDT 2014","latitude":"38.258042335509145","speed":"0.0","accuracy":"181.94342"},"uuid":"curl","userId":null}' 'http://localhost:3000/api/geoloaction'
```

