import { ShelterFacility } from '../types';

export const JK_SHELTERS: ShelterFacility[] = [
  // Srinagar
  {
    id: 'sh-sri-01',
    name: 'Sher-i-Kashmir Indoor Sports Complex Relief Shelter',
    district: 'Srinagar',
    lat: 34.078,
    lng: 74.809,
    address: 'Near Bakshi Stadium, Wazir Bagh, Srinagar, J&K 190008',
    capacityPersons: 1400,
    currentOccupancy: 45,
    facilities: ['Backup Solar Power', 'Reverse Osmosis Clean Water', 'First Aid Station', 'High-Plinth Elevation (Above 2014 Flood Line)', 'Blankets & Sleeping Mats', 'Sanitation Blocks'],
    contactNumber: '+91-194-2452103',
    wheelchairAccessible: true,
    verifiedDate: '2026-10-10 by JKSDMA Srinagar'
  },
  {
    id: 'sh-sri-02',
    name: 'NIT Srinagar Emergency Community Center',
    district: 'Srinagar',
    lat: 34.125,
    lng: 74.838,
    address: 'Hazratbal Campus, National Institute of Technology, Srinagar',
    capacityPersons: 850,
    currentOccupancy: 12,
    facilities: ['High Ground Location', 'Campus Infirmary & Medical Doctors', 'Food Storage', 'Ham Radio Station', 'Ambulance Bay'],
    contactNumber: '+91-194-2424809',
    wheelchairAccessible: true,
    verifiedDate: '2026-10-08 by District Administration'
  },
  {
    id: 'sh-sri-03',
    name: 'SP Higher Secondary Multi-Purpose Relief Hall',
    district: 'Srinagar',
    lat: 34.068,
    lng: 74.818,
    address: 'M.A. Road, Lal Chowk Perimeter, Srinagar',
    capacityPersons: 600,
    currentOccupancy: 0,
    facilities: ['Reinforced Concrete 2nd Floor Refuge', 'Emergency Lighting', 'Water Tankers', 'Separate Women Enclosure'],
    contactNumber: '+91-194-2479201',
    wheelchairAccessible: false,
    verifiedDate: '2026-10-05 by JK Fire & Emergency Services'
  },

  // Jammu
  {
    id: 'sh-jam-01',
    name: 'MA Stadium Disaster Evacuation & Shelter Center',
    district: 'Jammu',
    lat: 32.719,
    lng: 74.862,
    address: 'Maulana Azad Stadium, Nawabad, Jammu, J&K 180001',
    capacityPersons: 2200,
    currentOccupancy: 80,
    facilities: ['Dual Diesel Generators', 'Community Kitchen (Langar)', 'District Health Medical Post', 'Helipad Access nearby', 'Clean Water Filtration'],
    contactNumber: '+91-191-2547890',
    wheelchairAccessible: true,
    verifiedDate: '2026-10-12 by DEOC Jammu'
  },
  {
    id: 'sh-jam-02',
    name: 'Govt Polytechnic College Relief Pavilion',
    district: 'Jammu',
    lat: 32.709,
    lng: 74.878,
    address: 'Bikram Chowk, Jammu, J&K 180004',
    capacityPersons: 900,
    currentOccupancy: 0,
    facilities: ['Elevated First-Floor Hall', 'Catering Facilities', 'Emergency Medical Supplies', 'Sanitation Facility'],
    contactNumber: '+91-191-2430291',
    wheelchairAccessible: true,
    verifiedDate: '2026-10-11 by SDRF Jammu'
  },

  // Ramban (NH-44 Stranded Commuters Shelter)
  {
    id: 'sh-ram-01',
    name: 'Banihal Transit Camp & Stranded Commuter Shelter',
    district: 'Ramban',
    lat: 33.501,
    lng: 75.204,
    address: 'Railway Station Road, Banihal, Ramban, J&K 182446',
    capacityPersons: 1100,
    currentOccupancy: 140,
    facilities: ['Heated Sleeping Barracks', 'Sub-Zero Thermal Blankets', '24/7 Hot Soup & Meals', 'Medical EMT Post', 'NH-44 Traffic Status Desk'],
    contactNumber: '+91-1998-255102',
    wheelchairAccessible: true,
    verifiedDate: '2026-10-14 by Traffic Police & DEOC Ramban'
  },
  {
    id: 'sh-ram-02',
    name: 'Govt Higher Secondary School Shelter (Ramban Town)',
    district: 'Ramban',
    lat: 33.245,
    lng: 75.242,
    address: 'Maitra, Ramban, J&K 182144',
    capacityPersons: 450,
    currentOccupancy: 0,
    facilities: ['Safe Geotechnical Slope Buffer', 'Emergency Generator', 'Clean Drinking Water', 'Dry Food Rations'],
    contactNumber: '+91-1998-266710',
    wheelchairAccessible: false,
    verifiedDate: '2026-10-09 by Tehsildar Ramban'
  },

  // Anantnag
  {
    id: 'sh-ana-01',
    name: 'Govt Degree College (Boys) Flood Shelter',
    district: 'Anantnag',
    lat: 33.729,
    lng: 75.148,
    address: 'Khanabal, Anantnag, J&K 192101',
    capacityPersons: 1200,
    currentOccupancy: 30,
    facilities: ['Elevated Ground Floor', 'Backup Generators', 'Potable Water Tankers', 'Medical OPD Desk', 'Communication Link'],
    contactNumber: '+91-1932-222301',
    wheelchairAccessible: true,
    verifiedDate: '2026-10-10 by JKSDMA Anantnag'
  },

  // Baramulla
  {
    id: 'sh-bar-01',
    name: 'Indoor Sports Stadium Relief Hub (Khawaja Bagh)',
    district: 'Baramulla',
    lat: 34.209,
    lng: 74.364,
    address: 'Khawaja Bagh, Baramulla, J&K 193101',
    capacityPersons: 950,
    currentOccupancy: 0,
    facilities: ['Above Jhelum Inundation Contour', 'Hot Water Geysers', 'Infant Care Supplies', 'Emergency Stocks'],
    contactNumber: '+91-1954-234201',
    wheelchairAccessible: true,
    verifiedDate: '2026-10-07 by DEOC Baramulla'
  },

  // Ganderbal
  {
    id: 'sh-gan-01',
    name: 'Kangan Sub-District Hospital Safe Buffer Shelter',
    district: 'Ganderbal',
    lat: 34.265,
    lng: 74.901,
    address: 'Main Market, Kangan, Ganderbal, J&K 191201',
    capacityPersons: 500,
    currentOccupancy: 15,
    facilities: ['Integrated Emergency Medical Room', 'Oxygen Concentrators', 'Food & Milk Rations', 'Elevated Ridge Location'],
    contactNumber: '+91-194-2418205',
    wheelchairAccessible: true,
    verifiedDate: '2026-10-09 by Directorate of Health Kashmir'
  },

  // Kishtwar
  {
    id: 'sh-kis-01',
    name: 'Chowgan Ground Emergency Evacuation Pavilion',
    district: 'Kishtwar',
    lat: 33.315,
    lng: 75.768,
    address: 'Opposite DC Office Complex, Kishtwar, J&K 182204',
    capacityPersons: 800,
    currentOccupancy: 0,
    facilities: ['Wide Open Helipad Field', 'Communication Control Room', 'Blankets', 'Solar Power', 'Emergency Satellite Phone'],
    contactNumber: '+91-1995-259555',
    wheelchairAccessible: true,
    verifiedDate: '2026-10-13 by District Disaster Cell Kishtwar'
  }
];
