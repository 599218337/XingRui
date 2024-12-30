/*
 * @Author: yuyanglei yuyl@zhiwyl.com
 * @Date: 2024-09-14 14:43:19
 * @LastEditors: yuyanglei yuyl@zhiwyl.com
 * @LastEditTime: 2024-09-18 18:03:21
 * @FilePath: \zwyl-project-51world\screen-web\src\components\WDPMap\class\CameraTrace.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import utils from "@/utils/utils.js";


class AddPath {

    constructor(options) {
        this.cloudRender = options.cloudRender;
        this.name="AddPath添加线"

        utils.bindAll([
            'init',
        ], this);
        this.init();
    }

    init() {
        console.log('AddPath-init');
    }
    add(id) { 
        let jsondata = {
            "id": id,
            "advancedSetting": {
                "smoothnessOfCorners": "extremelyHigh"  //设置路径边角的平滑度(extremelyHigh:极高; high:高; middle:中; low:低;)
            },
            "coord_type": 0,                    //坐标类型(0:经纬度坐标, 1:cad坐标)
            "coord_z_type": 0,                  //坐标高度类型(0:相对3D世界表面；1:相对3D世界地面；2:相对3D世界海拔; 注:cad坐标无效)
            "cad_mapkey": "",                   //CAD基准点Key值, 项目中约定
            "type": "railway",                    //样式类型; 注①
            "color": "ff0000",                  //颜色(HEX颜色值, 空值即透明; railway类型无效, 默认黑白色)
            "pass_color": "ffff00",             //覆盖物移动经过路径颜色(HEX颜色值)
            "width": 10,                        //宽度(单位:米, 圆柱直径或方柱边长；当类型为“adaptive_solid”，含义为倍率)
            "speedRate":1,                      //流动特效的移动倍率,仅针对部分类型有效（arrow,arrow_dot,arrow_dashed,brimless_arrow,scan_line,scan_line_solid）
            "points": [
                {
                    "coord": "113.288002,23.180922",
                    "coord_z": "0.003955"
                },
                {
                    "coord": "113.286819,23.180925",
                    "coord_z": "0.009966"
                },
                {
                    "coord": "113.286674,23.180943",
                    "coord_z": "-0.000044"
                },
                {
                    "coord": "113.286674,23.181044",
                    "coord_z": "-0.000039"
                },
                {
                    "coord": "113.286674,23.181444",
                    "coord_z": "-0.00604"
                }
            ]
        }
        
        this.cloudRender.SuperAPI("AddPath", jsondata, (status) => {
            console.log(status); //成功、失败回调
        })
    }
    remove(id) { 

        let jsondata = {
            "id":id,            //覆盖物id
            "covering_type":"path"     //覆盖物类型, 详见下表
        }
        this.cloudRender.SuperAPI("RemoveCovering", jsondata, (status) => {
            console.log('删除成功', status); //成功、失败回调
        })
    }

    destroy() {
        
    }
    

    
        
};
        
export default AddPath;
