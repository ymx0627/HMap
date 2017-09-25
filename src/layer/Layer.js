import { ol } from '../constants'
import mixin from '../utils/mixins'
import * as MapboxStyle from '../style/MapboxStyle'
import Style from '../style/Style'
import './source/GaoDe'
import './source/BaiDu'
import './source/Google'

class Layer extends mixin(Style) {
  constructor () {
    super()
    this.desc = ''
  }

  /**
   * 通过layerName获取图层
   * @param layerName
   * @returns {*}
   */
  getLayerByLayerName (layerName) {
    try {
      let targetLayer = null
      if (this.map) {
        let layers = this.map.getLayers().getArray()
        layers.every(layer => {
          if (layer.get('layerName') === layerName) {
            targetLayer = layer
            return false
          } else {
            return true
          }
        })
      }
      return targetLayer
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 通过layerName获取专题图层
   * @param layerName
   * @returns {*}
   */
  getTitleLayerByLayerName (layerName) {
    try {
      let targetLayer = null
      if (this.map) {
        let layers = this.map.getLayers().getArray()
        layers.every(layer => {
          if (layer.get('layerType') === 'title' && layer.get('layerName') === layerName) {
            targetLayer = layer
            return false
          } else {
            return true
          }
        })
      }
      return targetLayer
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 根据图层名获取底图
   * @param layerName
   * @returns {*}
   */
  getBaseLayerByLayerName (layerName) {
    try {
      let currentLayer = null
      this.map.getLayers().getArray().forEach(layer => {
        if (layer && layer instanceof ol.layer.Group && layer.get('isBaseLayer')) {
          layer.getLayers().getArray().forEach(_layer => {
            if (_layer && _layer instanceof ol.layer.Tile && _layer.get('isBaseLayer') && _layer.get('layerName') === layerName) {
              currentLayer = _layer
            }
          })
        }
      })
      return currentLayer
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 获取底图图层组
   * @returns {*}
   */
  getBaseLayers () {
    try {
      let currentLayer = null
      this.map.getLayers().getArray().forEach(layer => {
        if (layer && layer instanceof ol.layer.Group && layer.get('isBaseLayer')) {
          currentLayer = layer
        }
      })
      return currentLayer
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 通过要素获取图层
   * @param feature
   * @returns {*}
   */
  getLayerByFeatuer (feature) {
    let tragetLayer = null
    if (this.map) {
      if (feature instanceof ol.Feature) {
        let layers = this.map.getLayers().getArray()
        layers.every(layer => {
          if (layer && layer instanceof ol.layer.Vector && layer.getSource) {
            let source = layer.getSource()
            if (source.getFeatures) {
              let features = source.getFeatures()
              features.every(feat => {
                if (feat === feature) {
                  tragetLayer = layer
                  return false
                } else {
                  return true
                }
              })
            }
            if (tragetLayer) {
              return false
            } else {
              return true
            }
          } else {
            return true
          }
        })
      } else {
        throw new Error('传入的不是要素!')
      }
    }
    return tragetLayer
  }

  /**
   * 创建临时图层
   * @param layerName
   * @param params
   * @returns {*}
   */
  createVectorLayer (layerName, params) {
    try {
      if (this.map) {
        let vectorLayer = this.getLayerByLayerName(layerName)
        if (!(vectorLayer instanceof ol.layer.Vector)) {
          vectorLayer = null
        }
        if (!vectorLayer) {
          if (params && params.create) {
            vectorLayer = new ol.layer.Vector({
              layerName: layerName,
              params: params,
              layerType: 'vector',
              source: new ol.source.Vector({
                wrapX: false
              }),
              style: new ol.style.Style({
                fill: new ol.style.Fill({
                  color: 'rgba(67, 110, 238, 0.4)'
                }),
                stroke: new ol.style.Stroke({
                  color: '#4781d9',
                  width: 2
                }),
                image: new ol.style.Circle({
                  radius: 7,
                  fill: new ol.style.Fill({
                    color: '#ffcc33'
                  })
                })
              })
            })
          }
        }
        if (this.map && vectorLayer) {
          if (params && params.hasOwnProperty('selectable')) {
            vectorLayer.set('selectable', params.selectable)
          }
          // 图层只添加一次
          let _vectorLayer = this.getLayerByLayerName(layerName)
          if (!_vectorLayer || !(_vectorLayer instanceof ol.layer.Vector)) {
            this.map.addLayer(vectorLayer)
          }
        }
        return vectorLayer
      }
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 添加聚合图层
   * @param layerName
   * @param params
   * @returns {*}
   */
  creatClusterLayer (layerName, params) {
    try {
      if (this.map) {
        let vectorLayer = this.getLayerByLayerName(layerName)
        if (!(vectorLayer instanceof ol.layer.Vector)) {
          vectorLayer = null
        }
        if (!vectorLayer) {
          if (params && params.create) {
            vectorLayer = new ol.layer.Vector({
              layerName: layerName,
              params: params,
              layerType: 'vector',
              source: new ol.source.Cluster({
                distance: (typeof params['distance'] === 'number' ? params['distance'] : 20),
                source: new ol.source.Vector(),
                wrapX: false
              }),
              style: new ol.style.Style({
                fill: new ol.style.Fill({
                  color: 'rgba(67, 110, 238, 0.4)'
                }),
                stroke: new ol.style.Stroke({
                  color: '#4781d9',
                  width: 2
                }),
                image: new ol.style.Circle({
                  radius: 7,
                  fill: new ol.style.Fill({
                    color: '#ffcc33'
                  })
                })
              })
            })
          }
        }
        if (this.map && vectorLayer) {
          if (params && params.hasOwnProperty('selectable')) {
            vectorLayer.set('selectable', params.selectable)
          }
          // 图层只添加一次
          let _vectorLayer = this.getLayerByLayerName(layerName)
          if (!_vectorLayer || !(_vectorLayer instanceof ol.layer.Vector)) {
            this.map.addLayer(vectorLayer)
          }
        }
        return vectorLayer
      }
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 创建热力图图层
   * @param layerName
   * @param params
   * @returns {string}
   */
  createHeatMapLayer (layerName, params) {
    try {
      let currentLayer = null
      if (this.map) {
        currentLayer = this.getLayerByLayerName(layerName)
        if (!(currentLayer instanceof ol.layer.Heatmap)) {
          currentLayer = null
        } else if ((currentLayer instanceof ol.layer.Heatmap) && !(params['addLayer'] === false)) {
          this.map.removeLayer(currentLayer)
          currentLayer = null
        }
        if (!currentLayer && params && params['create']) {
          currentLayer = new ol.layer.Heatmap({
            layerName: layerName,
            gradient: (params['gradient'] ? params['gradient'] : ['#00f', '#0ff', '#0f0', '#ff0', '#f00']),
            source: new ol.source.Vector({
              wrapX: false,
              crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined)
            }),
            blur: (params['blur'] ? params['blur'] : 15),
            radius: (params['radius'] ? params['radius'] : 8),
            shadow: (params['shadow'] ? params['shadow'] : 250),
            weight: (params['weight'] ? params['weight'] : 'weight'),
            extent: (params['extent'] ? params['extent'] : undefined),
            minResolution: (params['minResolution'] ? params['minResolution'] : undefined),
            maxResolution: (params['maxResolution'] ? params['maxResolution'] : undefined),
            opacity: (params['opacity'] ? params['opacity'] : 1),
            visible: ((params['visible'] === false) ? params['visible'] : true)
          })
          if (params && params.hasOwnProperty('selectable')) {
            currentLayer.set('selectable', params.selectable)
          }
        }
        if (currentLayer && !(params['addLayer'] === false)) {
          this.map.addLayer(currentLayer)
        }
        return currentLayer
      } else {
        throw new Error('未创建地图对象！')
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 创建专题图层
   * @param layerName
   * @param params
   * @returns {*}
   */
  createTitleLayer (layerName, params) {
    try {
      let serviceUrl = params['layerUrl']
      if (!serviceUrl) return null
      let ooLayer = this.getTitleLayerByLayerName(layerName)
      if (ooLayer && ooLayer instanceof ol.layer.Tile && !(params['addLayer'] === false)) {
        this.map.removeLayer(ooLayer)
        ooLayer = null
      }
      if (!ooLayer && params['create']) {
        ooLayer = new ol.layer.Tile({
          layerName: layerName,
          layerType: ((params['notShowLayerType'] === true) ? '' : 'title'),
          visible: (params['visible'] === false) ? params['visible'] : true,
          source: new ol.source.TileArcGISRest({
            url: serviceUrl,
            crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined),
            params: (params['layerParams'] ? params['layerParams'] : undefined),
            wrapX: false
          }),
          wrapX: false
        })
      }
      if (this.map && ooLayer && !(params['addLayer'] === false)) {
        this.map.addLayer(ooLayer)
      }
      return ooLayer
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 创建ImageWMSLayer
   * @param layerName
   * @param params
   * @returns {string}
   */
  createImageWMSLayer (layerName, params) {
    try {
      let layer = this.getLayerByLayerName(layerName)
      if (!(layer instanceof ol.layer.Image)) {
        layer = null
      } else if ((layer instanceof ol.layer.Image) && !(params['addLayer'] === false)) {
        this.map.removeLayer(layer)
        layer = null
      }
      if (!layer && params && params['layerUrl'] && params['create']) {
        layer = new ol.layer.Image({
          layerName: layerName,
          visible: (params['visible'] === false) ? params['visible'] : true,
          opacity: (params['opacity'] && (typeof params['opacity'] === 'number')) ? params['opacity'] : 1,
          source: new ol.source.ImageWMS({
            url: params['layerUrl'],
            crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined),
            params: {
              LAYERS: params['layers'], // require
              STYLES: params['style'] ? params['style'] : '',
              VERSION: params['version'] ? params['version'] : '1.3.0',
              WIDTH: params['width'] ? params['width'] : 256,
              HEIGHT: params['height'] ? params['height'] : 256,
              BBOX: params['bbox'], // require
              SRS: (params['srs'] ? params['srs'] : 'EPSG:3857'),
              CRS: (params['srs'] ? params['srs'] : 'EPSG:3857'),
              REQUEST: 'GetMap',
              TRANSPARENT: true,
              TILED: (params['tiled'] === false) ? params['tiled'] : true,
              TILESORIGIN: (params['tiledsorrigin'] ? params['tiledsorrigin'] : undefined),
              SERVICE: 'WMS',
              FORMAT: (params['format'] ? params['format'] : 'image/png'),
              VIEWPARAMS: (params['viewparams'] ? params['viewparams'] : '')
            },
            wrapX: false
          })
        })
      }
      if (this.map && layer && !(params['addLayer'] === false)) {
        this.map.addLayer(layer)
      }
      return layer
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 创建TileWMSLayer
   * @param layerName
   * @param params
   * @returns {string}
   */
  createTileWMSLayer (layerName, params) {
    try {
      let layer = this.getLayerByLayerName(layerName)
      if (!(layer instanceof ol.layer.Image)) {
        layer = null
      } else if ((layer instanceof ol.layer.Tile) && !(params['addLayer'] === false)) {
        this.map.removeLayer(layer)
        layer = null
      }
      if (!layer && params && params['layerUrl'] && params['create']) {
        layer = new ol.layer.Tile({
          layerName: layerName,
          visible: (params['visible'] === false) ? params['visible'] : true,
          opacity: (params['opacity'] && (typeof params['opacity'] === 'number')) ? params['opacity'] : 1,
          source: new ol.source.TileWMS({
            url: params['layerUrl'],
            crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined),
            params: {
              LAYERS: params['layers'], // require
              STYLES: params['style'] ? params['style'] : '',
              VERSION: params['version'] ? params['version'] : '1.3.0',
              WIDTH: params['width'] ? params['width'] : 256,
              HEIGHT: params['height'] ? params['height'] : 256,
              BBOX: params['bbox'], // require
              SRS: (params['srs'] ? params['srs'] : 'EPSG:3857'),
              CRS: (params['srs'] ? params['srs'] : 'EPSG:3857'),
              REQUEST: 'GetMap',
              TRANSPARENT: true,
              TILED: ((params['tiled'] === false) ? params['tiled'] : true),
              TILESORIGIN: (params['tiledsorrigin'] ? params['tiledsorrigin'] : undefined),
              SERVICE: 'WMS',
              FORMAT: (params['format'] ? params['format'] : 'image/png'),
              VIEWPARAMS: (params['viewparams'] ? params['viewparams'] : '')
            },
            wrapX: false
          })
        })
      }
      if (this.map && layer && !(params['addLayer'] === false)) {
        this.map.addLayer(layer)
      }
      return layer
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 创建WFS图层
   * @param layerName
   * @param params
   * @returns {*}
   */
  createWfsVectorLayer (layerName, params) {
    try {
      let vectorLayer = this.getLayerByLayerName(layerName)
      if (!(vectorLayer instanceof ol.layer.Vector)) {
        vectorLayer = null
      }
      if (!vectorLayer) {
        let proj = params['projection'] ? params['projection'] : 'EPSG:3857'
        let style = this.getStyleByParams(params['style'])
        vectorLayer = new ol.layer.Vector({
          layerName: layerName,
          params: params,
          layerType: 'vector',
          visible: (params['visible'] === false) ? params['visible'] : true,
          opacity: ((params['opacity'] && (typeof params['opacity'] === 'number')) ? params['opacity'] : 1),
          source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined),
            url: function (extent) {
              return params['layerUrl'] + extent.join(',') + ',' + proj
            },
            wrapX: false,
            strategy: ol.loadingstrategy.bbox
          }),
          style: style
        })
      }
      if (this.map && vectorLayer) {
        if (params && params.hasOwnProperty('selectable')) {
          vectorLayer.set('selectable', params.selectable)
        }
        // 图层只添加一次
        let _vectorLayer = this.getLayerByLayerName(layerName)
        if (!_vectorLayer || !(_vectorLayer instanceof ol.layer.Vector)) {
          if (!(params['addLayer'] === false)) {
            this.map.addLayer(vectorLayer)
          }
        }
      }
      return vectorLayer
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 创建矢量要素图层
   * @param layerName
   * @param params
   * @returns {*}
   */
  createVectorFeatureLayer (layerName, params) {
    try {
      let layer = this.getLayerByLayerName(layerName)
      if (!(layer instanceof ol.layer.Vector)) {
        layer = null
      } else if (this.map && (layer instanceof ol.layer.Vector) && !(params['addLayer'] === false)) {
        this.map.removeLayer(layer)
        layer = null
      }
      if (!layer && params && params['layerUrl'] && params['create']) {
        let style = this.getStyleByParams(params['style'])
        layer = new ol.layer.Vector({
          layerName: layerName,
          params: params,
          layerType: 'vector',
          visible: (params['visible'] === false) ? params['visible'] : true,
          opacity: ((params['opacity'] && (typeof params['opacity'] === 'number')) ? params['opacity'] : 1),
          source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined),
            url: params['layerUrl'],
            wrapX: false,
            strategy: ol.loadingstrategy.bbox
          }),
          style: style
        })
      }
      if (this.map && layer && !(params['addLayer'] === false)) {
        this.map.addLayer(layer)
      }
      return layer
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 创建WMTS图层
   * @param layerName
   * @param params
   * @returns {*}
   */
  createWMTSLayer (layerName, params) {
    try {
      let layer = this.getLayerByLayerName(layerName)
      if (!(layer instanceof ol.layer.Tile)) {
        layer = null
      } else if (this.map && (layer instanceof ol.layer.Tile) && !(params['addLayer'] === false)) {
        this.map.removeLayer(layer)
        layer = null
      }
      if (!layer && params && params['layerUrl'] && params['create'] && params['levels']) {
        let projection = ol.proj.get((params['projection'] ? params['projection'] : 'EPSG:3857'))
        let projectionExtent = (params['extent'] ? params['extent'] : projection.getExtent())
        let size = ol.extent.getWidth(projectionExtent) / 256
        let levels = params['levels']
        let resolutions = new Array(levels)
        let matrixIds = new Array(levels)
        for (let z = 0; z < levels; ++z) {
          // generate resolutions and matrixIds arrays for this WMTS
          resolutions[z] = size / Math.pow(2, z)
          matrixIds[z] = z
        }
        layer = new ol.layer.Tile({
          layerName: layerName,
          visible: (params['visible'] === false) ? params['visible'] : true,
          opacity: ((params['opacity'] && (typeof params['opacity'] === 'number')) ? params['opacity'] : 1),
          source: new ol.source.WMTS({
            url: params['layerUrl'],
            layer: (params['layer'] ? params['layer'] : '0'),
            matrixSet: (params['matrixSet'] ? params['matrixSet'] : 'EPSG:3857'),
            format: (params['format'] ? params['format'] : 'image/png'),
            crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined),
            projection: projection,
            tileGrid: new ol.tilegrid.WMTS({
              origin: ol.extent.getTopLeft(projectionExtent),
              resolutions: resolutions,
              matrixIds: matrixIds,
              version: (params['version'] ? params['version'] : '1.0.0'),
              dimensions: (params['dimensions'] ? params['dimensions'] : undefined)
            }),
            style: (params['style'] ? params['style'] : 'default'),
            wrapX: false
          })
        })
      } else {
        throw new Error('传入参数不正确！')
      }
      if (this.map && layer && !(params['addLayer'] === false)) {
        this.map.addLayer(layer)
      }
      return layer
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 创建XYZ图层
   * @param layerName
   * @param params
   * @returns {*}
   */
  createXYZLayer (layerName, params) {
    try {
      let layer = this.getLayerByLayerName(layerName)
      if (!(layer instanceof ol.layer.Tile)) {
        layer = null
      } else if (this.map && (layer instanceof ol.layer.Tile) && !(params['addLayer'] === false)) {
        this.map.removeLayer(layer)
        layer = null
      }
      if (!layer && params && params['layerUrl'] && params['create']) {
        let tileGrid = null
        let tileSize = 256
        if (params['tileSize'] && typeof params['tileSize'] === 'number') {
          tileSize = params['tileSize']
        } else if (params['tileGrid'] && params['tileGrid']['tileSize'] && typeof params['tileGrid']['tileSize'] === 'number') {
          tileSize = params['tileGrid']['tileSize']
        }
        let projection = 'EPSG:3857'
        if (params['projection']) {
          projection = params['projection']
        } else if (this.view && this.view instanceof ol.View) {
          projection = this.view.getProjection().getCode()
        }
        if (params['tileGrid'] && params['tileGrid']['resolutions']) {
          tileGrid = new ol.tilegrid.TileGrid({
            tileSize: tileSize,
            origin: (params['tileGrid']['origin'] ? params['tileGrid']['origin'] : undefined),
            extent: (params['tileGrid']['extent'] ? params['tileGrid']['extent'] : undefined),
            resolutions: params['tileGrid']['resolutions'],
            minZoom: ((params['tileGrid']['minZoom'] && typeof params['tileGrid']['minZoom'] === 'number') ? params['tileGrid']['minZoom'] : 0)
          })
        }
        layer = new ol.layer.Tile({
          layerName: layerName,
          visible: (params['visible'] === false) ? params['visible'] : true,
          opacity: ((params['opacity'] && (typeof params['opacity'] === 'number')) ? params['opacity'] : 1),
          source: new ol.source.XYZ({
            wrapX: false,
            tileGrid: (tileGrid !== null ? tileGrid : undefined),
            tileSize: tileSize,
            opaque: (params['opaque'] === true) ? params['opaque'] : false, // 图层是否不透明（主题相关）
            tilePixelRatio: (params['tilePixelRatio'] ? params['tilePixelRatio'] : 1), // todo 对于高分辨率设备，例如苹果等可能2、3（移动端开发需要注意）
            projection: projection,
            maxZoom: (params['maxZoom'] ? params['maxZoom'] : 18),
            minZoom: (params['minZoom'] ? params['minZoom'] : 0),
            crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined),
            tileUrlFunction: function (tileCoord) {
              let url = (params['layerUrl']).replace('{z}',
                (tileCoord[0]).toString()).replace('{x}',
                tileCoord[1].toString()).replace('{y}',
                (-tileCoord[2] - 1).toString())
              return url
            }
          })
        })
      }
      if (this.map && layer && !(params['addLayer'] === false)) {
        this.map.addLayer(layer)
      }
      return layer
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 创建OSM图层
   * @param layerName
   * @param params
   * @returns {*}
   */
  createOSMLayer (layerName, params) {
    try {
      let layer = this.getLayerByLayerName(layerName)
      if (!(layer instanceof ol.layer.Tile)) {
        layer = null
      } else if (this.map && (layer instanceof ol.layer.Tile) && !(params['addLayer'] === false)) {
        this.map.removeLayer(layer)
        layer = null
      }
      if (!layer && params['create']) {
        layer = new ol.layer.Tile({
          layerName: layerName,
          visible: (params['visible'] === false) ? params['visible'] : true,
          opacity: ((params['opacity'] && (typeof params['opacity'] === 'number')) ? params['opacity'] : 1),
          source: new ol.source.OSM({
            wrapX: false,
            opaque: (params['opaque'] === false) ? params['opaque'] : true, // 图层是否不透明（主题相关）
            url: params['layerUrl'] ? params['layerUrl'] : 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined)
          })
        })
      }
      if (this.map && layer && !(params['addLayer'] === false)) {
        this.map.addLayer(layer)
      }
      return layer
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 创建百度图层
   * @param layerName
   * @param params
   * @returns {*}
   */
  createBaiDuLayer (layerName, params) {
    try {
      let layer = this.getLayerByLayerName(layerName)
      if (!(layer instanceof ol.layer.Tile)) {
        layer = null
      } else if (this.map && (layer instanceof ol.layer.Tile) && !(params['addLayer'] === false)) {
        this.map.removeLayer(layer)
        layer = null
      }
      if (!layer && params['create']) {
        layer = new ol.layer.Tile({
          layerName: layerName,
          visible: (params['visible'] === false) ? params['visible'] : true,
          opacity: ((params['opacity'] && (typeof params['opacity'] === 'number')) ? params['opacity'] : 1),
          source: new ol.source.BAIDU({
            wrapX: false,
            projection: params['projection'] ? params['projection'] : 'EPSG:3857',
            origin: params['origin'] ? params['origin'] : [0, 0],
            opaque: (params['opaque'] === false) ? params['opaque'] : true, // 图层是否不透明（主题相关）
            url: params['layerUrl'] ? params['layerUrl'] : 'http://online{0-3}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20170607&scaler=1&p=1',
            crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined)
          })
        })
      }
      if (this.map && layer && !(params['addLayer'] === false)) {
        this.map.addLayer(layer)
      }
      return layer
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 创建高德图层
   * @param layerName
   * @param params
   * @returns {*}
   */
  createGaoDeLayer (layerName, params) {
    try {
      let layer = this.getLayerByLayerName(layerName)
      if (!(layer instanceof ol.layer.Tile)) {
        layer = null
      } else if (this.map && (layer instanceof ol.layer.Tile) && !(params['addLayer'] === false)) {
        this.map.removeLayer(layer)
        layer = null
      }
      if (!layer && params['create']) {
        layer = new ol.layer.Tile({
          layerName: layerName,
          visible: (params['visible'] === false) ? params['visible'] : true,
          opacity: ((params['opacity'] && (typeof params['opacity'] === 'number')) ? params['opacity'] : 1),
          source: new ol.source.GAODE({
            wrapX: false,
            opaque: (params['opaque'] === false) ? params['opaque'] : true, // 图层是否不透明（主题相关）
            url: params['layerUrl'] ? params['layerUrl'] : 'http://online{0-3}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20170607&scaler=1&p=1',
            crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined)
          })
        })
      }
      if (this.map && layer && !(params['addLayer'] === false)) {
        this.map.addLayer(layer)
      }
      return layer
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 创建高德图层
   * @param layerName
   * @param params
   * @returns {*}
   */
  createGoogleLayer (layerName, params) {
    try {
      let layer = this.getLayerByLayerName(layerName)
      if (!(layer instanceof ol.layer.Tile)) {
        layer = null
      } else if (this.map && (layer instanceof ol.layer.Tile) && !(params['addLayer'] === false)) {
        this.map.removeLayer(layer)
        layer = null
      }
      if (!layer && params['create']) {
        layer = new ol.layer.Tile({
          layerName: layerName,
          visible: (params['visible'] === false) ? params['visible'] : true,
          opacity: ((params['opacity'] && (typeof params['opacity'] === 'number')) ? params['opacity'] : 1),
          source: new ol.source.GOOGLE({
            wrapX: false,
            opaque: (params['opaque'] === false) ? params['opaque'] : true, // 图层是否不透明（主题相关）
            url: params['layerUrl'] ? params['layerUrl'] : 'http://online{0-3}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20170607&scaler=1&p=1',
            crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined)
          })
        })
      }
      if (this.map && layer && !(params['addLayer'] === false)) {
        this.map.addLayer(layer)
      }
      return layer
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 创建Mapbox矢量图层
   * @param layerName
   * @param params
   * @returns {*}
   */
  createMapboxVectorTileLayer (layerName, params) {
    try {
      let layer = this.getLayerByLayerName(layerName)
      if (!(layer instanceof ol.layer.VectorTile)) {
        layer = null
      } else if (this.map && (layer instanceof ol.layer.VectorTile) && !(params['addLayer'] === false)) {
        this.map.removeLayer(layer)
        layer = null
      }
      if (!layer && params && params['layerUrl'] && params['create']) {
        let tileGrid = null
        let tileSize = 256
        if (params['tileSize'] && typeof params['tileSize'] === 'number') {
          tileSize = params['tileSize']
        } else if (params['tileGrid'] && params['tileGrid']['tileSize'] && typeof params['tileGrid']['tileSize'] === 'number') {
          tileSize = params['tileGrid']['tileSize']
        }
        let projection = 'EPSG:3857'
        if (params['projection']) {
          projection = params['projection']
        } else if (this.view && this.view instanceof ol.View) {
          projection = this.view.getProjection().getCode()
        }
        if (params['tileGrid']) {
          /* eslint new-cap: ["error", { "newIsCap": false }] */
          tileGrid = new ol.tilegrid.createXYZ({
            tileSize: tileSize,
            extent: (params['tileGrid']['extent'] ? params['tileGrid']['extent'] : undefined),
            minZoom: ((params['tileGrid']['minZoom'] && typeof params['tileGrid']['minZoom'] === 'number') ? params['tileGrid']['minZoom'] : 0),
            maxZoom: ((params['tileGrid']['maxZoom'] && typeof params['tileGrid']['maxZoom'] === 'number') ? params['tileGrid']['maxZoom'] : 22)
          })
        }
        layer = new ol.layer.VectorTile({
          visible: (params['visible'] === false) ? params['visible'] : true,
          renderBuffer: ((params['renderBuffer'] && (typeof params['renderBuffer'] === 'number')) ? params['renderBuffer'] : 100),
          renderMode: (params['renderMode'] ? params['renderMode'] : 'hybrid'), // 渲染方式image，hybrid，vector，性能由高到低
          extent: (params['extent'] ? params['extent'] : undefined),
          opacity: ((params['opacity'] && (typeof params['opacity'] === 'number')) ? params['opacity'] : 1),
          minResolution: ((params['minResolution'] && typeof params['minResolution'] === 'number') ? params['minResolution'] : undefined),
          maxResolution: ((params['maxResolution'] && typeof params['maxResolution'] === 'number') ? params['maxResolution'] : undefined),
          preload: ((params['preload'] && typeof params['preload'] === 'number') ? params['preload'] : 0),
          source: new ol.source.VectorTile({
            format: new ol.format.MVT(),
            crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined),
            projection: projection,
            overlaps: (params['overlaps'] ? params['overlaps'] : true),
            tileGrid: ((tileGrid && tileGrid instanceof ol.tilegrid.TileGrid) ? tileGrid : undefined),
            tilePixelRatio: ((params['tilePixelRatio'] && typeof params['tilePixelRatio'] === 'number') ? params['tilePixelRatio'] : 1),
            url: params['layerUrl'],
            wrapX: false
          }),
          style: MapboxStyle.createMapboxStreetsV6Style()
        })
      }
      if (this.map && layer && !(params['addLayer'] === false)) {
        this.map.addLayer(layer)
      }
      return layer
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 获取矢量数据格式化类型
   * @param params
   * @returns {*}
   * @private
   */
  _getFormatType (params) {
    try {
      let type
      if (params['format']) {
        switch (params['format']) {
          case 'MVT':
            type = new ol.format.MVT()
            break
          case 'GeoJSON':
            type = new ol.format.GeoJSON()
            break
          case 'EsriJSON':
            type = new ol.format.EsriJSON()
            break
          case 'TopoJSON':
            type = new ol.format.TopoJSON()
            break
          case 'IGC':
            type = new ol.format.IGC()
            break
          case 'Polyline':
            type = new ol.format.Polyline()
            break
          case 'WKT':
            type = new ol.format.WKT()
            break
          case 'GMLBase':
            type = new ol.format.GMLBase()
            break
          case 'GPX':
            type = new ol.format.GPX()
            break
          case 'KML':
            type = new ol.format.KML()
            break
          case 'OSMXML':
            type = new ol.format.OSMXML()
            break
          case 'WFS':
            type = new ol.format.WFS()
            break
          case 'WMSGetFeatureInfo':
            type = new ol.format.WMSGetFeatureInfo()
            break
        }
      }
      return type
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 获取切片规则
   * @param params
   * @returns {*}
   * @private
   */
  _getTileGrid (params) {
    try {
      let tileGrid
      if (params['tileGrid']) {
        let [tileSize, tileSizes] = [256]
        if (params['tileSize'] && typeof params['tileSize'] === 'number') {
          tileSize = params['tileSize']
        } else if (params['tileGrid'] && params['tileGrid']['tileSize'] && typeof params['tileGrid']['tileSize'] === 'number') {
          tileSize = params['tileGrid']['tileSize']
        }
        if (params['tileGrid']['tileSizes'] && params['tileGrid']['tileSizes'].length === params['tileGrid']['resolutions']) {
          tileSizes = params['tileGrid']['tileSizes']
        }
        if (params['tileGrid']['gridType'] === 'XYZ') {
          /* eslint new-cap: ["error", { "newIsCap": false }] */
          tileGrid = new ol.tilegrid.createXYZ({
            tileSize: tileSize,
            extent: (params['tileGrid']['extent'] ? params['tileGrid']['extent'] : undefined),
            minZoom: ((params['tileGrid']['minZoom'] && typeof params['tileGrid']['minZoom'] === 'number') ? params['tileGrid']['minZoom'] : 0),
            maxZoom: ((params['tileGrid']['maxZoom'] && typeof params['tileGrid']['maxZoom'] === 'number') ? params['tileGrid']['maxZoom'] : 22)
          })
        } else if (params['tileGrid']['gridType'] === 'WMTS') {
          tileGrid = new ol.tilegrid.WMTS({
            sizes: ((params['tileGrid']['sizes'] && Array.isArray(params['tileGrid']['sizes'])) ? params['tileGrid']['sizes'] : undefined),
            widths: ((params['tileGrid']['widths'] && Array.isArray(params['tileGrid']['widths'])) ? params['tileGrid']['widths'] : undefined),
            tileSize: tileSize,
            tileSizes: tileSizes, //  If given, the array length should match the length of the resolutions array
            resolutions: params['tileGrid']['resolutions'],
            origin: (params['tileGrid']['origin'] ? params['tileGrid']['origin'] : undefined),
            origins: (params['tileGrid']['origins'] ? params['tileGrid']['origins'] : undefined),
            extent: (params['tileGrid']['extent'] ? params['tileGrid']['extent'] : undefined),
            minZoom: ((params['tileGrid']['minZoom'] && typeof params['tileGrid']['minZoom'] === 'number') ? params['tileGrid']['minZoom'] : 0),
            matrixIds: params['tileGrid']['matrixIds']
          })
        } else {
          tileGrid = new ol.tilegrid.TileGrid({
            sizes: ((params['tileGrid']['sizes'] && Array.isArray(params['tileGrid']['sizes'])) ? params['tileGrid']['sizes'] : undefined),
            widths: ((params['tileGrid']['widths'] && Array.isArray(params['tileGrid']['widths'])) ? params['tileGrid']['widths'] : undefined),
            tileSize: tileSize,
            tileSizes: tileSizes, //  If given, the array length should match the length of the resolutions array
            resolutions: params['tileGrid']['resolutions'],
            matrixIds: params['tileGrid']['matrixIds'],
            origin: (params['origin'] ? params['origin'] : undefined),
            origins: (params['origins'] ? params['origins'] : undefined),
            extent: (params['tileGrid']['extent'] ? params['tileGrid']['extent'] : undefined),
            minZoom: ((params['tileGrid']['minZoom'] && typeof params['tileGrid']['minZoom'] === 'number') ? params['tileGrid']['minZoom'] : 0)
          })
        }
      }
      return tileGrid
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 创建矢量切片图层
   * @param layerName
   * @param params
   * @returns {*}
   */
  createVectorTileLayer (layerName, params) {
    try {
      let layer = this.getLayerByLayerName(layerName)
      if (!(layer instanceof ol.layer.VectorTile)) {
        layer = null
      } else if (this.map && (layer instanceof ol.layer.VectorTile) && !(params['addLayer'] === false)) {
        this.map.removeLayer(layer)
        layer = null
      }
      if (!layer && params && (params['layerUrl'] || params['layerUrls']) && params['create']) {
        let projection = 'EPSG:3857'
        if (params['projection']) {
          projection = params['projection']
        } else if (this.view && this.view instanceof ol.View) {
          projection = this.view.getProjection().getCode()
        }
        layer = new ol.layer.VectorTile({
          visible: (params['visible'] === false) ? params['visible'] : true,
          renderBuffer: ((params['renderBuffer'] && (typeof params['renderBuffer'] === 'number')) ? params['renderBuffer'] : 100),
          renderMode: (params['renderMode'] ? params['renderMode'] : 'hybrid'), // 渲染方式image，hybrid，vector，性能由高到低
          extent: (params['extent'] ? params['extent'] : undefined),
          opacity: ((params['opacity'] && (typeof params['opacity'] === 'number')) ? params['opacity'] : 1),
          minResolution: ((params['minResolution'] && typeof params['minResolution'] === 'number') ? params['minResolution'] : undefined),
          maxResolution: ((params['maxResolution'] && typeof params['maxResolution'] === 'number') ? params['maxResolution'] : undefined),
          preload: ((params['preload'] && typeof params['preload'] === 'number') ? params['preload'] : 0),
          source: new ol.source.VectorTile({
            format: this._getFormatType(params),
            cacheSize: ((params['cacheSize'] && typeof params['cacheSize'] === 'number') ? params['cacheSize'] : 128),
            crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined),
            projection: projection,
            state: (params['state'] ? params['state'] : undefined), // State of the source, one of 'undefined', 'loading', 'ready' or 'error'.
            overlaps: (params['overlaps'] ? params['overlaps'] : true),
            tileClass: ((params['tileClass'] && typeof params['tileClass'] === 'function') ? params['tileClass'] : ol.VectorTile),
            tileGrid: this._getTileGrid(params),
            tilePixelRatio: ((params['tilePixelRatio'] && typeof params['tilePixelRatio'] === 'number') ? params['tilePixelRatio'] : 1),
            url: (params['layerUrl'] ? params['layerUrl'] : undefined),
            urls: ((params['layerUrls'] && Array.isArray(params['layerUrls']) && params['layerUrls'].length > 0) ? params['layerUrls'] : undefined),
            tileUrlFunction: ((params['tileUrlFunction'] && typeof params['tileUrlFunction'] === 'function') ? params['tileUrlFunction'] : undefined),
            tileLoadFunction: ((params['tileLoadFunction'] && typeof params['tileLoadFunction'] === 'function') ? params['tileLoadFunction'] : undefined),
            wrapX: false
          }),
          style: (params['style'] ? params['style'] : undefined)
        })
      }
      if (this.map && layer && !(params['addLayer'] === false)) {
        this.map.addLayer(layer)
      }
      return layer
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 创建图片类型图层
   * @param layerName
   * @param params
   * @returns {*}
   */
  createImageLayer (layerName, params) {
    try {
      let layer = this.getLayerByLayerName(layerName)
      if (!(layer instanceof ol.layer.Image)) {
        layer = null
      } else if (this.map && (layer instanceof ol.layer.Image) && !(params['addLayer'] === false)) {
        this.map.removeLayer(layer)
        layer = null
      }
      if (!layer && params && params['layerUrl'] && params['create']) {
        let source = this.getImagesSource(params)
        layer = new ol.layer.Image({
          layerName: layerName,
          extent: (params['extent'] ? params['extent'] : undefined),
          visible: (params['visible'] === false) ? params['visible'] : true,
          opacity: ((params['opacity'] && (typeof params['opacity'] === 'number')) ? params['opacity'] : 1),
          source: source
        })
      }
      if (this.map && layer && !(params['addLayer'] === false)) {
        this.map.addLayer(layer)
      }
      return layer
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 获取影像图层源
   * @param params
   * @returns {*}
   */
  getImagesSource (params) {
    let source = null
    let projection = new ol.proj.Projection({
      code: (params['projection'] ? params['projection'] : 'EPSG:3857'),
      units: 'm',
      axisOrientation: 'neu'
    })
    switch (params['sourceType']) {
      case 'ImageStatic':
        source = new ol.source.ImageStatic({
          crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined),
          imageExtent: params['imageExtent'],
          projection: projection,
          imageSize: (params['imageSize'] ? params['imageSize'] : undefined),
          url: params['layerUrl'],
          wrapX: false
        })
        break
      case 'ImageWMS':
        source = new ol.source.ImageWMS({
          url: params['layerUrl'],
          crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined),
          params: {
            LAYERS: params['layers'], // require
            STYLES: params['style'] ? params['style'] : '',
            TYPE: params['type'] ? params['type'] : '',
            VERSION: params['version'] ? params['version'] : '1.3.0',
            WIDTH: params['width'] ? params['width'] : 256,
            HEIGHT: params['height'] ? params['height'] : 256,
            SRS: (params['srs'] ? params['srs'] : 'EPSG:3857'),
            CRS: (params['srs'] ? params['srs'] : 'EPSG:3857'),
            REQUEST: 'GetMap',
            TRANSPARENT: true,
            TILED: (params['tiled'] === false) ? params['tiled'] : true,
            TILESORIGIN: (params['tiledsorrigin'] ? params['tiledsorrigin'] : undefined),
            SERVICE: 'WMS',
            FORMAT: (params['format'] ? params['format'] : 'image/png'),
            VIEWPARAMS: (params['viewparams'] ? params['viewparams'] : '')
          },
          wrapX: false
        })
        break
      case 'Raster':
        source = new ol.source.Raster()
        break
      case 'ImageMapGuide':
        source = new ol.source.ImageMapGuide({
          url: params['layerUrl'],
          wrapX: false,
          displayDpi: ((params['displayDpi'] && (typeof params['displayDpi'] === 'number')) ? params['displayDpi'] : 96),
          metersPerUnit: ((params['metersPerUnit'] && (typeof params['metersPerUnit'] === 'number')) ? params['metersPerUnit'] : 1),
          hidpi: ((params['hidpi'] && (typeof params['hidpi'] === 'boolean')) ? params['hidpi'] : true),
          useOverlay: ((params['useOverlay'] && (typeof params['useOverlay'] === 'boolean')) ? params['useOverlay'] : undefined),
          projection: (params['projection'] ? params['projection'] : 'EPSG:3857'),
          ratio: ((params['ratio'] && (typeof params['ratio'] === 'number')) ? params['ratio'] : 1),
          resolutions: ((params['resolutions'] && Array.isArray(params['resolutions'])) ? params['resolutions'] : undefined),
          imageLoadFunction: ((params['imageLoadFunction'] && (typeof params['imageLoadFunction'] === 'function')) ? params['imageLoadFunction'] : undefined),
          params: ((params['params'] && (typeof params['params'] === 'object')) ? params['params'] : undefined)
        })
        break
      case 'ImageCanvas':
        source = new ol.source.ImageCanvas({
          projection: (params['projection'] ? params['projection'] : 'EPSG:3857'),
          ratio: ((params['ratio'] && (typeof params['ratio'] === 'number')) ? params['ratio'] : 1),
          resolutions: ((params['resolutions'] && Array.isArray(params['resolutions'])) ? params['resolutions'] : undefined),
          canvasFunction: params['canvasFunction'],
          state: (params['state'] ? params['state'] : undefined),
          wrapX: false
        })
        break
      case 'ImageArcGISRest':
        source = new ol.source.ImageArcGISRest({
          url: params['layerUrl'],
          hidpi: ((params['hidpi'] && (typeof params['hidpi'] === 'boolean')) ? params['hidpi'] : true),
          crossOrigin: (params['crossOrigin'] ? params['crossOrigin'] : undefined),
          projection: (params['projection'] ? params['projection'] : 'EPSG:3857'),
          ratio: ((params['ratio'] && (typeof params['ratio'] === 'number')) ? params['ratio'] : 1),
          resolutions: ((params['resolutions'] && Array.isArray(params['resolutions'])) ? params['resolutions'] : undefined),
          imageLoadFunction: ((params['imageLoadFunction'] && (typeof params['imageLoadFunction'] === 'function')) ? params['imageLoadFunction'] : undefined),
          params: ((params['params'] && (typeof params['params'] === 'object')) ? params['params'] : undefined),
          wrapX: false
        })
        break
      default:
        console.log('sourceType类型未传！')
        return false
    }
    return source
  }

  /**
   * 移除图层
   * @param layerName
   */
  removeLayerByLayerName (layerName) {
    if (this.map) {
      let layer = this.getLayerByLayerName(layerName)
      if (layer && !layer.get('isBaseLayer')) {
        this.map.removeLayer(layer)
      }
    }
  }

  /**
   * 移除多个图层
   * @param layerNames
   */
  removeLayerByLayerNames (layerNames) {
    if (this.map && layerNames && Array.isArray(layerNames) && layerNames.length > 0) {
      layerNames.forEach(layerName => {
        if (layerName) {
          this.removeLayerByLayerName(layerName)
        }
      })
    }
  }

  /**
   * 通过layerName移除专题图层
   * @param layerName
   */
  removeTileLayerByLayerName (layerName) {
    if (this.map) {
      let layer = this.getTitleLayerByLayerName(layerName)
      if (layer && layer instanceof ol.layer.Tile) {
        this.map.removeLayer(layer)
      }
    }
  }

  /**
   * 移除所有图层（除底图）
   */
  removeAllLayer () {
    if (this.map) {
      let layers = this.map.getLayers().getArray()
      layers.forEach(layer => {
        if (!layer.get('isBaseLayer')) {
          this.map.removeLayer(layer)
        }
      })
    }
  }

  /**
   * 调整当前要素范围
   * @param extent
   * @param params
   * @returns {*}
   */
  adjustExtent (extent, params) {
    if (this.map) {
      params = params || {}
      let size = ol.extent.getSize(extent)
      let adjust = typeof params['adjust'] === 'number' ? params['adjust'] : 0.2
      let minWidth = typeof params['minWidth'] === 'number' ? params['minWidth'] : 0.05
      let minHeight = typeof params['minHeight'] === 'number' ? params['minHeight'] : 0.05
      if (size[0] <= minWidth || size[1] <= minHeight) {
        let bleft = ol.extent.getBottomLeft(extent) // 获取xmin,ymin
        let tright = ol.extent.getTopRight(extent) // 获取xmax,ymax
        let xmin = bleft[0] - adjust
        let ymin = bleft[1] - adjust
        let xmax = tright[0] + adjust
        let ymax = tright[1] + adjust
        extent = ol.extent.buffer([xmin, ymin, xmax, ymax], adjust)
      }
      return extent
    }
  }

  /**
   * 缩放到当前范围
   * @param extent
   * @param isanimation
   * @param duration
   */
  zoomToExtent (extent, isanimation, duration) {
    if (this.map) {
      let view = this.map.getView()
      let size = this.map.getSize()
      /**
       *  @type {ol.Coordinate} center The center of the view.
       */
      let center = ol.extent.getCenter(extent)
      if (!isanimation) {
        view.fit(extent, size, {
          padding: [350, 200, 200, 350]
        })
        view.setCenter(center)
      } else {
        if (!duration) {
          duration = 800
          view.animate({
            center: center,
            duration: duration
          })
          view.fit(extent, {
            size: size,
            duration: duration
          })
        }
      }
    }
  }
}

export default Layer
