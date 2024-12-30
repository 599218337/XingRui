import utils from "@/utils/utils.js";

const defaultOptions = {
    path: [],
    width: 4,
    color: "#0037e4",
    dashed: false,
};

class FatLineClass {

    constructor(options) {
        this._map = options.map;

        this._all_line_ids = [];

        utils.bindAll([
            'init',
        ], this);
        this.init();
    }

    init() {
        console.log('FatLineClass-init');
        // 实例化三维线类
    }
    // 添加三维线
    add_line(id, options, cb) {
        let lineConfig = utils._validate(options || {}, defaultOptions);
       
    }
    remove_line(id) { 

    }
    destroy() {
        
    }
    

    
        
};
        
export default FatLineClass;
