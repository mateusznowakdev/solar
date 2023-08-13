import { STRINGS } from "../locale";
import { getVersion } from "../utils";

export default function About() {
  return (
    <div className="my-3 text-center">
      <h3>Solar</h3>
      <p>
        {STRINGS.VERSION} {getVersion()}
      </p>
    </div>
  );
}
