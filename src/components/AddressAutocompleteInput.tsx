import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Building2, Check, Loader2, MapPin, Star, X } from 'lucide-react';
import { Language, LocalLandmark } from '../data/transferData';

export interface PhotonProperties {
  osm_id?: number;
  osm_type?: string;
  name?: string;
  street?: string;
  housenumber?: string;
  district?: string;
  city?: string;
  county?: string;
  state?: string;
  country?: string;
  countrycode?: string;
  osm_value?: string;
}

interface PhotonFeature {
  properties?: PhotonProperties;
}

interface PhotonResponse {
  features?: PhotonFeature[];
}

export interface PresetDestinationOption {
  id: string;
  label: string;
  subtitle: string;
  meta?: string;
}

interface FormattedSuggestion {
  id: string;
  title: string;
  subtitle: string;
  fullText: string;
  properties: PhotonProperties;
}

interface AddressAutocompleteInputProps {
  id: string;
  ariaLabel?: string;
  value: string;
  placeholder: string;
  icon: 'pin' | 'hotel';
  lang: Language;
  error?: boolean;
  presets?: PresetDestinationOption[];
  selectedPresetId?: string;
  presetsHeading?: string;
  landmarks?: LocalLandmark[];
  landmarksHeading?: string;
  suggestionsHeading?: string;
  searchingLabel: string;
  clearAriaLabel: string;
  onChangeText: (text: string) => void;
  onSelectPreset?: (preset: PresetDestinationOption) => void;
  onSelectLandmark?: (landmark: LocalLandmark, formattedAddress: string) => void;
  onSelectSuggestion: (formattedAddress: string, properties: PhotonProperties) => void;
}

const KYRGYZSTAN_BBOX = '69.2,39.1,80.3,43.3';

function isKyrgyzstanFeature(feature: PhotonFeature): boolean {
  const p = feature.properties;
  if (!p) return false;

  const code = p.countrycode?.trim().toUpperCase();
  if (code === 'KG') return true;

  const country = p.country?.trim().toLowerCase() ?? '';
  return (
    country === 'kyrgyzstan' ||
    country === 'кыргызстан' ||
    country === 'киргизия' ||
    country === 'kyrgyz republic' ||
    country === 'кыргызская республика'
  );
}

function dedupeParts(parts: (string | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of parts) {
    const trimmed = part?.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(trimmed);
  }
  return out;
}

function formatPhotonFeature(feature: PhotonFeature, idx: number): FormattedSuggestion | null {
  const p = feature.properties;
  if (!p) return null;

  const streetWithNum = [p.street, p.housenumber].filter(Boolean).join(' ').trim();
  const title = p.name?.trim() || streetWithNum || p.city?.trim() || p.state?.trim();
  if (!title) return null;

  const subtitleParts = dedupeParts([
    streetWithNum && streetWithNum.toLowerCase() !== title.toLowerCase() ? streetWithNum : undefined,
    p.district && p.district.toLowerCase() !== title.toLowerCase() ? p.district : undefined,
    p.city && p.city.toLowerCase() !== title.toLowerCase() ? p.city : undefined,
    p.state &&
    p.state.toLowerCase() !== title.toLowerCase() &&
    p.state.toLowerCase() !== p.city?.toLowerCase()
      ? p.state
      : undefined,
    p.country,
  ]);

  const subtitle = subtitleParts.join(', ');

  const compactParts = dedupeParts([
    title,
    streetWithNum && streetWithNum.toLowerCase() !== title.toLowerCase() ? streetWithNum : undefined,
    p.city && p.city.toLowerCase() !== title.toLowerCase() ? p.city : undefined,
  ]);

  const fullText = compactParts.join(', ');
  const id = `${p.osm_type ?? 'f'}-${p.osm_id ?? idx}-${fullText}`;

  return {
    id,
    title,
    subtitle,
    fullText,
    properties: p,
  };
}

