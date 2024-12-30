/*
 * @Author: yuyanglei yuyl@zhiwyl.com
 * @Date: 2024-09-14 14:43:19
 * @LastEditors: yuyanglei yuyl@zhiwyl.com
 * @LastEditTime: 2024-09-18 10:40:19
 * @FilePath: \zwyl-project-51world\screen-web\src\components\WDPMap\class\SetCameraRoamingPro.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import utils from "@/utils/utils.ts";


class SetCameraRoamingPro {

  constructor(options) {
    this.cloudRender = options.cloudRender;
    this.name = "SetCameraRoamingPro镜头漫游"

    utils.bindAll([
      'init',
    ], this);
    this.init();
  }

  init() {
    console.log('SetCameraRoamingPro-init');
  }
  set(key) {
    switch (key) {
      case 'start':   // 开始漫游
        this.startroamingProo();
        break;
      case 'pause':   // 暂停漫游
        this.cloudRender.SuperAPI("SetCameraRoamingProState", {
          "state": "pause"      //pause:暂停移动; continue:继续移动; stop:停止移动, 释放焦点
        }, (status) => {
          console.log(status); //成功、失败回调
        })
        break;
      case 'continue':    // 继续漫游

        this.cloudRender.SuperAPI("SetCameraRoamingProState", {
          "state": "continue"      //pause:暂停移动; continue:继续移动; stop:停止移动, 释放焦点
        }, (status) => {
          console.log(status); //成功、失败回调
        })
        break;
      case 'stop':    // 停止漫游

        this.cloudRender.SuperAPI("SetCameraRoamingProState", {
          "state": "stop"      //pause:暂停移动; continue:继续移动; stop:停止移动, 释放焦点
        }, (status) => {
          console.log(status); //成功、失败回调
        })
        break;

      default:
        break;
    }
  }
  // 开始漫游
  startroamingProo() {

    let jsondata = {
      "coord_type": 0,            //坐标类型(0:经纬度坐标, 1:cad坐标)
      "cad_mapkey": "",           //CAD基准点Key值, 项目中约定
      "coord_z_type": 0,          //坐标高度类型(0:相对3D世界表面; 1:相对3D世界地面; 2:相对3D世界海拔; 注:cad坐标无效)
      "subsidiary_show": false,     //是否显示辅助线(true:显示; false:不显示)
      "points": [
        {
          "coord": "113.284119,23.180703",        //路径坐标点 lng,lat
          "coord_z": 6,                        //高度(单位:米, cad坐标无效)
          "coord_easetype": "linear",            //镜头漫游至下一坐标点缓动类型(linear:线型, curve:曲线型)
          "arm_distance": 27,                   //镜头与坐标点距离(单位:米)
          "pitch": 25,                           //镜头俯仰角(0~89)
          "yaw": 122,                             //镜头偏航角(0正北, 0~359)
          "attitude_easetype": "Linear",         //镜头漫游至下一坐标点缓动姿态类型(见下表)
          "time": 5,                             //镜头漫游至下一坐标点所花费的时间(单位:秒)
          "speed_easetype": "linear"             //镜头漫游速度类型(见下表)
        },

        {
          "coord": "113.285386,23.179905",        //路径坐标点 lng,lat
          "coord_z": 6,                        //高度(单位:米, cad坐标无效)
          "coord_easetype": "linear",            //镜头漫游至下一坐标点缓动类型(linear:线型, curve:曲线型)
          "arm_distance": 27,                   //镜头与坐标点距离(单位:米)
          "pitch": 25,                           //镜头俯仰角(0~89)
          "yaw": 122,                             //镜头偏航角(0正北, 0~359)
          "attitude_easetype": "Linear",         //镜头漫游至下一坐标点缓动姿态类型(见下表)
          "time": 5,                             //镜头漫游至下一坐标点所花费的时间(单位:秒)
          "speed_easetype": "linear"             //镜头漫游速度类型(见下表)
        },

        {
          "coord": "113.286505,23.179743",        //路径坐标点 lng,lat
          "coord_z": 6,                        //高度(单位:米, cad坐标无效)
          "coord_easetype": "linear",            //镜头漫游至下一坐标点缓动类型(linear:线型, curve:曲线型)
          "arm_distance": 27,                   //镜头与坐标点距离(单位:米)
          "pitch": 8,                           //镜头俯仰角(0~89)
          "yaw": 355,                             //镜头偏航角(0正北, 0~359)
          "attitude_easetype": "Linear",         //镜头漫游至下一坐标点缓动姿态类型(见下表)
          "time": 5,                             //镜头漫游至下一坐标点所花费的时间(单位:秒)
          "speed_easetype": "linear"             //镜头漫游速度类型(见下表)
        }
      ]
    }
    this.cloudRender.SuperAPI("SetCameraRoamingPro", jsondata, (status) => {
      console.log(status); //成功、失败回调
    })
  }
  destroy() {

  }




};

export default SetCameraRoamingPro;
