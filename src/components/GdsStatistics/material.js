import * as gs3d from '/public/gs3d/index'

let ElliposidWaveMaterialPropertyClass = null;

export function initElliposidWaveMaterial() {
  if (ElliposidWaveMaterialPropertyClass) return ElliposidWaveMaterialPropertyClass;

  const { Cesium } = gs3d;
  var defaultColor = Cesium.Color.WHITE;
  
  function ElliposidWaveMaterialProperty(options) {
    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);

    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;

    this.color = options.color;
    this.count = options.count || 1;
    this.duration = Cesium.defaultValue(options.duration, 1e3);
    this.gradient = Cesium.defaultValue(options.gradient, 0.1);
    this._time = performance.now();
  }

  Object.defineProperties(ElliposidWaveMaterialProperty.prototype, {
    isConstant: {
        get: function () {
            return false;
        }
    },
    definitionChanged: {
        get: function () {
            return this._definitionChanged;
        }
    },
    color: Cesium.createPropertyDescriptor("color")
  });

  ElliposidWaveMaterialProperty.prototype.getType = function (time) {
    return Cesium.Material.EllipsoidWaveType;
  };

  ElliposidWaveMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color);

    if (this._time === undefined) {
        this._time = time.secondsOfDay;
    }
    result.time = (performance.now() - this._time) / this.duration;
    result.count = this.count;
    result.gradient = 1 + 40 * (1 - this.gradient);
    return result;
  };

  ElliposidWaveMaterialProperty.prototype.equals = function (other) {
    return this === other || 
        (other instanceof ElliposidWaveMaterialProperty &&
          Cesium.Property.equals(this._color, other._color));
  };

  if (!Cesium.Material.EllipsoidWaveType) {
    Cesium.Material.EllipsoidWaveType = "EllipsoidWave";
    const ElliposidWaveMaterial = "czm_material czm_getMaterial(czm_materialInput materialInput) { \n\
      czm_material material = czm_getDefaultMaterial(materialInput); \n\
      material.diffuse = 1.5 * color.rgb; \n\
      vec2 st = materialInput.st; \n\
      float dis = distance(st, vec2(0.5, 0.5)); \n\
      float per = fract(time); \n\
      if (dis > 0.5) {  \n\
          discard;  \n\
      } else {  \n\
          float perDis = 0.5 / count; \n\
          float disNum; \n\
          float bl = .0; \n\
          for (int i = 0; i < 10; i++) {\n\
              if(float(i) > count) {\n\
                  break;\n\
              }   \n\
              disNum = perDis * float(i) - dis + per / count; \n\
              if (disNum > 0.0) {  \n\
                  if (disNum < perDis) {  \n\
                      bl = 1.0 - disNum / perDis; \n\
                  } \n\
                  else if(disNum - perDis < perDis) { \n\
                      bl = 1.0 - abs(1.0 - disNum / perDis);  \n\
                  }  \n\
                  material.alpha = pow(bl, gradient);  \n\
              }  \n\
          }  \n\
      }  \n\
      return material;  \n\
    }";

    Cesium.Material._materialCache.addMaterial(Cesium.Material.EllipsoidWaveType, {
      fabric: {
          type: Cesium.Material.EllipsoidWaveType,
          uniforms: {
              color: new Cesium.Color(1, 0, 0, 1.0),
              time: 1,
              count: 1,
              duration: 1000,
              gradient: 0.1
          },
          source: ElliposidWaveMaterial
      },
      translucent: function () {
          return true;
      }
    });
  }

  ElliposidWaveMaterialPropertyClass = ElliposidWaveMaterialProperty;
  return ElliposidWaveMaterialPropertyClass;
}
