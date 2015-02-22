'use strict';
var crypto = require('crypto');
var extend = require('extend');
var revalidator = require('revalidator');


exports.handler = function(event, context) {
	console.log((event.enc ? 'En' : 'De') + "crypting: " + event.message);

	var opts = extend({
		length: 256,
		mode: 'ecb',
		encoding: 'base64'
	}, event.opts);

	var valid = revalidator.validate(opts, {
		properties: {
			length: {
				type: 'integer',
				conform: function(v) {
					return [128, 192, 256].indexOf(v) !== -1;
				}
			},
			mode: {
				type: 'string',
				conform: function(v) {
					return ['cbc', 'cfb', 'cfb1', 'cfb8', 'ctr', 'ecb', 'gcm', 'ofb'].indexOf(v) !== -1;
				}
			},
			encoding: {
				type: 'string',
				conform: function(v) {
					return ['base64', 'hex'].indexOf(v) !== -1;
				}
			}
		}
	});

	if (!valid.valid) {
		var errors = valid.errors.map(function(error) {
			return error.property;
		});
		context.done("The following options are malformed: " + errors.join(', '));
		return;
	}

	var format = "aes-" + opts.length + "-" + opts.mode;

	var result;
	if (event.enc) {
		var ct = crypto.createCipher(format, event.pass);
		result = ct.update(event.message, 'utf8', opts.encoding) + ct.final(opts.encoding);
	} else {
		var pt = crypto.createDecipher(format, event.pass);
		result = pt.update(event.message, opts.encoding, 'utf8') + pt.final('utf8');
	}

	console.log("Result: " + result);
	context.done(null, result);
};
