<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-10-30 14:48:52
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="personStatistics">
    <div class="widget">
      <div class="header">
        <span>人员定位</span>
      </div>
      <div class="content">
        <el-collapse v-model="activeName">
          <el-collapse-item  v-for="(item, index) in departTypeList" :title="item.label" :name="item.value">
            <div class="contentItem" v-for="(_item, _index) in item.detailPeople" @click="location(_item)">
              <div class="Item">
                <div class="text" style="margin-left: 10px;">{{ _item.empName }}</div>
              </div>
              <div class="icon">
                <el-tooltip content="查看" placement="top" popper-class="iconTooltip" :offset="3">
                  <div class="view" @click.stop="location(_item)"></div>
                </el-tooltip>
              </div>
            </div>
          </el-collapse-item>
         
        </el-collapse>

      </div>
    

    </div>
    <div id="personBtn" @click="showContentFuc"> </div>


  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useStore } from "vuex";
const store = useStore();
import { ElMessage } from 'element-plus';
import * as gs3d from '../../../public/gs3d/index';



const  getPersonApiToken =async ()=>{
  let token;
 await fetch('/people-locate/api/v2/get-token',{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":"837E4298041D73923169079720895C06",},
      body:JSON.stringify({
        "appId":"client",
        "buildIdList":[
          "209094"
      ]})
    }).then(res=>{
      if(!res.ok){
        throw Error(res.statusText)
      }
      return res.json()
    }).then(json=>{
      token= json.data
    })
    return token;
}

const  getPersonList =async (token)=>{
  let personList;
 await fetch('/people-locate/api/v2/person/realTimeData',{
      method:"POST",
      headers:{"Content-Type":"application/json","token":token,},
      body:JSON.stringify({
        "buildId": "209094"
      })
    }).then(res=>{
      if(!res.ok){
        throw Error(res.statusText)
      }
      return res.json()
    }).then(json=>{
      console.log('json',json)
      personList= json.data
      personList = personList.reduce((pre,cur)=>{
        showAllPerson(cur)
        if(!pre.has(cur.department)){
          pre.set(cur.department,[{department:cur.department,empNo:cur.empNo,empName:cur.empName,islxsign:cur.islxsign,specifictype:cur.specifictype,tel:cur.tel,worktypename:cur.worktypename,latitude:cur.latitude,longitude:cur.longitude,layer:cur.layer}])
        }else {
          pre.get(cur.department).push({department:cur.department,empNo:cur.empNo,empName:cur.empName,islxsign:cur.islxsign,specifictype:cur.specifictype,tel:cur.tel,worktypename:cur.worktypename,latitude:cur.latitude,longitude:cur.longitude,layer:cur.layer})
        }
        return pre;
      },new Map())
    })
    return personList;
}

const peopleList = ref();
const activeName = ref();
const departTypeList = ref([])
onMounted(async () => {
  let peopleApiToken =  await getPersonApiToken()
    console.log('peopleApiToken',peopleApiToken)
     peopleList.value = await getPersonList(peopleApiToken)
    console.log('peopleList',peopleList.value)
    activeName.value =[...peopleList.value.keys()][0]
    console.log(' activeName.value', activeName.value)
    Array.from(peopleList.value.values()).forEach(element => {
      departTypeList.value.push({label:element[0].department,value:element[0].department,detailPeople:element})
    });
    console.log('departTypeList',departTypeList.value)
})

const billBoardOption =(name)=> {
  return {
    text: name, //文字
  font: '16px Helvetica', //字体，默认"16px Helvetica"
  style: 'FILL', //样式，默认"FILL"，可选"FILL"||"OUTLINE"||"FILL_AND_OUTLINE"
  fillColor: '#ffffff', //文字填充颜色，默认"#ffffff"
  outlineWidth: 1, //文字描边宽度,默认1
  outlineColor: '#ffffff', //文字描边颜色，默认"#ffffff"
  showBackground: false, //是否显示文字背景，默认false
  backgroundColor: '#000000', //文字填充颜色，默认"BLACK"
  pixelOffset: [0, 20], //文本偏移量，默认[0,20]
  distance: { near: 0, far: 30000000 }, //文本及图标显示距离范围,默认near:0,far:30000000
  url: 'image/1.png', //图标路径
  width: 40, //图片宽，默认40
  height: 40 //图片高，默认40
  }
 
}

const showAllPerson = (person) => {
  gs3d.common.draw.drawGraphic(window.viewer, {
    "type": "Point",
    "coordinates": [person.longitude, person.latitude, person.layer]
  }, {
    entityId: 'person_'+person.empName,
    billBoardOption:billBoardOption(person.empName),
    entityProperties: {
      deviceType: 'camera',
      floor: 1,
    }
  })
}

const showContent = ref(false)
const showContentFuc = () => {
  let p = showContent.value ? 0 : 374
  let b = showContent.value ? 'url("/image/zhankai.png")' : 'url("/image/shouqi.png")'
  document.getElementsByClassName('personStatistics')[0].style.transform = `translateX(${p}px)`
  document.getElementsByClassName('personStatistics')[0].style.transition = `transform 0.5s`
  document.getElementById('personBtn').style.background = b
  document.getElementById('personBtn').style.backgroundSize = '100% 100%'
  showContent.value = !showContent.value
}



const location = (val) => {
  if (!val.coord) {
    ElMessage({
      type: 'warning',
      message: `${val.label}坐标点缺失！`
    })
    return
  }
  let jsondata = {
    "id": "person_" + val.id,             //覆盖物id
    "covering_type": "poi",     //覆盖物类型, 详见下表
    "distance": 10           //距离(单位:米), 默认20米
  }
  cloudRender.SuperAPI("FocusCovering", jsondata, (status) => {
    console.log(status); //成功、失败回调
  })
}

</script>

<style lang="scss" scoped>
@import url('./PersonStatistics.scss');

:deep(.el-collapse) {
  --el-collapse-content-bg-color: transparent;
  --el-collapse-header-bg-color: #0356b570;
  --el-collapse-border-color: #0356b570;
  --el-collapse-header-height: 36px;
  --el-collapse-header-text-color: #ffffff;
  margin: 6px;

  .el-collapse-item__content {
    margin: 14px;
  }
}
</style>