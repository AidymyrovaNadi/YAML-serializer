const assert = require('assert');
const Yaml = require('../YAMLstringify.js')

it('должно возвращать true', () => {
  assert.equal(true, true);
}); 

it(`возвращает тип "string"`, () => {
    assert.equal(Yaml.checkType('Hello!'), 'string');
}); 

it(`сериализация объекта`, () => {
    assert.equal(Yaml.stringify( {"bar": "baz"} ), "bar: baz");
}); 

it(`принимает и возвращает null`, () => {
    assert.equal(Yaml.stringify( null ), null);
});