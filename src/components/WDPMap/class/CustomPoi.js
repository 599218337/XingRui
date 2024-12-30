/*
 * @Author: yuyanglei yuyl@zhiwyl.com
 * @Date: 2024-09-14 14:43:19
 * @LastEditors: daisyskr 3218387007@qq.com
 * @LastEditTime: 2024-09-19 20:09:31
 * @FilePath: \zwyl-project-51world\screen-web\src\components\WDPMap\class\CameraTrace.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import utils from "@/utils/utils.js";


class CustomPoi {

    constructor(options) {
        this.cloudRender = options.cloudRender;
        this.name="CustomPoi自定义POI点"

        utils.bindAll([
            'init',
        ], this);
        this.init();
    }

    init() {
        console.log('CustomPoi-init');
    }
    add(key = 1) {
        switch (key) {
            case 1:
                this.poi1();
                break;
            case 2:
                this.poi2();
                break;
            case 3:
                this.poi3();
                break;
        
            default:
                break;
        }
    }
    // 镜头FOCUS至指定类型的覆盖物
    lookAt(id) {
        let jsondata = {
            "id": id,             //覆盖物id
            "covering_type":"poi",     //覆盖物类型, 详见下表
            "distance":50            //距离(单位:米), 默认20米
        }
        this.cloudRender.SuperAPI("FocusCovering", jsondata, (status) => {
            console.log(status); //成功、失败回调
        })
    }

    poi1() { 
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

        cloudRender.SuperAPI("AddPOI", jsondata, (status) => {
            console.log('添加POI点', status); //成功、失败回调
            // this.lookAt(JSON.parse(status).args.id);
        })
    }
    poi2() { 
        let jsondata = {
            "id":"customPOI_id",
            "coord_type":0,                         //坐标类型(0:经纬度坐标, 1:cad坐标)
            "cad_mapkey":"",                        //CAD基准点的Key值, 项目中约定
            "adaptive":false,                       //true:自适应大小;false:默认
            "coord":"113.287224,23.181856",         //POI点的坐标 lng,lat
            "coord_z":0,                            //高度(单位:米)
            "coord_z_type":0,                       //坐标高度类型(0:相对3D世界表面；1:相对3D世界地面；2:相对3D世界海拔; 注:cad坐标无效)
            "always_show_label":true,               //是否永远显示label, true:显示label(默认), false:不显示label
            "show_label_range":"0,2000",            //POI点显示label的范围(单位:米, 范围最小、最大距离; 在此范围内显示, 超出范围隐藏; 注意:always_show_label属性优先于此属性)
            "sort_order":false,                     //是否开启遮挡排序(根据POI点真实3D位置开启遮挡排序,
                                                    //注: 只与其他开启排序的POI之间进行排序, 开启此排序会消耗性能(最多60个POI点同时开启排序)
            "animation_type":"bounce",              //动画类型(bounce:弹出式; stretch:伸缩式; wipe:展开式)
            "duration_time":0.7,                    //规定完成动画所花费的时间(单位:秒)
            "state":"state_1",                      //与marker之中images中的define_state对应
            "marker":{
                "size":"100,228",                   //marker大小(宽,高 单位:像素)
                "images":[
                    {
                        "define_state":"state_1",   //marker图片组
                        "normal_url":"http://superapi.51hitech.com/doc-static/images/static/markerNormal.png",        //normal 图片url地址
                        // "normal_url":"path:/public/image/login/bg.png.png",        //normal 图片url地址
                        "activate_url":"http://superapi.51hitech.com/doc-static/images/static/markerActive.png"       //hover, active 图片url地址
                                        //本地图片地址一: "file:///D:/xxx/markerNormal.png",    D: 在线席位所在盘符
                                        //本地图片地址二: "path:/UserData/markerNormal.png",    图片资源由在线席位后台管理, 在线席位4.3.1以上版本
                    }
                ]
            },
            "label":{
                "bg_image_url": "http://superapi.51hitech.com/doc-static/images/static/LabelBg.png",      
                // "bg_image_url": "path:/image/marker/camera.png",
                                //本地图片地址一: "file:///D:/xxx/LabelBg.png",    D: 在线席位所在盘符
                                //本地图片地址二: "path:/UserData/LabelBg.png",    图片资源由在线席位后台管理, 在线席位4.3.1以上版本
                "bg_size":"100,100", //label大小(宽, 高 单位:像素)
                "bg_offset":"50,200", //整个label左上角相对于marker的中心点(coord坐标中心点)的偏移(x,y 单位:像素), 注: x为正向右, y为正向上
                "content": [
                      {
                          "text":["文本内容A", "ff0000ff", "30"],   //[文本内容, HEXA颜色, 文本大小]
                          "text_offset":"10,5",     //文本框左上角相对于label中bg_offset左上角的margin偏移(x,y 单位:像素), 注: x为正向右, y为正向下
                          "text_boxwidth": 80,      //文本框宽度
                          "text_centered": false,   //文本居中(true:居中; false:不居中)
                          "scroll_speed": 1         //文本滚动速度(0:不滚动; 注: "text_centered":true优先)
                      },
                      {
                          "text":["文本内容B", "00ff00ff", "20"],
                          "text_offset":"10,45",
                          "text_boxwidth": 180,
                          "text_centered": true,
                          "scroll_speed": 0
                      }
                 ]
            },
            "window":{
                "url":"http://superapi.51hitech.com/doc-static/images/static/video.html",      
                       //本地地址一: "file:///D:/xxx/echarts.html",    D: 在线席位所在盘符
                "size":"520,500",      //window大小(宽,高 单位:像素)
                "offset":"50,180"      //window左上角相对于marker的中心点(coord坐标中心点)的偏移(x,y 单位:像素), 注: x为正向右, y为正向上
            }
        }
        this.cloudRender.SuperAPI("AddCustomPOI", jsondata, (status) => {
            console.log(status); //成功、失败回调
            // this.lookAt(JSON.parse(status).args.id);
        })
    }
    poi3() { 
        let jsondata = {
            "id": "id_window",
            "coord_type": 0,                         //坐标类型(0:经纬度坐标, 1:cad坐标)
            "cad_mapkey": "",                        //CAD基准点的Key值, 项目中约定
            "coord": "113.287567,23.180861",         //POI点的坐标 lng,lat
            "coord_z": 0,                            //高度(单位:米)
            "coord_z_type": 0,                       //坐标高度类型(0:相对3D世界表面；1:相对3D世界地面；2:相对3D世界海拔; 注:cad坐标无效)
            "window": {
                "url": "https://superapi.51aes.com/apifunc?timestamp=1900524264000",
                "size": "1200,800",     //window大小(宽,高 单位:像素)
                "offset": "0,0"         //window左上角相对于coord坐标中心的偏移(x,y 单位:像素), 注:x为正向右, y为正向上
            }
        }
        this.cloudRender.SuperAPI("AddPOIByWindow", jsondata, (status) => {
            console.log(status); //成功、失败回调
            // this.lookAt(JSON.parse(status).args.id);
        })
    }
    remove() { 
        let jsondata = {
            "id":["poi_id_0", "customPOI_id", "id_window"],            //覆盖物id
            "covering_type":"poi"     //覆盖物类型, 详见下表
        }
        this.cloudRender.SuperAPI("RemoveCovering", jsondata, (status) => {
            console.log('删除成功', status); //成功、失败回调
        })
    }
    // 更新位置
    UpdateCustomPOICoord(id, postion) { 
        let jsondata = {
            "id": id,
            "coord_type":0,                     //坐标类型(0:经纬度坐标, 1:cad坐标)
            "cad_mapkey":"",                    //CAD基准点的Key值, 项目中约定
            "coord": postion,     //POI点的坐标 lng,lat
            "coord_z":0,                        //高度(单位:米)
            "coord_z_type":0                    //高度类型(0:相对3D世界表面；1:相对3D世界地面；2:相对3D世界海拔; 注:cad坐标无效)
        }
        this.cloudRender.SuperAPI("UpdateCustomPOICoord", jsondata, (status) => {
            console.log('UpdateCustomPOICoord',status); //成功、失败回调
        })

    }

    destroy() {
        
    }
    

    
        
};
        
export default CustomPoi;
