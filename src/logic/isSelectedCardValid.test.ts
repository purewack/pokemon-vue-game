import { expect, test } from "vitest";
import isSelectedCardValid from "./isSelectedCardValid";

test("HP bigger", () => {
  expect(isSelectedCardValid({ hp: 40 }, { hp: 30 })).toBe(true);
});
test("HP less", () => {
  expect(isSelectedCardValid({ hp: 20 }, { hp: 30 })).toBe(false);
});

test("Has matching Type", () => {
  expect(
    isSelectedCardValid({ types: ["fire"] }, { types: ["fire", "water"] }),
  ).toBe(true);
});

test("No matching Type", () => {
  expect(
    isSelectedCardValid({ types: ["dragon"] }, { types: ["fire", "water"] }),
  ).toBe(false);
});

test("HP more, No matching Type ", () => {
  expect(
    isSelectedCardValid(
      { hp: 50, types: ["dragon"] },
      { hp: 20, types: ["fire", "water"] },
    ),
  ).toBe(true);
});

test("HP less, Has matching Type ", () => {
  expect(
    isSelectedCardValid(
      { hp: 10, types: ["water", "dragon"] },
      { hp: 20, types: ["fire", "water"] },
    ),
  ).toBe(true);
});

test("HP more, Has matching Type ", () => {
  expect(
    isSelectedCardValid(
      { hp: 40, types: ["water", "rock"] },
      { hp: 20, types: ["fire", "water"] },
    ),
  ).toBe(true);
});

test("HP less, No matching Type ", () => {
  expect(
    isSelectedCardValid(
      { hp: 10, types: ["dragon", "rock"] },
      { hp: 20, types: ["fire", "water"] },
    ),
  ).toBe(false);
});
