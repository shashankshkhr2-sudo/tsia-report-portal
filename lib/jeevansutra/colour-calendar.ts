// Calendar-year convention; all cycle numbers reduce to 1–9.
// Daily colour selection is a Jeevan Sutra styling interpretation,
// combining personal-day numbers with our planetary colour palette.
// Name numbers are not used in this version.
export type Colour = { name: string; hex: string }
export const colourPalettes: Record<number, Colour[]> = {
  1: [{name:"Gold",hex:"#C6A34F"},{name:"Soft orange",hex:"#EDAC74"},{name:"Apricot",hex:"#F3C7A5"}],
  2: [{name:"White",hex:"#FFFFFF"},{name:"Cream",hex:"#F3E8D1"},{name:"Pearl",hex:"#E6E2DC"}],
  3: [{name:"Yellow",hex:"#EDCE61"},{name:"Soft gold",hex:"#D9BF80"},{name:"Mustard",hex:"#B89535"}],
  4: [{name:"Blue",hex:"#6489AD"},{name:"Grey",hex:"#A3A6AB"},{name:"Slate",hex:"#657586"}],
  5: [{name:"Green",hex:"#487D62"},{name:"Sage",hex:"#A6B79A"},{name:"Mint",hex:"#CCE5D7"}],
  6: [{name:"White",hex:"#FFFFFF"},{name:"Light pink",hex:"#F0D0D8"},{name:"Rose",hex:"#C9899B"}],
  7: [{name:"Light green",hex:"#B6CCA1"},{name:"White",hex:"#FFFFFF"},{name:"Pale sage",hex:"#D7DFCC"}],
  8: [{name:"Dark blue",hex:"#304966"},{name:"Black",hex:"#29282D"},{name:"Navy",hex:"#202D45"}],
  9: [{name:"Red",hex:"#B64046"},{name:"Brick red",hex:"#A95649"},{name:"Burgundy",hex:"#64263B"}]
}
// Contemporary Jyotish associations; Rahu and Ketu use silver from gemstone-setting practice.
// Applying these associations to the personal-day number is a Jeevan Sutra interpretation.
// Sources: https://www.ganeshaspeaks.com/predictions/astrology/navagraha/
// https://namietamodi.com/gemstones/
// Optional jewellery guidance, not a gemstone prescription.
export const jewelleryMetals: Record<number, string> = {
  1: "Gold or copper",
  2: "Silver",
  3: "Gold",
  4: "Silver",
  5: "Bronze",
  6: "Silver",
  7: "Silver",
  8: "Iron",
  9: "Copper"
}
export function reduceNumber(value: number): number {
  if (!Number.isSafeInteger(value) || value < 1) throw new Error("Expected a positive whole number");
  return 1 + ((value - 1) % 9);
}
function readDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Use YYYY-MM-DD");
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (year < 1900 || year > 2200 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new Error("Invalid date");
  return { year, month, day };
}
export function getColourDay(dob: string, selectedDate: string) {
  const birthIso = /^\d{2}\/\d{2}\/\d{4}$/.test(dob) ? dob.split("/").reverse().join("-") : dob;
  const birth = readDate(birthIso);
  const target = readDate(selectedDate);
  if (selectedDate < birthIso) throw new Error("Choose a date on or after birth");
  const mulank = reduceNumber(birth.day);
  const personalYear = reduceNumber(birth.day + birth.month + target.year);
  const personalMonth = reduceNumber(personalYear + target.month);
  const personalDay = reduceNumber(personalMonth + target.day);
  return {
    date: selectedDate, mulank, personalYear, personalMonth, personalDay,
    personalColours: colourPalettes[mulank],
    personalMetal: jewelleryMetals[mulank],
    dailyColours: colourPalettes[personalDay],
    jewelleryMetal: jewelleryMetals[personalDay]
  };
}
