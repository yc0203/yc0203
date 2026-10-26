/* Original beagle model, built from editable geometry. No cat mesh or image. */
window.createChengBeagle = function (T) {
  const group = new T.YJl(), head = new T.YJl(), tail = new T.YJl();
  const white = 0xfff7e9, tan = 0xc58b4f, brown = 0x85502e, saddle = 0x383c45;
  const plane = new T.bdM(1, 1);
  const Geometry = Object.getPrototypeOf(Object.getPrototypeOf(plane)).constructor;
  const Attribute = plane.attributes.position.constructor;
  plane.dispose();
  function ellipsoid(parent, color, position, scale, rotation = 0) {
    const geometry = new Geometry(), vertices = [], colors = [], indices = [];
    const base = new T.Q1f(color), rows = 18, cols = 28;
    for (let row = 0; row <= rows; row++) {
      const phi = row / rows * Math.PI;
      for (let col = 0; col <= cols; col++) {
        const theta = col / cols * Math.PI * 2;
        const x = Math.sin(phi) * Math.cos(theta), y = Math.cos(phi), z = Math.sin(phi) * Math.sin(theta);
        vertices.push(x, y, z);
        const light = .67 + .33 * Math.max(0, -.4 * x + .65 * y + .65 * z);
        colors.push(base.r * light, base.g * light, base.b * light);
        if (row < rows && col < cols) {
          const a = row * (cols + 1) + col, b = a + cols + 1;
          indices.push(a, a + 1, b, b, a + 1, b + 1);
        }
      }
    }
    geometry.setAttribute('position', new Attribute(vertices, 3));
    geometry.setAttribute('color', new Attribute(colors, 3)); geometry.setIndex(indices); geometry.computeVertexNormals();
    const mesh = new T.eaF(geometry, new T.V9B({color: 0xffffff, vertexColors: true}));
    mesh.position.set(...position); mesh.scale.set(...scale); mesh.rotation.z = rotation; parent.add(mesh); return mesh;
  }
  const body = ellipsoid(group, white, [0,-.40,0], [.47,.65,.37]);
  ellipsoid(group, saddle, [0,-.29,-.20], [.43,.46,.25]);
  ellipsoid(group, saddle, [-.32,-.28,.04], [.17,.38,.26]);
  ellipsoid(group, saddle, [.32,-.28,.04], [.17,.38,.26]);
  ellipsoid(group, white, [0,-.38,.25], [.32,.49,.17]);
  ellipsoid(group, tan, [-.41,-.78,-.02], [.24,.25,.30]);
  ellipsoid(group, tan, [.41,-.78,-.02], [.24,.25,.30]);
  ellipsoid(group, white, [-.25,-.91,.28], [.18,.24,.31]);
  ellipsoid(group, white, [.25,-.91,.28], [.18,.24,.31]);
  ellipsoid(group, 0x8f6bc9, [0,.04,.07], [.43,.09,.35]);
  ellipsoid(group, 0xe6b756, [0,-.05,.41], [.08,.09,.035]);
  group.add(head); head.position.set(0,.64,.05);
  ellipsoid(head, tan, [0,0,0], [.58,.58,.46]);
  ellipsoid(head, brown, [-.58,-.18,.015], [.23,.59,.17], -.17);
  ellipsoid(head, brown, [.58,-.18,.015], [.23,.59,.17], .17);
  ellipsoid(head, 0xa5683f, [-.57,-.17,.13], [.15,.47,.07], -.17);
  ellipsoid(head, 0xa5683f, [.57,-.17,.13], [.15,.47,.07], .17);
  ellipsoid(head, white, [0,.18,.385], [.13,.37,.105]);
  ellipsoid(head, white, [-.135,-.20,.40], [.26,.22,.26]);
  ellipsoid(head, white, [.135,-.20,.40], [.26,.22,.26]);
  ellipsoid(head, 0x27282c, [0,-.105,.643], [.14,.095,.075]);
  ellipsoid(head, 0x4e3024, [-.245,.14,.415], [.105,.13,.065]);
  ellipsoid(head, 0x4e3024, [.245,.14,.415], [.105,.13,.065]);
  ellipsoid(head, 0x111c29, [-.242,.14,.463], [.064,.082,.025]);
  ellipsoid(head, 0x111c29, [.242,.14,.463], [.064,.082,.025]);
  ellipsoid(head, 0xffffff, [-.263,.17,.483], [.023,.028,.012]);
  ellipsoid(head, 0xffffff, [.223,.17,.483], [.023,.028,.012]);
  ellipsoid(head, 0xb9586a, [0,-.37,.517], [.085,.11,.045]);
  group.add(tail); tail.position.set(.40,-.55,-.19);
  ellipsoid(tail, tan, [.18,.22,0], [.10,.35,.10], -.45);
  ellipsoid(tail, white, [.31,.48,0], [.095,.15,.095], -.45);
  group.name = 'ChengBeagle'; head.name = 'BeagleHead';
  return {
    group, monaHeadGroup: head,
    create() {},
    updateMouseInteraction(point) {
      head.rotation.y = point.x * 1.1; head.rotation.x = -point.y * .38;
      tail.rotation.z = Math.sin(performance.now() / 170) * .18;
      body.scale.y = .65 * (1 + Math.sin(performance.now() / 850) * .015);
    }
  };
};
