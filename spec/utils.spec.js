const { expect } = require("chai");
const { formatDate, makeRefObj, formatComments } = require("../db/utils/utils");

describe("formatDate", () => {
  it("returns a new empty array when passed an empty array", () => {
    const testList = [];
    const actual = formatDate(testList)
    const expected = []
      expect(actual).to.eql(expected)
      expect(actual).to.not.equal(testList)
  });
  it('returns a new array of one object with the correctly formatted date', () => {
    const testList = [{ 
        body:"test body",
        belongs_to: "test article",
        created_by: 'test author',
        votes: 1,
        created_at: Date.now()
      }];
    const actual = formatDate(testList)
    const expected = [{ 
          body:"test body",
          belongs_to: "test article",
          created_by: 'test author',
          votes: 1,
          created_at: new Date()
        }]
        expect(actual).to.eql(expected)
        expect(actual).to.not.equal(testList)
  });
  it('returns a new array of multiple objects with correctly formatted date', () => {
    const testList = [{ 
        body:"test body",
        belongs_to: "test article",
        created_by: 'test author',
        votes: 1,
        created_at: Date.now()
      }, 
      {
      body:"test body 2",
      belongs_to: "test article 2",
      created_by: 'test author 2',
      votes: 2,
      created_at: Date.now()
    }];    
    const actual = formatDate(testList)
    const expected = [{ 
          body:"test body",
          belongs_to: "test article",
          created_by: 'test author',
          votes: 1,
          created_at: new Date()
        }, 
        {
        body:"test body 2",
        belongs_to: "test article 2",
        created_by: 'test author 2',
        votes: 2,
        created_at: new Date()
    }];
        expect(actual).to.eql(expected)
        expect(actual).to.not.equal(testList)
  });
  it('does not mutate the original array', () => {
      const input = [{
      body:"test body",
      belongs_to: "test article",
      created_by: 'test author',
      votes: 1,
      created_at: 1561390428698
    }]
      formatDate(input)
      expect(input).to.eql([{
        body:"test body",
        belongs_to: "test article",
        created_by: 'test author',
        votes: 1,
        created_at: 1561390428698
      }])
  });
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
