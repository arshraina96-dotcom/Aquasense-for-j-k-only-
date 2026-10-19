import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import {
  Layers,
  RotateCcw,
  Search,
  List,
  Map as MapIcon,
  Info,
  Waves,
  Mountain,
  Snowflake,
  CloudLightning,
  Shield,
  ArrowRight,
  AlertTriangle,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { JKDistrict, SupportedLanguage, RiskLevel } from '../types';
import { JK_DISTRICTS } from '../data/jkDistricts';
import { JK_DISTRICTS_GEOJSON, JK_RIVERS_GEOJSON, JK_HIGHWAYS_GEOJSON } from '../data/jkGeoJson';
import { JK_GLACIAL_LAKES } from '../data/jkGlacialLakes';
import { JK_SHELTERS } from '../data/jkShelters';
import { TRANSLATIONS } from '../i18n/translations';

interface RiskMapProps {
  selectedDistrict: JKDistrict;
  setSelectedDistrict: (district: JKDistrict) => void;
  language: SupportedLanguage;
  activeHazardFilter?: 'all' | 'flood' | 'landslide' | 'glof' | 'weather';
}

export const RiskMap: React.FC<RiskMapProps> = ({
  selectedDistrict,
  setSelectedDistrict,
  language
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayer, setActiveLayer] = useState<'all' | 'flood' | 'landslide' | 'glof' | 'shelters'>('all');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const [tilesDegraded, setTilesDegraded] = useState<boolean>(false);
  const [hoveredDistrictName, setHoveredDistrictName] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  // Center coordinates of Jammu & Kashmir
  const JK_CENTER: [number, number] = [75.05, 33.65];
  const JK_ZOOM = 7.1;

  // Glacial lakes GeoJSON representation
  const glacialLakesGeoJson = {
    type: 'FeatureCollection',
    features: JK_GLACIAL_LAKES.map(lake => ({
      type: 'Feature',
      id: lake.id,
      properties: {
        id: lake.id,
        name: lake.name,
        district: lake.district,
        altitude: lake.altitudeMeters,
        volume: lake.estimatedVolumeMcm,
        riskLevel: lake.riskLevel,
        moraineStability: lake.moraineDamStability
      },
      geometry: {
        type: 'Point',
        coordinates: [lake.lng, lake.lat]
      }
    }))
  };

  // Shelters GeoJSON representation
  const sheltersGeoJson = {
    type: 'FeatureCollection',
    features: JK_SHELTERS.map(shelter => ({
      type: 'Feature',
      id: shelter.id,
      properties: {
        id: shelter.id,
        name: shelter.name,
        district: shelter.district,
        capacity: shelter.capacityPersons,
        address: shelter.address,
        accessible: shelter.wheelchairAccessible
      },
      geometry: {
        type: 'Point',
        coordinates: [shelter.lng, shelter.lat]
      }
    }))
  };

  // Helper to compute bounding box from district polygon coordinates
  const getDistrictBounds = (districtId: string): [number, number, number, number] | null => {
    const feat = JK_DISTRICTS_GEOJSON.features.find(f => f.id === districtId);
    if (!feat || !feat.geometry) return null;

    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
    
    const inspectCoords = (coords: any) => {
      if (typeof coords[0] === 'number') {
        const [lng, lat] = coords;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      } else {
        coords.forEach(inspectCoords);
      }
    };

    inspectCoords(feat.geometry.coordinates);
    if (minLng === Infinity) return null;
    return [minLng, minLat, maxLng, maxLat];
  };

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Check WebGL capability directly via canvas context
    const checkWebGl = () => {
      try {
        const canvas = document.createElement('canvas');
        return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    };

    if (!checkWebGl()) {
      console.warn('WebGL is not supported in this browser environment. Using accessible fallback.');
      setWebGlSupported(false);
      return;
    }

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: [
                'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
                'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors, © CARTO'
            }
          },
          layers: [
            // Background fallback layer in case raster tiles are unreachable
            {
              id: 'background-fallback',
              type: 'background',
              paint: {
                'background-color': '#030712'
              }
            },
            // Base raster map
            {
              id: 'osm-tiles-layer',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        },
        center: JK_CENTER,
        zoom: JK_ZOOM,
        minZoom: 6,
        maxZoom: 14
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');

      // Tile error listener for graceful fallback
      map.on('error', (e) => {
        if (e && e.error && (e.error.message?.includes('tile') || (e as any).sourceId === 'osm-tiles')) {
          setTilesDegraded(true);
        }
      });

      map.on('load', () => {
        // 1. Add Districts GeoJSON Source
        map.addSource('jk-districts', {
          type: 'geojson',
          data: JK_DISTRICTS_GEOJSON as any
        });

        // 2. District Base Fill Layer
        map.addLayer({
          id: 'districts-fill',
          type: 'fill',
          source: 'jk-districts',
          paint: {
            'fill-color': [
              'match',
              ['get', 'id'],
              'ramban', '#f43f5e',
              'kishtwar', '#f43f5e',
              'srinagar', '#f97316',
              'anantnag', '#f97316',
              'doda', '#f97316',
              'kulgam', '#f97316',
              'ganderbal', '#f97316',
              'baramulla', '#f59e0b',
              'jammu', '#f59e0b',
              'reasi', '#f59e0b',
              'kupwara', '#f59e0b',
              'bandipora', '#f59e0b',
              '#10b981'
            ],
            'fill-opacity': 0.35
          }
        });

        // 3. District Boundary Outline Layer
        map.addLayer({
          id: 'districts-line',
          type: 'line',
          source: 'jk-districts',
          paint: {
            'line-color': '#06b6d4',
            'line-width': 1.6,
            'line-opacity': 0.8
          }
        });

        // 4. Selected District Highlight Fill
        map.addLayer({
          id: 'district-selected-fill',
          type: 'fill',
          source: 'jk-districts',
          filter: ['==', 'id', selectedDistrict.id],
          paint: {
            'fill-color': '#06b6d4',
            'fill-opacity': 0.25
          }
        });

        // 5. Selected District Highlight Border
        map.addLayer({
          id: 'district-highlight',
          type: 'line',
          source: 'jk-districts',
          filter: ['==', 'id', selectedDistrict.id],
          paint: {
            'line-color': '#38bdf8',
            'line-width': 3.5,
            'line-opacity': 1.0
          }
        });

        // 6. Rivers Layer
        map.addSource('jk-rivers', {
          type: 'geojson',
          data: JK_RIVERS_GEOJSON as any
        });

        map.addLayer({
          id: 'rivers-line',
          type: 'line',
          source: 'jk-rivers',
          paint: {
            'line-color': '#38bdf8',
            'line-width': 3.0,
            'line-opacity': 0.9
          }
        });

        // 7. Highway Corridors Layer
        map.addSource('jk-highways', {
          type: 'geojson',
          data: JK_HIGHWAYS_GEOJSON as any
        });

        map.addLayer({
          id: 'highways-line',
          type: 'line',
          source: 'jk-highways',
          paint: {
            'line-color': '#fbbf24',
            'line-width': 2.5,
            'line-dasharray': [2, 1],
            'line-opacity': 0.95
          }
        });

        // 8. Glacial Lakes Layer
        map.addSource('jk-glacial-lakes', {
          type: 'geojson',
          data: glacialLakesGeoJson as any
        });

        map.addLayer({
          id: 'glacial-lakes-points',
          type: 'circle',
          source: 'jk-glacial-lakes',
          paint: {
            'circle-radius': 6,
            'circle-color': '#2dd4bf',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });

        // 9. Shelters Layer
        map.addSource('jk-shelters', {
          type: 'geojson',
          data: sheltersGeoJson as any
        });

        map.addLayer({
          id: 'shelters-points',
          type: 'circle',
          source: 'jk-shelters',
          paint: {
            'circle-radius': 5,
            'circle-color': '#10b981',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });

        // Setup Popup instance
        popupRef.current = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: 'aquasense-map-popup'
        });

        // District Click Interaction
        map.on('click', 'districts-fill', (e) => {
          if (!e.features || e.features.length === 0) return;
          const clickedId = e.features[0].properties?.id;
          const target = JK_DISTRICTS.find(d => d.id === clickedId);
          if (target) {
            handleDistrictSelect(target);
          }
        });

        // Glacial Lake Click Interaction
        map.on('click', 'glacial-lakes-points', (e) => {
          if (!e.features || e.features.length === 0) return;
          const lakeProps = e.features[0].properties;
          const coords = (e.features[0].geometry as any).coordinates.slice();

          new maplibregl.Popup({ className: 'aquasense-map-popup' })
            .setLngLat(coords)
            .setHTML(`
              <div style="background:#0f172a;color:#f8fafc;padding:10px;border-radius:8px;font-family:sans-serif;font-size:12px;border:1px solid #334155;">
                <div style="font-weight:bold;color:#2dd4bf;margin-bottom:4px;">${lakeProps?.name}</div>
                <div>District: ${lakeProps?.district}</div>
                <div>Altitude: ${lakeProps?.altitude}m MSL</div>
                <div>Volume: ${lakeProps?.volume} MCM</div>
                <div style="margin-top:4px;color:#f59e0b;font-weight:bold;">Moraine: ${lakeProps?.moraineStability}</div>
              </div>
            `)
            .addTo(map);
        });

        // Shelter Click Interaction
        map.on('click', 'shelters-points', (e) => {
          if (!e.features || e.features.length === 0) return;
          const shProps = e.features[0].properties;
          const coords = (e.features[0].geometry as any).coordinates.slice();

          new maplibregl.Popup({ className: 'aquasense-map-popup' })
            .setLngLat(coords)
            .setHTML(`
              <div style="background:#0f172a;color:#f8fafc;padding:10px;border-radius:8px;font-family:sans-serif;font-size:12px;border:1px solid #334155;">
                <div style="font-weight:bold;color:#10b981;margin-bottom:4px;">${shProps?.name}</div>
                <div>Capacity: ${shProps?.capacity} persons</div>
                <div>Address: ${shProps?.address}</div>
                <div style="margin-top:4px;color:#38bdf8;">Verified Emergency Refuge</div>
              </div>
            `)
            .addTo(map);
        });

        // Hover cursor and district name tooltip
        map.on('mousemove', 'districts-fill', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          if (e.features && e.features.length > 0) {
            setHoveredDistrictName(e.features[0].properties?.name || null);
          }
        });

        map.on('mouseleave', 'districts-fill', () => {
          map.getCanvas().style.cursor = '';
          setHoveredDistrictName(null);
        });

        mapRef.current = map;
        setMapLoaded(true);
      });
    } catch (err) {
      console.warn('MapLibre GL failed to initialize:', err);
      setWebGlSupported(false);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update selection highlight & fly to district bounds
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    try {
      if (map.getLayer('district-highlight')) {
        map.setFilter('district-highlight', ['==', 'id', selectedDistrict.id]);
      }
      if (map.getLayer('district-selected-fill')) {
        map.setFilter('district-selected-fill', ['==', 'id', selectedDistrict.id]);
      }

      // Smooth zoom to genuine district bounding box
      const bounds = getDistrictBounds(selectedDistrict.id);
      if (bounds) {
        map.fitBounds(
          [[bounds[0], bounds[1]], [bounds[2], bounds[3]]],
          { padding: 48, maxZoom: 9.8, duration: 1100 }
        );
      } else {
        map.flyTo({ center: [selectedDistrict.lng, selectedDistrict.lat], zoom: 9.0, duration: 1000 });
      }
    } catch (e) {
      console.warn('Map filter or flyTo error:', e);
    }
  }, [selectedDistrict, mapLoaded]);

  // Handle Layer Visibility toggling
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    try {
      // Rivers
      if (map.getLayer('rivers-line')) {
        map.setLayoutProperty(
          'rivers-line',
          'visibility',
          (activeLayer === 'all' || activeLayer === 'flood') ? 'visible' : 'none'
        );
      }
      // Highways
      if (map.getLayer('highways-line')) {
        map.setLayoutProperty(
          'highways-line',
          'visibility',
          (activeLayer === 'all' || activeLayer === 'landslide') ? 'visible' : 'none'
        );
      }
      // Glacial Lakes
      if (map.getLayer('glacial-lakes-points')) {
        map.setLayoutProperty(
          'glacial-lakes-points',
          'visibility',
          (activeLayer === 'all' || activeLayer === 'glof') ? 'visible' : 'none'
        );
      }
      // Shelters
      if (map.getLayer('shelters-points')) {
        map.setLayoutProperty(
          'shelters-points',
          'visibility',
          (activeLayer === 'all' || activeLayer === 'shelters') ? 'visible' : 'none'
        );
      }
    } catch (e) {
      console.warn('Error adjusting layer visibility:', e);
    }
  }, [activeLayer, mapLoaded]);

  const handleResetMap = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({ center: JK_CENTER, zoom: JK_ZOOM, duration: 1200 });
    }
  };

  const handleDistrictSelect = (district: JKDistrict) => {
    setSelectedDistrict(district);
  };

  const filteredDistricts = JK_DISTRICTS.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.headquarters.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.localities.some(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative w-full h-[640px] md:h-[720px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col">
      
      {/* Top Map Controls Bar */}
      <div className="z-10 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 20 J&K districts or tehsils..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Hazard & Asset Layer Toggles */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {[
            { id: 'all' as const, label: 'All Hazards', icon: Layers },
            { id: 'flood' as const, label: 'Rivers & Floods', icon: Waves },
            { id: 'landslide' as const, label: 'NH-44 Landslides', icon: Mountain },
            { id: 'glof' as const, label: 'Glacial Lakes', icon: Snowflake },
            { id: 'shelters' as const, label: 'Verified Shelters', icon: Shield }
          ].map((l) => {
            const Icon = l.icon;
            const isAct = activeLayer === l.id;
            return (
              <button
                key={l.id}
                onClick={() => setActiveLayer(l.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  isAct
                    ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{l.label}</span>
              </button>
            );
          })}
        </div>

        {/* Map / List View Toggle & Reset */}
        <div className="flex items-center gap-2">
          {tilesDegraded && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/80 text-[10px] text-amber-300">
              <AlertTriangle className="w-3 h-3" />
              Vector Mode
            </span>
          )}

          <button
            onClick={handleResetMap}
            title="Reset to Full J&K View"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="p-0.5 bg-slate-800 rounded-lg flex items-center border border-slate-700">
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'map' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Map View"
            >
              <MapIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Accessible District List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Main View Area: Interactive Map vs Accessible List */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        
        {/* MapLibre GL Map Element */}
        {webGlSupported ? (
          <div
            ref={mapContainerRef}
            className={`w-full h-full ${viewMode === 'map' ? 'block' : 'hidden'}`}
          />
        ) : (
          /* Graceful WebGL Unsupported Fallback */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-300 space-y-3">
            <Compass className="w-10 h-10 text-cyan-400 animate-pulse" />
            <h4 className="text-base font-bold text-white">Interactive Geospatial Grid Active</h4>
            <p className="text-xs text-slate-400 max-w-md">
              Hardware accelerated WebGL tiles are restricted in this sandbox environment. The complete 20-district directory, genuine coordinates, and risk filters are available below.
            </p>
            <button
              onClick={() => setViewMode('list')}
              className="px-4 py-2 bg-cyan-600 text-white rounded-xl text-xs font-semibold"
            >
              Open Accessible District List
            </button>
          </div>
        )}

        {/* Hovered District Tooltip on Map */}
        {viewMode === 'map' && hoveredDistrictName && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-semibold text-cyan-300 shadow-lg pointer-events-none">
            {hoveredDistrictName} District
          </div>
        )}

        {/* Selected District Overlay Drawer on Map */}
        {viewMode === 'map' && (
          <div className="absolute bottom-4 left-4 z-20 max-w-sm w-[calc(100%-2rem)] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-xl">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
                  Selected J&amp;K Territory
                </span>
                <h4 className="text-base font-bold text-white">
                  {selectedDistrict.name} ({selectedDistrict.division} Division)
                </h4>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-slate-800 border border-slate-700 text-slate-200">
                {selectedDistrict.elevationAvgM} m MSL
              </span>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2 mb-3">
              Rivers: {selectedDistrict.rivers.join(', ')} · Corridors: {selectedDistrict.highwayCorridors[0] || 'Local Arterials'}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
              <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400 block">Flood Baseline</span>
                <span className="font-semibold text-white">{selectedDistrict.baseTerrainSusceptibility.flood}</span>
              </div>
              <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400 block">Landslide Baseline</span>
                <span className="font-semibold text-white">{selectedDistrict.baseTerrainSusceptibility.landslide}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Click on any district boundary to switch focus</span>
              <span className="font-mono text-cyan-400 font-medium">
                {selectedDistrict.lat.toFixed(2)}°N, {selectedDistrict.lng.toFixed(2)}°E
              </span>
            </div>
          </div>
        )}

        {/* Map Legend Overlay */}
        {viewMode === 'map' && (
          <div className="absolute top-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-lg text-[11px] space-y-1.5 hidden sm:block">
            <span className="font-semibold text-slate-300 block mb-1">Geospatial Legend</span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-rose-500" />
              <span className="text-slate-300">Very High Hazard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-orange-500" />
              <span className="text-slate-300">High Hazard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-amber-500" />
              <span className="text-slate-300">Moderate Hazard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span className="text-slate-300">Low Hazard Baseline</span>
            </div>
            <div className="pt-1 border-t border-slate-800 flex items-center gap-2">
              <span className="w-4 h-1 bg-sky-400 rounded-full" />
              <span className="text-slate-400">Rivers (Jhelum / Chenab)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 border-t border-dashed border-amber-400" />
              <span className="text-slate-400">NH-44 Highway</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 border border-white" />
              <span className="text-slate-400">Glacial Lakes (GLOF)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
              <span className="text-slate-400">Verified Shelters</span>
            </div>
          </div>
        )}

        {/* Accessible List-Based Alternative */}
        {viewMode === 'list' && (
          <div className="w-full h-full overflow-y-auto p-4 bg-slate-950">
            <div className="max-w-4xl mx-auto space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Showing {filteredDistricts.length} Jammu &amp; Kashmir Districts</span>
                <span>Select a district to update telemetry context</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredDistricts.map((d) => {
                  const isSelected = d.id === selectedDistrict.id;
                  return (
                    <div
                      key={d.id}
                      onClick={() => handleDistrictSelect(d)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500/80 shadow-md shadow-cyan-950/30'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-base">{d.name}</h4>
                            <span className="text-xs text-slate-400">({d.headquarters})</span>
                          </div>
                          <span className="text-xs text-cyan-400 font-medium">{d.division} Division</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400 tabular-nums">{d.elevationAvgM} m</span>
                      </div>

                      <p className="text-xs text-slate-400 mb-3 line-clamp-1">
                        Rivers: {d.rivers.join(', ')}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="text-slate-400">Flood: <span className="font-semibold text-slate-200">{d.baseTerrainSusceptibility.flood}</span></span>
                          <span className="text-slate-400">Landslide: <span className="font-semibold text-slate-200">{d.baseTerrainSusceptibility.landslide}</span></span>
                        </div>
                        <span className="text-cyan-400 font-semibold flex items-center gap-1">
                          {isSelected ? 'Active' : 'Select'}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
