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
        belongs_to: 1,
        created_by: 'test author',
        votes: 1,
        created_at: Date.now()
      }];
    const actual = formatDate(testList)
    const expected = [{ 
          body:"test body",
          belongs_to: 1,
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
        belongs_to: 1,
        created_by: 'test author',
        votes: 1,
        created_at: Date.now()
      }, 
      {
      body:"test body 2",
      belongs_to: 2,
      created_by: 'test author 2',
      votes: 2,
      created_at: Date.now()
    }];    
    const actual = formatDate(testList)
    const expected = [{ 
          body:"test body",
          belongs_to: 1,
          created_by: 'test author',
          votes: 1,
          created_at: new Date()
        }, 
        {
        body:"test body 2",
        belongs_to: 2,
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
      belongs_to: 1,
      created_by: 'test author',
      votes: 1,
      created_at: 1561390428698
    }]
      formatDate(input)
      expect(input).to.eql([{
        body:"test body",
        belongs_to: 1,
        created_by: 'test author',
        votes: 1,
        created_at: 1561390428698
      }])
  });
});

describe("makeRefObj", () => {
  it('returns an empty object when passed an empty array', () => {
    expect(makeRefObj([])).to.eql({})
  });
  it('returns an object with one KVP when passed an array of one object', () => {
    const input = [{ article_id: 1, title: 'A' }]
    expect(makeRefObj(input)).to.eql({A: 1})
  });
  it('returns an object with multiple KVPs when passed an array of multiple objects', () => {
    const input = [{ article_id: 1, title: 'A' }, { article_id: 2, title: 'B' }]
    expect(makeRefObj(input)).to.eql({A: 1, B: 2})
  });
  it('does not mutate the input array', () => {
    const input = [{ article_id: 1, title: 'A' }]
    makeRefObj(input)
    expect(input).to.eql([{ article_id: 1, title: 'A' }])
  });
});

describe("formatComments", () => {
  it('returns a new empty array when passed an empty array', () => {
    expect(formatComments([])).to.eql([])
  });
  it('returns an array containing a single formatted comment when passed an array with one comment obj', () => {
    const testComments = [{ 
      body:"test body",
      belongs_to: 'A',
      created_by: 'test author',
      votes: 1,
      created_at: Date.now()
    }]
    const refObj = { A : 1 }
    const actual = formatComments(testComments, refObj)
    const expected = [{ 
      body:"test body",
      article_id: 1,
      author: 'test author',
      votes: 1,
      created_at: new Date()
    }]
    expect(actual).to.eql(expected)
  })
  it('returns an array containing multiple formatted comments when passed an array with multiple comment objs', () => {
    const testComments = [{ 
      body:"test body",
      belongs_to: 'A',
      created_by: 'test author',
      votes: 1,
      created_at: Date.now()
    }, { 
      body:"test",
      belongs_to: 'B',
      created_by: 'test man',
      votes: 1,
      created_at: Date.now()
    }]
    const refObj = { A : 1, B : 2 }
    const actual = formatComments(testComments, refObj)
    const expected = [{ 
      body:"test body",
      article_id: 1,
      author: 'test author',
      votes: 1,
      created_at: new Date()
    }, { 
      body:"test",
      article_id: 2,
      author: 'test man',
      votes: 1,
      created_at: new Date()
    }]
    expect(actual).to.eql(expected)
  });
  it('does not mutate the original array', () => {
    const testComments = [{ 
      body:"test body",
      belongs_to: 'A',
      created_by: 'test author',
      votes: 1,
      created_at: Date.now()
    }]
    const refObj = { A : 1 }
    formatComments(testComments, refObj)
    expect(testComments).to.eql([{ 
      body:"test body",
      belongs_to: 'A',
      created_by: 'test author',
      votes: 1,
      created_at: Date.now()
    }])
  });
});

// add test for updateComments util