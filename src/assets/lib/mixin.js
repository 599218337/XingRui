// import { Message } from 'element-ui'
import { ElMessage } from 'element-plus'
// import CryptoJS from 'crypto-js' //加密js

/**
 * 获取指定长度的随机码
 * @param codeLength
 * @return {String}
 */
export const uuid = (codeLength) => {
    // 时间戳
    let timestamp = (new Date()).getTime().toString();
    // 默认返回20位随机数
    let num = codeLength || 20;
    let code = "";
    let codeTwo = "";
    let selectChar = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F", "G", "H", "I", "G", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");
    let selectCharTwo = new Array("A", "B", "C", "D", "E", "F", "G", "H", "I", "G", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    for (let i = 0; i < num; i++) {
        let charIndex = Math.floor(Math.random() * 32);
        code += selectChar[charIndex];
    }
    for (let i = 0; i < num; i++) {
        let charIndex = Math.floor(Math.random() * 32);
        codeTwo += selectCharTwo[charIndex];
    }
    if (code.length != num) {
        createCode();
    }
    // 时间戳 + 随机数
    code = code + timestamp + codeTwo;
    return code;
}

/**
 * 获取文档页面导航数据
 * 整合所有数据，生成最终的数组
 * @param baseUrl            // 开发文档呢基础路由，例如/doc/jsapi
 * @param filesMDNames      // 读取文件夹内的所有md文件路径数组
 * @param navList           // 文档页面导航的中文对应
 * @return {Array}
 */
export const gitSidebarList = (baseUrl, filesMDNames, navList) => {
    const sidebarList = [];
    var childrenAllName = [];

    for (var i in filesMDNames) {
        let path = filesMDNames[i];
        const listObj = {};                         // 单个对象
        const listItemS = path.split('/');
        var type = 'one';
        if (listItemS.length > 0) {
            listObj.path = path;                            // 路径
            if (listItemS.length == 4) {                    // 三级
                listObj.id = listItemS[1];
                listObj.name = listItemS[3].replace('.md', '');    // 名字
                if (childrenAllName.indexOf(listItemS[1]) >= 0) {
                    type = 'two';
                    listObj.url = baseUrl + '/' + listItemS[1] + '/' + listItemS[2] + '/' + listItemS[3].replace('.md', '');
                } else {
                    listObj.children = [];
                    listObj.showChildStatus = false;                  // 默认隐藏二级
                    childrenAllName.push(listItemS[1]);
                    listObj.oneUrl =  baseUrl + '/' + listItemS[1];
                    listObj.url = baseUrl + '/' + listItemS[1] + '/' + listItemS[2] + '/' + listItemS[3].replace('.md', '');
                }
            } else if (listItemS.length == 3) {                    // 二级
                listObj.id = listItemS[1];
                listObj.name = listItemS[2].replace('.md', '');    // 名字

                if (childrenAllName.indexOf(listItemS[1]) >= 0) {
                    type = 'two';
                    listObj.url = baseUrl + '/' + listItemS[1] + '/' + listItemS[2].replace('.md', '');
                } else {
                    listObj.children = [];
                    listObj.showChildStatus = false;                  // 默认隐藏二级
                    childrenAllName.push(listItemS[1]);
                    listObj.oneUrl =  baseUrl + '/' + listItemS[1];
                    listObj.url = baseUrl + '/' + listItemS[1] + '/' + listItemS[2].replace('.md', '');
                }
            } else if (listItemS.length == 2) {                     // 一级
                listObj.name = listItemS[1].replace('.md', '');    // 名字
                listObj.url = baseUrl + '/' + listObj.name;
                listObj.oneUrl = baseUrl + '/' + listObj.name;
            }

        }

        var newObj = JSON.parse(JSON.stringify(listObj));
        delete(newObj.children);
        delete(newObj.oneUrl);
        if (type == 'one') {
            sidebarList.push(listObj);
        }
        for (var i in sidebarList) {
            if (sidebarList[i].id && sidebarList[i].id == newObj.id) {
                sidebarList[i].children.push(newObj);
                break;
            }
        }
    }



    var data = [];


    // 排序并添加名字
    for (var k in navList) {

        for (var i in sidebarList) {
            // 判断一级目录的URL是否匹配， 有二级的也要判断一级oneurl
            if (navList[k].target && navList[k].target == 'blank') {
                navList[k].showName = navList[k].name;
                data.push(navList[k]);
                break;
            } else if (sidebarList[i].oneUrl == navList[k].url) {
                sidebarList[i].showName = navList[k].name;
                if (navList[k].children && sidebarList[i].children) {
                    var childrenList = [];
                    for (var j in navList[k].children) {
                        if (navList[k].children[j].typeName) {
                            childrenList.push(navList[k].children[j])
                        } else {
                            for (var h in sidebarList[i].children) {
                                if (navList[k].children[j].url == sidebarList[i].children[h].url) {
                                    sidebarList[i].children[h].showName = navList[k].children[j].name;
                                    sidebarList[i].children[h].pageData = navList[k].children[j].pageData;
                                    childrenList.push(sidebarList[i].children[h]);
                                }
                            }
                        }
                    }
                    sidebarList[i].children = childrenList;
                    sidebarList[i].className = 'heightCount' + childrenList.length.toString();
                } if (navList[k].pageData) {
                    sidebarList[i].pageData = navList[k].pageData;
                }
                data.push(sidebarList[i]);
            }

        }




    }


    return data;
}


