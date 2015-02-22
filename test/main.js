'use strict';
var aes = require('../');
var should = require('should');


var mockHandler = function(enc, message, pass, cb, opts) {
	aes.handler({
		enc: enc,
		message: message,
		pass: pass,
		opts: opts
	}, {
		done: function(err, res) {
			should(err).be.null;
			cb(res);
		}
	});
};

var testRoundTrip = function(plain, cipher, pass, opts) {
	// Encrypt
	mockHandler(true, plain, pass, function(res) {
		res.should.eql(cipher);
	}, opts);
	// Decrypt
	mockHandler(false, cipher, pass, function(res) {
		res.should.eql(plain);
	}, opts);
};

var mockError = function(opts, expected) {
	aes.handler({
		enc: true,
		message: 'Well that escalated quickly',
		pass: 'nope',
		opts: opts
	}, {
		done: function(err) {
			err.should.eql(expected);
		}
	});
};


describe('aws-lambda-aes', function() {
	it('should implement AES correctly', function() {
		testRoundTrip('Hello world!', 'JVeSgMvJsMwj0Q548+OccQ==', 'password');
	});

	it('should handle the empty string edge case', function() {
		testRoundTrip('', 'SCqF2+1iOJ1O3DmeDmBd0Q==', 'yolo');
	});

	it('should handle long strings', function() {
		var plain = 'I met a traveller from an antique land\n' +
			'Who said: "Two vast and trunkless legs of stone\n' +
			'Stand in the desert. Near them, on the sand,\n' +
			'Half sunk, a shattered visage lies, whose frown,\n' +
			'And wrinkled lip, and sneer of cold command,\n' +
			'Tell that its sculptor well those passions read\n' +
			'Which yet survive, stamped on these lifeless things,\n' +
			'The hand that mocked them and the heart that fed:\n' +
			'And on the pedestal these words appear:\n' +
			'\'My name is Ozymandias, king of kings:\n' +
			'Look on my works, ye Mighty, and despair!\'\n' +
			'Nothing beside remains. Round the decay\n' +
			'Of that colossal wreck, boundless and bare\n' +
			'The lone and level sands stretch far away."';

		var cipher = '/t5AfeoEOXw1RbodG3SuXWDi2MLi/aK+irNuhhtq6neDLZvRYgli' +
			'Q0T5nJVPAH2BO/kjEYBejrpvPhErgRA110YLepb0R9fBAv8WBCJdCO1MffvWl' +
			'Nm4V9D6XW5VQJcI2mxpdFC2h9d+v/moe2foV+2yr4imwc4vxYP/zZ9vUPUYLr' +
			'Tc2HmPFWZf5plvCj0OFJ5BOocv9iNHfoZQOLb8Sy+xM7ElJq/9uSdusXsAAE6' +
			'87cJfsWw6Qe4GfOrREyHEDobVz0cxnvA3+ZDfbq4Lx+9KsHDowJNCpqjG+Yry' +
			'BKsESdNFaIQ/aNGKqV660vVO3IJvYmVVI/0MuWI4BwnNZKnWueD+Q98lflTCG' +
			'/jMMHhGa6JgTuS6KcGtBdBq3zPHgoE/tiE9r+aBvbSVQgrlk9/cdUuOIoo1OQ' +
			'ZIJ4iMg50e8xv4UZDpESzGp4vx7t5//H4fDVCiSENK1MKOrfi1DJ/qbhkv/aH' +
			'80BX/tOGqZaqf79i9WgpWPzHLp8c9CmZ5TlWeQfiTG0FmXS3L8ehXWaNk+zbM' +
			'Clk/hC6HunHlwx+LL0VtV+g3CfxtMgD8UhgDIJ/2vMe4qXpPPwlHzHAiDan87' +
			'hPVTQ2WsW9jGHvTap4D0CvarC8LLRudo6Ntci3uhIZqwqqiyu4N0B5ggH4Ju6' +
			'kHgP4+0zhskLlYB08tjt7v3mV2VFPepRAI2QeEYpjgFn1ML7JA+oxqgSnLa2B' +
			'fDt+X0navytddAVL2HZAgMClAJZM8z9EOnoW802sI4EGwrx5wJxOnuGN92LHS' +
			'0KM6+aEr446FoMDGTtbUcU2vaaq7YNoP2zxds41mRWyT7gHIRQPl8IOBRhXIP' +
			'7NW6Ab2IQ==';

		testRoundTrip(plain, cipher, 'Heisenberg');
	});

	it('should accept encryption options', function() {
		testRoundTrip('Hello world!', '4c2d464b954e0258026eceea23bb6a6e', 'password', {
			length: 128,
			mode: 'cbc',
			encoding: 'hex'
		});
	});

	it('should error out on bad options', function() {
		mockError({
			length: 200,
			mode: 'idk yo',
			encoding: 4
		}, 'The following options are malformed: length, mode, encoding');
	});
});
