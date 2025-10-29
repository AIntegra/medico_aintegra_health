export default function Button({ children, variant = "primary", ...props }) {
  const base = "ai-btn w-full";
  const color =
    variant === "success"
      ? "ai-btn-success"
      : variant === "quiet"
      ? "ai-btn-quiet"
      : "ai-btn-primary";
  return (
    <button className={`${base} ${color}`} {...props}>
      {children}
    </button>
  );
}
