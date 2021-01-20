'use strict';

class YAML {
    static stringify(value, replacer, space, key) {
        const serializer = this.serializers[this.checkType(value)];
        if (!!serializer) {
            if (!replacer) return serializer(value, key);
        }
    }

    static checkType(obj) {
        const type = typeof obj;
        if (type === 'string') return 'string';
        if (type === 'number') return 'number';
        if (type === 'boolean') return 'boolean';
        if (type instanceof Function) return 'function';
        if (Array.isArray(obj)) {
            if (this.checkType(obj[0]) === 'object') return 'arrayObject';
            else return 'array';
        };
        if (obj !== null) return 'object';
    }

    static serializers = {
        string: s => {
            if (s.includes('\n')) {
                const res = `|\n  ${s.replace(/\n/g, '\n  ')}`;
                return res;
            }
            else return `${s}`;
        },
        number: n => n.toString(),
        boolean: b => b.toString(),
        function: f => f.toString(),
        array: a => {
            let s = '';
            const sortedArr = a.entries();
            for (const [key, value] of sortedArr) {
                s += `\n  - ${this.stringify(value, undefined, undefined, key)}`;
            }
            return s;
        },
        object: o => {
            let s = '';

            const sortedObj = Object.entries(o).sort((a, b) => { 
                return this.sortFields(a, b); 
            });

            for (const [key, value] of sortedObj) {

                if (s.length > 1) s += '\n';
                const type = this.checkType(value);

                if (type === "object") {
                    s += `${key}: \n  ${this.stringify(value, undefined, undefined, key)}`;
                    const subObjest = Object.create(value);

                    const sortedSubObj = Object.entries(subObjest).sort((a, b) => { 
                        return this.sortFields(a, b); 
                    });

                    for (const [key, value] of sortedSubObj) {
                        s += `  ${key}: ${this.stringify(value, undefined, undefined, key)}`;
                    }
                }
                
                else s += `${key}: ${this.stringify(value, undefined, undefined, key)}`;
            }
            return s;
        }
    }

    static sortFields(a, b) {
        const typeOfA = this.checkType(a[1]);
        const typeOfB = this.checkType(b[1]);

        if (typeOfA === typeOfB) return 0;
        if (typeOfA === 'object') return 1;
        if (typeOfB === 'object') return -1;
    }
}

const obj1 = {
    name: "John",
    surname: "pisos",
    age: 123,
    climax: {
      jopa: "bolit",
      pisos: "bolit",
      rot: 1,
      climaxsa: {
        jopa: "bolits",
        pisos: "bolits",
        rot: ["sss0", "sdfewwwww", 3322]
      }
    }
};

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
          "null_value": null
        },
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
      "key": "value"
    //   "array": [
    //     {
    //       "null_value": null
    //     },
    //     {
    //       "boolean": true
    //     },
    //     {
    //       "integer": 1
    //     },
    //     {
    //       "alias": "aliases are like variables"
    //     },
    //     {
    //       "alias": "aliases are like variables"
    //     }
    //   ]
    },
    "paragraph": "Blank lines denote\nparagraph breaks\n",
    "content": "Or we\ncan auto\nconvert line breaks\nto save space",
    "alias": {
      "bar": "baz"
    },
    "alias_reuse": {
      "bar": "baz"
    }
};

const string1 = `"Hello"`;

const Yaml = new YAML();

console.log(Yaml.stringify(string1));

module.exports = Yaml;