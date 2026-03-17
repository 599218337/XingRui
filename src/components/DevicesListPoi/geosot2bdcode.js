/**
 * 将 GeoSOT (一维25级/32级码) 转换为 20位北斗二维网格位置码 (GB/T 39409-2020)
 * @param {string} geosotCode - 类似 "G0011233312110021200302100" 的标准GeoSOT码
 * @returns {string} - 20位长度的北斗二维网格位置码
 */
export function geosotToBeiDou2D(geosotCode) {
    if (!geosotCode || !geosotCode.toUpperCase().startsWith('G')) {
        throw new Error("无效的 GeoSOT 码格式，必须以 'G' 开头。");
    }

    // 剔除前缀 G，并在末尾补 0 到完整 32 位 (以完全覆盖北斗10级所需的 1/2048 秒精度)
    let code = geosotCode.substring(1).padEnd(32, '0').substring(0, 32);

    // 辅助函数：通过位运算提取四进制对应的二维十进制网格坐标
    // GeoSOT中：数字0(00)->左0右0, 1(01)->左0右1, 2(10)->左1右0, 3(11)->左1右1
    const parseBits = (start, length) => {
        let lat = 0, lon = 0;
        for (let i = start; i < start + length; i++) {
            let val = parseInt(code[i], 10);
            lat = (lat << 1) | ((val >> 1) & 1); // 提取高位赋给纬度
            lon = (lon << 1) | (val & 1);        // 提取低位赋给经度
        }
        return { lat, lon };
    };

    // 按照 GeoSOT 标准层级拆分：度(9位)、分(6位)、秒(6位)、秒以下(11位)
    let deg = parseBits(0, 9);
    let min = parseBits(9, 6);
    let sec = parseBits(15, 6);
    let sub = parseBits(21, 11);

    // 将所有的经纬度信息统一换算为以 1/2048 秒为单位的绝对整数，完全避免浮点误差
    const UNIT = 2048;
    let lonUnits = deg.lon * 3600 * UNIT + min.lon * 60 * UNIT + sec.lon * UNIT + sub.lon;
    let latUnits = deg.lat * 3600 * UNIT + min.lat * 60 * UNIT + sec.lat * UNIT + sub.lat;

    // --- 开始根据 GB/T 39409-2020 逐级生成北斗网格码 ---

    // 默认示例为北半球(N)、东经(E)，实际工程中可根据 GeoSOT 极性前缀动态判断
    let bdCode = "N";

    // 第1级：6°×4° 网格 (1:100万图幅)
    let lonL1 = Math.floor((deg.lon + 180) / 6) + 1; // 经度 01-60
    let latL1 = Math.floor(deg.lat / 4);             // 纬度 A-V
    bdCode += lonL1.toString().padStart(2, '0') + String.fromCharCode(65 + latL1);

    // 计算当前位置在第一级网格内的剩余相对单位（基准点对齐）
    let baseLonUnits = Math.floor(deg.lon / 6) * 6 * 3600 * UNIT;
    let baseLatUnits = Math.floor(deg.lat / 4) * 4 * 3600 * UNIT;
    let rlon = lonUnits - baseLonUnits;
    let rlat = latUnits - baseLatUnits;

    // 数学辅助方法
    const div = (val, d) => Math.floor(val / d);
    const mod = (val, d) => val % d;
    const hex = (val) => val.toString(16).toUpperCase();

    // 第2级：30'×30' (0-B, 0-7)
    let d2 = 30 * 60 * UNIT;
    bdCode += hex(div(rlon, d2)) + div(rlat, d2);
    rlon = mod(rlon, d2); rlat = mod(rlat, d2);

    // 第3级：15'×10' (Z序：0-5)
    let d3lon = 15 * 60 * UNIT, d3lat = 10 * 60 * UNIT;
    bdCode += (div(rlat, d3lat) * 2 + div(rlon, d3lon)).toString();
    rlon = mod(rlon, d3lon); rlat = mod(rlat, d3lat);

    // 第4级：1'×1' (0-E, 0-9)
    let d4 = 60 * UNIT;
    bdCode += hex(div(rlon, d4)) + div(rlat, d4);
    rlon = mod(rlon, d4); rlat = mod(rlat, d4);

    // 第5级：4"×4" (0-E, 0-E)
    let d5 = 4 * UNIT;
    bdCode += hex(div(rlon, d5)) + hex(div(rlat, d5));
    rlon = mod(rlon, d5); rlat = mod(rlat, d5);

    // 第6级：2"×2" (Z序：0-3)
    let d6 = 2 * UNIT;
    bdCode += (div(rlat, d6) * 2 + div(rlon, d6)).toString();
    rlon = mod(rlon, d6); rlat = mod(rlat, d6);

    // 第7-10级：等比例四叉剖分 (经纬向各取 0-7)
    let divs = [UNIT / 4, UNIT / 32, UNIT / 256, 1];
    for (let i = 0; i < divs.length; i++) {
        let d = divs[i];
        bdCode += div(rlon, d).toString() + div(rlat, d).toString();
        rlon = mod(rlon, d); rlat = mod(rlat, d);
    }

    return bdCode;
}
