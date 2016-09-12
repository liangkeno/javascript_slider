(function() {
	var initObj = {
		width: 1000,
		slider: document.querySelector(".slider"),
		delayTime: 1000
	};
	//初始化视图，生成pages nav
	var initHtml = (function(obj) {
		var initCache = {};
		return {
			setCache: function(name, value) {
				initCache[name] = value;
			},
			getCache: function(name) {
				return initCache[name];
			},
			getChildElement: function(dom) {
				var childList = dom.childNodes,
					ret = [];
				if (!dom.children) {
					for (var i = 0; i < childList.length; i++) {
						if (childList[i].nodeType == 1) {
							ret.push(childList[i]);
						}
					}
					return ret;
				} else {
					return dom.children;
				}
			},
			setSliderInit: function() {
				//获取设置的宽度
				var width = obj.slider.width || obj.slider.offsetWidth;
				var sliderIner = this.getChildElement(obj.slider);
				this.setCache("sliderIner", sliderIner[0]);
				//对li设置宽度
				var sliderInerLis = this.getChildElement(sliderIner[0]);

				var lis = [];
				for (var i = 0; i < sliderInerLis.length; i++) {
					lis.push(sliderInerLis[i]);
					sliderInerLis[i].style.width = width + "px";

				}
				this.setCache("sliderList", lis);
				//对li的父node设置总宽度
				sliderIner[0].style.width = width * lis.length + "px";
				sliderIner[0].style.position = "absolute";
				//对slider设置高度宽度
				obj.slider.style.width = width + "px";
				obj.slider.style.height = lis[0].offsetHeight + "px";
				//初始化nav pages
				this.createPages();
				//初始化prev nexts
				this.createPrvNext();
			},
			createPages: function() {
				var wrapPage = document.createElement('div');
				wrapPage.className = "slider_page";
				var sliderList = this.getCache("sliderList");
				var len = sliderList.length;
				var span;
				var spanArr = [];
				for (var i = 0; i < len; i++) {
					if (i == 0) {
						span = "<span class='page_item_$ %'>$</span>";
					} else {
						span = "<span class='page_item_$'>$</span>";
					}
					spanArr.push(span.replace(/\$/g, i));
				}
				spanArr[0] = spanArr[0].replace(/\%/, "active");
				var spanStr = spanArr.join("");
				wrapPage.innerHTML = spanStr;
				initObj.slider.appendChild(wrapPage);
				this.setCache("pageList", this.getChildElement(wrapPage));
			},
			createPrvNext: function() {
				var ctrlArr = [];
				//prev html
				var wrapCtrlPrev = document.createElement('div');
				wrapCtrlPrev.innerHTML = "<i class='icon_left'></i>";
				wrapCtrlPrev.className = "slderCtrl prev";
				wrapCtrlPrev.style.display = "none";
				//next html
				var wrapCtrlNext = document.createElement('div');
				wrapCtrlNext.className = "slderCtrl next";
				wrapCtrlNext.innerHTML = "<i class='icon_right'></i>";
				wrapCtrlNext.style.display = "none";
				//插入slider
				initObj.slider.appendChild(wrapCtrlPrev);
				initObj.slider.appendChild(wrapCtrlNext);
				ctrlArr.push(wrapCtrlPrev, wrapCtrlNext);
				this.setCache("sliderCtrl", ctrlArr);
			},
			hideOrShow: function() {
				var sliderCtrl = this.getCache('sliderCtrl');
				for (var i = 0; i < sliderCtrl.length; i++) {
					if (sliderCtrl[i].style.display != "block") {
						sliderCtrl[i].style.display = "block";
					} else {
						sliderCtrl[i].style.display = "none";
					}
				}
			}
		};
	})(initObj);
	//动画模块，动画的自动播放暂停
	var animate = (function() {
		var animateTimer, timer, index = 0;
		var params = {};
		return {
			controlIndex(direction) {
				var sliderLength = initHtml.getCache("sliderList").length;
				if (direction == "next" && index < sliderLength) {
					index++;
					if (index == sliderLength) {
						index = 0;
					}
				} else if (direction == "prev") {
					index--;
					if (index < 0) {
						index = sliderLength - 1;
					}
				}
				this.scrollOneSlider(index);
			},
			//设置幻灯片切换延时参数
			setParam: function(delayTime, scrollSize) {
				params["delayTime"] = delayTime;
				params["scrollSize"] = scrollSize;
				return this;
			},
			getStyleAttr: function(dom, attr) {
				if (dom.currentStyle) {
					return dom.currentStyle[attr];
				} else {
					return getComputedStyle(dom, false)[attr];
				}
			},
			//一张图的减速到对应位置
			doScroll: function(dom, pesitionLeft) {
				var that = this;
				clearInterval(animateTimer);
				animateTimer = setInterval(function() {
					var curLeft = parseInt(that.getStyleAttr(dom, "left"));
					var speed = (pesitionLeft - curLeft) / 5;
					speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
					//console.log(pesitionLeft + ":" + curLeft + ":" + speed);
					dom.style.left = (curLeft + speed) + "px";
					if (pesitionLeft == curLeft) {
						clearInterval(animateTimer);
					}
				}, 50);
			},
			scrollOneSlider: function(index) {
				//设置选中nav page
				var pageList = initHtml.getCache('pageList');
				//清除active对应样式
				for (var i = 0; i < pageList.length; i++) {
					var classNames = pageList[i].getAttribute('class').replace(/active/g, "");
					pageList[i].setAttribute('class', classNames)
				}
				//添加选中activ
				pageList[index].className = pageList[index].getAttribute('class') + " active";
				//滚动一张幻灯片
				this.doScroll(initHtml.getCache('sliderIner'), params["scrollSize"] * index);
				index = index;
			},
			autoScroll: function() {
				var that = this;
				timer = setInterval(function() {
					var sliderLength = initHtml.getCache("sliderList").length;
					that.scrollOneSlider(index);
					if (index >= sliderLength - 1) {
						index = 0;
					} else {
						index++;
					}
				}, params["delayTime"]);
			},
			stopScroll: function() {
				clearInterval(timer);
			}
		};
	})();

	var eventControl = (function() {
		return {
			addEvent: function(dom, type, fn) {
				if (dom.addEventListener) {
					dom.addEventListener(type, fn, false);
				} else if (dom.attachEvent) {
					dom.attachEvent("on" + type, fn);
				} else {
					dom['on' + type] = fn;
				}
			},
			doMouseEnterAndLeave: function(dom, enterFn, leaveFn) {
				this.addEvent(dom, "mouseenter", enterFn);
				this.addEvent(dom, "mouseleave", leaveFn);
			},
			doMouseOver: function(dom, overFn) {
				this.addEvent(dom, "mouseover", overFn);
			},
			doClick: function(dom, clickFn) {
				this.addEvent(dom, "click", clickFn);
			}
		};
	})();

	//初始化slider
	initHtml.setSliderInit();
	animate.setParam(3000, -1000).autoScroll();
	//鼠标滑入停止，滑出播放
	eventControl.doMouseEnterAndLeave(initObj.slider, function(e) {
		animate.stopScroll();
		initHtml.hideOrShow();
	}, function(e) {
		initHtml.hideOrShow();
		animate.autoScroll();
	});
	//鼠标滑过page nav 进行滚动
	eventControl.doMouseOver(document.querySelector('.slider_page'), function(e) {
		var event = e || window.event;
		var target = event.target || event.srcElement;
		if (target.nodeName == "SPAN") {
			animate.scrollOneSlider(target.innerHTML);
		}
	});
	//next prev滚动事件
	eventControl.doClick(document.querySelector(".icon_left"), function(e) {
		animate.controlIndex("prev");
	});
	eventControl.doClick(document.querySelector(".icon_right"), function(e) {
		animate.controlIndex("next");
	});
})();