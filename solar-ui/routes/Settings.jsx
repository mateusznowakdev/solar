import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import AppearanceSettingsForm from "../components/settings/AppearanceSettingsForm";
import DeviceSettingsForm from "../components/settings/DeviceSettingsForm";
import { STRINGS } from "../locale";

export default function Settings() {
  return (
    <>
      <h1 className="my-3">{STRINGS.MENU_SETTINGS}</h1>
      <Tabs justify unmountOnExit>
        <Tab eventKey="device" title={STRINGS.SETTINGS_DEVICE}>
          <DeviceSettingsForm />
        </Tab>
        <Tab eventKey="appearance" title={STRINGS.SETTINGS_APPEARANCE}>
          <AppearanceSettingsForm />
        </Tab>
      </Tabs>
    </>
  );
}
