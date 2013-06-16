/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
	geolocation: {
	    // onSuccess Geolocation
	    //
	    onSuccess: function(position) {
	        var element = document.getElementById('geolocation');
	        element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
	                            'Longitude: ' + position.coords.longitude     + '<br />' +
	                            '<hr />'      + element.innerHTML;
	        var addPoint = ddp.call('addPoint', [position.coords.latitude, position.coords.longitude]);
	        addPoint.done(function(pointId) {
	        	console.log('Added new point');
	        });
	    },

	    // onError Callback receives a PositionError object
	    //
	    onError: function(error) {
	        alert('code: '    + error.code    + '\n' +
	              'message: ' + error.message + '\n');
	    }
	},
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        // attach to socket
        app.ddp = new MeteorDdp('wss://mappo.meteor.com/websocket');
		app.ddp.connect().done(function() {
		   console.log('Connected!');
		   var options = {maximumAge: 300000, timeout:300000, enableHighAccuracy : true};
		   navigator.geolocation.watchPosition(app.geolocation.onSuccess, app.geolocation.onError, options);
	    });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
