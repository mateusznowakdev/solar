import Sun from "react-bootstrap-icons/dist/icons/sun";

import { STRINGS } from "../locale";
import { COLORS } from "../meta";
import { getVersion } from "../utils";

export default function About() {
  return (
    <div className="my-3 text-center">
      <Sun className="my-3" color={COLORS.PRIMARY} size={36} />
      <h3>Solar</h3>
      <p>&copy; 2023 Mateusz Nowak</p>
      <p>
        {STRINGS.ABOUT_VERSION} {getVersion()}
      </p>
      <p className="text-muted text-small">{STRINGS.ABOUT_LICENSE}</p>
      <a href="https://github.com/mateusznowakdev/solar" target="_blank">
        {STRINGS.ABOUT_SOURCE_CODE}
      </a>
    </div>
  );
}
