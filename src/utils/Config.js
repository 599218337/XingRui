/*
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-14 10:23:20
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-09-27 15:59:30
 * @FilePath: \screen-web\src\utils\Config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
let Config = {
    version: '1.0.0',
    user1: {
        name: "admin",
        // admin
        pass: ['a', 'd', 'm', 'i', 'n']
    },
    user2: {
        name: "user",
        // user
        pass: ['u', 's', 'e', 'r']
    },
    
};


// 管理员账户
// 账户名：teacher
// 密码：teacher@240430

// 用户账户
// 账户名：student
// 密码：student_0430



export const base_position = {
    x1: 32885000,
    y1: 24880000,
    x2: 32885000 + 30000,
    y2: 24880000 + (1500 * 4),
    x3: 32885000 + 60000,
    y3: 24880000 + (10000 * 3),
    x4: 32885000 + 90000,
    y4: 24880000 + (22000 * 3),
    x5: 32885000 + 140000,
    y5: 24880000 + (22000 * 3),
    x6: 32885000 + 170000,
    y6: 24880000 + (10000 * 3),
    x7: 32885000 + 230000,
    y7: 24880000,
}


export default Config;