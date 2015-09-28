var _ = require("lodash");
var Chan = require("../../models/chan");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("message", function(data) {
		if (data.message.indexOf("\u0001") === 0 && data.message.substring(0, 7) != "\u0001ACTION") {
			// Hide ctcp messages.
			return;
		}

		if (client.otrStore.isOtrMessage(data.message)) {
			// Hide OTR messages
			return;
		}

		var target = data.to;
		if (target.toLowerCase() == irc.me.toLowerCase()) {
			target = data.from;
		}

		var chan = client.getQuery(target, network);
		if (chan === null) {
			chan = client.startQuery(target, network);
		}

		var type = "";
		var text = data.message;
		if (text.split(" ")[0] === "\u0001ACTION") {
			type = Msg.Type.ACTION;
			text = text.replace(/^\u0001ACTION|\u0001$/g, "");
		}

		text.split(" ").forEach(function(w) {
			if (w.replace(/^@/, "").toLowerCase().indexOf(irc.me.toLowerCase()) === 0) type += " highlight";
		});

		var self = false;
		if (data.from.toLowerCase() == irc.me.toLowerCase()) {
			self = true;
		}

		if (chan.id != client.activeChannel) {
			chan.unread++;
		}

		var name = data.from;
		var msg = new Msg({
			type: type || Msg.Type.MESSAGE,
			mode: chan.getMode(name),
			from: name,
			text: text,
			self: self
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
	});
};
