/**
 * 
 */
var pahoClient;
var nickName;
var _clientID;

var lobbyFeedData = {
		"lobbyFeedDataCollection" : [
		                             ]
};
var peopleFeedData = {
		"peopleFeedDataCollection" : [
		                              ]
};
var groupsFeedData = {
		"groupsFeedDataCollection" : [
		                              ]
};
var chatFeedData = {
		"chatFeedDataCollection" : [
		                           ]
};

var connectionStatusData = false;
var iconDisconnectedIcon;
var iconConnectedIcon;
var toolHeaderConnected;
var btnEnterLobby;

var oLobbyFeedModel;
var oGroupFeedModel;
var oPeopleFeedModel;

function createConnection(_nickName) {
	// Create a client instance
	_clientID = "_nickName_" + _nickName;
	pahoClient = new Paho.MQTT.Client("iot.eclipse.org", Number("443"),"/ws",_clientID);
	nickName = _nickName;
	toolHeaderConnected.setBusy(true);
	//	set callback handlers
	pahoClient.onConnectionLost = onConnectionLost;
	pahoClient.onMessageArrived = onMessageArrived;


	//Create Will Message
	var oEntry = {
			Author : nickName,
			Type : "Post",
			MessageType: "WILL",
			Date : "" + new Date(),
			Text : nickName + " Disconnected"
	};
	var willmsg = new Paho.MQTT.Message(JSON.stringify(oEntry));
	willmsg.qos = 2;
	willmsg.destinationName = "/Lobby";
	willmsg.retained = true;
	
	//	connect the client
	pahoClient.connect({onSuccess:onConnect,onFailure:onConnectFailed, useSSL: true,willMessage: willmsg});
}

function endConnection() {
	var oEntry = {
			Author : nickName,
			Type : "Post",
			MessageType: "EXIT",
			Date : "" + new Date(),
			Text : nickName + " is Leaving!"
	};
	sendMessageToLobby(oEntry);
	pahoClient.disconnect();
	updateStatus(false);
}


function updateStatus(_status) {
	connectionStatusData = _status;
	iconDisconnectedIcon.setVisible(!_status);
	iconConnectedIcon.setVisible(_status);
	btnEnterLobby.setPressed(_status);
}
//called when the client connects
function onConnect() {
	// Once a connection has been made, make a subscription and send a message.
	toolHeaderConnected.setBusy(false);
	console.log("onConnect");
	updateStatus(true);
	lobbyFeedData.lobbyFeedDataCollection.length = 0;
	peopleFeedData.peopleFeedDataCollection.length = 0;
	pahoClient.subscribe("/Lobby");
	pahoClient.subscribe("/PeoplePresent");
	pahoClient.subscribe("/Groups");
	pahoClient.subscribe("$SYS/broker/clients/connected");
	var oEntry = {
			Author : "Lobby",
			Type : "Post",
			MessageType: "ENTRY",
			Date : "" + new Date(),
			Text : nickName + " Entered the Lobby"
	};
	sendMessageToLobby(oEntry);
	sendPeoplePresentMessage(createPeoplePresentMessage());
}
//called when the client connects
function onConnectFailed() {
	console.log("onConnectFailed");
	var msg = 'Connection Failed!';
	sap.m.MessageToast.show(msg);
}
function createPeoplePresentMessage(){
	var oEntry = {
			name : nickName,
			MessageType: "PRESENCE",
			Date : "" + new Date()
	};
	return oEntry;
}
function sendPeoplePresentMessage(_oEntry){
	var message = new Paho.MQTT.Message(JSON.stringify(_oEntry));
	message.destinationName = "/PeoplePresent";
	message.retained = true;
	pahoClient.send(message);

}
//called when the client loses its connection
function onConnectionLost(responseObject) {
	if (responseObject.errorCode !== 0) {
		updateStatus(false);
		console.log("onConnectionLost:"+responseObject.errorMessage);
		var msg = 'Connection Lost!!';
		sap.m.MessageToast.show(msg);
	}
}
function sendMessageToLobby (_oEntry){
	var message = new Paho.MQTT.Message(JSON.stringify(_oEntry));
	message.destinationName = "/Lobby";
	message.qos = 2;
	message.retained = true;
	pahoClient.send(message);
}
//called when a message arrives
function onMessageArrived(message) {
	console.log("onMessageArrived:"+message.payloadString);

	var msg = JSON.parse(message.payloadString);
	var topic = message.destinationName
	if(topic == "/Lobby") 
	{
		//update model
		var aEntries = oLobbyFeedModel.getData().lobbyFeedDataCollection;
		aEntries.unshift(msg);
		oLobbyFeedModel.setData({
			lobbyFeedDataCollection : aEntries
		});
	}
	if(topic == "/PeoplePresent") 
	{
		//update model
		var aEntries = oPeopleFeedModel.getData().peopleFeedDataCollection;
		aEntries.push(msg);
		//jQuery.sap.require("sap.ui.commons.MessageToast");	
		var msg = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.';
		sap.m.MessageToast.show(msg)
		oPeopleFeedModel.setData({
			peopleFeedDataCollection : aEntries
		});	  
	}

}