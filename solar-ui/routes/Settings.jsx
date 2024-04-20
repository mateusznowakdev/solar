import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import SettingsAutomationForm from "../components/settings/SettingsAutomationForm";
import SettingsLocalForm from "../components/settings/SettingsLocalForm";
import { STRINGS } from "../locale";

export default function Settings() {
  return (
    <>
      <h1 className="my-3">{STRINGS.MENU_SETTINGS}</h1>
      <Tabs className="mb-3" justify unmountOnExit>
        <Tab eventKey="main" title={STRINGS.SETTINGS_MAIN}>
          <SettingsAutomationForm />
        </Tab>
        <Tab eventKey="advanced" title={STRINGS.SETTINGS_ADVANCED}>
          <SettingsLocalForm />
        </Tab>
      </Tabs>
    </>
  );
}
