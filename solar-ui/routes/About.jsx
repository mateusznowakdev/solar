import { STRINGS } from "../locale";
import { getVersion } from "../utils";

export default function About() {
  return (
    <div className="my-3 text-center">
      <h3>Solar</h3>
      <p>&copy; 2023 Mateusz Nowak</p>
      <p>
        {STRINGS.ABOUT_VERSION} {getVersion()}
      </p>
      <p className="text-muted text-small">{STRINGS.ABOUT_LICENSE}</p>
      <a
        className="link-success"
        href="https://github.com/mateusznowakdev/solar"
        target="_blank"
      >
        {STRINGS.ABOUT_SOURCE_CODE}
      </a>
    </div>
  );
}
