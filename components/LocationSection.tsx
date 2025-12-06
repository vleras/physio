"use client";

interface LocationSectionProps {
  isMobile?: boolean;
}

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.5!2d21.1775131!3d42.6495972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDM4JzU4LjYiTiAyMcKwMTAnMzkuMSJF!5e0!3m2!1sen!2s!4v1736789123456!5m2!1sen!2s";

export default function LocationSection({
  isMobile = false,
}: LocationSectionProps) {
  const sectionStyle: React.CSSProperties = {
    padding: isMobile ? "1.5rem 0 3rem 0" : "3rem 0",
    background: "#fff",
    width: "100%",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "95%",
    width: "95%",
    margin: "0 auto",
    padding: 0,
    boxSizing: "border-box",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? "1.75rem" : "2rem",
    color: "#000",
    marginBottom: isMobile ? "0.75rem" : "1rem",
    textAlign: "center",
    fontWeight: 700,
  };

  const addressStyle: React.CSSProperties = {
    fontSize: isMobile ? "0.95rem" : "1.1rem",
    color: "#000",
    textAlign: "center",
    marginBottom: isMobile ? "1rem" : "2rem",
    fontWeight: 500,
  };

  const contentStyle: React.CSSProperties = {
    display: "block",
    marginTop: isMobile ? "1rem" : "2rem",
  };

  const mapContainerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  };

  const iframeStyle: React.CSSProperties = {
    width: "100%",
    height: isMobile ? "250px" : "400px",
    border: "none",
  };

  return (
    <section className="location-section" style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Lokacioni Ynë</h2>
        <p style={addressStyle}>Adresa: Rruga Valbona, Rruga C</p>
        <div style={contentStyle}>
          <div style={mapContainerStyle}>
            <iframe
              src={MAP_EMBED_URL}
              style={iframeStyle}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