/**
 *  重写ElementUI的Message
 *  single默认值true，因为项目需求，默认只弹出一个，可以根据实际需要设置
 */
// 为了实现Class的私有属性
const showMessage = Symbol('showMessage');
export class DonMessage {
    success (options, single = true) {
        this[showMessage]('success', options, single)
    }
    warning (options, single = true) {
        this[showMessage]('warning', options, single)
    }
    info (options, single = true) {
        this[showMessage]('info', options, single)
    }
    error (options, single = true) {
        this[showMessage]('error', options, single)
    }

    [showMessage] (type, options, single) {
        if (single) {
            // 判断是否已存在Message
            if (document.getElementsByClassName('el-message').length === 0) {
                ElMessage[type](options)
            }
        } else {
            ElMessage[type](options)
        }
    }
}




/**
 * 获取指定长度的随机码
 * @param codeLength
 * @return {String}
 */
export const onCopy = () => {
    // var messageList = document.getElementsByClassName('el-message');
    // if (messageList.length > 0) {
    //     for (var i in messageList) {
    //         messageList[i].style.display = 'none';
    //     }

    // }
    // Message({
    //     message: '复制成功',
    //     type: 'success',
    //     duration: 800,
    // });
}



/**
 * 所有正则表达式
 * @param codeLength
 * @return {String}
 */
export const RegularObj = {
    // 手机号
    mobile: /^1[3456789]\d{9}$/,
    // 密码
    password: /^[a-zA-Z0-9]{3,16}$/,
    // 图片验证码:
    verifCode: /^[a-zA-Z0-9]{4}$/,
    // 手机验证码
    sendCode: /^\d{4}$/,
    // 手机验证码
    emailVerifCode: /^\d{4}$/,
    // 计算验证码规则
    verifCodeCreate: /^[0-9\-]{1,3}$/,
    // 邮箱
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    // 开发者姓名
    userName: /^[a-zA-Z\u4e00-\u9fa5]{2,20}$/,
    // 公司名称
    completeName: /^[a-zA-Z0-9\ \-\_\（\）\(\)\u4e00-\u9fa5]{2,30}$/,
    // 营业执照号
    registrationId: /^[a-zA-Z0-9]{3,45}$/,
    // 个人简介
    userIntro: /^[a-zA-Z0-9\*\.\,\、\，\。\-\(\)\（\）\:\；\;\u4e00-\u9fa5]{10,100}$/,
    // 页面链接
    pageUrl: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
    // 应用名称
    appName: /^[a-zA-Z0-9\u4e00-\u9fa5\_\-]{1,15}$/,
    // key名称
    keyName: /^[a-zA-Z0-9\u4e00-\u9fa5\_\-]{1,15}$/,

    // Android 端 sha
    sha: /^([0-9A-Z]{2}\:){19}[0-9A-Z]{2}$/,
    // Android 端 packgeName
    packgeName: /^[a-zA-Z0-9\_\.]{1,128}$/,
    // Web 端 ip
    webIp: /^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}(\/[0-9]{1,2})?(\n)?)+$/,
    // 安全码Bundle ID
    bundleId: /^[a-zA-Z0-9\.\_\-]{1,128}$/,
    // js sdk，referer
    referer: /^([a-zA-Z0-9\-\_]{0,62}\.[a-zA-Z0-9\-\_]{1,62}(\.[a-zA-Z0-9]{1,62})?(\n)?)+$/,

    // 自定义地图
    customDemand: /^[\d\D]{5,500}$/,
    // 问题反馈-描述
    feedbackDescribe: /^[\d\D]{1,500}$/,
    // 使用场景
    scene: /^[\d\D]{30,1000}$/,
    // 问题反馈-标题
    feedbackTitle: /^[\d\D]{1,200}$/,
    // 身份证号
    idNum: /^[1-9]\d{5}(15|16|17|18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,

    // 申请配额理由
    applyReason: /^[\d\D]{20,200}$/,


    // s_ips: /^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}(\/[0-9]{1,2})?(\,)?)+$/,
    // m_scode: /^(([0-9A-Z]{2}\:){19}[0-9A-Z]{2}\;[a-zA-Z0-9\_\.]{0,100})|([a-zA-Z0-9\.]{1,300})$/,
    // m_scode_ios: /^(([0-9A-Z]{2}\:){19}[0-9A-Z]{2}\;[a-zA-Z0-9\_\.]{0,100})|([a-zA-Z0-9\.]{1,300})$/,
    // sha : /^([0-9A-Z]{2}\:){19}[0-9A-Z]{2}|([a-zA-Z0-9\.]{1,300})$/,
    // b_referers: /^[a-zA-Z0-9\*\.\,\-]+$/,
}



