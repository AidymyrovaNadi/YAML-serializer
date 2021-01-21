'use strict';

class YAML {
    stringify = (value, replacer, space) => {
      this.space = space;
      if (replacer instanceof Function) this.replacer = replacer;
      if (Array.isArray(replacer)) {
          const filtered = replacer.reduce((acc, val) => {
              acc[val] = value[val];
              return acc;
          }, {});
          return this.serialize(filtered);
      }
      return this.serialize(value);
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
        if (type instanceof Date) return 'date';
        if (Array.isArray(obj)) {
            if (this.checkType(obj[0]) === 'object') return 'arrayObject';
            else return 'array';
        };
        if (obj !== null) return 'object';
    }

    serializers = {
        string: (s, key = '', prefix = '', postfix = '') => {
            if (key && s.includes('\n')) {
                const res = `${prefix + key}|\n  ${s.replace(/\n/g, '\n  ') + postfix}`;
                return res;
            }
            else return `${prefix + key + s + postfix}`;
        },
        number: (n, key = '', prefix = '', postfix = '') => prefix + key + n.toString() + postfix,
        boolean: (b, key = '', prefix = '', postfix = '') => prefix + key + b.toString() + postfix,
        date: (d, key = '', prefix = '', postfix = '') => prefix + key + d.toString() + postfix,
        array: (a, key = '', prefix = '', postfix = '') => {
          const mapped = a.map(obj => this.serialize(obj)).join('\n  - ');
          return `${prefix}${key}\n  - ${mapped}${postfix}`;
        },
        arrayObject: (a, key, prefix = '', postfix = '') => {
          const mapped = a.map(obj => this.serialize(obj)).join('  - ');
          return `${prefix}${key}:\n  - ${mapped}${postfix}`;
        },
        object: (o, prev, prefix = '', postfix = '') => {
            let s = prev ? `${prefix}${prev}:${postfix}` : '';

            const sortedObj = Object.entries(o).sort((a, b) => { 
                return this.sortFields(a, b); 
            });

            for (const [key, value] of sortedObj) {
                const type = this.checkType(value);

                const combinatedKey = prev ? `${prev}.${key}` : key;
                const space = this.additionalSpace(prefix);

                if (type === 'object') {
                  s += this.serialize(value, combinatedKey, space, '\n  ');
                }
                if (type === 'arrayObject') {
                  s += this.serialize(value, combinatedKey, space, '\n');
                }
                else {
                  s += this.serialize(value, `${key}: `, space, '\n')
                }
            }
            return s;
        }
    }

    sortFields = (a, b) => {
        const typeOfA = this.checkType(a[0]);
        const typeOfB = this.checkType(b[0]);

        if (typeOfA === typeOfB) return 0;
        if (typeOfA === 'object') return 1;
        if (typeOfB === 'object') return -1;
    }

    additionalSpace(prefix) {
      const type = this.checkType(this.space);
      let s = '';
      let length = prefix.length;
      if (type === 'number') {
          length = prefix.length + this.space;
      }
      if (type === 'string') {
          s = this.space;
          length = prefix.length + this.space.length;
      }
      return s.repeat(length);
  }
}


const Yaml = new YAML();


module.exports = Yaml;