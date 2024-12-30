/*
 * @Author: yuyanglei yuyl@zhiwyl.com
 * @Date: 2024-09-14 14:43:19
 * @LastEditors: yuyanglei yuyl@zhiwyl.com
 * @LastEditTime: 2024-09-18 20:41:15
 * @FilePath: \zwyl-project-51world\screen-web\src\components\WDPMap\class\CameraTrace.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import utils from "@/utils/utils.js";


class Light {

    constructor(options) {
        this.cloudRender = options.cloudRender;
        this.name="Light添加灯光"

        utils.bindAll([
            'init',
        ], this);
        this.init();
    }

    init() {
        console.log('Light-init');
    }
    add(id, position, options) { 
        let jsondata = {
            "id": id,                      //场景特效id
            "coord_type": 0,                       //坐标类型(0:经纬度坐标, 1:cad坐标)
            "cad_mapkey": "",                      //CAD基准点Key值, 项目中约定
            "coord": position,
            "coord_z": 10,                        //高度(单位:米)
            "coord_z_type": 0,                     //坐标高度类型(0:相对3D世界表面; 1:相对3D世界地面; 2:相对3D世界海拔; 注:cad坐标无效)
            "pitch": 0,                            //俯仰角(-90~90)
            "yaw": 0,                              //偏航角(0正北, 0~360)
            "intensity": 40,                       //灯光强度(0~100)
            "color": "fff000",                     //灯光颜色(HEX颜色值)
            "angle": 50,                           //灯光张角(0~50)
            "attenuation": 200,                    //灯光衰减长度(单位:米)
            "shadows": true,                       //是否开启阴影(true/false)
            "haze": true,                          //是否开启烟雾(true/false)
            "haze_Intensity": 90                   //烟雾强度(0~100)
        }
        jsondata = utils._validate(jsondata, options || {});
        this.cloudRender.SuperAPI("AddLight", jsondata, (status) => {
            console.log(status); //成功、失败回调
        })
    }
    updateCoord(id, options) {
        let jsondata = {
            "id": id,
            "coord_type": 0,                          //坐标类型(0:经纬度坐标, 1:cad坐标)
            "cad_mapkey": "",                         //CAD基准点Key值, 项目中约定
            "coord": "113.28672,23.180935",      //坐标点 lng,lat
            "coord_z": 10,                           //高度(单位:米)
            "coord_z_type": 0                         //坐标高度类型(0:相对3D世界表面；1:相对3D世界地面；2:相对3D世界海拔; 注:cad坐标无效)
        }
        jsondata = utils._validate(jsondata, options || {});
        this.cloudRender.SuperAPI("UpdateLightCoord", jsondata, (status) => {
            console.log('updateCoord', status); //成功、失败回调
        })
    }
    updateStyle(id, options) {
        let jsondata = {
            "id": id,
            "pitch": 0,                //俯仰角(-90~90)
            "yaw": 90,                  //偏航角(0正北, 0~360)
            "intensity": 40,           //灯光强度(0~100)
            "color": "ff0000",         //灯光颜色(HEX颜色值)
            "angle": 40,               //灯光张角(0~50)
            "attenuation": 180,        //灯光衰减长度(单位:米)
            "shadows": true,           //是否开启阴影(true/false)
            "haze": true,              //是否开启烟雾(true/false)
            "haze_Intensity": 60       //烟雾强度(0~100)
        }
        jsondata = utils._validate(jsondata, options || {});
        this.cloudRender.SuperAPI("UpdateLightStyle", jsondata, (status) => {
            console.log('updateStyle', status); //成功、失败回调
        })
    }
    remove(id) { 
        let jsondata = {
            "id": id,            //覆盖物id
            "covering_type":"light"     //覆盖物类型, 详见下表
        }
        this.cloudRender.SuperAPI("RemoveCovering", jsondata, (status) => {
            console.log('删除成功', status); //成功、失败回调
        })

    }

    destroy() {
        
    }
    

    
        
};
        
export default Light;
