
export const DOM = {};


DOM.create = function (tagName, className = '', container) {
	const el = window.document.createElement(tagName);
	if (className) el.className = className;
	if (container) container.appendChild(el);
	return el;
};

DOM.createNS = function (namespaceURI, tagName) {
	const el = window.document.createElementNS(namespaceURI, tagName);
	return el;
};

DOM.removeEventListener = function (target, type, callback, options = {}) {
	if ('passive' in options && passiveSupported) {
		target.removeEventListener(type, callback, (options));
	} else {
		target.removeEventListener(type, callback, options.capture);
	}
};

DOM.addEventListener = function (target, type, callback, options = {}) {
	if ('passive' in options && passiveSupported) {
		target.addEventListener(type, callback, (options));
	} else {
		target.addEventListener(type, callback, options.capture);
	}
};

DOM.remove = function (node) {
	if (node && node.parentNode) {
		node.parentNode.removeChild(node);
	}
};
var utils = {

	//gimme radians
	radify: function (deg) {

		function convert(degrees) {
			degrees = degrees || 0;
			return Math.PI * 2 * degrees / 360
		}

		if (typeof deg === 'object') {

			//if [x,y,z] array of rotations
			if (deg.length > 0) {
				return deg.map(function (degree) {
					return convert(degree)
				})
			}

			// if {x: y: z:} rotation object
			else {
				return [convert(deg.x), convert(deg.y), convert(deg.z)]
			}
		}

		//if just a number
		else return convert(deg)
	},

	//gimme degrees
	degreeify: function (rad) {
		function convert(radians) {
			radians = radians || 0;
			return radians * 360 / (Math.PI * 2)
		}

		if (typeof rad === 'object') {
			return [convert(rad.x), convert(rad.y), convert(rad.z)]
		} else return convert(rad)
	},


	extend: function (original, addition) {
		for (let key in addition) original[key] = addition[key];
	},

	clone: function (original) {
		var clone = {};
		for (let key in original) clone[key] = original[key];
		return clone;
	},

	clamp: function (n, min, max) {
		return Math.min(max, Math.max(min, n));
	},

	// // retrieve object parameters from an options object
	// types: {

	// 	rotation: function (r, currentRotation) {

	// 		//[jscastro] rotation default 0
	// 		if (!r) { r = 0; };

	// 		// if number provided, rotate only in Z by that amount
	// 		if (typeof r === 'number') r = { z: r };

	// 		var degrees = this.applyDefault([r.x, r.y, r.z], currentRotation);
	// 		var radians = utils.radify(degrees);
	// 		return radians;

	// 	},

	// 	scale: function (s, currentScale) {
	// 		//[jscastro] scale default 1
	// 		if (!s) { s = 1; };
	// 		if (typeof s === 'number') return s = [s, s, s];
	// 		else return this.applyDefault([s.x, s.y, s.z], currentScale);
	// 	},

	// 	applyDefault: function (array, current) {

	// 		var output = array.map(function (item, index) {
	// 			item = item || current[index];
	// 			return item
	// 		})

	// 		return output
	// 	},

	// },

	toDecimal: function (n, d) {
		return Number(n.toFixed(d));
	},

	equal: function (obj1, obj2) {
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);

		if (keys1.length !== keys2.length) {
			return false;
		}
		if (keys1.length == 0 && keys2.length == 0 && keys1 !== keys2) {
			return false;
		}

		for (const key of keys1) {
			const val1 = obj1[key];
			const val2 = obj2[key];
			const areObjects = this.isObject(val1) && this.isObject(val2);
			if (
				areObjects && !equal(val1, val2) ||
				!areObjects && val1 !== val2
			) {
				return false;
			}
		}

		return true;
	},

	isObject: function (object) {
		return object != null && typeof object === 'object';
	},

	_validate: function (userInputs, defaults) {

		userInputs = userInputs || {};
		var validatedOutput = {};
		utils.extend(validatedOutput, userInputs);

		for (let key of Object.keys(defaults)) {

			if (userInputs[key] === undefined) {
				//make sure required params are present
				validatedOutput[key] = defaults[key]
			} else {
				validatedOutput[key] = userInputs[key]
			}
		}

		return validatedOutput
	},

	/**
	 * 设置方法this指向
	 */
	bindAll: function (fns, context) {
		fns.forEach((fn) => {
			if (!context[fn]) {
				return;
			}
			context[fn] = context[fn].bind(context);
		});
	},

	/**
	 * 获取指定长度的随机码
	 * @param codeLength 获取随机码的长度，默认为6
	 * @return {String}
	 */
	getRandomId: function (codeLength = 6) {
		// 时间戳
		let timestamp = (new Date()).getTime().toString();
		// 默认返回20位随机数
		let num = codeLength;
		let code = "";
		let codeTwo = "";
		let selectChar = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F", "G", "H", "I", "G", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");
		let selectCharTwo = new Array("A", "B", "C", "D", "E", "F", "G", "H", "I", "G", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
		for (let i = 0; i < num; i++) {
			let charIndex = Math.floor(Math.random() * 32);
			codeTwo += selectCharTwo[charIndex];
		}
		for (let i = 0; i < num; i++) {
			let charIndex = Math.floor(Math.random() * 32);
			code += selectChar[charIndex];
		}
		if (code.length != num) {
			createCode();
		}
		// 时间戳 + 随机数
		code = code + timestamp + codeTwo;
		return code;
	},

	// vsThree中的墨卡托转经纬度
	mercatorToLngLat: function (px, py, pz) {
		let lnglat = {};
		const EXTENT = 20037508.342;
		lnglat.lng = (px - EXTENT) / EXTENT * 180;
		let mmy = (py - EXTENT) / EXTENT * 180;
		lnglat.lat = 180 / Math.PI * (2 * Math.atan(Math.exp(mmy * Math.PI / 180)) - Math.PI / 2);
		return [lnglat.lng, lnglat.lat, pz];
	},
	//获取一个瓦片范围
	GetTileOrgin: function (tile) {
		const HalfEarthCircumfrence = 20037508.3427892;
		let arr = [{
			X: tile.X,
			Y: tile.Y
		}, {
			X: tile.X + 1,
			Y: tile.Y
		}, {
			X: tile.X + 1,
			Y: tile.Y + 1
		}, {
			X: tile.X,
			Y: tile.Y + 1
		}]
		let pointArr = [];
		for (let i = 0; i < 4; i++) {
			let tilePerLine = Math.pow(2, tile.Z);
			let deltaPerTile = HalfEarthCircumfrence * 2 / tilePerLine;
			let x = arr[i].X * deltaPerTile;
			let y = arr[i].Y * deltaPerTile;
			// let xy=this.mercatorToLngLat(x,y,40)
			pointArr.push([x, HalfEarthCircumfrence * 2 - y])
		}

		return pointArr;

	},
	_getType: function (data) {
		return Object.prototype.toString.call(data).slice(8, -1);
	},
	_arrayToPositions: function (data, height) {
		if (this._getType(data) !== "Array") {
			throw new Error("请传入点的数组");
		}
		let caclData = [];
		// 判断是单面，还是多面
		if (this._getType(data[0][0]) === "Number") {
			caclData = [data];
		} else {
			caclData = data;
		}
		const res = [];
		// 面
		for (let i = 0; i < caclData.length; i++) {
			res.push([]);
			// 点集
			for (let j = 0; j < caclData[i].length; j++) {
				res[i].push(this.LngLatToPosition(caclData[i][j], height));
			}
		}
		return res;
	},
	//获取一个瓦片范围
	GetTileOrgin: function (tile) {
		const HalfEarthCircumfrence = 20037508.3427892;
		let arr = [{
			X: tile.X,
			Y: tile.Y
		}, {
			X: tile.X + 1,
			Y: tile.Y
		}, {
			X: tile.X + 1,
			Y: tile.Y + 1
		}, {
			X: tile.X,
			Y: tile.Y + 1
		}]
		let pointArr = [];
		for (let i = 0; i < 4; i++) {
			let tilePerLine = Math.pow(2, tile.Z);
			let deltaPerTile = HalfEarthCircumfrence * 2 / tilePerLine;
			let x = arr[i].X * deltaPerTile;
			let y = arr[i].Y * deltaPerTile;
			// let xy=this.mercatorToLngLat(x,y,40)
			pointArr.push([x, HalfEarthCircumfrence * 2 - y])
		}

		return pointArr;

	},
	// 异步加载文件
	addScript: function (url, cbk) {
		var script = this.create('script', {
			'type': 'text/javascript'
		});
		script.charset = "utf-8";
		script.src = url;
		// 脚本加载完成后进行移除
		if (script.addEventListener) {
			script.addEventListener('load', function (e) {
				var t = e.target;
				t.parentNode.removeChild(t);
				if (cbk) cbk();
			}, false);
		} else if (script.attachEvent) {
			script.attachEvent('onreadystatechange', function (e) {
				var t = window.event.srcElement;
				if (t && (t.readyState == 'loaded' || t.readyState == 'complete')) {
					t.parentNode.removeChild(t);
					if (cbk) cbk();
				}
			});
		}
		// 使用setTimeout解决ie6无法发送问题
		setTimeout(function () {
			document.getElementsByTagName('head')[0].appendChild(script);
			script = null;
		}, 1);
	},
	create: function (tagName, className = '', container) {
		const el = window.document.createElement(tagName);
		if (className) el.className = className;
		if (container) container.appendChild(el);
		return el;
    },
    
    calculate_distance(lng1, lat1, lng2, lat2) {
        var radLat1 = lat1 * Math.PI / 180.0;
        var radLat2 = lat2 * Math.PI / 180.0;
        var a = radLat1 - radLat2;
        var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378137.00;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;
        return s;
    },
    get_earth_path_distance(pathList) { 
        let distance = 0;
        if (pathList.length < 2) { 
            return 0;
        }
        for (let i = 0; i < pathList.length - 1; i++) {
            const start = pathList[i];
            const end = pathList[i + 1];
            if (start[0] == end[0] && start[1] == end[1]) {
                let max = Math.max(start[2], end[2]);
                let min = Math.min(start[2], end[2]);
                distance += (max - min);
            } else { 
                let d = this.calculate_distance(start[0], start[1], end[0], end[1]);
                distance += d;
            }
        }
        return distance;
    },
	dateToWeek: (date) => {
		const d = new Date(date);
		const dayOfWeek = d.getDay();
		const weekDays = [
			"星期日",
			"星期一",
			"星期二",
			"星期三",
			"星期四",
			"星期五",
			"星期六",
		];
		return weekDays[dayOfWeek];
	},
	
	dateFormat:(date, format = 'yyyy-MM-dd hh:mm:ss') => {
		const d = new Date(date)
		if (!date || d.toUTCString() === 'Invalid Date') {
			return '';
		}
		const map = {
			y: d.getFullYear(), // 年
			M: d.getMonth() + 1, //月
			d: d.getDate(), //日
			h: d.getHours(), //时
			m: d.getMinutes(), //分
			s: d.getSeconds(), //秒
			S: d.getMilliseconds(), //毫秒
			q: Math.floor((d.getMonth() + 3) / 3), //季度
		}
	
		return format.replace(/([yMdhmsqS])\1*/g, function (m, t) {
			var v = String(map[t]);
			if (t === 'y') {
				return v.substr(4 - m.length);
			} else if (t === 'S') {
				return ('00' + v).substr(v.length - 1);
			} else if (m.length > 1) {
				return ('0' + v).substr(v.length - 1);
			}
			return v;
		})
	},

	exposedMethods: ['projectToWorld', 'projectedUnitsPerMeter', 'extend', 'unprojectFromWorld']
};
// 获取shape形状

export default utils;



export function bindAll(fns, context) {
	fns.forEach((fn) => {
		if (!context[fn]) {
			return;
		}
		context[fn] = context[fn].bind(context);
	});
}

/**
 * Given a destination object and optionally many source objects,
 * copy all properties from the source objects into the destination.
 * The last source object given overrides properties from previous
 * source objects.
 *
 * @param dest destination object
 * @param sources sources from which properties are pulled
 * @private
 */
export function extend(dest, sources) {
	let newData = JSON.parse(JSON.stringify(dest));
	for (var src in sources) {
		newData[src] = sources[src];
	}
	return newData;
}