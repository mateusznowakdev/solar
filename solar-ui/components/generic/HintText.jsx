import Info from "lucide-react/dist/esm/icons/info";

export default function HintText({ hint }) {
  return (
    <div className="my-3 text-secondary">
      <Info strokeWidth={1.5} />
      <br />
      {hint}
    </div>
  );
}
