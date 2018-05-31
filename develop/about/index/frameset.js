// 管理iframe

define(function (require) {
    var $ = require('jquery');

    var list = [];
    var index = 1;
    var activeFrame = null;
    var container;

    function Frame() {
        this.index;
        this.div;
        this.element;
        this.menuId; 
        this.url;
        this.active;
    }

    Frame.prototype.create = function (_menuId, _url) {
        this.menuId = _menuId; 
        this.url = _url;
        this.index = index++;

        var div = $("<div></div>");

        $('img', container).show();

        var el = $("<iframe onload='this.height = 0;this.height = iframe" + this.index + ".document.body.scrollHeight;'></iframe>");
        el.attr('name', 'iframe' + this.index);
        el.attr('id', 'iframe' + this.index);
        el.attr('width', '100%');
        el.attr('height', 0);
        el.attr('frameborder','0');
        el.attr('scrolling', 'auto');
        el.attr('src', _url + '?timestamp=' + (+new Date()));
        el.load(function () { $('img', container).hide(); })
        div.append(el);
        container.append(div);
        this.div = div;
        this.element = el;

        this.setActive(true);        
    } 

    Frame.prototype.dispose = function () {
    	this.element.remove();
    	this.div.remove();
    }

    Frame.prototype.setActive = function (flag) {
        if (this.active == flag) return;
        this.active = flag;
        flag ? this.div.show() : this.div.hide();
    }

    function ret() { };

    ret.init = function () {
        container = $('.ui-content');
    }

    ret.clear = function () {
        for (var i = 0; i < list.length; i++) {
            var frame = list[i];
            frame.dispose();
        }
        list = [];
        index = 1;
    }

    ret.open = function (menuId, url) {
        G.CurrentMenuId = menuId;
        G.CurrentPageUrl = url;

        for (var i = 0; i < list.length; i++) {
            var frame = list[i];
            if (frame.menuId == menuId) {
                activeFrame.setActive(false);
                frame.setActive(true);
                activeFrame = frame;
                return;
            }
        }

        if (activeFrame) activeFrame.setActive(false);
        var frame = new Frame();
        frame.create(menuId, url);
        list.push(frame);
        activeFrame = frame;        
    }

    ret.close = function (menuId) {
    	var index = (function (menuId) {
    		for (var i = 0; i < list.length; i++) {
    			var frame = list[i];
    			if (frame.menuId == menuId) {
    				return i;
    			}
    		}
    		return -1;
    	})(menuId);

    	if (activeFrame == list[index]) {
    		Frame.prototype.setActive.call(list[index - 1], true);
    		activeFrame = list[index - 1];
    	}
    	Frame.prototype.dispose.call(list[index]);

    	if (index > -1) {
    		list.splice(index, 1);
    	}

        G.CurrentMenuId = activeFrame.menuId;
        G.CurrentPageUrl = activeFrame.url;

    	return list[index - 1];
    }

    return ret;
})