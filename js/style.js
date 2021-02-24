!function(w,doc){
	var config = {
		//名称
		name:'鸿通物业',
		//设计图尺寸 px
		size:750,
		//CSS单位比例 rem : px
		scale:'1:100'
	};
	var _i_ = 0,_s = function(){
		var c1 = '#528CFF',c2 = '#FFFFFF';
		return ('background:'+((_i_=!_i_)?c1:c2)+';color:'+(_i_?c2:c1)+';padding:8px 10px;border:1px solid '+c1);
	},log = false;
	var docEl = doc.documentElement,
	    resizeEvt = ('orientationchange' in w ? 'orientationchange' : 'resize'),
	    recalc = function() {
			_scale = (config.scale||'').split(':');
			var _ = ['%c名称%c'+config.name+'%c设计图尺寸%c'+config.size+'px%cCSS单位比例%c'+_scale[0]+'rem == '+(_scale[1]||'')+'px',_s(),_s(),_s(),_s(),_s(),_s()];
	        var clientWidth = docEl.clientWidth;
	        if (undefined === clientWidth) return;
	        docEl.style.fontSize = (clientWidth / ((config.size / _scale[1]) * _scale[0])) + 'px';
			if(w.parent === w && !log)
			console.log.apply(console,_)
			log = true;
	    };
	if (undefined !== doc.addEventListener){
	  w.addEventListener(resizeEvt, recalc, false);
	  doc.addEventListener('DOMContentLoaded',recalc, false);
	}
	w._configSet = function(obj){
		config.name = obj.name || config.name;
		config.size = obj.size || config.size;
		config.scale = obj.scale || config.scale;
		console.clear();
		log = false;
		recalc();
	}
}(window,document)                                                                                 