import { renderDateTime, renderNumber } from "./render";

export const COLORS = {
  PRIMARY: "#198754", // --bs-green
  PRIMARY_TRANSLUCENT: "#19875433",
};

export const METADATA = {
  ambient_temperature: {
    description: "Temperatura otoczenia",
    unit: "°C",
  },
  battery_apparent_power: {
    description: "Moc baterii (pozorna)",
    unit: "VA",
  },
  battery_current: {
    description: "Prąd baterii",
    unit: "A",
  },
  battery_level_soc: {
    description: "Poziom naładowania baterii",
    unit: "%",
  },
  battery_voltage: {
    description: "Napięcie baterii",
    unit: "V",
  },
  bus_voltage: {
    description: "Napięcie magistrali",
    unit: "V",
  },
  charge_priority: {
    description: "Priorytet ładowania",
    render: (value) =>
      ({
        0: "Preferuj panele",
        1: "Preferuj sieć",
        2: "Tryb mieszany",
        3: "Tylko panele",
      })[value] || value,
  },
  charge_status: {
    description: "Tryb ładowania",
    render: (value) =>
      ({
        0: "Wyłączone",
        1: "Włączone",
        2: "MPPT",
        3: "Wyrównujące",
        4: "Przyspieszone",
        5: "Pływające",
        6: "Ograniczone",
      })[value] || value,
  },
  controller_faults: {
    chart: false,
    description: "Kody błędów sterownika",
    render: (value) => JSON.stringify(value),
  },
  current_state: {
    description: "Tryb inwertera",
    render: (value) =>
      ({
        0: "Opóźnienie po uruchomieniu",
        1: "Oczekiwanie",
        2: "Uruchamianie",
        3: "Miękki start",
        4: "Sieć",
        5: "Inwerter",
        6: "Inwerter do sieci",
        7: "Sieć do inwertera",
        10: "Wyłączone",
        11: "Awaria",
      })[value] || value,
  },
  dc_current: {
    description: "Prąd DC",
    unit: "A",
  },
  dc_power: {
    description: "Moc DC",
    unit: "W",
  },
  dc_voltage: {
    description: "Napięcie DC",
    unit: "V",
  },
  grid_current: {
    description: "Prąd sieci",
    unit: "A",
  },
  grid_frequency: {
    description: "Częstotliwość sieci",
    unit: "Hz",
  },
  grid_voltage: {
    description: "Napięcie sieci",
    unit: "V",
  },
  heatsink_a_temperature: {
    description: "Temperatura radiatora A",
    unit: "°C",
  },
  heatsink_b_temperature: {
    description: "Temperatura radiatora B",
    unit: "°C",
  },
  heatsink_c_temperature: {
    description: "Temperatura radiatora C",
    unit: "°C",
  },
  inverter_current: {
    description: "Prąd inwertera",
    unit: "A",
  },
  inverter_dc_component: {
    description: "Składowa DC inwertera",
    unit: "mV",
  },
  inverter_faults: {
    chart: false,
    description: "Kody błędów inwertera",
    render: (value) => JSON.stringify(value),
  },
  inverter_frequency: {
    description: "Częstotliwość inwertera",
    unit: "Hz",
  },
  inverter_voltage: {
    description: "Napięcie inwertera",
    unit: "V",
  },
  load_active_power: {
    description: "Moc obciążenia (czynna)",
    unit: "W",
  },
  load_apparent_power: {
    description: "Moc obciążenia (pozorna)",
    unit: "VA",
  },
  load_current: {
    description: "Prąd obciążenia",
    unit: "A",
  },
  load_on: {
    chart: false,
    description: "Obciążenie",
    render: (value) => (value ? "Tak" : "Nie"),
  },
  load_pf: {
    description: "Współczynnik mocy obciążenia",
  },
  load_ratio: {
    description: "Poziom obciążenia",
    unit: "%",
  },
  mains_charge_current: {
    description: "Prąd ładowania z sieci",
    unit: "A",
  },
  output_priority: {
    description: "Priorytet wyjścia",
    render: (value) =>
      ({
        0: "Panel",
        1: "Sieć",
        2: "Inwerter",
      })[value] || value,
  },
  pv_buck_current_1: {
    description: "Zbiorczy prąd PV 1",
    unit: "A",
  },
  pv_buck_current_2: {
    description: "Zbiorczy prąd PV 2",
    unit: "A",
  },
  pv_current: {
    description: "Prąd paneli",
    unit: "A",
  },
  pv_power: {
    description: "Moc paneli",
    unit: "W",
  },
  pv_voltage: {
    description: "Napięcie paneli",
    unit: "V",
  },
  timestamp: {
    chart: false,
    description: "Czas pomiaru",
    render: (value) => renderDateTime(new Date(value)),
  },
};

export function defaultRenderer(value) {
  const asInt = parseInt(value);
  const asFloat = parseFloat(value);

  if (isNaN(asFloat)) return value;

  if (asInt === asFloat) {
    return renderNumber(asInt);
  } else {
    return renderNumber(asFloat);
  }
}

for (const key in METADATA) {
  if (METADATA[key].chart === undefined) {
    METADATA[key].chart = true;
  }
  if (METADATA[key].render === undefined) {
    METADATA[key].render = defaultRenderer;
  }
}
