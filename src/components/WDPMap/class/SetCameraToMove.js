/*
 * @Author: yuyanglei yuyl@zhiwyl.com
 * @Date: 2024-09-14 14:43:19
 * @LastEditors: yuyanglei yuyl@zhiwyl.com
 * @LastEditTime: 2024-09-18 10:40:24
 * @FilePath: \zwyl-project-51world\screen-web\src\components\WDPMap\class\CameraTrace.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import utils from "@/utils/utils.js";


class SetCameraToMove {

    constructor(options) {
        this.cloudRender = options.cloudRender;
        this.name="SetCameraToMove镜头沿覆盖物移动"

        utils.bindAll([
            'init',
        ], this);
        this.init();
    }

    init() {
        console.log('SetCameraToMove-init');
    }
    add() { 
        let jsondata = {
            "id": "poi_id_0", //POI点的ID
            "label": "Hello World!", //POI提示文本
            "type": "default", //图标的数据类型, 项目中约定
            "coord_type": 0, //坐标类型(0:经纬度坐标, 1:cad坐标)
            "cad_mapkey": "default", //CAD基准点Key值, 项目中约定
            "coord": "113.287072,23.181194", //POI点的坐标
            "coord_z": 1, //高度(单位:米, cad坐标无效)
            "coord_z_type": 0, //坐标高度类型(0:相对3D世界表面; 1:相对3D世界地面; 2:相对3D世界海拔; 注:cad坐标无效)
            "always_show_label": true, //是否永远显示title, true:显示title(默认), false:不显示title
            "show_label_range": "0,3000", //POI点显示title的范围(单位:米, 范围最小、最大距离; 在此范围内显示, 超出范围隐藏; 注意:always_show_label属性优先于此属性)
            "umg_type": "default", //此POI所使用的UI模板类型(项目中约定, 默认有两种:default为带线的默认POI UI样式, default_noline为不带线的POI UI样式)
            "sort_order": true, //是否自动遮挡排序
            "animation_type": "bounce", //动画类型(bounce:弹出式; stretch:伸缩式; wipe:展开式)
            "duration_time": .7 //规定完成动画所花费的时间(单位:秒)
        }

        cloudRender.SuperAPI("AddPOI", jsondata, (_back) => {
            console.log('添加POI点', _back); //成功、失败回调
        })
    }
    destroy() {
        
    }
    

    
        
};
        
export default SetCameraToMove;
