import CryptoJS from 'crypto-js'

const ak = '1fd4ec69848add1ec610b73346b5888f'
const sk = '2e201a988fa32e215a6254bef6a933aa'

function calculateSignature(method, uri, query = {}, headers = {}) {
    // 1. 规范化 URI
    const normalizedUri = uri.replace(/\/+$/, '') || '/'

    // 2. 处理查询参数
    const queryEntries = Object.entries(query)
        .map(([k, v]) => [k.toLowerCase(), v])
        .sort((a, b) => a[0].localeCompare(b[0]))
    const canonicalQuery = queryEntries.map(([k, v]) => `${k}=${v}`).join('&')

    // 3. 处理请求头
    const mcHeaders = Object.entries(headers)
        .filter(([k]) => k.toLowerCase().startsWith('x-mc-'))
        .map(([k, v]) => [
            k.toLowerCase(),
            typeof v === 'string' ? v.trim() : String(v).trim()
        ])
        .sort((a, b) => a[0].localeCompare(b[0]))

    const canonicalHeaders = mcHeaders.map(([k, v]) => `${k}:${v}`).join(';')

    // 4. 构建签名字符串
    const signComponents = [
        method.toUpperCase(),
        normalizedUri,
        headers['Content-Type'] || 'application/json',
        canonicalQuery,
        canonicalHeaders,
        '' // 空body
    ]

    const canonicalRequest = signComponents.join('\n')

    // 5. 计算签名
    const signature = CryptoJS.HmacSHA256(canonicalRequest, sk).toString(CryptoJS.enc.Hex)

    return { signature: `Sign ${ak}-${signature}`, canonicalRequest }
}

export async function fetchDeviceData(id) {
    // 构造查询的 inputKey
    const inputKey = "system.RemoteCollector.supos.system." + id;

    const testParams = {
        method: 'POST',
        uri: '/open-api/supos/oodm/v2/attribute/current',
        query: {},
        body: JSON.stringify({
            inputs: [inputKey]
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const { signature: authHeader } = calculateSignature(
        testParams.method,
        testParams.uri,
        testParams.query,
        testParams.headers
    )

    // 构建请求 URL (通过 Vite 开发服务器代理解决跨域)
    const queryString = new URLSearchParams(testParams.query).toString()
    const fullUrl = `${testParams.uri}${queryString ? '?' + queryString : ''}`

    // 发送请求
    const response = await fetch(fullUrl, {
        method: testParams.method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
        },
        body: testParams.body
    })

    const data = await response.json()
    if (data.code === 200 && data.data && data.data[inputKey]) {
        console.log('获取设备数据成功:', data.data[inputKey])
        // 只返回响应数据里面的 value
        return data.data[inputKey].value
    } else {
        throw new Error(data.message || '获取数据失败或格式不正确')
    }
}