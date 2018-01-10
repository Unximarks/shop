(function(win, doc, undef) {
	var UA = navigator.userAgent;
	var toString = Object.prototype.toString;
	var utils = {
		$: function(id) {
			return doc.getElementById(id)
		},
		getByTagName: function(tag, ele) {
			ele = ele || doc;
			return utils.makeElesArray(ele.getElementsByTagName(tag))
		},
		getByClsName: function(cls, ele) {
			ele = ele || doc;
			return utils.makeElesArray(ele.getElementsByClassName(cls))
		},
		makeElesArray: function(eles) {
			return Array.prototype.slice.call(eles)
		},
		attr: function(ele, key, val) {
			if (val !== undef) {
				return ele.setAttribute(key, val)
			} else {
				return ele.getAttribute(key)
			}
		},
		bind: function(ele, eventType, func) {
			ele.addEventListener(eventType, func, false)
		},
		unbind: function(ele, eventType, func) {
			ele.removeEventListener(eventType, func, false)
		},
		viewData: function() {
			var w = win,
				body = doc.body,
				dd = doc.documentElement,
				W = w.innerWidth || dd.clientWidth || body.clientWidth || 0,
				H = w.innerHeight || dd.clientHeight || body.clientHeight || 0;
			return {
				"scrollTop": body.scrollTop || dd.scrollTop || w.pageYOffset,
				"scrollLeft": body.scrollLeft || dd.scrollLeft || w.pageXOffset,
				"documentWidth": Math.max(body.scrollWidth, dd.scrollWidth || 0),
				"documentHeight": Math.max(body.scrollHeight, dd.scrollHeight || 0, H),
				"viewWidth": W,
				"viewHeight": H
			}
		},
		remove: function(nid) {
			if (nid && nid.nodeName) {
				nid.parentNode.removeChild(nid)
			}
		},
		hide: function(ele) {
			ele.style.display = 'none'
		},
		show: function(ele) {
			ele.style.display = 'block'
		},
		hasAttr: function(ele, key) {
			return ele.hasAttribute(key)
		},
		contain: function(ele, cls) {
			while (ele && ele.parentNode) {
				if (utils.hasClass(ele, cls)) {
					return ele
				}
				ele = ele.parentNode
			}
			return false
		},
		hasClass: function(ele, cls) {
			return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
		},
		isWeixin: function() {
			return UA.toLowerCase().match(/MicroMessenger/i) === "micromessenger" ? true : false
		},
		shareWeibo: function(params) {
			var wbTitle = doc.title || params.title;
			var shareImg = params.shareImg || '';
			var weiboreg = /weibo/i;
			if (weiboreg.test(UA)) {
				win.WeiboJSBridge.invoke("openMenu", {}, function() {})
			} else {
				doc.location.href = 'http://share.sina.cn/callback?vt=4&title=' + encodeURIComponent(wbTitle) + '&pic=' + encodeURIComponent(shareImg) + '&url=' + encodeURIComponent(document.location.href)
			}
		},
		mixin: function(sup, obj) {
			for (var i in obj) {
				if (obj.hasOwnProperty(i)) {
					sup[i] = obj[i]
				}
			}
			return sup
		},
		transitionDurationToMilliseconds: function(duration) {
			var pieces = duration.match(/^([\d\.]+)(\w+)$/),
				time, unit, multiplier;
			if (pieces.length <= 1) {
				return duration
			}
			time = pieces[1];
			unit = pieces[2];
			switch (unit) {
				case 'ms':
					multiplier = 1;
					break;
				case 's':
					multiplier = 1000;
					break
			}
			return time * multiplier
		},
		isArray: function(v) {
			return toString.call(v) === '[object Array]'
		},
		isObject: function(v) {
			return toString.call(v) === '[object Object]'
		}
	};
	var Events = function() {
		this.map = {}
	};
	Events.prototype = {
		constructor: Event,
		trigger: function(eventname, args) {
			if (this.map[eventname]) {
				this.map[eventname].forEach(function(fn) {
					fn.apply(this, args)
				})
			}
		},
		on: function(eventname, callback) {
			if (this.map[eventname]) {
				this.map[eventname].push(callback)
			} else {
				this.map[eventname] = [callback]
			}
		}
	};
	var swipeEvent = function(ele) {
		this.startX = 0;
		this.startY = 0;
		this.lastX = 0;
		this.lastY = 0;
		this.scrollEle = null;
		this.scrollEleDire = null;
		this.startTime = null;
		Events.call(this);
		this.bindSwipe(ele)
	};
	swipeEvent.prototype = {
		constructor: swipeEvent,
		isScrollContain: function(ele) {
			while (ele && ele.parentNode) {
				if (utils.hasAttr(ele, 'scroll')) {
					return ele
				}
				ele = ele.parentNode
			}
			return null
		},
		bindSwipe: function(ele) {
			utils.bind(ele, "touchstart", this._touchstart.bind(this));
			utils.bind(ele, "touchmove", this._touchmove.bind(this));
			utils.bind(ele, "touchend", this._touchend.bind(this))
		},
		_touchstart: function(e) {
			if (e.touches && e.touches.length > 1) {
				return false
			}
			this.scrollEle = null;
			this.scrollEleDire = null;
			this.startX = this.lastX = e.touches[0].pageX;
			this.startY = this.lastY = e.touches[0].pageY;
			this.startTime = Date.now()
		},
		_touchmove: function(e) {
			var scrollEle = this.isScrollContain(e.target);
			var lastX = this.lastX = e.touches[0].pageX;
			var lastY = this.lastY = e.touches[0].pageY;
			if (e.touches && e.touches.length > 1) {
				return false
			}
			if (scrollEle) {
				this.scrollEle = scrollEle;
				this.scrollEleDire = utils.attr(scrollEle, 'scroll');
				return false
			}
			e.preventDefault();
			var startX = this.startX;
			var startY = this.startY;
			var absX = Math.abs(this.lastX - this.startX);
			var absY = Math.abs(this.lastY - this.startY);
			var moveTime = Date.now() - this.startTime;
			this.trigger('swipeMove', [this.slides, {
				moveTime: moveTime,
				positive: {
					x: lastX - startX >= 0 ? 1 : -1,
					y: lastY - startY >= 0 ? 1 : -1
				},
				direc: absX > absY ? "X" : "Y",
				moveX: absX,
				moveY: absY,
				startX: startX,
				startY: startY,
				lastX: lastX,
				lastY: lastY
			}, e.target])
		},
		_touchend: function(e) {
			var target = e.target;
			var absX = Math.abs(this.lastX - this.startX);
			var absY = Math.abs(this.lastY - this.startY);
			var dragDirec = absX > absY ? "x" : "y";
			var of = 5;
			if ((dragDirec === "x" && absX < of) || (dragDirec === "y" && absY < of)) {
				return false
			}
			var swipe = dragDirec === 'y' ? 'swipeY' : 'swipeX';
			var direction = dragDirec === 'y' ? (this.lastY < this.startY ? 1 : -1) : (this.lastX < this.startX ? 1 : -1);
			if (this.scrollEle && this.scrollEleDire === dragDirec) {
				var scrollTopLeft = this.scrollEleDire === 'y' ? this.scrollEle.scrollTop : this.scrollEle.scrollLeft;
				var eleHW = this.scrollEleDire === 'y' ? this.scrollEle.clientHeight : this.scrollEle.clientWidth;
				var scrollHW = this.scrollEleDire === 'y' ? this.scrollEle.scrollHeight : this.scrollEle.scrollWidth;
				if (eleHW + scrollTopLeft + 10 >= scrollHW) {
					this.trigger(swipe, [1, target])
				} else if (scrollTopLeft < 10) {
					this.trigger(swipe, [-1, target])
				}
				return false
			}
			this.trigger(swipe, [direction, target])
		}
	};
	swipeEvent.prototype = utils.mixin(swipeEvent.prototype, Events.prototype);
	var EasySlide = function(config) {
		this.slides = [];
		this.slidesLen = 0;
		this.curIndex = 0;
		this.curGroups = [];
		this.curGLen = 0;
		this.curGIndex = 0;
		this.subppt = [];
		this.subpptNum = [];
		var defaultConfig = {
			transition: 'all 0.5s ease',
			firstTime: true,
			animateEffect: 'default',
			swipeDirection: 'y',
			replay: false,
			wrapAll: ''
		};
		utils.mixin(defaultConfig, config);
		utils.mixin(this, defaultConfig);
		this.wrapAll = utils.$(this.wrapAll);
		swipeEvent.call(this, this.wrapAll);
		this.init()
	};
	EasySlide.STATIC = {
		flayerCls: 'EasySlide-flayer',
		flayerTriggerCls: 'EasySlide-triggerLayer',
		animateCls: 'EasySlide-animate',
		groupCls: 'EasySlide-groups',
		slideCls: 'EasySlide-slides'
	};
	EasySlide.animationEffects = {
		'default': function(ele, axis, offsetEnd, setTransition) {
			if (setTransition) {
				ele.style.transition = this.transition
			}
			ele.style["-webkit-transform"] = 'translateZ(0) translate' + axis + '(' + offsetEnd + 'px)'
		}
	};
	EasySlide.prototype = {
		constructor: EasySlide,
		bindEvent: function() {
			utils.bind(this.wrapAll, "click", this._click.bind(this));
			this.on('swipeY', this.allowSwipeY.bind(this));
			this.on('swipeX', this.allowSwipeX.bind(this));
			utils.bind(win, "load", this.resize.bind(this));
			utils.bind(win, "resize", this.resize.bind(this));
			utils.bind(win, "scroll", function(e) {
				e.preventDefault()
			})
		},
		init: function() {
			this.initSlides(this.wrapAll);
			this.slides = utils.getByClsName(EasySlide.STATIC.slideCls, this.wrapAll);
			this.slidesLen = this.slides.length;
			this.curGroups = utils.getByClsName(EasySlide.STATIC.groupCls, this.slides[0]);
			this.curGLen = this.curGroups.length;
			this.showCurSlide();
			this.bindEvent();
			if (this.subpptObjects) {
				if (!EasySlide.Subppt) {
					throw new Error('must have ppt.js!');
				} else {
					this.initSubPPT(this.subpptObjects)
				}
			}
		},
		initSlides: function(wrap) {
			this.vW = this.width || utils.viewData().viewWidth;
			this.vH = this.height || utils.viewData().viewHeight;
			wrap.style.height = this.vH + "px";
			wrap.style.width = this.vW + "px"
		},
		resize: function() {
			this.initSlides(this.wrapAll);
			this.showCurSlide()
		},
		setYPos: function(el, posY) {
			EasySlide.animationEffects[this.animateEffect].call(this, el, 'Y', posY, true)
		},
		setXPos: function(el, posX) {
			EasySlide.animationEffects[this.animateEffect].call(this, el, 'X', posX, true)
		},
		removeAnimation: function(el) {
			el.style['-webkit-animation'] = "";
			el.offsetWidth = el.offsetWidth
		},
		setAnimation: function(el, animation) {
			el.style["-webkit-animation"] = animation.name + " " + animation.duration + " " + animation.tfunction + " " + animation.delay + " " + animation.iteration + " normal forwards"
		},
		showCurSlide: function() {
			var self = this;
			var attr = utils.attr;
			this.slides.forEach(function(slide) {
				var tIndex = parseInt(utils.attr(slide, "index"), 10);
				var isEnd = self.curIndex === self.slidesLen - 1 && tIndex === 0;
				var isFirst = self.curIndex === 0 && tIndex === self.slidesLen - 1;
				var isCur = tIndex === self.curIndex;
				var isNext = tIndex === self.curIndex + 1;
				var isPrev = tIndex === self.curIndex - 1;
				var y = isCur ? 0 : null;
				var x = isCur ? 0 : null;
				if (isNext || isEnd) {
					y = self.vH;
					x = self.vW
				} else if (isPrev || isFirst) {
					y = -self.vH;
					x = -self.vW
				}
				if (isCur || isNext || isPrev || isEnd || isFirst) {
					if (self.swipeDirection === 'y') {
						self.setYPos(slide, y)
					} else if (self.swipeDirection === 'x') {
						self.setXPos(slide, x)
					}
					utils.show(slide)
				} else {
					utils.hide(slide)
				}
			});
			this.curGroups.forEach(function(group) {
				var tIndex = parseInt(utils.attr(group, "gIndex"), 10);
				if (tIndex === self.curGIndex) {
					utils.show(group);
					var animateDivs = utils.getByClsName(EasySlide.STATIC.animateCls, group);
					if (self.replay) {
						animateDivs.forEach(self.removeAnimation)
					}
					animateDivs.forEach(function(div) {
						self.setAnimation(div, {
							name: attr(div, "in"),
							duration: attr(div, "duration") || ".5s",
							tfunction: attr(div, "tfunction") || "ease",
							delay: attr(div, "delay") || 0,
							iteration: attr(div, "iteration") || 1
						})
					})
				} else {
					utils.hide(group)
				}
			});
			var allowswipe = this.getCurAllowSwipe();
			this.trigger('slide-switchEnd', [allowswipe])
		},
		getCurAllowSwipe: function() {
			return utils.attr(this.curGroups[this.curGIndex], "allowswipe")
		},
		allowSwipeY: function(direction) {
			this.allowSwipe(direction, 'y')
		},
		allowSwipeX: function(direction, target) {
			var subindex = this.subpptNum.indexOf(this.curIndex);
			if (subindex !== -1 && utils.contain(target, EasySlide.Subppt.STATIC.imgWrapCls)) {
				this.subppt[subindex].move(direction);
				this.trigger('ppt-switchEnd');
				return
			}
			this.allowSwipe(direction, 'x')
		},
		allowSwipe: function(direction, swipeDirection) {
			var allowswipe = this.getCurAllowSwipe();
			if ((!allowswipe || allowswipe === "next" || allowswipe === 'prev') && this.swipeDirection === swipeDirection) {
				this.move(direction)
			}
		},
		move: function(direction) {
			var directions = {
				'1': function() {
					if (this.curGIndex < this.curGLen - 1) {
						this.curGIndex++
					} else {
						this.curIndex++;
						if (this.curIndex >= this.slidesLen) {
							this.curIndex = 0
						}
						if (this.curIndex === this.slidesLen - 1) {
							this.firstTime = false
						}
						this.curGroups = utils.getByClsName(EasySlide.STATIC.groupCls, this.slides[this.curIndex]);
						this.curGLen = this.curGroups.length;
						this.curGIndex = 0
					}
				},
				'-1': function() {
					if (this.curGIndex > 0) {
						this.curGIndex--
					} else {
						this.curIndex--;
						if (this.curIndex < 0) {
							if (this.firstTime) {
								this.curIndex = 0
							} else {
								this.curIndex = this.slidesLen - 1
							}
						}
						this.curGroups = utils.getByClsName(EasySlide.STATIC.groupCls, this.slides[this.curIndex]);
						this.curGLen = this.curGroups.length;
						this.curGIndex = this.curGLen - 1
					}
				}
			};
			directions[direction].call(this);
			this.showCurSlide()
		},
		_click: function(e) {
			var target = e.target;
			while (target && target.parentNode && target !== this.wrapAll) {
				if (utils.hasAttr(target, "goto")) {
					e.stopPropagation();
					var tGoIndex = parseInt(utils.attr(target, "goto"), 10);
					this.goto(tGoIndex);
					break
				} else if (utils.hasAttr(target, 'layerid')) {
					e.stopPropagation();
					var tLayer = utils.$(utils.attr(target, "layerid"));
					utils.show(tLayer);
					break
				} else if (utils.hasClass(target, EasySlide.STATIC.flayerCls)) {
					e.stopPropagation();
					utils.hide(target);
					break
				}
				target = target.parentNode
			}
		},
		goto: function(index) {
			this.curIndex = index;
			this.curGroups = utils.getByClsName(EasySlide.STATIC.groupCls, this.slides[this.curIndex]);
			this.curGLen = this.curGroups.length;
			this.curGIndex = 0;
			this.showCurSlide()
		}
	};
	EasySlide.prototype = utils.mixin(EasySlide.prototype, swipeEvent.prototype);
	EasySlide.utils = utils;
	win.EasySlide = EasySlide
})(window, document);