import { JK_DISTRICTS } from './jkDistricts';
import genuineDistrictsRaw from './jkGenuineDistricts.json';

// Map district metadata to genuine Census / administrative boundaries
const districtMap = new Map(JK_DISTRICTS.map(d => [d.id, d]));

export const JK_DISTRICTS_GEOJSON = {
  type: 'FeatureCollection',
  features: genuineDistrictsRaw.features.map((feature: any) => {
    const id = feature.id || feature.properties.id || feature.properties.districtId;
    const meta = districtMap.get(id);

    return {
      type: 'Feature',
      id: id,
      properties: {
        id: id,
        name: meta ? meta.name : feature.properties.name,
        division: meta ? meta.division : 'Kashmir',
        headquarters: meta ? meta.headquarters : feature.properties.name,
        elevation: meta ? meta.elevationAvgM : 1600,
        lat: meta ? meta.lat : 34.0,
        lng: meta ? meta.lng : 74.8,
        rivers: meta ? meta.rivers.join(', ') : '',
        highwayCorridors: meta ? meta.highwayCorridors.join(', ') : '',
        floodBaseline: meta ? meta.baseTerrainSusceptibility.flood : 'Moderate',
        landslideBaseline: meta ? meta.baseTerrainSusceptibility.landslide : 'Moderate',
        glofBaseline: meta ? meta.baseTerrainSusceptibility.glof : 'Low',
        extremeWeatherBaseline: meta ? meta.baseTerrainSusceptibility.extremeWeather : 'Moderate'
      },
      geometry: feature.geometry
    };
  })
};

// Major verified river channels of Jammu & Kashmir
export const JK_RIVERS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'river-jhelum',
      properties: {
        name: 'Jhelum River (Vitasta)',
        basin: 'Kashmir Valley Basin',
        status: 'Primary Flood Channel',
        gauges: ['Sangam (Warning 21ft)', 'Ram Munshi Bagh (Warning 18ft)', 'Asham (Warning 14ft)']
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.250, 33.530], // Verinag Spring
          [75.180, 33.720], // Khanabal / Anantnag
          [75.080, 33.805], // Sangam Gauging Station
          [74.920, 33.910], // Awantipora
          [74.880, 34.020], // Pampore
          [74.820, 34.080], // Srinagar (Rajbagh / Zero Bridge)
          [74.620, 34.250], // Shadipora (Sindh confluence)
          [74.520, 34.350], // Wular Lake Inlet
          [74.450, 34.330], // Sopore Outlet
          [74.340, 34.200], // Baramulla Gorge
          [74.150, 34.120], // Uri Gorge
          [73.980, 34.150]  // LoC Outbound
        ]
      }
    },
    {
      type: 'Feature',
      id: 'river-chenab',
      properties: {
        name: 'Chenab River (Chandrabhaga)',
        basin: 'Jammu High Hills & Plains',
        status: 'Major Hydropower & Flood Basin',
        gauges: ['Baglihar Reservoir', 'Salal Dam', 'Akhnoor Bridge']
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.350, 33.280], // Paddar entry
          [75.760, 33.310], // Kishtwar confluence with Marusudar
          [75.600, 33.150], // Thatri
          [75.540, 33.140], // Pul Doda
          [75.310, 33.190], // Baglihar Dam Reservoir
          [75.240, 33.240], // Ramban town
          [74.830, 33.080], // Salal Dam / Reasi
          [74.740, 32.900], // Akhnoor Bridge
          [74.650, 32.820]  // Border plains
        ]
      }
    },
    {
      type: 'Feature',
      id: 'river-tawi',
      properties: {
        name: 'Tawi River (Suryaputri)',
        basin: 'Jammu Basin',
        status: 'Flash Flood Susceptible Monsoon Channel',
        gauges: ['Udhampur Nallah', 'Nagrota Gorge', 'Guwaran / Tawi Bridges']
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.550, 32.850], // Kali Kundi glacier / Bhaderwah ridge
          [75.300, 32.900], // Chenani
          [75.130, 32.920], // Udhampur
          [74.980, 32.830], // Nagrota gorge
          [74.860, 32.720], // Jammu city bridges
          [74.750, 32.650]  // Confluence toward Chenab
        ]
      }
    },
    {
      type: 'Feature',
      id: 'river-sindh',
      properties: {
        name: 'Sindh River (Sonamarg Valley)',
        basin: 'Kashmir High Valley',
        status: 'Glacial Meltwater Discharge Channel',
        gauges: ['Sonamarg Gauge', 'Kangan Powerhouse', 'Wayil Bridge']
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.350, 34.270], // Machoi glacier / Zojila foothills
          [75.290, 34.300], // Sonamarg
          [75.150, 34.270], // Gagangeer gorge
          [74.900, 34.260], // Kangan
          [74.780, 34.220], // Ganderbal town
          [74.620, 34.250]  // Shadipora confluence with Jhelum
        ]
      }
    }
  ]
};

// Strategic transportation lifeline corridors
export const JK_HIGHWAYS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'hwy-nh44',
      properties: {
        name: 'NH-44 Jammu-Srinagar Arterial Highway',
        criticalSectors: ['Panthyal', 'Mehar', 'Cafeteria Morh', 'Banihal Tunnel', 'Samroli'],
        dangerType: 'Shooting Stones & Debris Slides'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.520, 32.380], // Lakhanpur border
          [75.120, 32.550], // Samba
          [74.850, 32.720], // Jammu Bypass
          [74.980, 32.840], // Nagrota
          [75.130, 32.920], // Udhampur
          [75.280, 33.020], // Chenani-Nashri Tunnel
          [75.240, 33.240], // Ramban town
          [75.200, 33.360], // Ramsu / Panthyal
          [75.200, 33.500], // Banihal / Navyug Tunnel
          [75.160, 33.580], // Qazigund
          [75.150, 33.730], // Khanabal / Anantnag
          [74.890, 33.870], // Awantipora
          [74.880, 34.020], // Pampore
          [74.790, 34.080]  // Srinagar
        ]
      }
    },
    {
      type: 'Feature',
      id: 'hwy-mughal',
      properties: {
        name: 'Historic Mughal Road (Shopian - Poonch)',
        criticalSectors: ['Peer Ki Gali Pass (3490m)', 'Dubjan', 'Bafliaz'],
        dangerType: 'Snow Avalanches & Blizzard Blockade'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [74.830, 33.720], // Shopian
          [74.700, 33.660], // Hirpora
          [74.550, 33.620], // Peer Ki Gali Pass
          [74.370, 33.600], // Bafliaz
          [74.280, 33.640], // Surankote
          [74.090, 33.770]  // Poonch
        ]
      }
    }
  ]
};
