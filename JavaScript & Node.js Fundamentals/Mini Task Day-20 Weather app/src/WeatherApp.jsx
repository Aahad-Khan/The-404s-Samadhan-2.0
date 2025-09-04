import React, { useEffect, useMemo, useState } from "react";
import {
    MapPin,
    Search,
    LocateFixed,
    Loader2,
    ThermometerSun,
    Wind,
    Droplets,
    Sunrise,
    Sunset,
    CloudRain,
    CalendarDays,
    Sun,
    Moon,
} from "lucide-react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

/**
 * Responsive Weather Forecast App
 * - No API keys needed (uses Open-Meteo + Open-Meteo Geocoding)
 * - Current location detection via Geolocation API
 * - City search with suggestions
 * - Hourly chart + 7-day forecast
 * - Metric/Imperial toggle
 * - Polished, accessible, and responsive UI with Tailwind
 */

const formatHourLabel = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDayLabel = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
};

const UnitToggle = ({ unit, onChange }) => {
    return (
        <div className="inline-flex rounded-2xl border bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 shadow-sm overflow-hidden">
            <button
                aria-label="Use metric units"
                onClick={() => onChange("metric")}
                className={`px-3 py-2 text-sm font-medium transition ${unit === "metric" ? "bg-white shadow-inner" : "hover:bg-white/60"
                    }`}
            >
                °C, km/h
            </button>
            <button
                aria-label="Use imperial units"
                onClick={() => onChange("imperial")}
                className={`px-3 py-2 text-sm font-medium transition border-l ${unit === "imperial" ? "bg-white shadow-inner" : "hover:bg-white/60"
                    }`}
            >
                °F, mph
            </button>
        </div>
    );
};

