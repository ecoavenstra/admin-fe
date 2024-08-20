// Loader.jsx
export default function ButtonLoader() {
  return (
    <svg
      className="w-[3em] animate-rotate"
      viewBox="25 25 50 50"
    >
      <circle
        className="fill-none stroke-current stroke-[2] stroke-hsl stroke-dasharray-dynamic animate-dash"
        r="12"
        cy="50"
        cx="50"
      ></circle>
    </svg>
  );
}
