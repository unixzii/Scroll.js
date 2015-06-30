/*
 * Author: Cyandev(www.github.com/unixzii)
 * Version: 0.1.0
 */

(function () {
	var isReady = false;
	var bodyEl;

	var Runner = function () {
		this.currentValue = 0;
		this.velocity = 0;
		this.intervalId = null;
		this.isRunning = false;
		this.direction = false;
		this.callback = null;
	}

	Runner.prototype.step = function () {
		this.currentValue += (this.direction ? this.velocity : -this.velocity) / 1000;
		this.velocity += -this.velocity / 10;

		if (this.velocity <= 1) {
			this.stop();
		}

		if (this.callback(this.currentValue)) {
			this.stop();
		}
	}

	Runner.prototype.start = function (cb) {
		if (!this.isRunning) {
			this.callback = cb;
			var that = this;
			this.intervalId = setInterval(function () {
				that.step();
			}, 16);
			this.isRunning = true;
		}
	}

	Runner.prototype.stop = function () {
		if (this.isRunning) {
			clearInterval(this.intervalId);
			this.isRunning = false;
			this.velocity = 0;
		}
	}

	var runner = new Runner();
	window['a'] = runner;

	window.onload = function () {
		bodyEl = document.getElementsByTagName('body')[0];
		bodyEl.onmousewheel = onWheel;
		isReady = true;
	}
	
	var onWheel = function (e) {
		e.preventDefault();

		runner.currentValue = bodyEl.scrollTop;
		if (runner.isRunning) {
			var d = 20000 + runner.velocity / 10;
			if ((e.wheelDelta < 0) != runner.direction) {
				d *= -1;
			}
			runner.velocity += d;
		} else {
			runner.velocity = 10000;
		}
		runner.direction = e.wheelDelta < 0;
		runner.start(doScroll);
	}

	var doScroll = function (v) {
		bodyEl.scrollTop = v;
		if (v > bodyEl.scrollHeight || v < 0) {
			return true;
		}
		return false;
	} 
})();