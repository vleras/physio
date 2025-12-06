"use client";

export default function MobileMessagingButton() {
  const phoneNumber = "38349459111";
  const message = "Përshëndetje! Dua të pyes për shërbimet tuaja.";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mobile-messaging-btn"
      aria-label="Message us"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12l4 4V4c0-1.1-.9-2-2-2z"
          fill="white"
        />
        <circle cx="8" cy="10" r="1.25" fill="#000" />
        <circle cx="12" cy="10" r="1.25" fill="#000" />
        <circle cx="16" cy="10" r="1.25" fill="#000" />
      </svg>
    </a>
  );
}

