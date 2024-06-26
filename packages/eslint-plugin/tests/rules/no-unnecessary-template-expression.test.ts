import { noFormat, RuleTester } from '@typescript-eslint/rule-tester';

import rule from '../../src/rules/no-unnecessary-template-expression';
import { getFixturesRootDir } from '../RuleTester';

const rootPath = getFixturesRootDir();

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: rootPath,
    project: './tsconfig.json',
  },
});

ruleTester.run('no-unnecessary-template-expression', rule, {
  valid: [
    "const string = 'a';",
    'const string = `a`;',
    `
      declare const string: 'a';
      \`\${string}b\`;
    `,

    `
      declare const number: 1;
      \`\${number}b\`;
    `,

    `
      declare const boolean: true;
      \`\${boolean}b\`;
    `,

    `
      declare const nullish: null;
      \`\${nullish}-undefined\`;
    `,

    `
      declare const undefinedish: undefined;
      \`\${undefinedish}\`;
    `,

    `
      declare const left: 'a';
      declare const right: 'b';
      \`\${left}\${right}\`;
    `,

    `
      declare const left: 'a';
      declare const right: 'c';
      \`\${left}b\${right}\`;
    `,

    `
      declare const left: 'a';
      declare const center: 'b';
      declare const right: 'c';
      \`\${left}\${center}\${right}\`;
    `,

    '`1 + 1 = ${1 + 1}`;',

    '`true && false = ${true && false}`;',

    "tag`${'a'}${'b'}`;",

    '`${function () {}}`;',

    '`${() => {}}`;',

    '`${(...args: any[]) => args}`;',

    `
      declare const number: 1;
      \`\${number}\`;
    `,

    `
      declare const boolean: true;
      \`\${boolean}\`;
    `,

    `
      declare const nullish: null;
      \`\${nullish}\`;
    `,

    `
      declare const union: string | number;
      \`\${union}\`;
    `,

    `
      declare const unknown: unknown;
      \`\${unknown}\`;
    `,

    `
      declare const never: never;
      \`\${never}\`;
    `,

    `
      declare const any: any;
      \`\${any}\`;
    `,

    `
      function func<T extends number>(arg: T) {
        \`\${arg}\`;
      }
    `,

    `
      \`with

      new line\`;
    `,

    `
      declare const a: 'a';

      \`\${a} with

      new line\`;
    `,

    noFormat`
      \`with windows \r new line\`;
    `,

    `
\`not a useless \${String.raw\`nested interpolation \${a}\`}\`;
    `,
  ],

  invalid: [
    {
      code: '`${1}`;',
      output: '`1`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
          column: 4,
          endColumn: 5,
        },
      ],
    },
    {
      code: '`${1n}`;',
      output: '`1`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
          column: 4,
          endColumn: 6,
        },
      ],
    },
    {
      code: '`${/a/}`;',
      output: '`/a/`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
          column: 4,
          endColumn: 7,
        },
      ],
    },

    {
      code: noFormat`\`\${    1    }\`;`,
      output: '`1`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
      ],
    },

    {
      code: noFormat`\`\${    'a'    }\`;`,
      output: `'a';`,
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
      ],
    },

    {
      code: noFormat`\`\${    "a"    }\`;`,
      output: `"a";`,
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
      ],
    },

    {
      code: noFormat`\`\${    'a' + 'b'    }\`;`,
      output: `'a' + 'b';`,
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
      ],
    },

    {
      code: '`${true}`;',
      output: '`true`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
          column: 4,
          endColumn: 8,
        },
      ],
    },

    {
      code: noFormat`\`\${    true    }\`;`,
      output: '`true`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
      ],
    },

    {
      code: '`${null}`;',
      output: '`null`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
          column: 4,
          endColumn: 8,
        },
      ],
    },

    {
      code: noFormat`\`\${    null    }\`;`,
      output: '`null`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
      ],
    },

    {
      code: '`${undefined}`;',
      output: '`undefined`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
          column: 4,
          endColumn: 13,
        },
      ],
    },

    {
      code: noFormat`\`\${    undefined    }\`;`,
      output: '`undefined`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
      ],
    },

    {
      code: '`${Infinity}`;',
      output: '`Infinity`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
          column: 4,
          endColumn: 12,
        },
      ],
    },

    {
      code: '`${NaN}`;',
      output: '`NaN`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
          column: 4,
          endColumn: 7,
        },
      ],
    },

    {
      code: "`${'a'} ${'b'}`;",
      output: '`a b`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
          column: 4,
          endColumn: 7,
        },
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
          column: 11,
          endColumn: 14,
        },
      ],
    },

    {
      code: noFormat`\`\${   'a'   } \${   'b'   }\`;`,
      output: '`a b`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
      ],
    },

    {
      code: `
        declare const b: 'b';
        \`a\${b}\${'c'}\`;
      `,
      output: `
        declare const b: 'b';
        \`a\${b}c\`;
      `,
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 3,
          column: 17,
          endColumn: 20,
        },
      ],
    },

    {
      code: "`use${'less'}`;",
      output: '`useless`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
        },
      ],
    },

    {
      code: '`use${`less`}`;',
      output: '`useless`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
        },
      ],
    },

    {
      code: `
declare const nested: string, interpolation: string;
\`use\${\`less\${nested}\${interpolation}\`}\`;
      `,
      output: `
declare const nested: string, interpolation: string;
\`useless\${nested}\${interpolation}\`;
      `,
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
      ],
    },

    {
      code: noFormat`
\`u\${
  // hopefully this comment is not needed.
  'se'

}\${
  \`le\${  \`ss\`  }\`
}\`;
      `,
      output: `
\`use\${
  \`less\`
}\`;
      `,
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 4,
        },
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 7,
          column: 3,
          endLine: 7,
        },
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 7,
          column: 10,
          endLine: 7,
        },
      ],
    },
    {
      code: noFormat`
\`use\${
  \`less\`
}\`;
      `,
      output: `
\`useless\`;
      `,
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 3,
          column: 3,
          endColumn: 9,
        },
      ],
    },

    {
      code: "`${'1 + 1 ='} ${2}`;",
      output: '`1 + 1 = 2`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
          column: 4,
          endColumn: 13,
        },
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
          column: 17,
          endColumn: 18,
        },
      ],
    },

    {
      code: "`${'a'} ${true}`;",
      output: '`a true`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
          column: 4,
          endColumn: 7,
        },
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
          column: 11,
          endColumn: 15,
        },
      ],
    },

    {
      code: `
        declare const string: 'a';
        \`\${string}\`;
      `,
      output: `
        declare const string: 'a';
        string;
      `,
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 3,
          column: 12,
          endColumn: 18,
        },
      ],
    },

    {
      code: noFormat`
        declare const string: 'a';
        \`\${   string   }\`;
      `,
      output: `
        declare const string: 'a';
        string;
      `,
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
      ],
    },

    {
      code: "`${String(Symbol.for('test'))}`;",
      output: "String(Symbol.for('test'));",
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 1,
          column: 4,
          endColumn: 30,
        },
      ],
    },

    {
      code: `
        declare const intersection: string & { _brand: 'test-brand' };
        \`\${intersection}\`;
      `,
      output: `
        declare const intersection: string & { _brand: 'test-brand' };
        intersection;
      `,
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 3,
          column: 12,
          endColumn: 24,
        },
      ],
    },

    {
      code: `
        function func<T extends string>(arg: T) {
          \`\${arg}\`;
        }
      `,
      output: `
        function func<T extends string>(arg: T) {
          arg;
        }
      `,
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
          line: 3,
          column: 14,
          endColumn: 17,
        },
      ],
    },

    {
      code: "`${'`'}`;",
      output: "'`';",
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
      ],
    },

    {
      code: "`back${'`'}tick`;",
      output: '`back\\`tick`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
      ],
    },

    {
      code: "`dollar${'${`this is test`}'}sign`;",
      output: '`dollar\\${\\`this is test\\`}sign`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
      ],
    },

    {
      code: '`complex${\'`${"`${test}`"}`\'}case`;',
      output: '`complex\\`\\${"\\`\\${test}\\`"}\\`case`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
      ],
    },

    {
      code: "`some ${'\\\\${test}'} string`;",
      output: '`some \\\\\\${test} string`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
      ],
    },

    {
      code: "`some ${'\\\\`'} string`;",
      output: '`some \\\\\\` string`;',
      errors: [
        {
          messageId: 'noUnnecessaryTemplateExpression',
        },
      ],
    },
  ],
});
