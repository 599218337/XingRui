/**
 * Cesium CustomShader 特效工具模块
 * 提供 Fresnel 边缘发光 和 X-Ray 全息透视 两种效果
 */
import * as gs3d from '/public/gs3d/index'

const { Cesium } = gs3d

/**
 * 创建 Fresnel 边缘发光效果的 CustomShader
 * ★ 保留模型原色不透明，仅在边缘叠加明亮的辉光
 */
export function createFresnelShader(
    glowColor: [number, number, number] = [0.3, 0.6, 1.0],
    fresnelPower: number = 3.0,
    glowIntensity: number = 2.5,
) {
    return new Cesium.CustomShader({
        // MODIFY_MATERIAL: 在原材质基础上叠加效果，保留模型原色
        mode: Cesium.CustomShaderMode.MODIFY_MATERIAL,
        lightingModel: Cesium.LightingModel.PBR,
        translucencyMode: Cesium.CustomShaderTranslucencyMode.OPAQUE,
        uniforms: {
            u_glowColor: {
                type: Cesium.UniformType.VEC3,
                value: new Cesium.Cartesian3(glowColor[0], glowColor[1], glowColor[2]),
            },
            u_fresnelPower: {
                type: Cesium.UniformType.FLOAT,
                value: fresnelPower,
            },
            u_glowIntensity: {
                type: Cesium.UniformType.FLOAT,
                value: glowIntensity,
            },
        },
        fragmentShaderText: `
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        vec3 normalEC = fsInput.attributes.normalEC;
        vec3 positionEC = fsInput.attributes.positionEC;
        vec3 viewDir = normalize(-positionEC);

        // 菲涅尔因子：边缘 → 1, 正面 → 0
        float dotNV = abs(dot(normalEC, viewDir));
        float fresnel = pow(1.0 - dotNV, u_fresnelPower);

        // 呼吸脉冲
        float pulse = 0.8 + 0.2 * sin(czm_frameNumber * 0.04);

        // 在原始 diffuse 基础上叠加辉光（HDR 叠加，边缘处非常亮）
        vec3 glow = u_glowColor * fresnel * u_glowIntensity * pulse;
        material.diffuse = material.diffuse + glow;

        // 让边缘的自发光更强烈（emissive）
        material.emissive = glow * 0.6;

        // 模型保持完全不透明
        material.alpha = 1.0;
      }
    `,
    })
}

/**
 * 创建 X-Ray 全息透视效果的 CustomShader
 * ★ 完全替换材质：模型变为半透明骨架，带水平扫描线动画，真正"看穿"的效果
 * @param xrayColor 颜色 [r, g, b]
 * @param opacity 不透明度 0-1，越高颜色越浓（背面更可见），默认 0.3
 */
