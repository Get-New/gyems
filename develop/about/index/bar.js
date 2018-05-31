
define(function (require) {

    var $ = require('jquery');


    var ul;
    var allList;
    var fixedList;
    var dynamicList;
    var changeHandler;
    var closeHandler;
    var activeNode;

    function clear() {
        $('li', ul).remove();
        allList = [];
        fixedList = [];
        dynamicList = [];
    }

    function findNodeByMenuId(menuId) {
        for (var i = 0; i < allList.length; i++) {
            if (allList[i].menuId == menuId) return allList[i];
        }
    }

    function setActiveNode(node) {
        if(!node) return;
        if (activeNode && node.menuId == activeNode.menuId) return;
        if (activeNode) {
            activeNode.setActive(false);
        }
        node.setActive(true);
        activeNode = node;
    }

    function add(type, menuId, menuName, active, url) {
        
        for (var i = 0; i < allList.length; i++) {
            if (allList[i].menuId == menuId) {
                setActiveNode(allList[i]);
                return;
            }            
        }

        var li = $("<li>");
        var a = $("<div class='tab_close'></div>")
        li.attr('MenuId', menuId);
        li.append(menuName);
        if (type == 'dynamic') { li.append(a); }
        li.addClass(type);
        ul.append(li);

        var node = new Node();
        node.li = li;
        node.menuId = menuId;
        node.menuName = menuName;        
        node.type = type;
        node.url = url;

        if (type == 'fixed') { fixedList.push(node); }
        if (type == 'dynamic') { dynamicList.push(node); }
        allList.push(node);

        if (active) {
            setActiveNode(node);
        }
    }

    function arrayRemove(array, item) {
    	//if (array instanceof Array) return;

    	var index = (function (item) {
    		for (var i = 0; i < array.length; i++) {
    			if (array[i] == item) return i;
    		}
    		return -1;
    	})(item);

    	if (index > -1) {
    		array.splice(index, 1);
    	}
    }

    function dispose(node) {
    	if (!node) return;

    	if (node.active) {
    		var preNode = findNodeByMenuId(node.li.prev().attr('MenuId'));
    		setActiveNode(preNode);
    	}

    	if (node.type == 'fixed') { arrayRemove(fixedList, node); }
    	if (node.type == 'dynamic') { arrayRemove(dynamicList, node); }
    	arrayRemove(allList, node);
    	node.li.remove();
    }

    function Node() {
        this.li;
        this.menuId;
        this.menuName;

        this.active = false;
        this.type;
    }

    Node.prototype.setActive = function(flag){
        this.active = flag;
        this.active ? this.li.addClass('active') : this.li.removeClass('active');
    }

    var ret = {};

    ret.init = function () {
        ul = $('.topmenu');
        allList = [];
        fixedList = [];
        dynamicList = [];

        ul.on('click', 'li', function (e) {
            var li = $(this);
            var menuId = li.attr('menuId');
            var node = findNodeByMenuId(menuId);
            setActiveNode(node);
            if (typeof changeHandler === 'function') {
                changeHandler(menuId, node.menuName, node.url);
            }
        })

        ul.on('click', '.tab_close', function (e) {
        	var event = e || window.event;
        	if (event.stopPropagation) {
        		event.stopPropagation();
        	}
        	else {
        		event.cancelBubble = true;
        	}
        	var li = $(this).parent();
        	var menuId = li.attr('menuId');
        	var node = findNodeByMenuId(menuId);
        	dispose(node);

        	if (typeof closeHandler === 'function') {
        		closeHandler(menuId, node.menuName, node.url);
        	}
        })
    }

    // 加载数据
    ret.load = function (list) {
        clear();

        for (var i = 0; i < list.length; i++) {
            var type = list[i].dynamic ? 'dynamic' : 'fixed';
            add(type, list[i].menuId, list[i].menuName, list[i].active, list[i].url);
        }
    }

    // 动态追加tab
    ret.append = function (menuId, menuName, url) {
        add('dynamic', menuId, menuName, url);
    }

    ret.change = function (func) {
        changeHandler = func;
    }

    ret.close = function (func) {
    	closeHandler = func;
	}

    return ret;
});