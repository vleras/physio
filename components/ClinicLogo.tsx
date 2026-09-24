import Image from "next/image";
import "./clinic-logo.css";

export default function ClinicLogo({ footer = false }: { footer?: boolean }) {
  return (
    <span className={`clinic-logo${footer ? " clinic-logo--footer" : ""}`}>
      <Image
        src="/clinic-logo.jpeg"
        alt="VSO Clinic"
        width={1254}
        height={1254}
        priority={!footer}
        className="clinic-logo-artwork"
      />
    </span>
  );
}