/**
 * 格式化时间戳，并根据需求返回对应格式
 * @param {Int} t 时间戳
 * @param {String} type 控制返回对应格式
 */
export const SetTime = (t, type = "") => {
    var time = t;
    if (t && t.toString().length == 10) { 
        time *= 1000;
    }
    // 根据传入时间戳格式化时间
    var date = new Date(time);
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    // 保留两位处理
    if (hours === 0) hours = "00";
    if (minutes === 0) minutes = "00";

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
        day = "0" + day;
    }
    if (hours >= 0 && hours <= 9 && hours != '00') {
        hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9 && minutes != '00') {
        minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9 ) {
        seconds = "0" + seconds;
    }
    var currentdate = year +  "-" + month + "-" + day + " " + hours +  ":" + minutes + ':' + seconds;
    switch (type) {
        case 'H-M':
            currentdate = hours + ":" + minutes;
            break;
        case 'Y-S':
            currentdate = year +  "-" + month + "-" + day + " " + hours +  ":" + minutes + ':' + seconds;
        break;
        case 'Y-M':
            currentdate = year +  "-" + month + "-" + day + " " + hours +  ":" + minutes;
        break;
        case 'M-M':
            currentdate = month + "-" + day + " " + hours +  ":" + minutes;
        break;
        case 'Y-D':
            currentdate = year +  "-" + month + "-" + day;
        break;
        case 'M-D':
            currentdate = month + "-" + day;
        break;
        case '时-分':
            currentdate = hours + ":" + minutes;
        break;
        case '时-秒':
            currentdate = hours + ":" + minutes + ':' + seconds;
        break;
        case '年-秒':
            currentdate = year +  "年" + month + "月" + day + "日 " + hours +  ":" + minutes;
        break;
        case '月-秒':
            currentdate = month + "年" + day + "日 " + hours +  ":" + minutes;
        break;
        case '年-日':
            currentdate = year +  "年" + month + "月" + day + '日';
        break;
        case '月-日':
            currentdate = month + "月" + day + '日';
            break;
        case '月':
        currentdate = month + "月";
        break;
        case '日':
        currentdate = day + "日";
        break;
        case 'P-Y-D':
            currentdate = year +  "." + month + "." + day;
        break;

    }
    return currentdate;
}

/***
 * 格式化时间秒，
 */
export const TimeToHMS = (seconds, type = '') => {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var remainingSeconds = seconds % 60;
    switch (type) {
        case 'MS':
            return minutes + "分钟" + remainingSeconds + "秒";
        break;
        case 'HMS':
            return hours + "小时 " + minutes + "分钟 " + remainingSeconds + "秒";
        break;
        case 'check_HMS':
            let str = remainingSeconds + "秒";
            if (minutes > 0) { 
                str = minutes + "分钟 " + str;
            }
            if (hours > 0) { 
                str = hours + "小时 " + str;
            }
            return str;
        break;
        case 'watch_HMS':
            return hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + remainingSeconds.toString().padStart(2, '0');
        break;
        case 'valid_HMS':
            return (hours > 0 ? hours + "小时 " : "") + (minutes > 0 ? minutes + "分钟 " : "") + remainingSeconds + "秒";
        break;
        default:
            return hours + "小时 " + minutes + "分钟 " + remainingSeconds + "秒";
        break;
    }
}

/**
 * 防止sql注入字段校验
 *
 * @export
 * @param {*} value
 * @return {*}
 */
 export const AntiSqlValid = (value, type = 1) => {
    var re = /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
    if (type == 2) re = /select|update|delete|exec|count|'|"|=|>|<|%/i;
    if (type == 3) re = /select|update|delete|exec|count|'|=|;|>|<|%/i;
    if (type == 4) re = /select|update|delete|exec|'|=|;|>|<|%/i;
    if (re.test(value)) return false;
    return true;
}


