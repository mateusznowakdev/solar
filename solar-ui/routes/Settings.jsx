import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import AdvancedSettingsForm from "../components/settings/AdvancedSettingsForm";
import MainSettingsForm from "../components/settings/MainSettingsForm";
import { STRINGS } from "../locale";

export default function Settings() {
  return (
    <>
      <h1 className="my-3">{STRINGS.MENU_SETTINGS}</h1>
      <Tabs justify unmountOnExit>
        <Tab eventKey="main" title={STRINGS.SETTINGS_MAIN}>
          <MainSettingsForm />
        </Tab>
        <Tab eventKey="advanced" title={STRINGS.SETTINGS_ADVANCED}>
          <AdvancedSettingsForm />
        </Tab>
      </Tabs>
    </>
  );
}
