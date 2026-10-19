import { JKDistrict } from '../types';

export const JK_DISTRICTS: JKDistrict[] = [
  // Kashmir Division (10)
  {
    id: 'srinagar',
    name: 'Srinagar',
    nameHi: 'श्रीनगर',
    nameUr: 'سرینگر',
    nameKs: 'سِری نَگَر',
    nameDg: 'श्रीनगर',
    division: 'Kashmir',
    headquarters: 'Srinagar',
    lat: 34.0837,
    lng: 74.7973,
    areaSqKm: 1979,
    elevationAvgM: 1585,
    rivers: ['Jhelum River', 'Dal Lake basin', 'Anchar Lake', 'Doodh Ganga'],
    highwayCorridors: ['NH-44 Bypass', 'Srinagar-Baramulla Highway', 'Srinagar-Sonamarg Route'],
    localities: [
      { name: 'Lal Chowk / Rajbagh', elevationMeters: 1582, terrainType: 'River Basin', vulnerableFeatures: ['Jhelum Bund breach zone', 'Urban waterlogging'] },
      { name: 'Batmaloo & Bemina', elevationMeters: 1580, terrainType: 'Valley Bottom', vulnerableFeatures: ['Low-lying flood basin', 'Spill channel overflow'] },
      { name: 'Dalgate & Boulevard', elevationMeters: 1587, terrainType: 'Plains', vulnerableFeatures: ['Dal lake backwater inundation'] },
      { name: 'Hazratbal', elevationMeters: 1590, terrainType: 'Plains', vulnerableFeatures: ['Lakeside catchment run-off'] },
      { name: 'Harwan & Nishat', elevationMeters: 1650, terrainType: 'Foothills', vulnerableFeatures: ['Zabarwan foothill cloudburst flash flood'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'Very High',
      landslide: 'Low',
      glof: 'Moderate',
      extremeWeather: 'High'
    }
  },
  {
    id: 'anantnag',
    name: 'Anantnag',
    nameHi: 'अनंतनाग',
    nameUr: 'اننت ناگ',
    nameKs: 'اَنت ناگ',
    nameDg: 'अनंतनाग',
    division: 'Kashmir',
    headquarters: 'Anantnag',
    lat: 33.7311,
    lng: 75.1522,
    areaSqKm: 3574,
    elevationAvgM: 1600,
    rivers: ['Jhelum River (Sangam Gauge)', 'Lidder River', 'Bringi River', 'Sandran'],
    highwayCorridors: ['NH-44 Qazigund-Khanabal', 'Pahalgam Amarnath Route'],
    localities: [
      { name: 'Sangam Gauging Station', elevationMeters: 1588, terrainType: 'River Basin', vulnerableFeatures: ['Key Jhelum flood meter', 'Agricultural inundation'] },
      { name: 'Pahalgam Valley', elevationMeters: 2130, terrainType: 'High Mountains', vulnerableFeatures: ['Lidder flash flood', 'Cloudburst risk'] },
      { name: 'Bijbehara & Khanabal', elevationMeters: 1595, terrainType: 'River Basin', vulnerableFeatures: ['Riverbank spill', 'Silt deposition'] },
      { name: 'Kokernag & Verinag', elevationMeters: 1850, terrainType: 'Foothills', vulnerableFeatures: ['Spring recharge flooding', 'Mudslides'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'Very High',
      landslide: 'Moderate',
      glof: 'Moderate',
      extremeWeather: 'High'
    }
  },
  {
    id: 'baramulla',
    name: 'Baramulla',
    nameHi: 'बारामूला',
    nameUr: 'بارہمولہ',
    nameKs: 'بارَمولہ',
    nameDg: 'बारामूला',
    division: 'Kashmir',
    headquarters: 'Baramulla',
    lat: 34.2008,
    lng: 74.3436,
    areaSqKm: 4190,
    elevationAvgM: 1593,
    rivers: ['Jhelum River (Outflow)', 'Pohu River', 'Wular Lake margins'],
    highwayCorridors: ['NH-1 Srinagar-Baramulla-Uri Corridor', 'Tangmarg-Gulmarg Road'],
    localities: [
      { name: 'Baramulla Town', elevationMeters: 1590, terrainType: 'River Basin', vulnerableFeatures: ['Jhelum exit gorge choke point'] },
      { name: 'Gulmarg & Tangmarg', elevationMeters: 2650, terrainType: 'High Mountains', vulnerableFeatures: ['Avalanche hazard', 'Extreme snowfall'] },
      { name: 'Sopore', elevationMeters: 1582, terrainType: 'Valley Bottom', vulnerableFeatures: ['Wular lake backwash', 'Fruit orchards inundation'] },
      { name: 'Uri Gorge', elevationMeters: 1360, terrainType: 'High Mountains', vulnerableFeatures: ['Rockfalls', 'Landslides along LoC corridor'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'High',
      landslide: 'High',
      glof: 'Moderate',
      extremeWeather: 'Very High'
    }
  },
  {
    id: 'ganderbal',
    name: 'Ganderbal',
    nameHi: 'गांदरबल',
    nameUr: 'گاندربل',
    nameKs: 'گاندَربَل',
    nameDg: 'गांदरबल',
    division: 'Kashmir',
    headquarters: 'Ganderbal',
    lat: 34.2257,
    lng: 74.7805,
    areaSqKm: 1045,
    elevationAvgM: 1619,
    rivers: ['Sindh River', 'Gangabal stream', 'Manasbal Lake'],
    highwayCorridors: ['NH-1D Srinagar-Leh Highway (Sonamarg-Zojila)'],
    localities: [
      { name: 'Sonamarg & Gagangeer', elevationMeters: 2740, terrainType: 'High Mountains', vulnerableFeatures: ['Thajiwas GLOF risk', 'Snow avalanches', 'Sindh river surge'] },
      { name: 'Kangan & Wayil', elevationMeters: 1810, terrainType: 'Foothills', vulnerableFeatures: ['Flash floods from Sindh tributaries', 'Debris flow'] },
      { name: 'Ganderbal Town & Beehama', elevationMeters: 1610, terrainType: 'River Basin', vulnerableFeatures: ['Sindh river confluence inundation'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'High',
      landslide: 'High',
      glof: 'Very High',
      extremeWeather: 'Very High'
    }
  },
  {
    id: 'budgam',
    name: 'Budgam',
    nameHi: 'बडगाम',
    nameUr: 'بڈگام',
    nameKs: 'بَڈگام',
    nameDg: 'बडगाम',
    division: 'Kashmir',
    headquarters: 'Budgam',
    lat: 34.0152,
    lng: 74.7214,
    areaSqKm: 1371,
    elevationAvgM: 1610,
    rivers: ['Doodh Ganga', 'Sukhnag stream', 'Shaliganga'],
    highwayCorridors: ['Budgam-Charar-i-Sharief Road', 'Airport Road Corridor'],
    localities: [
      { name: 'Chadoora', elevationMeters: 1630, terrainType: 'River Basin', vulnerableFeatures: ['Doodh Ganga flash flooding', 'Soil erosion'] },
      { name: 'Charar-i-Sharief', elevationMeters: 1980, terrainType: 'Foothills', vulnerableFeatures: ['Karewa slope failure', 'Landslides'] },
      { name: 'Beerwah & Magam', elevationMeters: 1620, terrainType: 'Plains', vulnerableFeatures: ['Sukhnag flash runoff'] },
      { name: 'Doodhpathri', elevationMeters: 2730, terrainType: 'High Mountains', vulnerableFeatures: ['Cold surge', 'Cloudburst runoff'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'Moderate',
      landslide: 'Moderate',
      glof: 'Low',
      extremeWeather: 'High'
    }
  },
  {
    id: 'pulwama',
    name: 'Pulwama',
    nameHi: 'पुलवामा',
    nameUr: 'پلوامہ',
    nameKs: 'پُلوام',
    nameDg: 'पुलवामा',
    division: 'Kashmir',
    headquarters: 'Pulwama',
    lat: 33.8718,
    lng: 74.8953,
    areaSqKm: 1090,
    elevationAvgM: 1630,
    rivers: ['Jhelum River (Pampore stretch)', 'Rambiara outflow', 'Romshi'],
    highwayCorridors: ['NH-44 Awantipora-Pampore Stretch'],
    localities: [
      { name: 'Pampore', elevationMeters: 1585, terrainType: 'River Basin', vulnerableFeatures: ['Jhelum flood overflow', 'Saffron field waterlogging'] },
      { name: 'Awantipora', elevationMeters: 1590, terrainType: 'River Basin', vulnerableFeatures: ['River embankment erosion'] },
      { name: 'Tral Valley', elevationMeters: 1660, terrainType: 'Foothills', vulnerableFeatures: ['Tral stream flash flood'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'High',
      landslide: 'Moderate',
      glof: 'Low',
      extremeWeather: 'Moderate'
    }
  },
  {
    id: 'kulgam',
    name: 'Kulgam',
    nameHi: 'कुलगाम',
    nameUr: 'کولگام',
    nameKs: 'کُلگام',
    nameDg: 'कुलगाम',
    division: 'Kashmir',
    headquarters: 'Kulgam',
    lat: 33.6445,
    lng: 75.0189,
    areaSqKm: 1067,
    elevationAvgM: 1738,
    rivers: ['Vaishaw River', 'Aharbal stream', 'Kunder'],
    highwayCorridors: ['Kulgam-Qazigund Link', 'Mughal Road foothills'],
    localities: [
      { name: 'Aharbal Falls & Cirque', elevationMeters: 2260, terrainType: 'High Mountains', vulnerableFeatures: ['Vaishaw river surge', 'Kousarnag runoff'] },
      { name: 'Qaimoh & Khudwani', elevationMeters: 1640, terrainType: 'River Basin', vulnerableFeatures: ['Vaishaw flash inundation of farmlands'] },
      { name: 'Damhal Hanjipora', elevationMeters: 1820, terrainType: 'Foothills', vulnerableFeatures: ['Pir Panjal cloudburst torrents'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'Very High',
      landslide: 'High',
      glof: 'Moderate',
      extremeWeather: 'High'
    }
  },
  {
    id: 'shopian',
    name: 'Shopian',
    nameHi: 'शोपियां',
    nameUr: 'شوپیاں',
    nameKs: 'شۄپیان',
    nameDg: 'शोपियां',
    division: 'Kashmir',
    headquarters: 'Shopian',
    lat: 33.7208,
    lng: 74.8324,
    areaSqKm: 612,
    elevationAvgM: 2057,
    rivers: ['Rambiara River', 'Sasara stream'],
    highwayCorridors: ['Historic Mughal Road (Shopian-Bafliaz-Poonch)'],
    localities: [
      { name: 'Peer Ki Gali Pass', elevationMeters: 3490, terrainType: 'High Mountains', vulnerableFeatures: ['Heavy blizzard', 'Snow blockades', 'Avalanches'] },
      { name: 'Dubjan & Hirpora', elevationMeters: 2300, terrainType: 'High Mountains', vulnerableFeatures: ['Rambiara boulder flash flood', 'Mudslides'] },
      { name: 'Shopian Town', elevationMeters: 2050, terrainType: 'Foothills', vulnerableFeatures: ['Orchard runoff', 'Soil erosion'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'Moderate',
      landslide: 'High',
      glof: 'Moderate',
      extremeWeather: 'Very High'
    }
  },
  {
    id: 'bandipora',
    name: 'Bandipora',
    nameHi: 'बांदीपोरा',
    nameUr: 'بانڈی پورہ',
    nameKs: 'بانٛڈِ پوٗر',
    nameDg: 'बांदीपोरा',
    division: 'Kashmir',
    headquarters: 'Bandipora',
    lat: 34.4225,
    lng: 74.6469,
    areaSqKm: 345,
    elevationAvgM: 1578,
    rivers: ['Madhumi River', 'Arin Nallah', 'Wular Lake northern perimeter', 'Kishanganga (Gurez)'],
    highwayCorridors: ['Bandipora-Gurez Road over Razdan Pass'],
    localities: [
      { name: 'Gurez Valley (Dawar)', elevationMeters: 2400, terrainType: 'High Mountains', vulnerableFeatures: ['Winter cutoff', 'Kishanganga flood', 'Avalanches'] },
      { name: 'Razdan Pass', elevationMeters: 3550, terrainType: 'High Mountains', vulnerableFeatures: ['Severe snow accumulation', 'Blizzard'] },
      { name: 'Wular Shoreline', elevationMeters: 1575, terrainType: 'Valley Bottom', vulnerableFeatures: ['Wetland inundation', 'Displaced settlements'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'High',
      landslide: 'High',
      glof: 'High',
      extremeWeather: 'Very High'
    }
  },
  {
    id: 'kupwara',
    name: 'Kupwara',
    nameHi: 'कुपवाड़ा',
    nameUr: 'کپواڑہ',
    nameKs: 'کُپوارٕ',
    nameDg: 'कुपवाड़ा',
    division: 'Kashmir',
    headquarters: 'Kupwara',
    lat: 34.5262,
    lng: 74.2546,
    areaSqKm: 2379,
    elevationAvgM: 1615,
    rivers: ['Kishanganga River', 'Pohu River', 'Lolab stream', 'Mawar'],
    highwayCorridors: ['Kupwara-Tangdhar-Teetwal Road', 'Lolab Valley Highway'],
    localities: [
      { name: 'Sadhna Pass (Nastachun)', elevationMeters: 3130, terrainType: 'High Mountains', vulnerableFeatures: ['Frequent deadly avalanches', 'Snowdrifts'] },
      { name: 'Tangdhar & Karnah', elevationMeters: 1700, terrainType: 'High Mountains', vulnerableFeatures: ['Cloudburst washouts', 'Isolation hazard'] },
      { name: 'Lolab Valley', elevationMeters: 1650, terrainType: 'Foothills', vulnerableFeatures: ['Flash torrents in streams'] },
      { name: 'Handwara', elevationMeters: 1600, terrainType: 'River Basin', vulnerableFeatures: ['Pohu river overbanking'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'High',
      landslide: 'Very High',
      glof: 'Moderate',
      extremeWeather: 'Very High'
    }
  },

  // Jammu Division (10)
  {
    id: 'jammu',
    name: 'Jammu',
    nameHi: 'जम्मू',
    nameUr: 'جموں',
    nameKs: 'جۆم',
    nameDg: 'जम्मू',
    division: 'Jammu',
    headquarters: 'Jammu',
    lat: 32.7266,
    lng: 74.857,
    areaSqKm: 2342,
    elevationAvgM: 327,
    rivers: ['Tawi River (Suryaputri)', 'Chenab River (Akhnoor bridge)', 'Ranbir Canal'],
    highwayCorridors: ['NH-44 Pathankot-Jammu-Udhampur', 'Jammu-Poonch Highway'],
    localities: [
      { name: 'Old City & Tawi Bridges', elevationMeters: 330, terrainType: 'River Basin', vulnerableFeatures: ['Tawi river flash flood cresting', 'Artificial lake bund stress'] },
      { name: 'Akhnoor & Pargwal', elevationMeters: 300, terrainType: 'River Basin', vulnerableFeatures: ['Chenab river massive silt flow', 'Island border flood'] },
      { name: 'Bahu Fort & Circular Road', elevationMeters: 360, terrainType: 'Foothills', vulnerableFeatures: ['Sub-Himalayan slope slumping'] },
      { name: 'Bishnah & R.S. Pura', elevationMeters: 280, terrainType: 'Plains', vulnerableFeatures: ['Agricultural drainage inundation'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'Very High',
      landslide: 'Low',
      glof: 'Low',
      extremeWeather: 'High'
    }
  },
  {
    id: 'ramban',
    name: 'Ramban',
    nameHi: 'रामबन',
    nameUr: 'رام بن',
    nameKs: 'رام بَن',
    nameDg: 'रामबन',
    division: 'Jammu',
    headquarters: 'Ramban',
    lat: 33.2427,
    lng: 75.2415,
    areaSqKm: 1329,
    elevationAvgM: 1156,
    rivers: ['Chenab River (Baglihar Dam basin)', 'Bichleri stream'],
    highwayCorridors: ['NH-44 Jammu-Srinagar Arterial Highway (Critical Section)'],
    localities: [
      { name: 'Panthyal & Magarkote', elevationMeters: 1250, terrainType: 'High Mountains', vulnerableFeatures: ['Shooting stones', 'Major debris flow across NH-44'] },
      { name: 'Mehar & Cafeteria Morh', elevationMeters: 1120, terrainType: 'High Mountains', vulnerableFeatures: ['Persistent deep-seated highway landslide sink'] },
      { name: 'Banihal & Shabanbas', elevationMeters: 1670, terrainType: 'High Mountains', vulnerableFeatures: ['Tunnel approach snow block', 'Cloudbursts'] },
      { name: 'Batote & Sanasar', elevationMeters: 1560, terrainType: 'Foothills', vulnerableFeatures: ['Slope failure', 'Sinkholes'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'High',
      landslide: 'Very High',
      glof: 'Low',
      extremeWeather: 'Very High'
    }
  },
  {
    id: 'udhampur',
    name: 'Udhampur',
    nameHi: 'उधमपुर',
    nameUr: 'ادھم پور',
    nameKs: 'اُدھَم پوٗر',
    nameDg: 'उधमपुर',
    division: 'Jammu',
    headquarters: 'Udhampur',
    lat: 32.9248,
    lng: 75.1342,
    areaSqKm: 2637,
    elevationAvgM: 756,
    rivers: ['Tawi upper reaches', 'Dhudhar', 'Birun Nallah'],
    highwayCorridors: ['NH-44 Chenani-Nashri Tunnel Corridor', 'Dhar Road'],
    localities: [
      { name: 'Chenani & Patnitop', elevationMeters: 2024, terrainType: 'High Mountains', vulnerableFeatures: ['Heavy snowfall', 'Fog and ice on roads', 'Hill slippage'] },
      { name: 'Samroli & Kheri', elevationMeters: 850, terrainType: 'Foothills', vulnerableFeatures: ['NH-44 mudslides', 'Subsurface shear failure'] },
      { name: 'Udhampur City', elevationMeters: 750, terrainType: 'Plains', vulnerableFeatures: ['Flash drainage overflow'] },
      { name: 'Ramnagar', elevationMeters: 920, terrainType: 'Foothills', vulnerableFeatures: ['Nallah swell cutoffs'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'Moderate',
      landslide: 'Very High',
      glof: 'Low',
      extremeWeather: 'High'
    }
  },
  {
    id: 'reasi',
    name: 'Reasi',
    nameHi: 'रियासी',
    nameUr: 'ریاسی',
    nameKs: 'رِیاسی',
    nameDg: 'रियासी',
    division: 'Jammu',
    headquarters: 'Reasi',
    lat: 33.0827,
    lng: 74.8327,
    areaSqKm: 1719,
    elevationAvgM: 466,
    rivers: ['Chenab River (Salal Dam)', 'Anji Khad River (World Highest Arch Bridge)'],
    highwayCorridors: ['Katra-Reasi-Bakkal Link', 'Katra Vaishno Devi Pilgrimage Corridor'],
    localities: [
      { name: 'Katra (Vaishno Devi Base)', elevationMeters: 875, terrainType: 'Foothills', vulnerableFeatures: ['Trikuta hill rockfalls', 'Pilgrim route flash floods'] },
      { name: 'Bakkal / Kauri (Chenab Arch Bridge)', elevationMeters: 800, terrainType: 'High Mountains', vulnerableFeatures: ['Deep gorge high winds (>120 km/h)', 'Steep cliff drops'] },
      { name: 'Salal Reservoir Zone', elevationMeters: 450, terrainType: 'River Basin', vulnerableFeatures: ['Dam overflow spill', 'Silt influx'] },
      { name: 'Mahore & Gool', elevationMeters: 1400, terrainType: 'High Mountains', vulnerableFeatures: ['Remote mountain slope landslides'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'High',
      landslide: 'Very High',
      glof: 'Low',
      extremeWeather: 'High'
    }
  },
  {
    id: 'doda',
    name: 'Doda',
    nameHi: 'डोडा',
    nameUr: 'ڈوڈہ',
    nameKs: 'ڈوڈَہ',
    nameDg: 'डोडा',
    division: 'Jammu',
    headquarters: 'Doda',
    lat: 33.1455,
    lng: 75.5469,
    areaSqKm: 2625,
    elevationAvgM: 1107,
    rivers: ['Chenab River', 'Neeru River (Bhaderwah)', 'Kalgoni'],
    highwayCorridors: ['NH-244 Batote-Kishtwar Highway', 'Doda-Bhaderwah Highway'],
    localities: [
      { name: 'Assar & Pul Doda', elevationMeters: 1050, terrainType: 'High Mountains', vulnerableFeatures: ['NH-244 Chenab road collapses', 'Shooting boulders'] },
      { name: 'Bhaderwah (Chhota Kashmir)', elevationMeters: 1613, terrainType: 'Valley Bottom', vulnerableFeatures: ['Neeru flash floods', 'Heavy winter snowfall'] },
      { name: 'Thatri', elevationMeters: 980, terrainType: 'River Basin', vulnerableFeatures: ['Cloudburst flash flood hotspot (historic 2017/2021 events)'] },
      { name: 'Nai Basti Slumping Zone', elevationMeters: 1200, terrainType: 'Foothills', vulnerableFeatures: ['Active land subsidence affecting dwellings'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'High',
      landslide: 'Very High',
      glof: 'Moderate',
      extremeWeather: 'Very High'
    }
  },
  {
    id: 'kishtwar',
    name: 'Kishtwar',
    nameHi: 'किश्तवाड़',
    nameUr: 'کشتواڑ',
    nameKs: 'کِشتوار',
    nameDg: 'किश्तवाड़',
    division: 'Jammu',
    headquarters: 'Kishtwar',
    lat: 33.3134,
    lng: 75.7667,
    areaSqKm: 7737,
    elevationAvgM: 1638,
    rivers: ['Chenab River (Chandrabhaga)', 'Marusudar River', 'Warwan River'],
    highwayCorridors: ['NH-244 over Sinthan Top Pass to Anantnag', 'Paddar-Machail Road'],
    localities: [
      { name: 'Warwan & Marwah Valleys', elevationMeters: 2300, terrainType: 'High Mountains', vulnerableFeatures: ['Himalayan glacial lake outburst vulnerability', '6-month winter isolation', 'Marusudar surges'] },
      { name: 'Dachan & Honzar', elevationMeters: 1900, terrainType: 'High Mountains', vulnerableFeatures: ['Cloudburst flash floods (2021 disaster epicenter)'] },
      { name: 'Paddar (Sapphire Valley)', elevationMeters: 2100, terrainType: 'High Mountains', vulnerableFeatures: ['Machail pilgrim route flash floods', 'Debris flow'] },
      { name: 'Sinthan Top Pass', elevationMeters: 3748, terrainType: 'High Mountains', vulnerableFeatures: ['Heavy blizzards', 'Sub-zero freezes', 'Vehicular stranding'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'High',
      landslide: 'Very High',
      glof: 'Very High',
      extremeWeather: 'Very High'
    }
  },
  {
    id: 'poonch',
    name: 'Poonch',
    nameHi: 'पुंछ',
    nameUr: 'پونچھ',
    nameKs: 'پوٗنٛچھ',
    nameDg: 'पुंछ',
    division: 'Jammu',
    headquarters: 'Poonch',
    lat: 33.7715,
    lng: 74.095,
    areaSqKm: 1674,
    elevationAvgM: 981,
    rivers: ['Poonch River', 'Suran River', 'Betar Nallah', 'Mandi stream'],
    highwayCorridors: ['Jammu-Rajouri-Poonch Highway', 'Mughal Road western ascent (Bafliaz)'],
    localities: [
      { name: 'Poonch City & Betar Nallah', elevationMeters: 980, terrainType: 'River Basin', vulnerableFeatures: ['Poonch river flash flooding', 'Bridge scouring'] },
      { name: 'Surankote & Bafliaz', elevationMeters: 1400, terrainType: 'Foothills', vulnerableFeatures: ['Suran river torrential runoff', 'Mughal road slip'] },
      { name: 'Mandi & Loran', elevationMeters: 1550, terrainType: 'High Mountains', vulnerableFeatures: ['Pir Panjal cloudburst debris avalanches'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'Very High',
      landslide: 'Very High',
      glof: 'Moderate',
      extremeWeather: 'High'
    }
  },
  {
    id: 'rajouri',
    name: 'Rajouri',
    nameHi: 'राजौरी',
    nameUr: 'راجوری',
    nameKs: 'راجوٗری',
    nameDg: 'राजौरी',
    division: 'Jammu',
    headquarters: 'Rajouri',
    lat: 33.3769,
    lng: 74.3168,
    areaSqKm: 2630,
    elevationAvgM: 915,
    rivers: ['Manawar Tawi', 'Ans River', 'Sukhtaw'],
    highwayCorridors: ['NH-144A Jammu-Rajouri-Poonch Highway', 'Budhal-Chassana Link'],
    localities: [
      { name: 'Rajouri Town', elevationMeters: 915, terrainType: 'River Basin', vulnerableFeatures: ['Manawar Tawi surge inundating low markets'] },
      { name: 'Thanamandi & Dera Ki Gali', elevationMeters: 1650, terrainType: 'High Mountains', vulnerableFeatures: ['Mughal road landslides', 'Rockfall zone'] },
      { name: 'Nowshera & Sunderbani', elevationMeters: 620, terrainType: 'Foothills', vulnerableFeatures: ['Tawi tributary culvert flooding'] },
      { name: 'Budhal / Kotranka', elevationMeters: 1420, terrainType: 'High Mountains', vulnerableFeatures: ['Ans river flash flood', 'Slope instability'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'High',
      landslide: 'High',
      glof: 'Low',
      extremeWeather: 'High'
    }
  },
  {
    id: 'kathua',
    name: 'Kathua',
    nameHi: 'कठुआ',
    nameUr: 'کٹھوعہ',
    nameKs: 'کَٹھُوٗعہ',
    nameDg: 'कठुआ',
    division: 'Jammu',
    headquarters: 'Kathua',
    lat: 32.3831,
    lng: 75.5204,
    areaSqKm: 2502,
    elevationAvgM: 393,
    rivers: ['Ravi River (Ranjit Sagar Dam)', 'Ujh River', 'Tarnah Nallah', 'Basantar basin'],
    highwayCorridors: ['NH-44 Entry corridor (Lakhanpur border gateway)', 'Dhar Road via Basohli'],
    localities: [
      { name: 'Ujh Barrage & Plains', elevationMeters: 340, terrainType: 'River Basin', vulnerableFeatures: ['Ujh river massive flash flood (300,000 cusecs peaks)', 'Embankment washaway'] },
      { name: 'Billawar & Basohli', elevationMeters: 850, terrainType: 'Foothills', vulnerableFeatures: ['Ranjit Sagar reservoir slopes', 'Shivalik landslides'] },
      { name: 'Bani (Mini Himachal)', elevationMeters: 1300, terrainType: 'High Mountains', vulnerableFeatures: ['Sewa river flash floods', 'Road cutoffs'] },
      { name: 'Lakhanpur & Hiranagar', elevationMeters: 310, terrainType: 'Plains', vulnerableFeatures: ['Interstate highway culvert inundation'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'Very High',
      landslide: 'Moderate',
      glof: 'Low',
      extremeWeather: 'High'
    }
  },
  {
    id: 'samba',
    name: 'Samba',
    nameHi: 'सांबा',
    nameUr: 'سانبہ',
    nameKs: 'سامبا',
    nameDg: 'सांबा',
    division: 'Jammu',
    headquarters: 'Samba',
    lat: 32.5562,
    lng: 75.1189,
    areaSqKm: 904,
    elevationAvgM: 384,
    rivers: ['Basantar River', 'Devak stream'],
    highwayCorridors: ['NH-44 Corridor', 'Samba-Mansar Road'],
    localities: [
      { name: 'Basantar River Crossing', elevationMeters: 360, terrainType: 'River Basin', vulnerableFeatures: ['Flash floods from Shivalik upper catchments', 'Bridge scouring'] },
      { name: 'Vijaypur & Bari Brahmana', elevationMeters: 320, terrainType: 'Plains', vulnerableFeatures: ['Industrial area drainage overflows'] },
      { name: 'Mansar & Surinsar Lakes zone', elevationMeters: 660, terrainType: 'Foothills', vulnerableFeatures: ['Erosion', 'Lake catchment siltation'] }
    ],
    baseTerrainSusceptibility: {
      flood: 'High',
      landslide: 'Low',
      glof: 'Low',
      extremeWeather: 'Moderate'
    }
  }
];

export const JK_DIVISIONS = ['All', 'Kashmir', 'Jammu'] as const;
