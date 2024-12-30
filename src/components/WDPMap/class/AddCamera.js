/*
 * @Author: yuyanglei yuyl@zhiwyl.com
 * @Date: 2024-09-14 14:43:19
 * @LastEditors: yuyanglei yuyl@zhiwyl.com
 * @LastEditTime: 2024-09-18 10:39:37
 * @FilePath: \zwyl-project-51world\screen-web\src\components\WDPMap\class\CameraTrace.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import utils from "@/utils/utils.js";


class AddCamera {

    constructor(options) {
        this.cloudRender = options.cloudRender;
        this.name="AddCamera添加相机镜头"

        utils.bindAll([
            'init',
        ], this);
        this.init();
    }

    init() {
        console.log('AddCamera-init');
    }
    add() { 
    }
    destroy() {
        
    }
    

    
        
};
        
export default AddCamera;
