import {
  renderBoolean,
  renderChoice,
  renderDateTime,
  renderMultipleChoices,
  renderNumber,
} from "./utils";

export const COLORS = {
  PRIMARY: "#198754", // --bs-green
  PRIMARY_TRANSLUCENT: "#19875433",
  SECONDARY: "#6c757d",
};

const CHARGE_PRIORITY = {
  0: "Preferuj panele",
  1: "Preferuj sieć",
  2: "Tryb mieszany",
  3: "Tylko panele",
};

const CHARGE_STATUS = {
  0: "Wyłączone",
  1: "Włączone",
  2: "MPPT",
  3: "Wyrównujące",
  4: "Przyspieszone",
  5: "Pływające",
  6: "Ograniczone",
};

const CONTROLLER_FAULTS = {
  /* Error codes are documented so badly, there is no way to make correct guess */
};

const CURRENT_STATE = {
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
};

const INVERTER_FAULTS = {
  /* Error codes are documented so badly, there is no way to make correct guess */
};

const OUTPUT_PRIORITY = {
  0: "Panel",
  1: "Sieć",
  2: "Inwerter",
};

export const PARAMETER_METADATA = {
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
    render: (value) => renderChoice(CHARGE_PRIORITY, value),
  },
  charge_status: {
    description: "Tryb ładowania",
    render: (value) => renderChoice(CHARGE_STATUS, value),
  },
  controller_faults: {
    chart: false,
    description: "Kody błędów sterownika",
    render: (value) => renderMultipleChoices(CONTROLLER_FAULTS, value),
  },
  current_state: {
    description: "Tryb inwertera",
    render: (value) => renderChoice(CURRENT_STATE, value),
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
    render: (value) => renderMultipleChoices(INVERTER_FAULTS, value),
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
    render: (value) => renderBoolean(value),
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
    render: (value) => renderChoice(OUTPUT_PRIORITY, value),
  },
  pv_buck_current_1: {
    description: "Zbiorczy prąd paneli 1",
    unit: "A",
  },
  pv_buck_current_2: {
    description: "Zbiorczy prąd paneli 2",
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
    render: (value) => renderDateTime(value),
  },
};

export const EVENT_METADATA = {
  system_output_priority: {
    description: "Zmieniono ustawienia wyjścia",
  },
  system_charge_priority: {
    description: "Zmieniono ustawienia ładowania",
  },
  system_connecting: {
    description: "Łączenie z inwerterem",
  },
  system_connected: {
    description: "Połączono z",
  },
};

export const METADATA = {
  ...PARAMETER_METADATA,
  ...EVENT_METADATA,
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