export default function WeatherApp() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggest, setLoadingSuggest] = useState(false);

    const [coords, setCoords] = useState(null); // {lat, lon}
    const [place, setPlace] = useState(null); // {name, country, admin1}

    const [unit, setUnit] = useState("metric");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [current, setCurrent] = useState(null);
    const [hourly, setHourly] = useState([]);
    const [daily, setDaily] = useState([]);

    const [tab, setTab] = useState("today"); // today | week

    // Fetch suggestions when typing
    useEffect(() => {
        const controller = new AbortController();
        const run = async () => {
            if (!query || query.trim().length < 2) {
                setSuggestions([]);
                return;
            }
            try {
                setLoadingSuggest(true);
                const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                    query.trim()
                )}&count=6&language=en&format=json`;
                const res = await fetch(url, { signal: controller.signal });
                const data = await res.json();
                setSuggestions(data?.results || []);
            } catch (e) {
                if (e.name !== "AbortError") console.error(e);
            } finally {
                setLoadingSuggest(false);
            }
        };
        const t = setTimeout(run, 300);
        return () => {
            controller.abort();
            clearTimeout(t);
        };
    }, [query]);

    const fetchWeather = async (lat, lon, selectedPlace) => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams({
                latitude: lat.toString(),
                longitude: lon.toString(),
                hourly:
                    "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m",
                daily:
                    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,wind_speed_10m_max",
                current_weather: "true",
                timezone: "auto",
                forecast_days: "7",
                temperature_unit: unit === "metric" ? "celsius" : "fahrenheit",
                wind_speed_unit: unit === "metric" ? "kmh" : "mph",
            });

            const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch weather");
            const data = await res.json();

            // Map current
            const curr = {
                temp: data?.current_weather?.temperature,
                wind: data?.current_weather?.windspeed,
                windDirection: data?.current_weather?.winddirection,
                code: data?.current_weather?.weathercode,
                time: data?.current_weather?.time,
            };
            setCurrent(curr);

            // Map hourly
            const h = (data?.hourly?.time || []).map((t, i) => ({
                time: t,
                temperature: data?.hourly?.temperature_2m?.[i],
                apparent: data?.hourly?.apparent_temperature?.[i],
                humidity: data?.hourly?.relative_humidity_2m?.[i],
                precipitation: data?.hourly?.precipitation?.[i],
                wind: data?.hourly?.wind_speed_10m?.[i],
                wdir: data?.hourly?.wind_direction_10m?.[i],
                code: data?.hourly?.weather_code?.[i],
            }));
            setHourly(h);

            // Map daily
            const d = (data?.daily?.time || []).map((t, i) => ({
                date: t,
                tmin: data?.daily?.temperature_2m_min?.[i],
                tmax: data?.daily?.temperature_2m_max?.[i],
                precip: data?.daily?.precipitation_sum?.[i],
                code: data?.daily?.weather_code?.[i],
                sunrise: data?.daily?.sunrise?.[i],
                sunset: data?.daily?.sunset?.[i],
                windMax: data?.daily?.wind_speed_10m_max?.[i],
            }));
            setDaily(d);

            setCoords({ lat, lon });
            if (selectedPlace) setPlace(selectedPlace);
        } catch (e) {
            console.error(e);
            setError(e.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Geolocate on first mount
    useEffect(() => {
        if (!coords) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const { latitude, longitude } = pos.coords;
                        fetchWeather(latitude, longitude, {
                            name: "Current location",
                            country: "",
                            admin1: "",
                        });
                    },
                    () => {
                        // fallback: New Delhi
                        fetchWeather(28.6139, 77.209, { name: "New Delhi", country: "India", admin1: "Delhi" });
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            } else {
                // fallback: New York
                fetchWeather(40.7128, -74.006, { name: "New York", country: "USA", admin1: "NY" });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Refetch if unit changes and we already have coords
    useEffect(() => {
        if (coords) fetchWeather(coords.lat, coords.lon, place);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unit]);

    const hourlyToday = useMemo(() => {
        if (!hourly?.length) return [];
        const todayStr = new Date().toISOString().slice(0, 10);
        return hourly.filter((h) => h.time.startsWith(todayStr));
    }, [hourly]);

    const tempUnit = unit === "metric" ? "°C" : "°F";
    const windUnit = unit === "metric" ? "km/h" : "mph";

    const handlePickSuggestion = (s) => {
        setQuery(`${s.name}${s?.admin1 ? ", " + s.admin1 : ""}${s?.country ? ", " + s.country : ""}`);
        setSuggestions([]);
        fetchWeather(s.latitude, s.longitude, s);
    };

    const searchByQuery = async (e) => {
        e?.preventDefault?.();
        if (!query.trim()) return;
        try {
            setLoadingSuggest(true);
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                query.trim()
            )}&count=1&language=en&format=json`;
            const res = await fetch(url);
            const data = await res.json();
            const s = data?.results?.[0];
            if (s) handlePickSuggestion(s);
            else setError("No results for that place. Try another search.");
        } catch (e) {
            setError("Search failed. Please try again.");
        } finally {
            setLoadingSuggest(false);
        }
    };

    const wmoMap = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        56: "Freezing drizzle",
        57: "Dense freezing drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        66: "Freezing rain",
        67: "Heavy freezing rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        77: "Snow grains",
        80: "Rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Heavy thunderstorm with hail",
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-cyan-300 text-slate-900">
            {/* App Shell */}
            <div className="mx-auto max-w-6xl px-4 pb-24">
                {/* Header */}
                <header className="sticky top-0 z-50 mb-6 border-b border-white/20 bg-gradient-to-r from-sky-600/80 to-indigo-700/80 backdrop-blur-lg shadow-md">

                    <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <ThermometerSun className="h-6 w-6" />
                            <h1 className="text-lg sm:text-xl font-semibold">WeatherNow</h1>
                        </div>
                        <form onSubmit={searchByQuery} className="relative flex-1 max-w-xl">
                            <div className="flex items-center gap-2 rounded-2xl border bg-white/70 backdrop-blur px-3 py-2 shadow-sm focus-within:ring-2 ring-sky-300">
                                <Search className="h-4 w-4 shrink-0" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search city or place..."
                                    className="w-full bg-transparent outline-none text-sm"
                                    aria-label="Search city or place"
                                />
                                <button
                                    type="submit"
                                    className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-3 py-1.5 text-white text-sm font-medium shadow-md hover:from-sky-600 hover:to-indigo-700 transition transform hover:scale-105"
                                >
                                    Search
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition(
                                                (p) => {
                                                    fetchWeather(p.coords.latitude, p.coords.longitude, {
                                                        name: "Current location",
                                                        country: "",
                                                        admin1: "",
                                                    });
                                                },
                                                () => setError("Location access denied. Use search instead.")
                                            );
                                        } else setError("Geolocation not supported by this browser.");
                                    }}
                                    className="ml-1 rounded-xl border px-2 py-1.5 text-sm font-medium hover:bg-white inline-flex items-center gap-1"
                                >
                                    <LocateFixed className="h-4 w-4" />
                                    Locate
                                </button>
                            </div>
                            {/* Suggestions dropdown */}
                            {suggestions?.length > 0 && (
                                <div className="absolute left-0 right-0 mt-2 rounded-2xl border bg-white shadow-lg overflow-hidden">
                                    {suggestions.map((s) => (
                                        <button
                                            key={`${s.id}-${s.latitude}-${s.longitude}`}
                                            onClick={() => handlePickSuggestion(s)}
                                            className="w-full text-left px-4 py-2 hover:bg-sky-50 flex items-center gap-2"
                                        >
                                            <MapPin className="h-4 w-4" />
                                            <span className="truncate">
                                                {s.name}
                                                {s?.admin1 ? `, ${s.admin1}` : ""}
                                                {s?.country ? `, ${s.country}` : ""}
                                            </span>
                                        </button>
                                    ))}
                                    {loadingSuggest && (
                                        <div className="px-4 py-2 text-sm text-slate-500">Searching…</div>
                                    )}
                                </div>
                            )}
                        </form>

                        <div className="ml-auto hidden sm:block">
                            <UnitToggle unit={unit} onChange={setUnit} />
                        </div>
                    </div>
                </header>

                {/* Mobile unit toggle */}
                <div className="sm:hidden mb-4 flex justify-center">
                    <UnitToggle unit={unit} onChange={setUnit} />
                </div>

                {/* Error Toast */}
                {error && (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span>⚠️</span>
                            <p className="text-sm">{error}</p>
                        </div>
                        <button onClick={() => setError("")} className="text-sm font-medium underline">
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Top summary */}
                <section className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 rounded-3xl border border-white/30 bg-white/20 backdrop-blur-lg p-5 shadow-lg hover:shadow-xl transition">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm text-slate-500 flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {place ? (
                                        <span>
                                            {place.name}
                                            {place?.admin1 ? `, ${place.admin1}` : ""}
                                            {place?.country ? `, ${place.country}` : ""}
                                        </span>
                                    ) : (
                                        <span>—</span>
                                    )}
                                </p>
                                <h2 className="mt-1 text-4xl sm:text-5xl font-bold tracking-tight">
                                    {current ? (
                                        <span>
                                            {Math.round(current.temp)}
                                            <span className="text-2xl align-top ml-1">{tempUnit}</span>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 text-base text-slate-500">
                                            <Loader2 className="h-4 w-4 animate-spin" /> Loading current weather
                                        </span>
                                    )}
                                </h2>
                                <p className="mt-2 text-slate-600">
                                    {current ? wmoMap[current.code] || "—" : "Fetching conditions…"}
                                </p>
                                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-700">
                                    <span className="inline-flex items-center gap-1"><Wind className="h-4 w-4" /> {current ? `${Math.round(current.wind)} ${windUnit}` : "—"}</span>
                                    <span className="inline-flex items-center gap-1"><CloudRain className="h-4 w-4" /> {hourlyToday[0]?.precip ?? 0} mm</span>
                                </div>
                            </div>
                            <div className="text-right text-sm text-slate-500">
                                <p>Updated: {current ? new Date(current.time).toLocaleString() : "—"}</p>
                                <p className="mt-1">Lat/Lon: {coords ? `${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)}` : "—"}</p>
                            </div>
                        </div>

                        {/* Hourly chart */}
                        <div className="mt-6 h-64">
                            {hourlyToday?.length ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={hourlyToday} margin={{ left: 4, right: 8, top: 8, bottom: 4 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" tickFormatter={formatHourLabel} minTickGap={24} />
                                        <YAxis domain={["dataMin - 2", "dataMax + 2"]} tickFormatter={(v) => `${Math.round(v)}°`} />
                                        <Tooltip
                                            labelFormatter={(l) => new Date(l).toLocaleString()}
                                            formatter={(value, name) => {
                                                if (name === "temperature") return [`${Math.round(value)} ${tempUnit}`, "Temperature"];
                                                if (name === "apparent") return [`${Math.round(value)} ${tempUnit}`, "Feels like"];
                                                if (name === "humidity") return [`${Math.round(value)}%`, "Humidity"];
                                                if (name === "precipitation") return [`${value} mm`, "Precipitation"];
                                                if (name === "wind") return [`${Math.round(value)} ${windUnit}`, "Wind"];
                                                return [value, name];
                                            }}
                                        />
                                        <Line type="monotone" dataKey="temperature" dot={false} stroke="#f59e0b" strokeWidth={2} />
                                        <Line type="monotone" dataKey="apparent" dot={false} stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="5 5" />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full w-full grid place-items-center text-slate-500 text-sm">
                                    {loading ? (
                                        <div className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading hourly data…</div>
                                    ) : (
                                        <span>No hourly data.</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Side cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                        <div className="rounded-3xl border bg-white/70 backdrop-blur p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-600">Sunrise</p>
                                <Sunrise className="h-4 w-4" />
                            </div>
                            <p className="mt-2 text-xl font-semibold">
                                {daily?.[0]?.sunrise ? new Date(daily[0].sunrise).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                            </p>
                        </div>
                        <div className="rounded-3xl border bg-white/70 backdrop-blur p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-600">Sunset</p>
                                <Sunset className="h-4 w-4" />
                            </div>
                            <p className="mt-2 text-xl font-semibold">
                                {daily?.[0]?.sunset ? new Date(daily[0].sunset).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                            </p>
                        </div>
                        <div className="rounded-3xl border bg-white/70 backdrop-blur p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-600">Wind (max)</p>
                                <Wind className="h-4 w-4" />
                            </div>
                            <p className="mt-2 text-xl font-semibold">
                                {daily?.[0]?.windMax != null ? `${Math.round(daily[0].windMax)} ${windUnit}` : "—"}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Tabs */}
                <div className="mb-3 flex items-center gap-2">
                    <button
                        onClick={() => setTab("today")}
                        className={`rounded-2xl px-4 py-2 text-sm font-medium border ${tab === "today" ? "bg-sky-600 text-white border-sky-600" : "bg-white hover:bg-sky-50"
                            }`}
                    >
                        <CalendarDays className="inline h-4 w-4 mr-1" /> Today
                    </button>
                    <button
                        onClick={() => setTab("week")}
                        className={`rounded-2xl px-4 py-2 text-sm font-medium border ${tab === "week" ? "bg-sky-600 text-white border-sky-600" : "bg-white hover:bg-sky-50"
                            }`}
                    >
                        7-Day Forecast
                    </button>
                </div>

                {/* Panels */}
                {tab === "today" ? (
                    <section className="rounded-3xl border bg-white/70 backdrop-blur p-5 shadow-sm">
                        <h3 className="text-base font-semibold mb-4">Today at a glance</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {hourlyToday.slice(0, 12).map((h) => (
                                <div key={h.time} className="rounded-2xl border bg-white p-4 shadow-sm">
                                    <p className="text-xs text-slate-500">{formatHourLabel(h.time)}</p>
                                    <p className="mt-1 text-xl font-semibold">
                                        {Math.round(h.temperature)}<span className="text-sm ml-1">{tempUnit}</span>
                                    </p>
                                    <div className="mt-2 space-y-1 text-sm text-slate-600">
                                        <p className="flex items-center gap-1"><Wind className="h-4 w-4" /> {Math.round(h.wind)} {windUnit}</p>
                                        <p className="flex items-center gap-1"><Droplets className="h-4 w-4" /> {h.humidity}%</p>
                                        <p className="flex items-center gap-1"><CloudRain className="h-4 w-4" /> {h.precipitation} mm</p>
                                    </div>
                                </div>
                            ))}
                            {!hourlyToday.length && (
                                <p className="col-span-full text-sm text-slate-500">No hourly data available.</p>
                            )}
                        </div>
                    </section>
                ) : (
                    <section className="rounded-3xl border bg-white/70 backdrop-blur p-5 shadow-sm">
                        <h3 className="text-base font-semibold mb-4">Next 7 days</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {daily?.length ? (
                                daily.map((d) => (
                                    <div key={d.date} className="rounded-2xl border bg-white p-4 shadow-sm flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-slate-600">{formatDayLabel(d.date)}</p>
                                            <span className="text-xs rounded-full px-2 py-0.5 bg-sky-50 border text-sky-700">
                                                {wmoMap[d.code] || "—"}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-baseline gap-2">
                                            <p className="text-2xl font-bold">{Math.round(d.tmax)}{tempUnit}</p>
                                            <p className="text-slate-500">/ {Math.round(d.tmin)}{tempUnit}</p>
                                        </div>
                                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
                                            <p className="inline-flex items-center gap-1"><CloudRain className="h-4 w-4" /> {d.precip} mm</p>
                                            <p className="inline-flex items-center gap-1"><Wind className="h-4 w-4" /> {Math.round(d.windMax)} {windUnit}</p>
                                            <p className="inline-flex items-center gap-1"><Sun className="h-4 w-4" /> {new Date(d.sunrise).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                                            <p className="inline-flex items-center gap-1"><Moon className="h-4 w-4" /> {new Date(d.sunset).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">No daily data available.</p>
                            )}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="mt-6 text-center text-xs text-slate-200 opacity-80">
                    Weather data by Open‑Meteo. This demo uses your browser location (when allowed) and works without API keys.
                </footer>
            </div>

            {/* Page background flourish */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-200 opacity-30 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-200 opacity-30 blur-3xl" />
            </div>
        </div>
    );
}
