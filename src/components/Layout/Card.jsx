export default function Card({ children, className = "" }) {
  return (
    <div className={`ai-card fade-in w-full max-w-md text-center ${className}`}>
      {children}
    </div>
  );
}
