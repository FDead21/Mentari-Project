import Link from 'next/link';

export default function WhatsAppButton({ phoneNumber }: { phoneNumber: string | null | undefined }) {
  // Use the number from props, or a default fallback
  const number = phoneNumber || '6281234567890'; 

  const message = "Hello, I'm interested in your outbound packages.";
  const encodedMessage = encodeURIComponent(message);

   return (
    <Link
      href={`https://wa.me/${phoneNumber}?text=${encodedMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-gray-200 transition-all"
      aria-label="Chat on WhatsApp"
    >
      {/* A standard green WhatsApp icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.35 3.43 16.84L2.05 22L7.31 20.62C8.75 21.39 10.36 21.81 12.04 21.81C17.5 21.81 21.95 17.36 21.95 11.91C21.95 9.24 20.88 6.78 19.01 4.91C17.14 3.04 14.68 2 12.04 2ZM9.83 8.13C10.02 8.13 10.2 8.13 10.35 8.13C10.54 8.14 10.7 8.5 10.82 8.65L11.03 8.94C11.16 9.11 11.28 9.28 11.45 9.53C11.63 9.79 11.64 9.89 11.51 10.12C11.38 10.35 11.13 10.64 10.93 10.86C10.73 11.08 10.56 11.18 10.42 11.31C10.28 11.44 10.13 11.56 10.31 11.85C10.49 12.14 11.23 13.22 12.21 14.12C13.42 15.22 14.31 15.54 14.61 15.69C14.91 15.84 15.14 15.81 15.33 15.58C15.52 15.35 16.04 14.75 16.29 14.42C16.54 14.09 16.79 14.01 17.06 14.01C17.33 14.01 18.51 14.64 18.75 14.88C18.99 15.12 19.24 15.38 19.3 15.54C19.36 15.7 19.36 16.11 19.13 16.55C18.9 16.99 17.89 17.57 17.32 17.68C16.75 17.79 16.01 17.88 15.38 17.6C14.68 17.29 13.78 16.97 12.78 16.2C11.53 15.22 10.58 14.04 9.83 12.73C9.42 12.06 9.03 11.33 9.03 10.56C9.03 9.79 9.64 9.2 9.83 8.97C9.92 8.86 10.01 8.75 10.09 8.65C10.18 8.55 9.64 8.13 9.83 8.13Z"
          fill="#4CAF50"
        />
      </svg>
      {/* The text you wanted */}
      <span>Click here to Contact Us!</span>
    </Link>
  );
}