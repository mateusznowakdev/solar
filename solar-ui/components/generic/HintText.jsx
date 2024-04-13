import Info from "lucide-react/dist/esm/icons/info";

export default function HintText({ className, hint }) {
  return (
    <div className={`my-3 text-secondary ${className}`}>
      <Info className="mb-2" strokeWidth={1.5} />
      <p>{hint}</p>
    </div>
  );
}
