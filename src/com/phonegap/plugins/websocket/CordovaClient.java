package com.phonegap.plugins.websocket;

import java.net.URI;
import java.util.Arrays;
import java.util.List;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.PluginResult;
import org.apache.cordova.api.PluginResult.Status;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import com.codebutler.android_websockets.WebSocketClient;

public class CordovaClient {

	protected static final String TAG = CordovaClient.class.getSimpleName();
	private WebSocketClient websocket;
	private CallbackContext callbackContext;

	public CordovaClient(URI serverUri, final CallbackContext callbackContext) {
		List<BasicNameValuePair> extraHeaders = Arrays.asList(
			    new BasicNameValuePair("Cookie", "session=abcd")
			);
		this.callbackContext = callbackContext;
		this.websocket = new WebSocketClient(serverUri,
				new WebSocketClient.Listener() {
					@Override
					public void onConnect() {
						Log.d(TAG, "Connected!");
						websocket.send("{ \"msg\":\"connect\", \"version\":\"pre1\", \"support\":[\"pre1\"]}");

					}

					@Override
					public void onMessage(String message) {
						Log.d(TAG, String.format("Got string message! %s",
								message));
						sendResult(message, "message", Status.OK);
					}

					@Override
					public void onMessage(byte[] data) {
						Log.d(TAG,
								String.format("Got binary message! %s", data));
					}

					@Override
					public void onDisconnect(int code, String reason) {
						Log.d(TAG, String.format(
								"Disconnected! Code: %d Reason: %s", code,
								reason));
						callbackContext.success();
					}

					@Override
					public void onError(Exception error) {
						Log.e(TAG, "Error!", error);
					}

				}, extraHeaders);

	}

	private void sendResult(String message, String type, Status status) {
		JSONObject event = createEvent(message, type);
		PluginResult pluginResult = new PluginResult(status, event);
		pluginResult.setKeepCallback(true);
		this.callbackContext.sendPluginResult(pluginResult);
	}

	private JSONObject createEvent(String data, String type) {
		JSONObject event;

		try {
			event = new JSONObject();
			event.put("type", type);
			event.put("data", data);
			// event.put("readyState", this.getReadyState());
			return event;
		} catch (JSONException e) {
			e.printStackTrace();
		}

		return null;
	}

	public void close() {
		websocket.disconnect();
	}

	public void connect() {
		websocket.connect();
	}

	public void send(String data) {
		websocket.send(data);
	}
}
