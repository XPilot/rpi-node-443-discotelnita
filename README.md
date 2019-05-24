# Raspberry PI - NodeJS Powered 433Mhz Discotelnitza #

## About this project ##

When you leave your old job for a new one, it's nice to do something remarkable, something your colleagues will not forget. This project does just that. 
In the wireless world that we live in, it's very easy to hack things up. Specially 433 Mhz sockets. This example uses an Raspberry PI with 433Mhz Receiver/Emitter pair (transceiver) in order to send codes to control the light fixtures inside the office.

## Dependencies ##

This project is based on the rpi-433 by @eroak. This in terms will use the WiringPI library - this must be installed prior to installing this project. Guides are found here: https://projects.drogon.net/raspberry-pi/wiringpi/

## Getting started ##

~*Note:*~ This project will only run on a Raspberry PI with the minim node version of 10.6.x. It will not work on Mac/Windows/Linux ( you won't be able to install the rpi-433 package)

```
npm install
```

Once complete
```
npm start
```

It's best to bring your own 433 codes to the mix. You can view the on / off toggle states in codes.json