export function createXRayShader(
    xrayColor: [number, number, number] = [0.0, 0.6, 1.0],
    opacity: number = 0.3,
) {
    // opacity 控制：背面可见度 和 基础填充浓度
    const backfaceBase = Math.max(0.01, opacity * 0.8)
    const alphaBoost = opacity
    return new Cesium.CustomShader({
        // REPLACE_MATERIAL: 完全替换，不保留原色
        mode: Cesium.CustomShaderMode.REPLACE_MATERIAL,
        lightingModel: Cesium.LightingModel.UNLIT,
        translucencyMode: Cesium.CustomShaderTranslucencyMode.TRANSLUCENT,
        uniforms: {
            u_xrayColor: {
                type: Cesium.UniformType.VEC3,
                value: new Cesium.Cartesian3(xrayColor[0], xrayColor[1], xrayColor[2]),
            },
            u_backfaceBase: {
                type: Cesium.UniformType.FLOAT,
                value: backfaceBase,
            },
            u_alphaBoost: {
                type: Cesium.UniformType.FLOAT,
                value: alphaBoost,
            },
        },
        fragmentShaderText: `
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        vec3 normalEC = fsInput.attributes.normalEC;
        vec3 positionEC = fsInput.attributes.positionEC;
        // 使用模型局部坐标生成固定网格，避免眼坐标导致的摩尔纹
        vec3 positionMC = fsInput.attributes.positionMC;

        vec3 viewDir = normalize(-positionEC);

        // 背面显示：opacity 越高背面越可见，让颜色更浓
        float backfaceMultiplier = gl_FrontFacing ? 1.0 : u_backfaceBase;

        // 反向菲涅尔：正面几乎消失，边缘轮廓亮
        float dotNV = abs(dot(normalEC, viewDir));
        float edge = pow(1.0 - dotNV, 1.2);

        // ============ 水平扫描线 ============
        // 扫描线保留眼坐标，始终从屏幕下方往上扫
        float scanSpeed = czm_frameNumber * 0.06;
        float scanY = positionEC.y * 3.0 + scanSpeed;
        float scanBand = smoothstep(0.0, 0.2, abs(sin(scanY))) 
                       * smoothstep(0.0, 0.05, abs(cos(scanY * 0.5)));

        // ============ 网格线（使用模型坐标 + 低频率） ============
        // 改用 positionMC 使网格固定于模型表面，频率降到 4.0 消除摩尔纹
        float gridLine = smoothstep(0.85, 1.0, abs(sin(positionMC.x * 20.0)))
                       + smoothstep(0.85, 1.0, abs(sin(positionMC.y * 20.0)))
                       + smoothstep(0.85, 1.0, abs(sin(positionMC.z * 20.0)));
        gridLine = clamp(gridLine, 0.0, 1.0) * 0.3;

        // ============ 颜色合成 ============
        vec3 edgeColor = u_xrayColor * edge * 1.5;
        vec3 scanColor = u_xrayColor * 0.4 * (1.0 - scanBand * 0.3);
        vec3 gridColor = u_xrayColor * gridLine;

        material.diffuse = edgeColor + scanColor * 0.15 + gridColor;

        // ============ 透明度 ============
        float baseAlpha = 0.02 + u_alphaBoost * 0.3 + edge * 0.5;
        baseAlpha += gridLine * 0.15;

        // 叠加背面系数
        material.alpha = clamp(baseAlpha, 0.0, 1.0) * backfaceMultiplier;
      }
    `,
    })
}

/**
 * 创建 扫描线 + 海拔渐变 效果的 CustomShader
 * ★ 底部深色→顶部亮色的"接地发光"渐变
 * ★ 一条明亮光带自下而上周期性扫描（模型空间坐标驱动）
 */
