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
 */
export function createXRayShader(
    xrayColor: [number, number, number] = [0.0, 1.0, 0.8],
) {
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
        },
        fragmentShaderText: `
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        vec3 normalEC = fsInput.attributes.normalEC;
        vec3 positionEC = fsInput.attributes.positionEC;
        vec3 viewDir = normalize(-positionEC);

        // 反向菲涅尔：正面几乎消失，边缘轮廓亮
        float dotNV = abs(dot(normalEC, viewDir));
        float edge = pow(1.0 - dotNV, 1.2);

        // ============ 水平扫描线（从下往上移动） ============
        // 使用眼空间 Y 坐标 + 时间偏移实现移动扫描线
        float scanSpeed = czm_frameNumber * 0.06;
        float scanY = positionEC.y * 3.0 + scanSpeed;
        // 主扫描线：一条亮带
        float scanBand = smoothstep(0.0, 0.2, abs(sin(scanY))) 
                       * smoothstep(0.0, 0.05, abs(cos(scanY * 0.5)));
        // 细密网格线
        float gridLine = smoothstep(0.92, 1.0, abs(sin(positionEC.y * 60.0)))
                       + smoothstep(0.92, 1.0, abs(sin(positionEC.x * 60.0)));
        gridLine = clamp(gridLine, 0.0, 1.0) * 0.3;

        // ============ 颜色合成 ============
        // 边缘轮廓线
        vec3 edgeColor = u_xrayColor * edge * 1.5;
        // 网格 + 扫描线
        vec3 scanColor = u_xrayColor * 0.4 * (1.0 - scanBand * 0.3);
        vec3 gridColor = u_xrayColor * gridLine;

        material.diffuse = edgeColor + scanColor * 0.15 + gridColor;

        // ============ 透明度 ============
        // 正面几乎完全透明，边缘不透明 → 线框骨架感
        float baseAlpha = 0.02 + edge * 0.5;
        // 网格线处稍微加强
        baseAlpha += gridLine * 0.15;
        material.alpha = baseAlpha;
      }
    `,
    })
}

// 存储各 tileset 的原始 customShader，用于恢复
const originalShaders = new Map<string, any>()

/**
 * 为指定 ID 的 3D Tiles 应用 shader 效果
 * @param tilesetIds 要应用效果的 tileset ID 数组
 * @param effectType 效果类型: 'fresnel' | 'xray'
 */
export function applyShaderEffect(
    tilesetIds: string[],
    effectType: 'fresnel' | 'xray',
) {
    const shader =
        effectType === 'fresnel' ? createFresnelShader() : createXRayShader()

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
