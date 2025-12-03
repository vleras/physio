import Image from "next/image";

export default function Services() {
  const services = [
    {
      title: "Shëndeti i Grave",
      description:
        "Fizioterapi e dyshemesë pelvike për forcimin e muskujve pas lindjes, operacionit, menopauzës ose faktorëve të tjerë.",
    },
    {
      title: "Fizioterapi Pas Operacionit",
      description:
        "Mbështet shërimin dhe riktheon funksionin pas operacioneve si gjuri, shpina, kofsha, shpatulla, kyçi i dorës dhe kyçi i këmbës.",
    },
    {
      title: "Trajtim i Çrregullimit të TMJ",
      description:
        "Zvogëlon dhimbjen e nofullës dhe përmirëson lëvizjen me ushtrime, masazh dhe terapi me nxehtësi/ftohtësi.",
    },
    {
      title: "Trajtim i Vertigos",
      description:
        "Ushtrime të personalizuara për të përmirësuar ekuilibrin, stabilitetin dhe zvogëluar marramendjen.",
    },
    {
      title: "Fizioterapi Sportive",
      description:
        "Rehabilitim për t'u kthyer në mënyrë të sigurt në sport dhe parandalimin e dëmtimeve të ardhshme.",
    },
    {
      title: "Akupunturë & Dry Needling",
      description:
        "Trajton gjendjet fizike, liron pikat e shkaktimit dhe riktheon funksionin e muskujve me teknika me gjilpëra të holla.",
    },
    {
      title: "Fizioterapi e Shtyllës Kurrizore",
      description:
        "Diagnostikon dhe trajton problemet e lëvizjes së shtyllës kurrizore me ushtrime lëvizjeje dhe trajtime të synuara.",
    },
    {
      title: "Kiropraktikë",
      description:
        "Manipulim i shtyllës kurrizore dhe trajtime të lidhura për të reduktuar dhimbjen e shpinës, qafës, kokës dhe problemet mekanike muskuloskeletale.",
    },
  ];

  // Split services into two groups
  const firstGroup = services.slice(0, 4);
  const secondGroup = services.slice(4, 8);

  return (
    <main className="main-content">
      {/* Alternating Sections */}
      <section className="page-section services-flow">
        <div className="container">
          <h1
            className="page-title"
            style={{ marginBottom: "3rem", textAlign: "center" }}
          >
            Shërbimet
          </h1>
          {/* First Section: Content Left, Image Right */}
          <div className="service-layout">
            <div className="service-layout__content">
              <ul className="service-list">
                {firstGroup.map((service, index) => (
                  <li key={index} className="service-list__item">
                    <h3>
                      <span className="service-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>{" "}
                      {service.title}
                    </h3>
                    <p>{service.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="service-layout__image">
              <Image
                src="/images/hero7.jpg"
                alt="Our Services"
                fill
                className="service-layout__image-el"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Second Section: Image Left, Content Right */}
          <div className="service-layout">
            <div className="service-layout__image">
              <Image
                src="/images/hero8.jpg"
                alt="Our Services"
                fill
                className="service-layout__image-el"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="service-layout__content">
              <ul className="service-list">
                {secondGroup.map((service, index) => (
                  <li key={index} className="service-list__item">
                    <h3>
                      <span className="service-number">
                        {String(index + 5).padStart(2, "0")}
                      </span>{" "}
                      {service.title}
                    </h3>
                    <p>{service.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
