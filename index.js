const Yaml = require('./YAMLstringify.js');

const obj1 = { number: 3, plain: 'string', block: 'two\nlines\n' };

const arr1 = [true, false, 'maybe', null];

const obj2 = {
    "json": [
      "rigid",
      "better for data interchange"
    ],
    "yaml": [
      "slim and flexible",
      "better for configuration"
    ],
    "array": [
        {
          "boolean": true
        },
        {
          "integer": 1
        },
        {
          "alias": "aliases are like variables"
        },
        {
          "alias": "aliases are like variables"
        }
    ],
    "object": {
      "key1": "value1",
      "cell": 343,
      "hello": "world"
    },
    "paragraph": "Blank lines denote\nparagraph breaks",
    "content": "Or we\ncan auto\nconvert line breaks\nto save space",
    "alias": {
      "bar": "baz"
    },
    "alias_reuse": {
      "bar": "baz"
    }
};

const string1 = "Blank lines denote\nparagraph breaks";

console.log(Yaml.stringify(obj2));