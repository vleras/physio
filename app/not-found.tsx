import Link from "next/link";

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <span className="notfound-code">404</span>
        <h1 className="notfound-title">Page not found</h1>
        <p className="notfound-desc">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="notfound-btn">
          Go Home
        </Link>
      </div>
    </div>
  );
}
