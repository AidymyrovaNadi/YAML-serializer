const assert = require('assert');
const Yaml = require('../YAMLstringify.js');

it(`возвращает тип "string"`, () => {
    assert.equal(Yaml.checkType('Hello!'), 'string');
}); 

it(`сериализация объекта`, () => {
    assert.equal(Yaml.stringify( { "bar": "baz" } ), "  bar: baz\n");
}); 

it(`принимает и возвращает null`, () => {
    assert.equal(Yaml.stringify( null ), null);
});

it(`сериализация числа`, () => {
    assert.equal(Yaml.stringify( 3.14159 ), '  3.14159');
});

it(`сериализация массива`, () => {
    assert.equal(Yaml.stringify( [true, false, 'maybe', null] ), `- true\n- false\n- maybe\n- `);
});
// `- true
// - false
// - maybe
// - null
// `
