export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
    >
      {children}
    </button>
  );
}