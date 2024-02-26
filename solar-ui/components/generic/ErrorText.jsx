import XCircle from "lucide-react/dist/esm/icons/x-circle";

export default function ErrorText({ error }) {
  return (
    <div className="my-3 text-danger">
      <XCircle strokeWidth={1.5} />
      <br />
      {error}
    </div>
  );
}
