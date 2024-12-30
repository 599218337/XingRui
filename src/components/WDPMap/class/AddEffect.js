/*
 * @Author: yuyanglei yuyl@zhiwyl.com
 * @Date: 2024-09-14 14:43:19
 * @LastEditors: yuyanglei yuyl@zhiwyl.com
 * @LastEditTime: 2024-09-18 20:17:20
 * @FilePath: \zwyl-project-51world\screen-web\src\components\WDPMap\class\CameraTrace.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import utils from "@/utils/utils.js";


class AddEffect {

    constructor(options) {
        this.cloudRender = options.cloudRender;
        this.name="AddEffect添加模型"

        utils.bindAll([
            'init',
        ], this);
        this.init();
    }

    init() {
        console.log('AddEffect-init');
    }
    add(id, postion, cb) {
        // 覆盖物 小车特效
        let effectmovedata = {
            "id": id,
            "coord_type": 0,                          //坐标类型(0:经纬度坐标, 1:cad坐标)
            "cad_mapkey": "",                         //CAD基准点Key值, 项目中约定
            "type": "vehicle_car_black",              //场景特效类型
            "scale": 4,                               //半径(单位:米)
            "coord": postion,          //坐标 lng, lat
            "coord_z": 0,                             //高度(单位:米)
            "coord_z_type": 0,                        //坐标高度类型(0:相对3D世界表面; 1:相对3D世界地面; 2:相对3D世界海拔; 注:cad坐标无效)
            "pitch": 0,                               //俯仰角(-360~360)
            "roll": 0,                                //翻滚角(-360~360)
            "yaw": 0,                                 //偏航角(0正北, -360~360)
            "title_text": ["小车特效,00ff00ff,30"],
            "title_offset": "0,200",                  //文本偏移(单位:米; 东西向为x轴进行偏移)
            "title_face_to_camera": true,             //顶部文字是否跟踪朝向摄像机(注:true优先, "pitch", "roll", "yaw" 无效)
            "title_text_portrait": false              //顶部文字排列方向(true: 纵向, false: 横向)
        };
        
        this.cloudRender.SuperAPI('AddEffect', effectmovedata, (mycallback) => {
            console.log('覆盖物小车特效: ', mycallback);
            cb && cb(mycallback)
        })
    }
    remove(id) { 
        let jsondata = {
            "id":id,            //覆盖物id
            "covering_type":"scene_effect"     //覆盖物类型, 详见下表
        }
        this.cloudRender.SuperAPI("RemoveCovering", jsondata, (status) => {
            console.log('删除成功', status); //成功、失败回调
        })
    }

    show(id) { 
        let jsondata = {
            "id":id,            //覆盖物id
            "covering_type":"scene_effect",    //覆盖物类型, 详见下表
            "bshow":true              //true:显示; false:隐藏
        }
        this.cloudRender.SuperAPI("ShowHideCovering", jsondata, (status) => {
            console.log(status); //成功、失败回调
        })
    }
    hide(id) { 
        let jsondata = {
            "id":id,            //覆盖物id
            "covering_type":"scene_effect",    //覆盖物类型, 详见下表
            "bshow":false              //true:显示; false:隐藏
        }
        this.cloudRender.SuperAPI("ShowHideCovering", jsondata, (status) => {
            console.log(status); //成功、失败回调
        })
    }
    get_info(id, cb) { 
        let jsondata = {
            "data": [
                {
                    "covering_type": "scene_effect",
                    "id": [
                        id
                    ]
                }
            ]
        }
        this.cloudRender.SuperAPI("GetCoveringInfo", jsondata, (status) => {
            console.log(JSON.parse(status)); //成功、失败回调
            let info = JSON.parse(status).args.data;
            cb && cb(info);
        })
    }
    ToMove(id, postion, cb) {
        let jsondata ={
            "data": [
              {
                "object": [   //当object中包含多个对象时, 他们拥有相同的坐标（经纬高）, 但姿态只对aes_object生效, 目前只支持自定义poi、scene_effect、aes_objct三种类型
                  {
                    "id": [id],
                    "type": "scene_effect"
                  }
                ],
                "coord": postion, //目的地的坐标, 对象们从他们当前位置向目的地移动(lng,lat)
                "coord_type": 0, //坐标类型(0:经纬度坐标, 1:cad坐标)
                "cad_mapkey": "default", //CAD基准点Key值, 通过“注册CAD锚点”API创建；coord_type为0时可为空
                "coord_z": 50, //高度(单位:米, cad坐标无效)
                "coord_z_type": 0, //坐标高度类型(0:相对3D世界表面; 1:相对3D世界地面; 2:相对3D世界海拔; 注:cad坐标无效)
                "periodic": 5, //周期, 当前状态到该状态所需时间
                "pitch": 30, //俯仰角,姿态数据只对aes_object生效, 当aes_object到达目的地后, 在一个短暂时间内, 旋转到目标姿态
                "yaw": 30, //偏航角
                "default_yaw": false,  //true：根据运动方向自动计算各姿态角的0度方向；false：以固定yaw值运动
                "roll": 30 //滚动角
              }
            ]
        }
        
        this.cloudRender.SuperAPI("DataDriveObjectToMove", jsondata, (e) => {
            console.log('DataDriveObjectToMove', e);
            cb && cb(e)

        })
        
    }
    // 选中覆盖物
    selectActive(id, state = true, cb) { 
        let jsondata = {
            "id": id,             //覆盖物id
            "selected_state": state,      //覆盖物是否被选中; true:选中; false:未选中
            "covering_type":"scene_effect"      //覆盖物类型, 详见下表
        }
        this.cloudRender.SuperAPI("SimClickCovering", jsondata, (status) => {
            console.log('SimClickCovering', status); //成功、失败回调
            cb && cb(status)
        })
    }
    // 选中覆盖物
    edit(id, type = 'Translation', cb) { 
        let jsondata = {
            "id": id,           //覆盖物id (sectioning: 剖切体, id选填)
            "covering_type": "scene_effect",         //覆盖物类型(poi, viewshed, scene_effect, sectioning, light, aes_object)
            "gizmo_type": type,    //Translation:移动; Rotation:旋转; Scale:缩放
            "gizmo_mode": "world"           //坐标系类型（world:世界坐标系; local:物体坐标系）
        }
        this.cloudRender.SuperAPI("ActiveSuperApiGizmo", jsondata, (e) => {
            console.log('ActiveSuperApiGizmo', e); //成功、失败回调
            cb && cb(e)
        })
    }
    unEdit(id, cb) { 
        let jsondata = {
            "id": id,           //覆盖物id (sectioning: 剖切体, id选填)
            "covering_type": "scene_effect",         //覆盖物类型(poi, viewshed, scene_effect, sectioning, light, aes_object)
            // "gizmo_type": type,    //Translation:移动; Rotation:旋转; Scale:缩放
            "gizmo_mode": "world"           //坐标系类型（world:世界坐标系; local:物体坐标系）
        }
        this.cloudRender.SuperAPI("DeactiveSuperApiGizmo", jsondata, (status) => {
            console.log('DeactiveSuperApiGizmo', status); //成功、失败回调
            cb && cb(e)
        })
    }


    destroy() {
        
    }
    

    
        
};
        
export default AddEffect;
