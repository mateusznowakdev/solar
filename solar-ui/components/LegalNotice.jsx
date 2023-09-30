import { STRINGS } from "../locale";
import { getVersion } from "../utils";

export default function LegalNotice() {
  return (
    <p className="my-3 text-secondary text-small">
      Solar v{getVersion()}
      <br />
      <a
        className="link-secondary"
        href="https://github.com/mateusznowakdev/solar"
        target="_blank"
      >
        {STRINGS.ABOUT_SOURCE_CODE}
      </a>
    </p>
  );
}
