sap.ui.controller("mqcl1.main", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf mqcl1.main
*/
	
	onInit: function() {
		_this=this;
		this.nickName="";
		oLobbyFeedModel = new sap.ui.model.json.JSONModel(lobbyFeedData);
		this.getView().byId("listLobbyFeed").setModel(oLobbyFeedModel);
		
		oPeopleFeedModel = new sap.ui.model.json.JSONModel(peopleFeedData);
		this.getView().byId("navigationPeopleListq").setModel(oPeopleFeedModel);
		
		oGroupFeedModel = new sap.ui.model.json.JSONModel(groupsFeedData);
		this.getView().byId("navigationGroupsListq").setModel(oGroupFeedModel);
		
		iconDisconnectedIcon = this.getView().byId("iconDisconnected");
		iconConnectedIcon= this.getView().byId("iconConnected");
		toolHeaderConnected = this.getView().byId("toolHeaderConnected"); 
		
	},
	
	handleUserNameEntered: function (event) {
		var btnEnterLobby = this.getView().byId('btnEnterLobby');
		if (event.getParameters().value != "")
			{
				btnEnterLobby.setEnabled(true);
				nickName = event.getParameters().value;
				
			}
		else
			btnEnterLobby.setEnabled(false);
			
	},
	onLobbyPost: function (oEvent) {
		// create new entry
		var sValue = oEvent.getParameter("value");
		var oEntry = {
			Author : nickName,
			Type : "Reply",
			Date : "" + new Date(),
			Text : sValue
		};
		sendMessageToLobby(oEntry);
	},
	handleCreateGroup: function (_groupName){
		//groupsFeedData.groupsFeedDataCollection.push({"name": "newGroup"})
	},
	btnhandleEnterLobby: function (event) {
		if (event.getParameters().pressed == true)
			{
				btnEnterLobby = this.getView().byId('btnEnterLobby');
				createConnection(nickName);
			}
		else
			{
			endConnection();
			}
		
	},
	onMenuButtonPress: function (event) {
		var sideNavigation = this.getView().byId('navigationListq');
		var expanded = !sideNavigation.getExpanded();

		sideNavigation.setExpanded(expanded);
	},
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf mqcl1.main
*/
//	onBeforeRendering: function() {
//
//	},
	onConnectPress: function (evt) {
		
		btnEnterLobby = this.getView().byId('btnEnterLobby');
		createConnection();
	},
	
	onPost: function (evt) {
	
	},
/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf mqcl1.main
*/
	onAfterRendering: function() {
		
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf mqcl1.main
*/
//	onExit: function() {
//
//	}

});