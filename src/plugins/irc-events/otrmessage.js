var _ = require("lodash");
var Chan = require("../../models/chan");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("message", function(data) {
		if (!client.otrStore.isOtrMessage(data.message)) {
			return;
		}

		var chanName = network.getMessageChanName(data);

		var chan = client.getQuery(chanName, network);
		if (chan === null) {
			chan = client.startQuery(chanName, network);
		}

		var otrSession = client.otrStore.getSession(
			chanName,
			network.host
		);
		otrSession.receiveMsg(data.message);
	});
};
