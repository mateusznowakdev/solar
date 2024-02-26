import { STRINGS } from "../../locale";
import { getVersion } from "../../utils";
import HintText from "../generic/HintText";

export default function LegalNotice() {
  const hint = (
    <>
      Solar v{getVersion()}
      &nbsp;&middot;&nbsp;
      <a
        className="link-secondary"
        href="https://github.com/mateusznowakdev/solar"
        target="_blank"
      >
        {STRINGS.ABOUT_SOURCE_CODE}
      </a>
    </>
  );

  return <HintText hint={hint} />;
}
