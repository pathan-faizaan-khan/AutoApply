
export function parseResume(text: string) {
  const email =
    text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ||
    "Not Found";

  const phone =
    text.match(/\+91\s?\d{10}|\d{10}/)?.[0] ||
    "Not Found";

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const name =
    lines.find(
      (line) =>
        line.length > 3 &&
        line.length < 50 &&
        !line.includes("@") &&
        !/\d{5,}/.test(line) &&
        !line.toUpperCase().includes("RESUME")
    ) || "Not Found";

  

    const cleanLine = (line: string) =>
  line
    .replace(/^[0-9]+\s+/, "") // remove 1 2 3 at beginning
    .replace(/^[eE]\s+/, "")   // remove e at beginning
    .replace(/^[•\-\*]+/, "")
    .trim();

  const education = lines
    .filter(
      (line) =>
        (line.includes("10th") ||
          line.includes("12th") ||
          line.toLowerCase().includes("b.tech") ||
          line.toLowerCase().includes("btech") ||
          line.toLowerCase().includes("b.e") ||
          line.toLowerCase().includes("b.com")) &&
        !line.includes("S.No") &&
        !line.includes("Qualification")
    )
    .map(cleanLine)
    .filter(Boolean);

  const skills = lines
    .filter(
      (line) =>
        line.toLowerCase().includes("java") ||
        line.toLowerCase().includes("python") ||
        line.toLowerCase().includes("html") ||
        line.toLowerCase().includes("css") ||
        line.toLowerCase().includes("mysql") ||
        line.toLowerCase().includes("excel") ||
        line.toLowerCase().includes("react") ||
        line.toLowerCase().includes("computer")
    )
    .map(cleanLine)
    .filter(Boolean);

  const languages = lines
    .filter(
      (line) =>
        line.toLowerCase().includes("english") ||
        line.toLowerCase().includes("hindi") ||
        line.toLowerCase().includes("urdu")
    )
    .map(cleanLine)
    .filter(Boolean);

  const experience = lines
    .filter(
      (line) =>
        line.toLowerCase().includes("years of experience") ||
        line.toLowerCase().includes("computer operator") ||
        line.toLowerCase().includes("developer")
    )
    .map(cleanLine)
    .filter(Boolean);

  return {
    name,
    email,
    phone,
    education,
    skills,
    languages,
    experience,
  };
}
