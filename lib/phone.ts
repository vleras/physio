/** Kosovo number for Albanian (SQ); North Macedonia number for EN/MK. */
export function getContactPhone(locale: string) {
  if (locale === "sq") {
    return {
      display: "+383 49 669 360",
      tel: "+38349669360",
      whatsapp: "38349669360",
    };
  }

  return {
    display: "+389 71 562 521",
    tel: "+38971562521",
    whatsapp: "38971562521",
  };
}
