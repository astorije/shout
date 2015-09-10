var _ = require("lodash");
var DSA = require('otr').DSA;
var OTR = require('otr').OTR;
var Chan = require("./chan");

module.exports = OtrStore;

/** Stores OTR state for a given user
 *
 * Handels private key, current sessions and fingerprints.
 */
function OtrStore(name, client) {
	_.merge(this, {
		name: name,
		privKey: undefined,
		sessions: {},
		client: client,
	});
	console.log('Generating DSA....');
	this.privKey = new DSA();
	console.log('OK, key generated');
}

/** Initialize an OTR session for query chans
 *
 * Event handler, to be called on chan creation
 */
OtrStore.prototype.initChan = function(args) {
	var network_id = args.network;
	var chan = args.chan;
	if (chan.type == Chan.Type.QUERY) {
		var network = _.find(this.client.networks, {id: network_id});
		var session = this.getSession(chan.name, network);
		var irc = network.irc;
		if (session == undefined) {
			session = new OTR({
				fragment_size: 140,
				send_interval: 200,
				priv: this.privKey
			});

			session.on('ui', function(msg, encrypted, meta) {
				irc.emit("message", {
					from: chan.name,
					to: irc.me,
					message: msg
				});
			});

			session.on('io', function(msg, meta) {
				irc.send(chan.name, msg);
			});
			this.registerSession(chan.name, network, session);
		}
	}
};

OtrStore.prototype.getSession = function(nick, network) {
	var qualifiedUser = nick + '@' + network.host;
	return this.sessions[qualifiedUser];
};


OtrStore.prototype.registerSession = function(nick, network, session) {
	var qualifiedUser = nick + '@' + network.host;
	this.sessions[qualifiedUser] = session;
};
