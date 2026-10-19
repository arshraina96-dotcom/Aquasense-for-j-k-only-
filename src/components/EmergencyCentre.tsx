import React, { useState } from 'react';
import {
  PhoneCall,
  Shield,
  MapPin,
  Share2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Download,
  BookOpen,
  ArrowRight,
  Accessibility
} from 'lucide-react';
import { JKDistrict, SupportedLanguage, ShelterFacility, EmergencyContact } from '../types';
import { JK_SHELTERS } from '../data/jkShelters';
import { JK_EMERGENCY_CONTACTS } from '../data/jkContacts';
import { TRANSLATIONS } from '../i18n/translations';

interface EmergencyCentreProps {
  selectedDistrict: JKDistrict;
  language: SupportedLanguage;
}

export const EmergencyCentre: React.FC<EmergencyCentreProps> = ({
  selectedDistrict,
  language
}) => {
  const [shelterSearch, setShelterSearch] = useState('');
  const [copiedLocation, setCopiedLocation] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<'flood' | 'landslide' | 'glof' | 'winter'>('flood');
  const t = TRANSLATIONS[language];

  // Calculate approximate distance from current district center to shelter
  const sheltersWithDistance = JK_SHELTERS.map((s) => {
    const distKm = Math.round(
      Math.hypot((s.lat - selectedDistrict.lat) * 111, (s.lng - selectedDistrict.lng) * 88)
    );
    return { ...s, distKm };
  }).sort((a, b) => a.distKm - b.distKm);

  const filteredShelters = sheltersWithDistance.filter(s =>
    s.name.toLowerCase().includes(shelterSearch.toLowerCase()) ||
    s.address.toLowerCase().includes(shelterSearch.toLowerCase()) ||
    s.district.toLowerCase().includes(shelterSearch.toLowerCase())
  );

  const handleShareLocation = () => {
    const locText = `[AquaSense Emergency SOS] My location: Near ${selectedDistrict.name} District (${selectedDistrict.division} Division), J&K. Coordinates: ${selectedDistrict.lat.toFixed(4)}°N, ${selectedDistrict.lng.toFixed(4)}°E. In emergency call 112.`;
    navigator.clipboard.writeText(locText);
    setCopiedLocation(true);
    setTimeout(() => setCopiedLocation(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. SOS ACTION HERO BANNER */}
      <div className="bg-gradient-to-r from-red-950/70 via-rose-950/60 to-slate-900 border border-red-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
              Emergency SOS Response Network
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
            {t.sosTitle}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-5">
            {t.sosSubtitle} Always call 112 directly for active rescue, police, medical ambulance, or boat dispatch in Jammu &amp; Kashmir.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:112"
              className="py-3 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-red-700/40 transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>{t.sosEmergencyCall}</span>
            </a>

            <button
              onClick={handleShareLocation}
              className="py-3 px-5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>{copiedLocation ? 'Coordinates Copied!' : t.actions.shareLocation}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mt-4">
            Notice: Telephony links route via your mobile SIM provider to local J&amp;K emergency services.
          </p>
        </div>
      </div>

      {/* 2. VERIFIED SHELTERS DIRECTORY */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>{t.sheltersTitle}</span>
            </h4>
            <p className="text-xs text-slate-400">
              Verified reinforced community halls, indoor complexes, and colleges above historical flood contours
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={shelterSearch}
              onChange={(e) => setShelterSearch(e.target.value)}
              placeholder="Search shelters by town or name..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredShelters.slice(0, 6).map((shelter) => (
            <div
              key={shelter.id}
              className="p-4 bg-slate-800/40 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h5 className="font-bold text-white text-sm line-clamp-1">{shelter.name}</h5>
                  <span className="text-xs font-mono font-semibold text-cyan-400 tabular-nums shrink-0 ml-2">
                    ~{shelter.distKm} km
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="line-clamp-1">{shelter.address}</span>
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs mb-3 text-slate-300">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Capacity: <strong className="text-white font-mono">{shelter.capacityPersons}</strong> persons</span>
                  </span>
                  {shelter.wheelchairAccessible && (
                    <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                      <Accessibility className="w-3.5 h-3.5" />
                      <span>Accessible</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {shelter.facilities.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <a
                  href={`tel:${shelter.contactNumber}`}
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>{shelter.contactNumber}</span>
                </a>
                <span className="text-[10px] text-slate-400">{shelter.verifiedDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. OFFICIAL EMERGENCY CONTACT DIRECTORY */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <h4 className="text-base font-bold text-white tracking-tight mb-1 flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          <span>{t.contactsTitle}</span>
        </h4>
        <p className="text-xs text-slate-400 mb-4">
          Verified toll-free and control room numbers for state disaster management in J&amp;K
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {JK_EMERGENCY_CONTACTS.map((cnt) => (
            <div
              key={cnt.id}
              className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h5 className="font-semibold text-white text-xs">{cnt.agency}</h5>
                  {cnt.tollFree && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.2 rounded">
                      Toll-Free
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mb-3">{cnt.role}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/80">
                <a
                  href={`tel:${cnt.number}`}
                  className="text-sm font-mono font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{cnt.number}</span>
                </a>
                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{cnt.coverage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. PREPAREDNESS GUIDES (CACHED OFFLINE) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h4 className="text-base font-bold text-white tracking-tight">
              Community Disaster Preparedness Guides
            </h4>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
            Cached for Offline Access
          </span>
        </div>

        {/* Guide Selector Tabs */}
        <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'flood' as const, label: 'Flood & River Surge' },
            { id: 'landslide' as const, label: 'NH-44 Landslides' },
            { id: 'glof' as const, label: 'Glacial Lake Outbursts' },
            { id: 'winter' as const, label: 'Blizzards & Snow Avalanches' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedGuide(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedGuide === tab.id
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Guide Content */}
        <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl text-xs space-y-3 leading-relaxed text-slate-300">
          {selectedGuide === 'flood' && (
            <>
              <h5 className="font-bold text-sm text-white">Jhelum &amp; Chenab Basin Flood Protocols</h5>
              <p>• Prior to flooding, elevate valuable electronics, dry food grain stores, and clean drinking water containers to first floors or attics.</p>
              <p>• Never cross flooded irrigation canals or causeways when water depth exceeds 15 cm (6 inches); rapid currents can knock adults down.</p>
              <p>• Keep cattle unhitched so animals can swim to higher ground if floodwaters breach river dykes.</p>
            </>
          )}

          {selectedGuide === 'landslide' && (
            <>
              <h5 className="font-bold text-sm text-white">Pir Panjal &amp; NH-44 Landslide Survival Directives</h5>
              <p>• Check NH-44 Traffic Control Room Ramban (01998-266686) before traveling through the Ramban-Banihal sector.</p>
              <p>• Watch for sudden trickles of muddy water, rolling pebbles, or leaning utility poles on highway slopes.</p>
              <p>• If trapped inside a stationary vehicle during a rockfall, stay inside with seatbelts fastened and lean away from the uphill rock face.</p>
            </>
          )}

          {selectedGuide === 'glof' && (
            <>
              <h5 className="font-bold text-sm text-white">Himalayan Glacial Lake Outburst (GLOF) Awareness</h5>
              <p>• Proglacial moraine dams can breach suddenly following intense summer heatwaves or cloudbursts.</p>
              <p>• If you hear an unusual, deep roaring rumble from upper glaciated cirques or notice river water suddenly turn chalky-gray, evacuate immediately to ridges at least 30 meters above the valley floor.</p>
              <p>• Never pitch tents or build temporary shelters along dry boulder-strewn streambeds in alpine valleys (Warwan, Sonamarg, Paddar).</p>
            </>
          )}

          {selectedGuide === 'winter' && (
            <>
              <h5 className="font-bold text-sm text-white">Extreme Cold, Snowdrifts &amp; Avalanche Precautions</h5>
              <p>• Keep a minimum 3-day supply of dry firewood, kerosene, canned foods, and essential medicines during winter months in high-altitude zones (Gurez, Machail, Sinthan, Tangdhar).</p>
              <p>• Prevent carbon monoxide poisoning: ensure kerosene heaters (Bukhari) have unobstructed ventilation pipes to the exterior.</p>
              <p>• Equip all passenger vehicles with anti-skid tire chains and shovel kits when traveling over mountain passes.</p>
            </>
          )}
        </div>
      </div>

    </div>
  );
};
