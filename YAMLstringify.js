'use strict';

class YAML {
    stringify = (value, replacer, space) => {
        const serializer = this.serializers[this.checkType(value)];
        if (!!serializer) {
          if (replacer instanceof Function) this.replacer = replacer;
          if (Array.isArray(replacer)) return this.serialize(value);

          return this.serialize(value, undefined, this.space)
        }
    }

    serialize = (value, key, prefix, postfix) => {
      const replaced = this.replacer ? this.replacer(key, value) : value;
      const serializer = this.serializers[this.checkType(replaced)];
      if (!!serializer) return serializer(replaced, key, prefix, postfix);
  }

    checkType = (obj) => {
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

    serializers = {
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

    sortFields = (a, b) => {
        const typeOfA = this.checkType(a[1]);
        const typeOfB = this.checkType(b[1]);

        if (typeOfA === typeOfB) return 0;
        if (typeOfA === 'object') return 1;
        if (typeOfB === 'object') return -1;
    }
}

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

const Yaml = new YAML();

console.log(Yaml.stringify(obj2));

module.exports = Yaml;