function extractKyrgyzSuggestions(data: PhotonResponse): FormattedSuggestion[] {
  const features = Array.isArray(data.features) ? data.features : [];
  const formatted: FormattedSuggestion[] = [];
  const seenTexts = new Set<string>();

  for (let i = 0; i < features.length; i += 1) {
    if (!isKyrgyzstanFeature(features[i])) continue;
    const item = formatPhotonFeature(features[i], i);
    if (!item) continue;
    const key = item.fullText.toLowerCase();
    if (seenTexts.has(key)) continue;
    seenTexts.add(key);
    formatted.push(item);
    if (formatted.length >= 5) break;
  }

  return formatted;
}

async function fetchPhotonKyrgyzstan(
  query: string,
  lang: Language,
  signal: AbortSignal
): Promise<FormattedSuggestion[]> {
  const baseUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(
    query
  )}&lat=42.8746&lon=74.5698&bbox=${KYRGYZSTAN_BBOX}&limit=8`;

  // Primary request with active UI language (lang=ru or lang=en)
  try {
    const primaryRes = await fetch(`${baseUrl}&lang=${lang}`, { signal });
    if (primaryRes.ok) {
      const primaryData: PhotonResponse = await primaryRes.json();
      const primaryResults = extractKyrgyzSuggestions(primaryData);
      if (primaryResults.length > 0 || lang === 'en') {
        return primaryResults;
      }
    }
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
    // Continue to fallback below if primary request with lang failed
  }

  // Fallback request without lang parameter (e.g. if Photon doesn't return lang=ru results)
  const fallbackRes = await fetch(baseUrl, { signal });
  if (!fallbackRes.ok) {
    throw new Error(`Photon HTTP ${fallbackRes.status}`);
  }
  const fallbackData: PhotonResponse = await fallbackRes.json();
  return extractKyrgyzSuggestions(fallbackData);
}

function matchesLandmarkQuery(landmark: LocalLandmark, rawQuery: string): boolean {
  const normalized = rawQuery.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    landmark.name.en,
    landmark.name.ru,
    landmark.address.en,
    landmark.address.ru,
    ...landmark.keywords,
  ]
    .join(' ')
    .toLowerCase();

  // Require every typed word (token) to appear in the landmark's bilingual text/keywords
  // so multi-word queries like "глобус токомбаева" match instantly and accurately.
  const tokens = normalized.split(/\s+/).filter(Boolean);
  return tokens.every((token) => haystack.includes(token));
}

type DropdownItem =
  | { kind: 'preset'; preset: PresetDestinationOption }
  | { kind: 'landmark'; landmark: LocalLandmark }
  | { kind: 'suggestion'; suggestion: FormattedSuggestion };

export function AddressAutocompleteInput({
  id,
  ariaLabel,
  value,
  placeholder,
  icon,
  lang,
  error = false,
  presets,
  selectedPresetId,
  presetsHeading,
  landmarks,
  landmarksHeading,
  suggestionsHeading,
  searchingLabel,
  clearAriaLabel,
  onChangeText,
  onSelectPreset,
  onSelectLandmark,
  onSelectSuggestion,
}: AddressAutocompleteInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const skipNextFetchRef = useRef(false);

  const [isOpen, setIsOpen] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<FormattedSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Photon live search (400ms), strictly bounded & filtered to Kyrgyzstan
  useEffect(() => {
    if (!isOpen || !hasTyped) return;

    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }

    const query = value.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const kgSuggestions = await fetchPhotonKyrgyzstan(query, lang, controller.signal);
        setSuggestions(kgSuggestions);
        setActiveIndex(-1);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 400);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [value, lang, isOpen, hasTyped]);

  // Filter fixed-fare destination presets
  const filteredPresets = (() => {
    if (!presets || presets.length === 0) return [];
    const trimmed = value.trim().toLowerCase();
    if (!hasTyped || !trimmed) return presets;
    return presets.filter(
      (p) =>
        p.label.toLowerCase().includes(trimmed) ||
        p.subtitle.toLowerCase().includes(trimmed) ||
        p.id.toLowerCase().includes(trimmed)
    );
  })();

  // Instant local Bishkek landmarks & hotels matching (works immediately with 0ms delay)
  const filteredLandmarks = (() => {
    if (!landmarks || landmarks.length === 0) return [];
    const trimmed = value.trim();
    // On Drop-off (when presets exist), show matching landmarks as soon as user starts typing;
    // on Hotel/Destination (no presets), show top popular landmarks on focus too!
    if (presets && presets.length > 0 && (!hasTyped || trimmed.length < 2)) {
      return [];
    }
    if (!trimmed) {
      return landmarks.slice(0, 5);
    }
    return landmarks.filter((item) => matchesLandmarkQuery(item, trimmed)).slice(0, 5);
  })();

  // Avoid showing duplicate Photon items that already appear in the instant local landmarks list
  const landmarkNameKeys = new Set(
    filteredLandmarks.flatMap((l) => [l.name.en.toLowerCase(), l.name.ru.toLowerCase()])
  );
  const dedupedSuggestions = suggestions.filter(
    (s) => !landmarkNameKeys.has(s.title.toLowerCase())
  );

  const combinedItems: DropdownItem[] = [
    ...filteredPresets.map((preset): DropdownItem => ({ kind: 'preset', preset })),
    ...filteredLandmarks.map((landmark): DropdownItem => ({ kind: 'landmark', landmark })),
    ...dedupedSuggestions.map((suggestion): DropdownItem => ({ kind: 'suggestion', suggestion })),
  ];

  const showDropdown =
    isOpen &&
    (filteredPresets.length > 0 ||
      filteredLandmarks.length > 0 ||
      dedupedSuggestions.length > 0 ||
      isLoading);

  const handleSelectItem = (item: DropdownItem) => {
    skipNextFetchRef.current = true;
    setHasTyped(false);
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);

    if (item.kind === 'preset') {
      onSelectPreset?.(item.preset);
    } else if (item.kind === 'landmark') {
      const formatted = `${item.landmark.name[lang]}, ${item.landmark.address[lang]}`;
      if (onSelectLandmark) {
        onSelectLandmark(item.landmark, formatted);
      } else {
        onChangeText(formatted);
      }
    } else {
      onSelectSuggestion(item.suggestion.fullText, item.suggestion.properties);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!showDropdown || combinedItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % combinedItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? combinedItems.length - 1 : prev - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && activeIndex < combinedItems.length) {
      e.preventDefault();
      handleSelectItem(combinedItems[activeIndex]);
    }
  };

  const LeadingIcon = icon === 'hotel' ? Building2 : MapPin;

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <LeadingIcon className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          autoComplete="off"
          value={value}
          onFocus={() => {
            setIsOpen(true);
            if (!presets) {
              setHasTyped(true);
            }
          }}
          onChange={(e) => {
            setHasTyped(true);
            setIsOpen(true);
            onChangeText(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-[#F8FAFC] focus:bg-white border rounded-xl pl-10 pr-9 py-2.5 text-[14px] font-medium text-[#041427] placeholder:font-normal placeholder:text-[#94A3B8] outline-none transition-colors ${
            error
              ? 'border-rose-500 bg-rose-50/40 focus:border-rose-600'
              : 'border-[#CBD5E1] focus:border-[#0f2747]'
          }`}
        />

        {/* Right slot: Loading spinner or Clear button */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
          {isLoading ? (
            <Loader2
              className="w-4 h-4 text-[#c8a663] animate-spin"
              aria-label={searchingLabel}
            />
          ) : value.length > 0 ? (
            <button
              type="button"
              tabIndex={-1}
              aria-label={clearAriaLabel}
              onClick={() => {
                skipNextFetchRef.current = false;
                setHasTyped(true);
                setSuggestions([]);
                onChangeText('');
                setIsOpen(true);
                inputRef.current?.focus();
              }}
              className="inline-flex items-center justify-center w-6 h-6 rounded-md text-[#94A3B8] hover:text-[#041427] hover:bg-[#E2E8F0]/60 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown List */}
      {showDropdown && (
        <div
          role="listbox"
          className="absolute left-0 right-0 mt-1.5 z-40 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_18px_44px_rgba(4,20,39,0.18)] overflow-hidden max-h-80 overflow-y-auto"
        >
          {/* Section 1: Fixed-fare Presets (Drop-off) */}
          {filteredPresets.length > 0 && (
            <div className="py-1.5">
              {presetsHeading && (
                <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.05em] text-[#64748B]">
                  {presetsHeading}
                </div>
              )}
              {filteredPresets.map((preset, idx) => {
                const isHighlighted = activeIndex === idx;
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectItem({ kind: 'preset', preset });
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                      isHighlighted
                        ? 'bg-[#FFFBF4]'
                        : isSelected
                        ? 'bg-[#F8FAFC]'
                        : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <MapPin className="w-4 h-4 text-[#c8a663] mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold text-[#041427] truncate">
                          {preset.label}
                        </div>
                        <div className="text-[11px] text-[#64748B] truncate">
                          {preset.subtitle}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {preset.meta && (
                        <span className="text-[11px] font-mono tabular-nums text-[#475569]">
                          {preset.meta}
                        </span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#0f2747]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Section 2: Instant Local Bishkek Hotels & Landmarks */}
          {filteredLandmarks.length > 0 && (
            <div
              className={`py-1.5 ${
                filteredPresets.length > 0 ? 'border-t border-[#E2E8F0]' : ''
              }`}
            >
              {landmarksHeading && (
                <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.05em] text-[#64748B]">
                  {landmarksHeading}
                </div>
              )}
              {filteredLandmarks.map((landmark, lIdx) => {
                const flatIndex = filteredPresets.length + lIdx;
                const isHighlighted = activeIndex === flatIndex;
                return (
                  <button
                    key={landmark.id}
                    type="button"
                    role="option"
                    aria-selected={isHighlighted}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectItem({ kind: 'landmark', landmark });
                    }}
                    onMouseEnter={() => setActiveIndex(flatIndex)}
                    className={`w-full text-left px-3.5 py-2 flex items-start gap-2.5 transition-colors cursor-pointer ${
                      isHighlighted ? 'bg-[#FFFBF4]' : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <Star className="w-4 h-4 text-[#c8a663] mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold text-[#041427] truncate">
                        {landmark.name[lang]}
                      </div>
                      <div className="text-[11px] text-[#64748B] truncate">
                        {landmark.address[lang]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Section 3: Live Photon Results (Strictly Kyrgyzstan) */}
          {(dedupedSuggestions.length > 0 || isLoading) && (
            <div
              className={`py-1.5 ${
                filteredPresets.length > 0 || filteredLandmarks.length > 0
                  ? 'border-t border-[#E2E8F0]'
                  : ''
              }`}
            >
              {suggestionsHeading && (
                <div className="px-3.5 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.05em] text-[#64748B]">
                  <span>{suggestionsHeading}</span>
                  {isLoading && (
                    <span className="font-normal normal-case text-[#94A3B8]">
                      {searchingLabel}
                    </span>
                  )}
                </div>
              )}

              {dedupedSuggestions.map((item, sIdx) => {
                const flatIndex = filteredPresets.length + filteredLandmarks.length + sIdx;
                const isHighlighted = activeIndex === flatIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={isHighlighted}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectItem({ kind: 'suggestion', suggestion: item });
                    }}
                    onMouseEnter={() => setActiveIndex(flatIndex)}
                    className={`w-full text-left px-3.5 py-2 flex items-start gap-2.5 transition-colors cursor-pointer ${
                      isHighlighted ? 'bg-[#FFFBF4]' : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#0f2747] mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-[#041427] truncate">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-[11px] text-[#64748B] truncate">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
