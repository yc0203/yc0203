# Super Mona 来源与适配

按用户要求，从 GitHub Universe 2026 实际加载的公开前端模块中提取游戏部分，用于本地博客适配。下载与打包日期：2026-10-26。保留原模块中的依赖版权/许可注释；本文件记录来源，不代表原站授予额外许可。

原站：[GitHub Universe](https://githubuniverse.com/)。

## 模块

| 模块 ID | 原公开文件 | 用途 |
| --- | --- | --- |
| 4947 | `/_next/static/chunks/4492.a5d7e975fa5128d7.js` | Super Mona 游戏、渲染场景、角色、敌人、声音 |
| 2277 | 同上 | 调色板、网格与布局配置 |
| 6691 | `/_next/static/chunks/4559568c.22b0154cad238fea.js` | Three.js 场景与数学依赖 |
| 4796 | `/_next/static/chunks/69b51223.86fbd3f39fce92eb.js` | WebGL 渲染依赖 |
| 733、2159 | `/_next/static/chunks/733.ec935e063b76a7d8.js` | GLTF 模型加载依赖 |
| 6941 | `/_next/static/chunks/7265-622230508a1a08f4.js` | 动画模块 |
| 1705 | `/_next/static/chunks/281c3f4d-a48956c4df97e51c.js` | 动画依赖 |

这些路径的完整来源域名均为 `https://githubuniverse.com`。原始下载副本位于本项目 `.preview/universe-code/`。

## 提取改动

- 从 webpack 工厂中保留游戏类和所需依赖，移除原站 React/Next 首页组件部分。
- 通过很小的私有模块加载器暴露 `ChengSuperMona.Engine`、`audio`、`animations`。
- 原场景类内部名称仍保留在打包文件中，便于与原始模块比对。
- 移除原版构造器的全页键盘注册；本地适配器转发画布和触屏输入。
- 把模型、精灵图集和拾取物路径改成本地 `/yc0203/vendor/super-mona/assets/`。
- 未改写游戏的怪兽、平台生成、跳跃、碰撞、拾取、强化和游戏结束逻辑。

## 资源

`assets/` 保留原站的 UniverseBug、DuckGame 和 5 个 ContributionIcon 图集。原黑猫的 Mona GLB 与 UniverseGameSet 图集已删除。

2026-10-26：使用独立创作的 `beagle-model.js` 几何模型与 `assets/beagle-sprites.svg` 动画图集替换角色，包含首页、游戏、强化残影与结束画面。角色制作采用可编辑代码与 SVG，未使用原黑猫的模型轮廓或像素图。

游戏 UI、背景颜色、响应式布局、开始/暂停/退出/重玩、记分板文字和静音偏好由 `source/js/universe.js` 与 `source/css/custom.css` 管理。
