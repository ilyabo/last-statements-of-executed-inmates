const _ = require('lodash');
const fs = require('fs');
const d3dsv = require('d3-dsv');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const statements = JSON.parse(fs.readFileSync('data/statements.json', 'utf8'))
let rows = statements
  .filter(({ statement }) => !!statement)
  .map(({ statement, ...rest }) => (
    { ...rest,
        statement:
          _.trim(
            entities.decode(statement)
          )
    }
  ))
  .map(({ statement, ...rest }) => (
    { ...rest,
        statement:
          (
          statement === 'Last Statement:'
          || _.isEmpty(statement)
          )
            ? 'No last statement.'
            : statement
    }
  ))
  // .filter(({ statement }) =>
  //   !_.isEmpty(statement)
  //   && statement!='(Spoken statement)'
  //   && statement!='This offender declined to make a last statement.'
  // )

console.log(`Keeping ${rows.length} rows of ${statements.length} statements`)

fs.writeFileSync(
  'data/statements.csv',
  d3dsv.csvFormat(rows, Object.keys(rows[0]))
)
