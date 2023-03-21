import { fixTheId, shorten } from "./utils"


const data = {
  _id: { '$oid': '63ff71cf8424fca16e039bc9' }
}


test('util', () => {
  const id = fixTheId(data);
  expect(id).toEqual({ id: '63ff71cf8424fca16e039bc9' })
})

test('fixTheId', () => {
  const foo = {
    "_id": {
      "$oid": "640df401757e32daccdc79da"
    },
  }
  expect(fixTheId(foo)).toEqual({ id: '640df401757e32daccdc79da' })
})

test("shorten", () => {
  let str = "This is a paragraph. It has many sentences!";
  expect(shorten(str)).toBe("This is a paragraph.")
  str = "This is a paragraph? It has many sentences!";
  expect(shorten(str)).toBe("This is a paragraph?")
  str = "This is(car) a paragraph? It has many sentences!";
  expect(shorten(str)).toBe("This is(car) a paragraph?")
  str = "This is(car) a paragraph It has many sentences";
  expect(shorten(str)).toHaveLength(40)
})