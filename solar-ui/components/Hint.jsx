import Info from "lucide-react/dist/esm/icons/info";

export default function Hint({ children }) {
  return (
    <div className="my-3 text-secondary">
      <Info strokeWidth={1.5} />
      <br />
      {children}
    </div>
  );
}
