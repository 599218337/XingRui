/*
 * @Author: yuyanglei yuyl@zhiwyl.com
 * @Date: 2024-09-14 14:43:19
 * @LastEditors: yuyanglei yuyl@zhiwyl.com
 * @LastEditTime: 2024-09-18 20:02:42
 * @FilePath: \zwyl-project-51world\screen-web\src\components\WDPMap\class\CameraTrace.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import utils from "@/utils/utils.ts";


class CameraTrace {

  constructor(options) {
    this.cloudRender = options.cloudRender;
    this.name = "CameraTrace镜头追踪"

    utils.bindAll([
      'init',
    ], this);
    this.init();
  }

  init() {
    console.log('CameraTrace-init');
  }
  // 镜头追踪
  trace(id, type = 'poi', distance = 100) {
    this.active_jsondata = {
      "trace_object_type": type,    //支持类型：aes_object  ,poi，场景特效，可视域，3D文字，灯光
      "trace_object_id": id, //对象ID
      "arm_distance": distance,
      "fly": true
    }
    this.cloudRender.SuperAPI("CameraTrace", this.active_jsondata, (status) => {
      console.log('CameraTrace', status); //成功、失败回调
    })
  }
  // 停止追踪
  stop() {
    this.cloudRender.SuperAPI("StopCameraTrace", this.active_jsondata, (status) => {
      console.log('StopCameraTrace', status); //成功、失败回调
    })
  }
  destroy() {

  }




};

export default CameraTrace;
