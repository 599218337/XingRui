define(["./Matrix3-b2351961","./defaultValue-f6d5e6da","./EllipseOutlineGeometry-d92fc742","./Math-355606c6","./Transforms-c34ae887","./Matrix2-7a8e9daf","./RuntimeError-9b4ce3fb","./combine-0c102d93","./ComponentDatatype-ab629b88","./WebGLConstants-7f557f93","./EllipseGeometryLibrary-bfcb9f21","./GeometryAttribute-d91450b3","./GeometryAttributes-1e4ddcd2","./GeometryOffsetAttribute-2579b8d2","./IndexDatatype-a9b1bc18"],(function(e,t,r,i,n,l,o,a,s,u,m,c,p,y,G){"use strict";return function(i,n){return t.defined(n)&&(i=r.EllipseOutlineGeometry.unpack(i,n)),i._center=e.Cartesian3.clone(i._center),i._ellipsoid=e.Ellipsoid.clone(i._ellipsoid),r.EllipseOutlineGeometry.createGeometry(i)}}));
