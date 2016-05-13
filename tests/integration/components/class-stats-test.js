import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('class-stats', 'Integration | Component | class stats', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{class-stats}}`);

  assert.equal(this.$().text().trim(), 'Number of classes in this org:');

  // Template block usage:
  // this.render(hbs`
  //   {{#class-stats}}
  //     template block text
  //   {{/class-stats}}
  // `);

  // assert.equal(this.$().text().trim(), 'template block text');
});
