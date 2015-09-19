module.exports = function(network, chan, cmd, args) {
	if (cmd !== "otr") {
		return;
	}
	if (args.length === 0) {
		return;
	}
	var subCmd = args[0];
	var client = this;
	var otrStore = client.otrStore;
	var session = otrStore.getSession(chan.name, network.host);

	if (subCmd === "init") {
		session.sendQueryMsg();
	}
};
