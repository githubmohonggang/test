!function(w,doc){
	var u = {
		ajax:{
			IP:'http://uz.weifuht.com',
			// IP: 'http://localhost:53312',
			header:{
				"Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
				"openid":"oByCw4mZX6_mhM5ZKT4G9Ws82V58"
			},
			before:function(e){
				var win = w.parent !== w ? w.parent : w;
				var urlParam = urlToObj(win.location.search);
				// if(e.method != 'POST'){
					if(/\?[^?]+/.test(e.url)){
						e.url += ('&openid='+ urlParam.openid);
					}else{
						e.url += ('?openid='+ urlParam.openid);
					}
				// }else{
				// 	e.data.openid = urlParam.openid;
				// }
			},
			after:function(e,next){
				if("1" == e.status){
					next(e.data)
				}else{
					this.hint(e.msg);
				}
			}
		}
	};
	var isAndroid = (/android/gi).test(navigator.appVersion);
	var uzStorage = function(){
		return w.localStorage;
	};
	function parseArguments(url, data, fnSuc, dataType) {
		if (typeof(data) == 'function') {
			dataType = fnSuc;
			fnSuc = data;
			data = undefined;
		}
		if (typeof(fnSuc) != 'function') {
			dataType = fnSuc;
			fnSuc = undefined;
		}
		return {
			url: url,
			data: data,
			fnSuc: fnSuc,
			dataType: dataType
		};
	}
	u.trim = function(str){
		if(String.prototype.trim){
			return str == null ? "" : String.prototype.trim.call(str);
		}else{
			return str.replace(/(^\s*)|(\s*$)/g, "");
		}
	};
	u.trimAll = function(str){
		return str.replace(/\s*/g,'');
	};
	u.isElement = function(obj){
		return !!(obj && obj.nodeType == 1);
	};
	u.isArray = function(obj){
		if(Array.isArray){
			return Array.isArray(obj);
		}else{
			return obj instanceof Array;
		}
	};
	u.isEmptyObject = function(obj){
		if(JSON.stringify(obj) === '{}'){
			return true;
		}
		return false;
	};
	u.addEvt = function(el, name, fn, useCapture){
		if(!u.isElement(el)){
			console.warn('$api.addEvt Function need el param, el param must be DOM Element');
			return;
		}
		useCapture = useCapture || false;
		if(el.addEventListener) {
			el.addEventListener(name, fn, useCapture);
		}
	};
	u.rmEvt = function(el, name, fn, useCapture){
		if(!u.isElement(el)){
			console.warn('$api.rmEvt Function need el param, el param must be DOM Element');
			return;
		}
		useCapture = useCapture || false;
		if (el.removeEventListener) {
			el.removeEventListener(name, fn, useCapture);
		}
	};
	u.one = function(el, name, fn, useCapture){
		if(!u.isElement(el)){
			console.warn('$api.one Function need el param, el param must be DOM Element');
			return;
		}
		useCapture = useCapture || false;
		var that = this;
		var cb = function(){
			fn && fn();
			that.rmEvt(el, name, cb, useCapture);
		};
		that.addEvt(el, name, cb, useCapture);
	};
	u.dom = function(el, selector){
		if(arguments.length === 1 && typeof arguments[0] == 'string'){
			if(doc.querySelector){
				return doc.querySelector(arguments[0]);
			}
		}else if(arguments.length === 2){
			if(el.querySelector){
				return el.querySelector(selector);
			}
		}
	};
	u.domAll = function(el, selector){
		if(arguments.length === 1 && typeof arguments[0] == 'string'){
			if(doc.querySelectorAll){
				return doc.querySelectorAll(arguments[0]);
			}
		}else if(arguments.length === 2){
			if(el.querySelectorAll){
				return el.querySelectorAll(selector);
			}
		}
	};
	u.byId = function(id){
		return doc.getElementById(id);
	};
	u.first = function(el, selector){
		if(arguments.length === 1){
			if(!u.isElement(el)){
				console.warn('$api.first Function need el param, el param must be DOM Element');
				return;
			}
			return el.children[0];
		}
		if(arguments.length === 2){
			return this.dom(el, selector+':first-child');
		}
	};
	u.last = function(el, selector){
		if(arguments.length === 1){
			if(!u.isElement(el)){
				console.warn('$api.last Function need el param, el param must be DOM Element');
				return;
			}
			var children = el.children;
			return children[children.length - 1];
		}
		if(arguments.length === 2){
			return this.dom(el, selector+':last-child');
		}
	};
	u.eq = function(el, index){
		return this.dom(el, ':nth-child('+ index +')');
	};
	u.not = function(el, selector){
		return this.domAll(el, ':not('+ selector +')');
	};
	u.prev = function(el){
		if(!u.isElement(el)){
			console.warn('$api.prev Function need el param, el param must be DOM Element');
			return;
		}
		var node = el.previousSibling;
		if(node.nodeType && node.nodeType === 3){
			node = node.previousSibling;
			return node;
		}
	};
	u.next = function(el){
		if(!u.isElement(el)){
			console.warn('$api.next Function need el param, el param must be DOM Element');
			return;
		}
		var node = el.nextSibling;
		if(node.nodeType && node.nodeType === 3){
			node = node.nextSibling;
			return node;
		}
	};
	u.closest = function(el, selector){
		if(!u.isElement(el)){
			console.warn('$api.closest Function need el param, el param must be DOM Element');
			return;
		}
		var doms, targetDom;
		var isSame = function(doms, el){
			var i = 0, len = doms.length;
			for(i; i<len; i++){
				if(doms[i].isSameNode(el)){
					return doms[i];
				}
			}
			return false;
		};
		var traversal = function(el, selector){
			doms = u.domAll(el.parentNode, selector);
			targetDom = isSame(doms, el);
			while(!targetDom){
				el = el.parentNode;
				if(el != null && el.nodeType == el.doc_NODE){
					return false;
				}
				traversal(el, selector);
			}

			return targetDom;
		};

		return traversal(el, selector);
	};
	u.contains = function(parent,el){
		var mark = false;
		if(el === parent){
			mark = true;
			return mark;
		}else{
			do{
				el = el.parentNode;
				if(el === parent){
					mark = true;
					return mark;
				}
			}while(el === doc.body || el === doc.docElement);

			return mark;
		}
		
	};
	u.remove = function(el){
		if(el && el.parentNode){
			el.parentNode.removeChild(el);
		}
	};
	u.attr = function(el, name, value){
		if(!u.isElement(el)){
			console.warn('$api.attr Function need el param, el param must be DOM Element');
			return;
		}
		if(arguments.length == 2){
			return el.getAttribute(name);
		}else if(arguments.length == 3){
			el.setAttribute(name, value);
			return el;
		}
	};
	u.removeAttr = function(el, name){
		if(!u.isElement(el)){
			console.warn('$api.removeAttr Function need el param, el param must be DOM Element');
			return;
		}
		if(arguments.length === 2){
			el.removeAttribute(name);
		}
	};
	u.hasCls = function(el, cls){
		if(!u.isElement(el)){
			console.warn('$api.hasCls Function need el param, el param must be DOM Element');
			return;
		}
		if(el.className.indexOf(cls) > -1){
			return true;
		}else{
			return false;
		}
	};
	u.addCls = function(el, cls){
		if(!u.isElement(el)){
			console.warn('$api.addCls Function need el param, el param must be DOM Element');
			return;
		}
		if('classList' in el){
			el.classList.add(cls);
		}else{
			var preCls = el.className;
			var newCls = preCls +' '+ cls;
			el.className = newCls;
		}
		return el;
	};
	u.removeCls = function(el, cls){
		if(!u.isElement(el)){
			console.warn('$api.removeCls Function need el param, el param must be DOM Element');
			return;
		}
		if('classList' in el){
			el.classList.remove(cls);
		}else{
			var preCls = el.className;
			var newCls = preCls.replace(cls, '');
			el.className = newCls;
		}
		return el;
	};
	u.toggleCls = function(el, cls){
		if(!u.isElement(el)){
			console.warn('$api.toggleCls Function need el param, el param must be DOM Element');
			return;
		}
	   if('classList' in el){
			el.classList.toggle(cls);
		}else{
			if(u.hasCls(el, cls)){
				u.removeCls(el, cls);
			}else{
				u.addCls(el, cls);
			}
		}
		return el;
	};
	u.val = function(el, val){
		if(!u.isElement(el)){
			console.warn('$api.val Function need el param, el param must be DOM Element');
			return;
		}
		if(arguments.length === 1){
			switch(el.tagName){
				case 'SELECT':
					var value = el.options[el.selectedIndex].value;
					return value;
					break;
				case 'INPUT':
					return el.value;
					break;
				case 'TEXTAREA':
					return el.value;
					break;
			}
		}
		if(arguments.length === 2){
			switch(el.tagName){
				case 'SELECT':
					el.options[el.selectedIndex].value = val;
					return el;
					break;
				case 'INPUT':
					el.value = val;
					return el;
					break;
				case 'TEXTAREA':
					el.value = val;
					return el;
					break;
			}
		}
		
	};
	u.prepend = function(el, html){
		if(!u.isElement(el)){
			console.warn('$api.prepend Function need el param, el param must be DOM Element');
			return;
		}
		el.insertAdjacentHTML('afterbegin', html);
		return el;
	};
	u.append = function(el, html){
		if(!u.isElement(el)){
			console.warn('$api.append Function need el param, el param must be DOM Element');
			return;
		}
		el.insertAdjacentHTML('beforeend', html);
		return el;
	};
	u.before = function(el, html){
		if(!u.isElement(el)){
			console.warn('$api.before Function need el param, el param must be DOM Element');
			return;
		}
		el.insertAdjacentHTML('beforebegin', html);
		return el;
	};
	u.after = function(el, html){
		if(!u.isElement(el)){
			console.warn('$api.after Function need el param, el param must be DOM Element');
			return;
		}
		el.insertAdjacentHTML('afterend', html);
		return el;
	};
	u.html = function(el, html){
		if(!u.isElement(el)){
			console.warn('$api.html Function need el param, el param must be DOM Element');
			return;
		}
		if(arguments.length === 1){
			return el.innerHTML;
		}else if(arguments.length === 2){
			el.innerHTML = html;
			return el;
		}
	};
	u.text = function(el, txt){
		if(!u.isElement(el)){
			console.warn('$api.text Function need el param, el param must be DOM Element');
			return;
		}
		if(arguments.length === 1){
			return el.textContent;
		}else if(arguments.length === 2){
			el.textContent = txt;
			return el;
		}
	};
	u.offset = function(el){
		if(!u.isElement(el)){
			console.warn('$api.offset Function need el param, el param must be DOM Element');
			return;
		}
		var sl = Math.max(doc.docElement.scrollLeft, doc.body.scrollLeft);
		var st = Math.max(doc.docElement.scrollTop, doc.body.scrollTop);

		var rect = el.getBoundingClientRect();
		return {
			l: rect.left + sl,
			t: rect.top + st,
			w: el.offsetWidth,
			h: el.offsetHeight
		};
	};
	u.css = function(el, css){
		if(!u.isElement(el)){
			console.warn('$api.css Function need el param, el param must be DOM Element');
			return;
		}
		if(typeof css == 'string' && css.indexOf(':') > 0){
			el.style && (el.style.cssText += ';' + css);
		}
	};
	u.cssVal = function(el, prop){
		if(!u.isElement(el)){
			console.warn('$api.cssVal Function need el param, el param must be DOM Element');
			return;
		}
		if(arguments.length === 2){
			var computedStyle = w.getComputedStyle(el, null);
			return computedStyle.getPropertyValue(prop);
		}
	};
	u.jsonToStr = function(json){
		if(typeof json === 'object'){
			return JSON && JSON.stringify(json);
		}
	};
	u.strToJson = function(str){
		if(typeof str === 'string'){
			return JSON && JSON.parse(str);
		}
	};
	u.dbSet = function(key, value){
		if(arguments.length === 2){
			var v = value;
			if(typeof v == 'object'){
				v = JSON.stringify(v);
				v = 'obj-'+ v;
			}else{
				v = 'str-'+ v;
			}
			var ls = uzStorage();
			if(ls){
				ls.setItem(key, v);
			}
		}
	};
	u.dbGet = function(key){
		var ls = uzStorage();
		if(ls){
			var v = ls.getItem(key);
			if(!v){return;}
			if(v.indexOf('obj-') === 0){
				v = v.slice(4);
				return JSON.parse(v);
			}else if(v.indexOf('str-') === 0){
				return v.slice(4);
			}
		}
	};
	u.dbDelete = function(key){
		var ls = uzStorage();
		if(ls && key){
			ls.removeItem(key);
		}else if(ls){
			ls.clear();
		}
	};
	u.hint = function(msg){
		var div = doc.createElement('div');
		div.className = 'kingsmall2-hint';
		div.innerHTML = ('<p>'+msg+'</p>');
		doc.body.appendChild(div);
		setTimeout(function(){
			doc.body.removeChild(div);
		},2000)
	};
	u.open = function(url,data){
		var win = w.parent !== w ? w.parent : w;
		var arr = url.split('#');
		url = arr[0].split('?')[0];
		console.debug(queryParams(Object.assign(urlToObj(win.location.search),data||{}),true))
		win.location = (url + queryParams(Object.assign(urlToObj(win.location.search),data||{}),true) + (arr[1] ? "#" + arr[1] : ''));
	};
	u.paramGet = function(){
		var win = w.parent !== w ? w.parent : w;
		return urlToObj(win.location.search);
	}
	function ajax(param){
		var xh = new (w.XMLHttpRequest || w.ActiveXObject)("Microsoft.XMLHTTP"),
		ct,
		isUpload = ("FILE" == param.method),
		method = (isUpload ? "POST" : param.method);
	    xh.open(method, param.url, true);
		for (var key in param.header) {
			xh.setRequestHeader(key,param.header[key]);
		}
		var sendData = param.data || null;
		if(isUpload){
			xh.upload.onprogress = function (e) {
				if(e.lengthComputable) {
					var value = (e.loaded / e.total) * 100;
					// console.log(value)
				}
			};
			sendData = param.files;
		}
		xh.onreadystatechange = function(e) {
		  if (4 == xh.readyState && 200 == xh.status || 304 == xh.status) {
			  var data = xh.responseText;
			  try{
				clearTimeout(ct);
				if("json" == param.dataType){
					data = JSON.parse(data)
				}
				param.complete && param.complete.call(xh,data);
			  }catch(e){
				param.complete && param.complete.call(xh,data);  
			  }
		  }else{
			  if(200 != xh.status && 304 != xh.status){
				  u.hint('异常代码：'+xh.status)
			  }
		  }
		};
		xh.send(sendData);
		ct = setTimeout(function(){
			xh.abort();
		},param.timeout);
	}
	function urlToObj(str){
		if(!str) return {};
	　　var obj = {};
	　　var arr1 = str.split("?");
	　　var arr2 = arr1[1].split("&");
	　　for(var i=0 ; i < arr2.length; i++){
	　　　　var res = arr2[i].split("=");
	　　　　obj[res[0]] = res[1];
	　　}
	　　return obj;
	}
	/**
	 * 对象转url参数
	 * @param {*} data,对象
	 * @param {*} isPrefix,是否自动加上"?"
	 */
	function queryParams(data, isPrefix, arrayFormat) {
		data = data || {};
	    var prefix = isPrefix ? '?' : '';
	    var _result = [];
	    if (['indices', 'brackets', 'repeat', 'comma'].indexOf(arrayFormat) == -1) arrayFormat = 'brackets';
	    for (var key in data) {
	        var value = data[key];
	        // 去掉为空的参数
	        if (['', undefined, null].indexOf(value) >= 0) {
	            continue;
	        }
	        // 如果值为数组，另行处理
	        if (value.constructor === Array) {
	            // e.g. {ids: [1, 2, 3]}
	            switch (arrayFormat) {
	                case 'indices':
	                    // 结果: ids[0]=1&ids[1]=2&ids[2]=3
	                    for (var i = 0; i < value.length; i++) {
	                        _result.push(key + '[' + i + ']=' + value[i]);
	                    }
	                    break;
	                case 'brackets':
	                    // 结果: ids[]=1&ids[]=2&ids[]=3
						for (var i = 0; i < value.length; i++) {
	                        _result.push(key + '[]=' + value[i]);
						}
	                    break;
	                case 'repeat':
	                    // 结果: ids=1&ids=2&ids=3
						for (var i = 0; i < value.length; i++) {
	                        _result.push(key + '=' + value[i]);
						}
	                    break;
	                case 'comma':
	                    // 结果: ids=1,2,3
	                    var commaStr = "";
						for (var i = 0; i < value.length; i++) {
	                        commaStr += (commaStr ? "," : "") + value[i];
						}
	                    _result.push(key + '=' + commaStr)
	                    break;
	                default:
						for (var i = 0; i < value.length; i++) {
							_result.push(key + '[]=' + value[i])
						}
	            }
	        } else {
	            _result.push(key + '=' + value)
	        }
	    }
	    return _result.length ? prefix + _result.join('&') : ''
	}
	String.prototype.ajax = function(data,fn){
		var url = this.valueOf(),start = 0;
		if (!url.startsWith('{')) {
		  start = url.indexOf('}') + 1;
		}
		var arrStr = url.substring(start, url.indexOf('}') + 1);
		url = url.replace(arrStr, '');
		arrStr = arrStr.replace(/\{|\}/g, '').split(',');
	/*-------------------------------------------------------------------------------------------------------------------------------------*/
		var request_method = { 
			"GET":"method",
			"POST":"method", 
			"PUT":"method", 
			"DELETE":"method", 
			"CONNECT":"method",
			"HEAD":"method", 
			"OPTIONS":"method",
			"TRACE":"method",
			"FILE":"method",  
			"TEXT":"responseType",
			"arraybuffer":"responseType",
			"number":"timeout",
			"json":"dataType",
			"xml":"dataType",
			"html":"dataType",
			"script":"dataType",
			"jsonp":"dataType",
			"text":"dataType",
			"withCredentials":"withCredentials",
			"sslVerify":"sslVerify",
			"firstIpv4":"firstIpv4",
			"loading":"loading",
		};
		var request_param = {
			method:"GET",
			responseType:"text",
			timeout:30000,
			dataType:"json",
			loading:true
		};
		for(var i=0,len=arrStr.length;i<len;i++){
			var val = /^[0-9]+$/g.test(arrStr[i])?Number(arrStr[i]):arrStr[i];
			if(request_method[val]){
				request_param[request_method[val]] = 'withCredentials' == val || 'firstIpv4' == val ? true :'sslVerify' == val || 'loading' == val ? false : val;
			}
		}
		var app = u;
		//深度查找对象方法
		function getObj(obj) {
			var newObj = {};
			if (obj instanceof Array) {
				newObj = [];
			}
			for (var key in obj) {
				var val = obj[key];
				newObj[key] = 'object' === typeof val ? getObj(val) : 'function' === typeof val && key !== 'after' && key !== 'before'? val.apply(app) : val;
			}
			return newObj;
		}
		var config = getObj(app.ajax) || {};
		var src = config.IP + url,param = {};
		if(/^https?:\/\/[\s\S]+/.test(url)){
			src = url;
		}
		var header = config.header || {"Content-Type": "application/json;charset=utf-8"};
		if(typeof fn === 'function'){
			request_param.complete = function(res){
				if(config.after && typeof config.after === 'function'){
					var next = function(data){
						fn && fn.apply(app,[data]);
					}
					config.after.apply(app,[res,next]);
				}else{
					fn && fn.apply(app,[res]);
				}
			}
		}
		Object.assign(param,request_param);
		Object.assign(param,{url:src,header:header,data:data});
		var sBoundary = "---------------------------" + Date.now().toString(16);
		if(param.method == 'FILE'){
			param.header["Content-Type"] = ("multipart\/form-data; boundary=" + sBoundary);
		}
		config.before && config.before.apply(app,[param]);
		var technique = param.method ?
		    param.header["Content-Type"] === "multipart\/form-data" ? 3 : param.header["Content-Type"] === "text\/plain" ? 2 : 1 : 0;
		var fFilter = technique === 2 ? plainEscape : escape;
		if("POST" != param.method && "FILE" != param.method){
			if(/\?[^?]+/.test(param.url)){
				param.url += ("&" + queryParams(param.data));
			}else{
				param.url += queryParams(param.data,true);
			}
			delete param.data;
		}else{
			if("FILE" == param.method){
				var segments = [],len = Object.keys(param.data).length;
				for (var key in param.data) {
					  var oFile = param.data[key];
					  oSegmReq = new FileReader();
					  oSegmReq.segmentIdx = segments.length;
					  segments.push("Content-Disposition: form-data; name=\"" + key + "\"; filename=\"" + oFile.name + "\"; Content-Type: " + oFile.type + "\r\n\r\n");
					  oSegmReq.onload = function pushSegment (oFREvt) {
							segments[this.segmentIdx] += oFREvt.target.result + "\r\n";
							if(!(len -= 1)){
								var sData = ("--" + sBoundary + "\r\n" + segments.join("--" + sBoundary + "\r\n") + "--" + sBoundary + "--\r\n");
								var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
								for (var nIdx = 0; nIdx < nBytes; nIdx++) {
									ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
								}
								param.files = ui8Data;
								ajax(param);
							}
					  };
					  oSegmReq.readAsBinaryString(oFile);
				}
				return
			}else{
				// var formData = new FormData();
				// for (var key in param.data) {
				// 	formData.append(key, param.data[key]);
				// }
				// param.data = formData;
				param.data = queryParams(param.data);
			}
		}
		ajax(param);
	}
	
	String.prototype.formatTime = function(fmt) {
	    if (/[\s\S]*(Date\(.*\))[\s\S]*/.test(this.valueOf())) {
	        date = new Date(Number(this.valueOf().replace(/[\s\S]+\((\d+)\)[\s\S]*/, '$1')));
	    }else{
			return '';
		}
	    var o = {
	        "M+": date.getMonth() + 1, //月份
	        "d+": date.getDate(), //日
	        "h+": date.getHours(), //小时
	        "m+": date.getMinutes(), //分
	        "s+": date.getSeconds(), //秒
	        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
	        "S": date.getMilliseconds() //毫秒
	    };
	    if(/(y+)/.test(fmt)){
	      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	    }
	    for (var k in o) {
	        if (new RegExp("(" + k + ")").test(fmt)) {
	            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	        }
	    }
	    return fmt;
	}
	
	function plainEscape (sText) {
	  return sText.replace(/[\s\=\\]/g, "\\$&");
	}
	w.$api = u;
}(window,document)