export function createScanGradientShader(
    baseColor: [number, number, number] = [0.0, 0.6, 1.0],
    maxHeight: number = 40.0,
    scanSpeed: number = 0.15,
    scanBandWidth: number = 1.5,
) {
    return new Cesium.CustomShader({
        mode: Cesium.CustomShaderMode.REPLACE_MATERIAL,
        lightingModel: Cesium.LightingModel.UNLIT,
        translucencyMode: Cesium.CustomShaderTranslucencyMode.TRANSLUCENT,
        uniforms: {
            u_baseColor: {
                type: Cesium.UniformType.VEC3,
                value: new Cesium.Cartesian3(baseColor[0], baseColor[1], baseColor[2]),
            },
            u_maxHeight: {
                type: Cesium.UniformType.FLOAT,
                value: maxHeight,
            },
            u_scanSpeed: {
                type: Cesium.UniformType.FLOAT,
                value: scanSpeed,
            },
            u_scanBandWidth: {
                type: Cesium.UniformType.FLOAT,
                value: scanBandWidth,
            },
        },
        fragmentShaderText: `
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        vec3 positionMC = fsInput.attributes.positionMC;
        vec3 positionEC = fsInput.attributes.positionEC;
        vec3 normalEC  = fsInput.attributes.normalEC;
        vec3 viewDir   = normalize(-positionEC);

        // ============ 计算真实世界高度 ============
        // czm_model 将模型坐标转为世界坐标 (ECEF)
        vec4 worldPos = czm_model * vec4(positionMC, 1.0);
        // 模型原点在世界坐标中的位置
        vec4 modelOrigin = czm_model * vec4(0.0, 0.0, 0.0, 1.0);
        // 在 ECEF 中，"上"方向 = normalize(position)
        vec3 upDir = normalize(modelOrigin.xyz);
        // 当前点相对于模型原点沿"上"方向的投影 = 真实高度差
        float modelHeight = dot(worldPos.xyz - modelOrigin.xyz, upDir);

        // 背面剔除，防止内外墙重叠闪烁
        float backfaceMultiplier = gl_FrontFacing ? 1.0 : 0.1;

        // ============ 1. 边缘光 (Fresnel) ============
        float dotNV = abs(dot(normalEC, viewDir));
        float edge = pow(1.0 - dotNV, 1.5);

        // ============ 2. 海拔渐变 (接地发光) ============
        float heightRatio = clamp(modelHeight / u_maxHeight, 0.0, 1.0);
        float elevationGradient = pow(heightRatio, 1.5);

        // ============ 3. 动态扫描线 (自下而上) ============
        float time = czm_frameNumber * u_scanSpeed;
        float currentScanY = mod(time, u_maxHeight + 10.0) - 5.0;
        float distanceToScan = abs(modelHeight - currentScanY);
        float scanBand = smoothstep(u_scanBandWidth, 0.0, distanceToScan);

        // 扫描线中心色：基础蓝 + 白色混合 → 高亮激光感
        vec3 scanCoreColor = mix(u_baseColor, vec3(1.0, 1.0, 1.0), 0.6);

        // ============ 4. 网格线 ============
        float gridLine = smoothstep(0.88, 1.0, abs(sin(positionMC.x * 18.0)))
                       + smoothstep(0.88, 1.0, abs(sin(positionMC.y * 18.0)))
                       + smoothstep(0.88, 1.0, abs(sin(positionMC.z * 18.0)));
        gridLine = clamp(gridLine, 0.0, 1.0) * 0.2;

        // ============ 5. 合成 ============
        material.diffuse = (u_baseColor * edge)
                         + (u_baseColor * elevationGradient * 0.8)
                         + (u_baseColor * gridLine)
                         + (scanCoreColor * scanBand * 2.0);

        // 透明度
        float baseAlpha = 0.05 + (edge * 0.5) + (elevationGradient * 0.4) + scanBand;
        baseAlpha += gridLine * 0.1;
        material.alpha = clamp(baseAlpha, 0.0, 1.0) * backfaceMultiplier;
      }
    `,
    })
}

// 存储各 tileset 的原始 customShader，用于恢复
const originalShaders = new Map<string, any>()

/**
 * 为指定 ID 的 3D Tiles 应用 shader 效果
 * @param tilesetIds 要应用效果的 tileset ID 数组
 * @param effectType 效果类型: 'fresnel' | 'xray' | 'scanGradient'
 * @param color 可选，自定义颜色 [r, g, b]，取值 0-1
 */
export function applyShaderEffect(
    tilesetIds: string[],
    effectType: 'fresnel' | 'xray' | 'scanGradient',
    color?: [number, number, number],
    opacity?: number,
) {
    let shader: any
    if (effectType === 'fresnel') {
        shader = createFresnelShader(color)
    } else if (effectType === 'xray') {
        shader = createXRayShader(color, opacity)
    } else {
        shader = createScanGradientShader(color)
    }

    for (const id of tilesetIds) {
        const entry = gs3d.global.variable.gs3dAllLayer.find(
            (item: any) => item.id === id,
        )
        if (entry?.layer?.tileSet) {
            // 保存原始 shader
            if (!originalShaders.has(id)) {
                originalShaders.set(id, entry.layer.tileSet.customShader)
            }
            entry.layer.tileSet.customShader = shader
        }
    }
}

/**
 * 移除指定 ID 的 3D Tiles 的 shader 效果，恢复原始渲染
 * @param tilesetIds 要恢复的 tileset ID 数组
 */
export function removeShaderEffect(tilesetIds: string[]) {
    for (const id of tilesetIds) {
        const entry = gs3d.global.variable.gs3dAllLayer.find(
            (item: any) => item.id === id,
        )
        if (entry?.layer?.tileSet) {
            entry.layer.tileSet.customShader = originalShaders.get(id) ?? undefined
            originalShaders.delete(id)
        }
    }
}
