import * as Cesium from 'cesium';
export default class isCesium {
	// 地图实体实例
	viewer: Cesium.Viewer;

	constructor(
		container: HTMLElement | string,
		options: Cesium.Viewer.ConstructorOptions = {
			animation: true, // 控制场景动画的播放速度控件 左下角小控件
			baseLayerPicker: true, // 底图切换控件
			fullscreenButton: false, // 全屏控件
			geocoder: false, // 地理位置查询定位控件
			homeButton: true, // 默认相机位置控件
			timeline: true, // 时间滚动条控件
			sceneModePicker: true, //是否显示3D/2D选择器
			sceneMode: Cesium.SceneMode.SCENE3D, //设定3维地图的默认场景模式:Cesium.SceneMode.SCENE2D、Cesium.SceneMode.SCENE3D、Cesium.SceneMode.MORPHING
			navigationHelpButton: false, // 默认的相机控制提示控件  右上角提示信息
			// terrainProvider: Cesium.createWorldTerrain(), //初始化加载高程数据
			// selectionIndicator: true, //是否显示选取指示器组件
			// vrButton: true, // VR模式
			// scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存  开启后不能3D和2D切换
			// baselLayerPicker: false // 将图层选择的控件关掉，才能添加其他影像数据
			infoBox: false, //是否显示信息框
			// navigationInstructionsInitiallyVisible: true,
			// showRenderLoopErrors: false, //是否显示渲染错误
			orderIndependentTranslucency: true, //设置背景透明
		}
	) {
		// 修改相机初始化默认范围
		Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(100, 36, 110, 34);
		this.viewer = new Cesium.Viewer(container, options);
		this.resetDefault();
	}

	/**
	 * 修改默认配置 重写方法
	 * https://zhuanlan.zhihu.com/p/350724716
	 * https://github.com/ls870061011/cesium_training/blob/main/examples/3_1_3baseLayerPicker.html
	 */
	resetDefault() {
		// 显示帧率
		this.viewer.scene.debugShowFramesPerSecond = true;
		// 开启地形深度检测
		this.viewer.scene.globe.depthTestAgainstTerrain = true;
		//取消双击追踪事件
		// this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
		//左键点击 默认会选中point点需要禁止这个事件
		// this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

		/* 默认相机位置 配合homeButton使用 */
		this.viewer?.homeButton?.viewModel?.command?.beforeExecute?.addEventListener((e: any) => {
			e.cancel = true;
			// 飞到中国
			this.viewer.camera.flyTo({
				destination: Cesium.Cartesian3.fromDegrees(110, 32, 6000000),
			});
		});

		/* 自定义影像图层 */
		const gaodeVM = new Cesium.ProviderViewModel({
			category: '自定义分类',
			name: `高德矢量`,
			iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
			tooltip: '高德矢量 地图服务',
			creationFunction: () => {
				return new Cesium.UrlTemplateImageryProvider({
					url: 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
					subdomains: ['1', '2', '3', '4'],
				});
			},
		});
		this.viewer.baseLayerPicker.viewModel.imageryProviderViewModels.unshift(gaodeVM);

		/* 自定义地形图层 */
		const arcgisVM = new Cesium.ProviderViewModel({
			category: 'Cesium ion',
			name: 'ArcGIS地形',
			iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/Ellipsoid.png'),
			tooltip: 'ArcGIS地形服务',
			creationFunction: function () {
				return new Cesium.ArcGISTiledElevationTerrainProvider({
					url: 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
					token: 'KED1aF_申请的token..',
				});
			},
		});
		this.viewer.baseLayerPicker.viewModel.terrainProviderViewModels.push(arcgisVM);

		/* 键盘事件监听 */
		document.addEventListener('keydown', (e) => {
			if (e.code === 'KeyF') {
				// 显示帧率控制
				this.viewer.scene.debugShowFramesPerSecond = !this.viewer.scene.debugShowFramesPerSecond;
			}
		});
	}
}