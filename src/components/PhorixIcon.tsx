import { cn } from "@/lib/utils";

export function PhorixIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00E0FF" />
          <stop offset="100%" stopColor="#FF00A8" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#grad1)" strokeWidth="2" stroke="#00E0FF" />
      <path d="M50 15 L60 35 L75 30 L65 50 L75 70 L60 65 L50 85 L40 65 L25 70 L35 50 L25 30 L40 35 Z" fill="#0D1A2E" />
      <path d="M50 20 L58 37 L70 33 L63 50 L70 67 L58 63 L50 80 L42 63 L30 67 L37 50 L30 33 L42 37 Z" stroke="url(#grad1)" strokeWidth="1.5" fill="none" />
      
      {/* Central 'AI' structure */}
      <path d="M50 30 L55 40 L50 42 L45 40 Z" fill="#00E0FF" />
      <path d="M50 45 L58 60 L56 62 L50 55 L44 62 L42 60 Z" fill="url(#grad1)" />
      
      {/* Circuitry */}
      <path d="M45 65 L40 70 L42 72 L47 67" stroke="#FF00A8" strokeWidth="1" fill="none" />
      <path d="M55 65 L60 70 L58 72 L53 67" stroke="#FF00A8" strokeWidth="1" fill="none" />
      <circle cx="40" cy="70" r="1.5" fill="#FF00A8" />
      <circle cx="60" cy="70" r="1.5" fill="#FF00A8" />

      <path d="M48 43 L46 48 L48 50" stroke="#00E0FF" strokeWidth="1" fill="none" />
       <path d="M52 43 L54 48 L52 50" stroke="#00E0FF" strokeWidth="1" fill="none" />
       <circle cx="46" cy="48" r="1" fill="#00E0FF" />
       <circle cx="54" cy="48" r="1" fill="#00E0FF" />

      {/* 'AI' text stylized */}
      <text x="50" y="58" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0D1A2E" stroke="#00E0FF" strokeWidth="0.5">AI</text>
    </svg>
  );
}
