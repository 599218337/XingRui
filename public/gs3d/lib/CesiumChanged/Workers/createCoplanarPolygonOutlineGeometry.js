define(["./arrayRemoveDuplicates-0d8dde26","./Transforms-c34ae887","./Matrix3-b2351961","./ComponentDatatype-ab629b88","./CoplanarPolygonGeometryLibrary-1d9eb451","./defaultValue-f6d5e6da","./GeometryAttribute-d91450b3","./GeometryAttributes-1e4ddcd2","./GeometryInstance-c4920693","./GeometryPipeline-051fbe67","./IndexDatatype-a9b1bc18","./PolygonGeometryLibrary-9ec222f5","./Math-355606c6","./Matrix2-7a8e9daf","./RuntimeError-9b4ce3fb","./combine-0c102d93","./WebGLConstants-7f557f93","./OrientedBoundingBox-081f0b5f","./EllipsoidTangentPlane-0ef8532b","./AxisAlignedBoundingBox-12474ce0","./IntersectionTests-4dc8e906","./Plane-5931b53e","./AttributeCompression-0b8f7b7d","./EncodedCartesian3-abad5e8c","./ArcType-26a3f38d","./EllipsoidRhumbLine-1289f7e8","./PolygonPipeline-d058aecf"],(function(e,t,n,o,r,i,a,y,l,s,c,u,p,m,d,g,h,f,P,b,G,L,C,T,A,E,x){"use strict";function H(e){const t=e.length,n=new Float64Array(3*t),r=c.IndexDatatype.createTypedArray(t,2*t);let i=0,l=0;for(let o=0;o<t;o++){const a=e[o];n[i++]=a.x,n[i++]=a.y,n[i++]=a.z,r[l++]=o,r[l++]=(o+1)%t}const s=new y.GeometryAttributes({position:new a.GeometryAttribute({componentDatatype:o.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:n})});return new a.Geometry({attributes:s,indices:r,primitiveType:a.PrimitiveType.LINES})}function k(e){const t=(e=i.defaultValue(e,i.defaultValue.EMPTY_OBJECT)).polygonHierarchy;this._polygonHierarchy=t,this._workerName="createCoplanarPolygonOutlineGeometry",this.packedLength=u.PolygonGeometryLibrary.computeHierarchyPackedLength(t,n.Cartesian3)+1}k.fromPositions=function(e){return new k({polygonHierarchy:{positions:(e=i.defaultValue(e,i.defaultValue.EMPTY_OBJECT)).positions}})},k.pack=function(e,t,o){return o=i.defaultValue(o,0),t[o=u.PolygonGeometryLibrary.packPolygonHierarchy(e._polygonHierarchy,t,o,n.Cartesian3)]=e.packedLength,t};const w={polygonHierarchy:{}};return k.unpack=function(e,t,o){t=i.defaultValue(t,0);const r=u.PolygonGeometryLibrary.unpackPolygonHierarchy(e,t,n.Cartesian3);t=r.startingIndex,delete r.startingIndex;const a=e[t];return i.defined(o)||(o=new k(w)),o._polygonHierarchy=r,o.packedLength=a,o},k.createGeometry=function(o){const i=o._polygonHierarchy;let y=i.positions;if(y=e.arrayRemoveDuplicates(y,n.Cartesian3.equalsEpsilon,!0),y.length<3)return;if(!r.CoplanarPolygonGeometryLibrary.validOutline(y))return;const c=u.PolygonGeometryLibrary.polygonOutlinesFromHierarchy(i,!1);if(0===c.length)return;const p=[];for(let e=0;e<c.length;e++){const t=new l.GeometryInstance({geometry:H(c[e])});p.push(t)}const m=s.GeometryPipeline.combineInstances(p)[0],d=t.BoundingSphere.fromPoints(i.positions);return new a.Geometry({attributes:m.attributes,indices:m.indices,primitiveType:m.primitiveType,boundingSphere:d})},function(e,t){return i.defined(t)&&(e=k.unpack(e,t)),e._ellipsoid=n.Ellipsoid.clone(e._ellipsoid),k.createGeometry(e)}}));
