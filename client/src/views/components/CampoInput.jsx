export default function CampoInput({ label, type = "text", value, onChange, ...props }) {
  return (
    <label className="block mb-2">
      <span className="font-semibold">{label}</span>
      <input
        type={type}
        className="w-full p-2 rounded mt-1 text-black"
        value={value}
        onChange={onChange}
        {...props}
      />
    </label>
  );
}
