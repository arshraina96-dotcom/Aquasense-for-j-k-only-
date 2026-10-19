import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Users,
  Send,
  Building2,
  RefreshCw,
  Search,
  ChevronDown
} from 'lucide-react';
import { JKDistrict, SupportedLanguage, RiskLevel, HazardType } from '../types';
import { JK_DISTRICTS } from '../data/jkDistricts';
import { TRANSLATIONS } from '../i18n/translations';

interface AuthorityDashboardProps {
  selectedDistrict: JKDistrict;
  setSelectedDistrict: (district: JKDistrict) => void;
  language: SupportedLanguage;
}

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  selectedDistrict,
  setSelectedDistrict,
  language
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Pre-authenticated demo officer session
  const [officerRole, setOfficerRole] = useState<'DM_Kashmir' | 'DM_Jammu' | 'SEOC_Controller'>('SEOC_Controller');
  const [activeTab, setActiveTab] = useState<'matrix' | 'corridors' | 'sop' | 'resources'>('matrix');
  const [searchDistrict, setSearchDistrict] = useState<string>('');
  const [sopHazardType, setSopHazardType] = useState<HazardType>('flood');
  const [generatedSop, setGeneratedSop] = useState<any | null>(null);
  const [sopApproved, setSopApproved] = useState<boolean>(false);
  const [isGeneratingSop, setIsGeneratingSop] = useState<boolean>(false);
  const t = TRANSLATIONS[language];

  const handleGenerateSop = async () => {
    setIsGeneratingSop(true);
    setSopApproved(false);

    try {
      const res = await fetch('/api/authority/sop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          districtId: selectedDistrict.id,
          hazardType: sopHazardType,
          severity: 'High'
        })
      });
      const data = await res.json();
      setGeneratedSop(data);
    } catch (e) {
      console.warn('SOP generation failed, generating local fallback:', e);
      setGeneratedSop({
        sopId: `SOP-${selectedDistrict.name.toUpperCase()}-LOCAL`,
        generatedAt: new Date().toISOString(),
        district: selectedDistrict.name,
        division: selectedDistrict.division,
        hazard: sopHazardType,
        severity: 'High',
        humanReviewRequirement: 'MANDATORY: Must be authorized by District Magistrate before dispatch.',
        actionPhases: [
          {
            phase: 'Phase 1: Alert & DEOC Activation (T-0 to T+2 Hours)',
            actions: [
              `Activate DEOC 1077 and place SDRF team on stand-by along ${selectedDistrict.rivers[0] || 'main river channel'}.`,
              `Notify Tehsildars and Police Stations in ${selectedDistrict.localities.map(l => l.name).slice(0, 3).join(', ')}.`
            ]
          },
          {
            phase: 'Phase 2: Shelter Readiness & Evacuation (T+2 to T+6 Hours)',
            actions: [
              'Verify relief shelters, backup generators, and clean water tankers.',
              'Begin voluntary relocation of vulnerable citizens from flood plains.'
            ]
          }
        ]
      });
    } finally {
      setIsGeneratingSop(false);
    }
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'Very High':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-800">Very High</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-950 text-orange-300 border border-orange-800">High</span>;
      case 'Moderate':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950 text-amber-300 border border-amber-800">Moderate</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-normal bg-emerald-950 text-emerald-300 border border-emerald-800">Low</span>;
    }
  };

  const filteredDistricts = JK_DISTRICTS.filter(d =>
    d.name.toLowerCase().includes(searchDistrict.toLowerCase()) ||
    d.division.toLowerCase().includes(searchDistrict.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* 1. OFFICER AUTHENTICATION HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Disaster Management Authority Console
              </h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                SESSION ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Role: J&amp;K State Emergency Operation Centre (SEOC) Controller · Level-2 Clearance
            </p>
          </div>
        </div>

        {/* Officer Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 hidden sm:inline">Active Officer Desk:</span>
          <select
            value={officerRole}
            onChange={(e) => setOfficerRole(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
          >
            <option value="SEOC_Controller">SEOC J&amp;K Apex Controller</option>
            <option value="DM_Kashmir">Divisional Commissioner (Kashmir)</option>
            <option value="DM_Jammu">Divisional Commissioner (Jammu)</option>
          </select>
        </div>
      </div>

      {/* 2. SUB NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
        {[
          { id: 'matrix' as const, label: 'UT-Wide District Risk Matrix', icon: Activity },
          { id: 'corridors' as const, label: 'Lifeline Highway Corridors', icon: Building2 },
          { id: 'sop' as const, label: 'SOP Generator & Response Planning', icon: FileText },
          { id: 'resources' as const, label: 'Inter-Agency Resource Worksheet', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isAct = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
                isAct
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB 1: UT-WIDE DISTRICT RISK MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                20-District Multi-Hazard Status Matrix
              </h4>
              <p className="text-xs text-slate-400">
                Synchronized real-time status across Kashmir and Jammu administrative divisions
              </p>
            </div>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                placeholder="Filter by district name or division..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3">Division</th>
                  <th className="py-2.5 px-3">Elevation</th>
                  <th className="py-2.5 px-3">Flood Risk</th>
                  <th className="py-2.5 px-3">Landslide Risk</th>
                  <th className="py-2.5 px-3">GLOF Risk</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredDistricts.map((d) => {
                  const isCur = d.id === selectedDistrict.id;
                  return (
                    <tr
                      key={d.id}
                      className={`hover:bg-slate-800/40 transition-colors ${isCur ? 'bg-cyan-950/20' : ''}`}
                    >
                      <td className="py-3 px-3 font-semibold text-white">
                        {d.name}
                        {isCur && <span className="ml-2 text-[10px] text-cyan-400 font-normal">(Active)</span>}
                      </td>
                      <td className="py-3 px-3 text-slate-400">{d.division}</td>
                      <td className="py-3 px-3 font-mono tabular-nums">{d.elevationAvgM} m</td>
                      <td className="py-3 px-3">{getRiskBadge(d.baseTerrainSusceptibility.flood)}</td>
                      <td className="py-3 px-3">{getRiskBadge(d.baseTerrainSusceptibility.landslide)}</td>
                      <td className="py-3 px-3">{getRiskBadge(d.baseTerrainSusceptibility.glof)}</td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => setSelectedDistrict(d)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Focus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAB 2: LIFELINE HIGHWAY CORRIDORS */}
      {activeTab === 'corridors' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              Arterial Highway Corridor Operational Status
            </h4>
            <p className="text-xs text-slate-400">
              Live updates from J&amp;K Traffic Police Headquarters &amp; Border Roads Organisation (BRO)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 border border-rose-800/60 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-400">CRITICAL WATCH</span>
                <span className="text-[10px] text-slate-400">Updated 10m ago</span>
              </div>
              <h5 className="font-bold text-white text-sm mb-1">NH-44 Jammu-Srinagar Highway</h5>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Shooting stones active at Mehar, Cafeteria Morh, and Panthyal in Ramban district. Heavy vehicle traffic regulated.
              </p>
              <div className="text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-800/50">
                Control Room: 01998-266686 (Traffic Ramban)
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 border border-amber-800/60 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400">CONDITIONAL ACCESS</span>
                <span className="text-[10px] text-slate-400">Updated 25m ago</span>
              </div>
              <h5 className="font-bold text-white text-sm mb-1">Mughal Road (Shopian - Poonch)</h5>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Snow chains mandatory at Peer Ki Gali (3490m MSL). Vehicular transit restricted to daylight hours (08:00 to 16:00).
              </p>
              <div className="text-[11px] text-slate-300 bg-slate-800 p-2 rounded-lg border border-slate-700">
                Plow Units: 2 active BRO bulldozers
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400">NORMAL FLOW</span>
                <span className="text-[10px] text-slate-400">Updated 1h ago</span>
              </div>
              <h5 className="font-bold text-white text-sm mb-1">NH-1D Srinagar-Sonamarg</h5>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Clear up to Sonamarg market. Zojila Pass transit subject to late-evening frost warnings.
              </p>
              <div className="text-[11px] text-slate-300 bg-slate-800 p-2 rounded-lg border border-slate-700">
                SDRF Rescue Unit: Stationed at Wayil
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: SOP GENERATOR & RESPONSE PLANNING */}
      {activeTab === 'sop' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Standard Operating Procedure (SOP) Action Worksheet
              </h4>
              <p className="text-xs text-slate-400">
                Target: <strong>{selectedDistrict.name} District</strong> ({selectedDistrict.division} Division)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sopHazardType}
                onChange={(e) => setSopHazardType(e.target.value as HazardType)}
                className="bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none"
              >
                <option value="flood">Flood Incident SOP</option>
                <option value="landslide">Landslide Incident SOP</option>
                <option value="glof">GLOF Incident SOP</option>
                <option value="extreme_weather">Severe Blizzard SOP</option>
              </select>

              <button
                onClick={handleGenerateSop}
                disabled={isGeneratingSop}
                className="py-1.5 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingSop ? 'animate-spin' : ''}`} />
                <span>{isGeneratingSop ? 'Generating...' : 'Synthesize SOP'}</span>
              </button>
            </div>
          </div>

          {generatedSop ? (
            <div className="p-5 bg-slate-800/40 border border-slate-800 rounded-xl space-y-4 text-xs">
              
              {/* Human-in-the-loop Guardrail Notice */}
              <div className="p-3 bg-amber-950/50 border border-amber-800/80 rounded-xl flex items-start gap-2.5 text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block mb-0.5">Mandatory Human Authorization Required</span>
                  <p>{generatedSop.humanReviewRequirement}</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-700">
                <span>Reference: <strong className="text-white font-mono">{generatedSop.sopId}</strong></span>
                <span>Severity Tier: <strong className="text-rose-400">{generatedSop.severity}</strong></span>
              </div>

              <div className="space-y-3">
                {generatedSop.actionPhases.map((phase: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <h5 className="font-bold text-white text-xs mb-2 text-cyan-300">{phase.phase}</h5>
                    <ul className="space-y-1.5 text-slate-300">
                      {phase.actions.map((act: string, aIdx: number) => (
                        <li key={aIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Approval Action */}
              <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
                <span className="text-slate-400">
                  {sopApproved ? 'Status: Formally Signed & Logged in Audit Trail' : 'Status: Pending Officer Signature'}
                </span>

                <button
                  onClick={() => setSopApproved(!sopApproved)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    sopApproved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{sopApproved ? 'Authorized by DDMA Controller' : 'Authorize & Sign SOP'}</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-slate-800/20 border border-slate-800 rounded-xl text-slate-400 text-xs">
              Select hazard type above and click "Synthesize SOP" to load the operational response checklist.
            </div>
          )}
        </div>
      )}

      {/* 6. TAB 4: INTER-AGENCY RESOURCE WORKSHEET */}
      {activeTab === 'resources' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 text-xs">
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              Pre-Positioned Emergency Response Assets
            </h4>
            <p className="text-slate-400">
              State Disaster Response Force (SDRF) &amp; National Disaster Response Force (NDRF 13th Bn) Deployment
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block mb-1">Inflatable Rescue Boats (Gemini)</span>
              <span className="text-xl font-bold font-mono text-cyan-400 tabular-nums">48</span>
              <span className="text-[10px] text-slate-500 block mt-1">Stationed at Sangam, Srinagar, Akhnoor</span>
            </div>
            <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block mb-1">Deep Trench Water Pumps</span>
              <span className="text-xl font-bold font-mono text-cyan-400 tabular-nums">72</span>
              <span className="text-[10px] text-slate-500 block mt-1">Bemina, Rajbagh &amp; Tawi riverfront</span>
            </div>
            <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block mb-1">Heavy Highway Earthmovers (JCB)</span>
              <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">24</span>
              <span className="text-[10px] text-slate-500 block mt-1">NH-44 Banihal, Ramban, Samroli</span>
            </div>
            <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block mb-1">Satellite Satellite Phones (IsatPhone)</span>
              <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">35</span>
              <span className="text-[10px] text-slate-500 block mt-1">Warwan, Gurez, Machail, Sinthan</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
