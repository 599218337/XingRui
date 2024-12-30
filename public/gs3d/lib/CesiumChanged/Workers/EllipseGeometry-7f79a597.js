define(["exports","./Transforms-c34ae887","./Matrix2-7a8e9daf","./Matrix3-b2351961","./ComponentDatatype-ab629b88","./defaultValue-f6d5e6da","./EllipseGeometryLibrary-bfcb9f21","./GeometryAttribute-d91450b3","./GeometryAttributes-1e4ddcd2","./GeometryInstance-c4920693","./GeometryOffsetAttribute-2579b8d2","./GeometryPipeline-051fbe67","./IndexDatatype-a9b1bc18","./Math-355606c6","./VertexFormat-fbdec922"],(function(t,e,i,r,n,o,a,s,l,u,m,c,p,y,d){"use strict";const f=new r.Cartesian3,A=new r.Cartesian3,x=new r.Cartesian3,h=new r.Cartesian3,g=new i.Cartesian2,_=new r.Matrix3,b=new r.Matrix3,C=new e.Quaternion,w=new r.Cartesian3,M=new r.Cartesian3,E=new r.Cartesian3,I=new r.Cartographic,T=new r.Cartesian3,G=new i.Cartesian2,N=new i.Cartesian2;function P(t,u,c){const p=u.vertexFormat,y=u.center,d=u.semiMajorAxis,h=u.semiMinorAxis,P=u.ellipsoid,v=u.stRotation,V=c?t.length/3*2:t.length/3,F=u.shadowVolume,D=p.st?new Float32Array(2*V):void 0,O=p.normal?new Float32Array(3*V):void 0,S=p.tangent?new Float32Array(3*V):void 0,L=p.bitangent?new Float32Array(3*V):void 0,R=F?new Float32Array(3*V):void 0;let j=0,z=w,k=M,B=E;const Y=new e.GeographicProjection(P),H=Y.project(P.cartesianToCartographic(y,I),T),U=P.scaleToGeodeticSurface(y,f);P.geodeticSurfaceNormal(U,U);let Q=_,W=b;if(0!==v){let t=e.Quaternion.fromAxisAngle(U,v,C);Q=r.Matrix3.fromQuaternion(t,Q),t=e.Quaternion.fromAxisAngle(U,-v,C),W=r.Matrix3.fromQuaternion(t,W)}else Q=r.Matrix3.clone(r.Matrix3.IDENTITY,Q),W=r.Matrix3.clone(r.Matrix3.IDENTITY,W);const J=i.Cartesian2.fromElements(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,G),q=i.Cartesian2.fromElements(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,N);let Z=t.length;const K=c?Z:0,X=K/3*2;for(let e=0;e<Z;e+=3){const i=e+1,n=e+2,o=r.Cartesian3.fromArray(t,e,f);if(p.st){const t=r.Matrix3.multiplyByVector(Q,o,A),e=Y.project(P.cartesianToCartographic(t,I),x);r.Cartesian3.subtract(e,H,e),g.x=(e.x+d)/(2*d),g.y=(e.y+h)/(2*h),J.x=Math.min(g.x,J.x),J.y=Math.min(g.y,J.y),q.x=Math.max(g.x,q.x),q.y=Math.max(g.y,q.y),c&&(D[j+X]=g.x,D[j+1+X]=g.y),D[j++]=g.x,D[j++]=g.y}(p.normal||p.tangent||p.bitangent||F)&&(z=P.geodeticSurfaceNormal(o,z),F&&(R[e+K]=-z.x,R[i+K]=-z.y,R[n+K]=-z.z),(p.normal||p.tangent||p.bitangent)&&((p.tangent||p.bitangent)&&(k=r.Cartesian3.normalize(r.Cartesian3.cross(r.Cartesian3.UNIT_Z,z,k),k),r.Matrix3.multiplyByVector(W,k,k)),p.normal&&(O[e]=z.x,O[i]=z.y,O[n]=z.z,c&&(O[e+K]=-z.x,O[i+K]=-z.y,O[n+K]=-z.z)),p.tangent&&(S[e]=k.x,S[i]=k.y,S[n]=k.z,c&&(S[e+K]=-k.x,S[i+K]=-k.y,S[n+K]=-k.z)),p.bitangent&&(B=r.Cartesian3.normalize(r.Cartesian3.cross(z,k,B),B),L[e]=B.x,L[i]=B.y,L[n]=B.z,c&&(L[e+K]=B.x,L[i+K]=B.y,L[n+K]=B.z))))}if(p.st){Z=D.length;for(let t=0;t<Z;t+=2)D[t]=(D[t]-J.x)/(q.x-J.x),D[t+1]=(D[t+1]-J.y)/(q.y-J.y)}const $=new l.GeometryAttributes;if(p.position){const e=a.EllipseGeometryLibrary.raisePositionsToHeight(t,u,c);$.position=new s.GeometryAttribute({componentDatatype:n.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:e})}if(p.st&&($.st=new s.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:D})),p.normal&&($.normal=new s.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:O})),p.tangent&&($.tangent=new s.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:S})),p.bitangent&&($.bitangent=new s.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:L})),F&&($.extrudeDirection=new s.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:R})),c&&o.defined(u.offsetAttribute)){let t=new Uint8Array(V);if(u.offsetAttribute===m.GeometryOffsetAttribute.TOP)t=t.fill(1,0,V/2);else{const e=u.offsetAttribute===m.GeometryOffsetAttribute.NONE?0:1;t=t.fill(e)}$.applyOffset=new s.GeometryAttribute({componentDatatype:n.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:t})}return $}function v(t){const e=new Array(t*(t+1)*12-6);let i,r,n,o,a,s=0;for(i=0,n=1,o=0;o<3;o++)e[s++]=n++,e[s++]=i,e[s++]=n;for(o=2;o<t+1;++o){for(n=o*(o+1)-1,i=(o-1)*o-1,e[s++]=n++,e[s++]=i,e[s++]=n,r=2*o,a=0;a<r-1;++a)e[s++]=n,e[s++]=i++,e[s++]=i,e[s++]=n++,e[s++]=i,e[s++]=n;e[s++]=n++,e[s++]=i,e[s++]=n}for(r=2*t,++n,++i,o=0;o<r-1;++o)e[s++]=n,e[s++]=i++,e[s++]=i,e[s++]=n++,e[s++]=i,e[s++]=n;for(e[s++]=n,e[s++]=i++,e[s++]=i,e[s++]=n++,e[s++]=i++,e[s++]=i,++i,o=t-1;o>1;--o){for(e[s++]=i++,e[s++]=i,e[s++]=n,r=2*o,a=0;a<r-1;++a)e[s++]=n,e[s++]=i++,e[s++]=i,e[s++]=n++,e[s++]=i,e[s++]=n;e[s++]=i++,e[s++]=i++,e[s++]=n++}for(o=0;o<3;o++)e[s++]=i++,e[s++]=i,e[s++]=n;return e}let V=new r.Cartesian3;const F=new e.BoundingSphere,D=new e.BoundingSphere;function O(t){const y=t.center,d=t.ellipsoid,b=t.semiMajorAxis;let V=r.Cartesian3.multiplyByScalar(d.geodeticSurfaceNormal(y,f),t.height,f);F.center=r.Cartesian3.add(y,V,F.center),F.radius=b,V=r.Cartesian3.multiplyByScalar(d.geodeticSurfaceNormal(y,V),t.extrudedHeight,V),D.center=r.Cartesian3.add(y,V,D.center),D.radius=b;const O=a.EllipseGeometryLibrary.computeEllipsePositions(t,!0,!0),S=O.positions,L=O.numPts,R=O.outerPositions,j=e.BoundingSphere.union(F,D),z=P(S,t,!0);let k=v(L);const B=k.length;k.length=2*B;const Y=S.length/3;for(let t=0;t<B;t+=3)k[t+B]=k[t+2]+Y,k[t+1+B]=k[t+1]+Y,k[t+2+B]=k[t]+Y;const H=p.IndexDatatype.createTypedArray(2*Y/3,k),U=new s.Geometry({attributes:z,indices:H,primitiveType:s.PrimitiveType.TRIANGLES}),Q=function(t,a){const u=a.vertexFormat,c=a.center,p=a.semiMajorAxis,y=a.semiMinorAxis,d=a.ellipsoid,b=a.height,P=a.extrudedHeight,v=a.stRotation,V=t.length/3*2,F=new Float64Array(3*V),D=u.st?new Float32Array(2*V):void 0,O=u.normal?new Float32Array(3*V):void 0,S=u.tangent?new Float32Array(3*V):void 0,L=u.bitangent?new Float32Array(3*V):void 0,R=a.shadowVolume,j=R?new Float32Array(3*V):void 0;let z=0,k=w,B=M,Y=E;const H=new e.GeographicProjection(d),U=H.project(d.cartesianToCartographic(c,I),T),Q=d.scaleToGeodeticSurface(c,f);d.geodeticSurfaceNormal(Q,Q);const W=e.Quaternion.fromAxisAngle(Q,v,C),J=r.Matrix3.fromQuaternion(W,_),q=i.Cartesian2.fromElements(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,G),Z=i.Cartesian2.fromElements(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,N);let K=t.length;const X=K/3*2;for(let e=0;e<K;e+=3){const i=e+1,n=e+2;let o,a=r.Cartesian3.fromArray(t,e,f);if(u.st){const t=r.Matrix3.multiplyByVector(J,a,A),e=H.project(d.cartesianToCartographic(t,I),x);r.Cartesian3.subtract(e,U,e),g.x=(e.x+p)/(2*p),g.y=(e.y+y)/(2*y),q.x=Math.min(g.x,q.x),q.y=Math.min(g.y,q.y),Z.x=Math.max(g.x,Z.x),Z.y=Math.max(g.y,Z.y),D[z+X]=g.x,D[z+1+X]=g.y,D[z++]=g.x,D[z++]=g.y}a=d.scaleToGeodeticSurface(a,a),o=r.Cartesian3.clone(a,A),k=d.geodeticSurfaceNormal(a,k),R&&(j[e+K]=-k.x,j[i+K]=-k.y,j[n+K]=-k.z);let s=r.Cartesian3.multiplyByScalar(k,b,h);if(a=r.Cartesian3.add(a,s,a),s=r.Cartesian3.multiplyByScalar(k,P,s),o=r.Cartesian3.add(o,s,o),u.position&&(F[e+K]=o.x,F[i+K]=o.y,F[n+K]=o.z,F[e]=a.x,F[i]=a.y,F[n]=a.z),u.normal||u.tangent||u.bitangent){Y=r.Cartesian3.clone(k,Y);const s=r.Cartesian3.fromArray(t,(e+3)%K,h);r.Cartesian3.subtract(s,a,s);const l=r.Cartesian3.subtract(o,a,x);k=r.Cartesian3.normalize(r.Cartesian3.cross(l,s,k),k),u.normal&&(O[e]=k.x,O[i]=k.y,O[n]=k.z,O[e+K]=k.x,O[i+K]=k.y,O[n+K]=k.z),u.tangent&&(B=r.Cartesian3.normalize(r.Cartesian3.cross(Y,k,B),B),S[e]=B.x,S[i]=B.y,S[n]=B.z,S[e+K]=B.x,S[e+1+K]=B.y,S[e+2+K]=B.z),u.bitangent&&(L[e]=Y.x,L[i]=Y.y,L[n]=Y.z,L[e+K]=Y.x,L[i+K]=Y.y,L[n+K]=Y.z)}}if(u.st){K=D.length;for(let t=0;t<K;t+=2)D[t]=(D[t]-q.x)/(Z.x-q.x),D[t+1]=(D[t+1]-q.y)/(Z.y-q.y)}const $=new l.GeometryAttributes;if(u.position&&($.position=new s.GeometryAttribute({componentDatatype:n.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:F})),u.st&&($.st=new s.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:D})),u.normal&&($.normal=new s.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:O})),u.tangent&&($.tangent=new s.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:S})),u.bitangent&&($.bitangent=new s.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:L})),R&&($.extrudeDirection=new s.GeometryAttribute({componentDatatype:n.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:j})),o.defined(a.offsetAttribute)){let t=new Uint8Array(V);if(a.offsetAttribute===m.GeometryOffsetAttribute.TOP)t=t.fill(1,0,V/2);else{const e=a.offsetAttribute===m.GeometryOffsetAttribute.NONE?0:1;t=t.fill(e)}$.applyOffset=new s.GeometryAttribute({componentDatatype:n.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:t})}return $}(R,t);k=function(t){const e=t.length/3,i=p.IndexDatatype.createTypedArray(e,6*e);let r=0;for(let t=0;t<e;t++){const n=t,o=t+e,a=(n+1)%e,s=a+e;i[r++]=n,i[r++]=o,i[r++]=a,i[r++]=a,i[r++]=o,i[r++]=s}return i}(R);const W=p.IndexDatatype.createTypedArray(2*R.length/3,k),J=new s.Geometry({attributes:Q,indices:W,primitiveType:s.PrimitiveType.TRIANGLES}),q=c.GeometryPipeline.combineInstances([new u.GeometryInstance({geometry:U}),new u.GeometryInstance({geometry:J})]);return{boundingSphere:j,attributes:q[0].attributes,indices:q[0].indices}}function S(t,e,n,o,s,l,u){const m=a.EllipseGeometryLibrary.computeEllipsePositions({center:t,semiMajorAxis:e,semiMinorAxis:n,rotation:o,granularity:s},!1,!0).outerPositions,c=m.length/3,p=new Array(c);for(let t=0;t<c;++t)p[t]=r.Cartesian3.fromArray(m,3*t);const d=i.Rectangle.fromCartesianArray(p,l,u);return d.width>y.CesiumMath.PI&&(d.north=d.north>0?y.CesiumMath.PI_OVER_TWO-y.CesiumMath.EPSILON7:d.north,d.south=d.south<0?y.CesiumMath.EPSILON7-y.CesiumMath.PI_OVER_TWO:d.south,d.east=y.CesiumMath.PI,d.west=-y.CesiumMath.PI),d}function L(t){const e=(t=o.defaultValue(t,o.defaultValue.EMPTY_OBJECT)).center,i=o.defaultValue(t.ellipsoid,r.Ellipsoid.WGS84),n=t.semiMajorAxis,a=t.semiMinorAxis,s=o.defaultValue(t.granularity,y.CesiumMath.RADIANS_PER_DEGREE),l=o.defaultValue(t.vertexFormat,d.VertexFormat.DEFAULT),u=o.defaultValue(t.height,0),m=o.defaultValue(t.extrudedHeight,u);this._center=r.Cartesian3.clone(e),this._semiMajorAxis=n,this._semiMinorAxis=a,this._ellipsoid=r.Ellipsoid.clone(i),this._rotation=o.defaultValue(t.rotation,0),this._stRotation=o.defaultValue(t.stRotation,0),this._height=Math.max(m,u),this._granularity=s,this._vertexFormat=d.VertexFormat.clone(l),this._extrudedHeight=Math.min(m,u),this._shadowVolume=o.defaultValue(t.shadowVolume,!1),this._workerName="createEllipseGeometry",this._offsetAttribute=t.offsetAttribute,this._rectangle=void 0,this._textureCoordinateRotationPoints=void 0}L.packedLength=r.Cartesian3.packedLength+r.Ellipsoid.packedLength+d.VertexFormat.packedLength+9,L.pack=function(t,e,i){return i=o.defaultValue(i,0),r.Cartesian3.pack(t._center,e,i),i+=r.Cartesian3.packedLength,r.Ellipsoid.pack(t._ellipsoid,e,i),i+=r.Ellipsoid.packedLength,d.VertexFormat.pack(t._vertexFormat,e,i),i+=d.VertexFormat.packedLength,e[i++]=t._semiMajorAxis,e[i++]=t._semiMinorAxis,e[i++]=t._rotation,e[i++]=t._stRotation,e[i++]=t._height,e[i++]=t._granularity,e[i++]=t._extrudedHeight,e[i++]=t._shadowVolume?1:0,e[i]=o.defaultValue(t._offsetAttribute,-1),e};const R=new r.Cartesian3,j=new r.Ellipsoid,z=new d.VertexFormat,k={center:R,ellipsoid:j,vertexFormat:z,semiMajorAxis:void 0,semiMinorAxis:void 0,rotation:void 0,stRotation:void 0,height:void 0,granularity:void 0,extrudedHeight:void 0,shadowVolume:void 0,offsetAttribute:void 0};L.unpack=function(t,e,i){e=o.defaultValue(e,0);const n=r.Cartesian3.unpack(t,e,R);e+=r.Cartesian3.packedLength;const a=r.Ellipsoid.unpack(t,e,j);e+=r.Ellipsoid.packedLength;const s=d.VertexFormat.unpack(t,e,z);e+=d.VertexFormat.packedLength;const l=t[e++],u=t[e++],m=t[e++],c=t[e++],p=t[e++],y=t[e++],f=t[e++],A=1===t[e++],x=t[e];return o.defined(i)?(i._center=r.Cartesian3.clone(n,i._center),i._ellipsoid=r.Ellipsoid.clone(a,i._ellipsoid),i._vertexFormat=d.VertexFormat.clone(s,i._vertexFormat),i._semiMajorAxis=l,i._semiMinorAxis=u,i._rotation=m,i._stRotation=c,i._height=p,i._granularity=y,i._extrudedHeight=f,i._shadowVolume=A,i._offsetAttribute=-1===x?void 0:x,i):(k.height=p,k.extrudedHeight=f,k.granularity=y,k.stRotation=c,k.rotation=m,k.semiMajorAxis=l,k.semiMinorAxis=u,k.shadowVolume=A,k.offsetAttribute=-1===x?void 0:x,new L(k))},L.computeRectangle=function(t,e){const i=(t=o.defaultValue(t,o.defaultValue.EMPTY_OBJECT)).center,n=o.defaultValue(t.ellipsoid,r.Ellipsoid.WGS84),a=t.semiMajorAxis,s=t.semiMinorAxis,l=o.defaultValue(t.granularity,y.CesiumMath.RADIANS_PER_DEGREE);return S(i,a,s,o.defaultValue(t.rotation,0),l,n,e)},L.createGeometry=function(t){if(t._semiMajorAxis<=0||t._semiMinorAxis<=0)return;const i=t._height,l=t._extrudedHeight,u=!y.CesiumMath.equalsEpsilon(i,l,0,y.CesiumMath.EPSILON2);t._center=t._ellipsoid.scaleToGeodeticSurface(t._center,t._center);const c={center:t._center,semiMajorAxis:t._semiMajorAxis,semiMinorAxis:t._semiMinorAxis,ellipsoid:t._ellipsoid,rotation:t._rotation,height:i,granularity:t._granularity,vertexFormat:t._vertexFormat,stRotation:t._stRotation};let d;if(u)c.extrudedHeight=l,c.shadowVolume=t._shadowVolume,c.offsetAttribute=t._offsetAttribute,d=O(c);else if(d=function(t){const i=t.center;V=r.Cartesian3.multiplyByScalar(t.ellipsoid.geodeticSurfaceNormal(i,V),t.height,V),V=r.Cartesian3.add(i,V,V);const n=new e.BoundingSphere(V,t.semiMajorAxis),o=a.EllipseGeometryLibrary.computeEllipsePositions(t,!0,!1),s=o.positions,l=o.numPts,u=P(s,t,!1);let m=v(l);return m=p.IndexDatatype.createTypedArray(s.length/3,m),{boundingSphere:n,attributes:u,indices:m}}(c),o.defined(t._offsetAttribute)){const e=d.attributes.position.values.length,i=t._offsetAttribute===m.GeometryOffsetAttribute.NONE?0:1,r=new Uint8Array(e/3).fill(i);d.attributes.applyOffset=new s.GeometryAttribute({componentDatatype:n.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:r})}return new s.Geometry({attributes:d.attributes,indices:d.indices,primitiveType:s.PrimitiveType.TRIANGLES,boundingSphere:d.boundingSphere,offsetAttribute:t._offsetAttribute})},L.createShadowVolume=function(t,e,i){const r=t._granularity,n=t._ellipsoid,o=e(r,n),a=i(r,n);return new L({center:t._center,semiMajorAxis:t._semiMajorAxis,semiMinorAxis:t._semiMinorAxis,ellipsoid:n,rotation:t._rotation,stRotation:t._stRotation,granularity:r,extrudedHeight:o,height:a,vertexFormat:d.VertexFormat.POSITION_ONLY,shadowVolume:!0})},Object.defineProperties(L.prototype,{rectangle:{get:function(){return o.defined(this._rectangle)||(this._rectangle=S(this._center,this._semiMajorAxis,this._semiMinorAxis,this._rotation,this._granularity,this._ellipsoid)),this._rectangle}},textureCoordinateRotationPoints:{get:function(){return o.defined(this._textureCoordinateRotationPoints)||(this._textureCoordinateRotationPoints=function(t){const e=-t._stRotation;if(0===e)return[0,0,0,1,1,0];const i=a.EllipseGeometryLibrary.computeEllipsePositions({center:t._center,semiMajorAxis:t._semiMajorAxis,semiMinorAxis:t._semiMinorAxis,rotation:t._rotation,granularity:t._granularity},!1,!0).outerPositions,n=i.length/3,o=new Array(n);for(let t=0;t<n;++t)o[t]=r.Cartesian3.fromArray(i,3*t);const l=t._ellipsoid,u=t.rectangle;return s.Geometry._textureCoordinateRotationPoints(o,e,l,u)}(this)),this._textureCoordinateRotationPoints}}}),t.EllipseGeometry=L}));
