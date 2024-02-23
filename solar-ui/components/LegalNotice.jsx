import { STRINGS } from "../locale";
import { getVersion } from "../utils";
import Hint from "./Hint";

export default function LegalNotice() {
  return (
    <Hint>
      Solar v{getVersion()}
      <br />
      <a
        className="link-secondary"
        href="https://github.com/mateusznowakdev/solar"
        target="_blank"
      >
        {STRINGS.ABOUT_SOURCE_CODE}
      </a>
    </Hint>
  );
}
