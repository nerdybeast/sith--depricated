import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bootstrap/panel-heading', 'Integration | Component | bootstrap/panel heading', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{bootstrap/panel-heading}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#bootstrap/panel-heading}}
      template block text
    {{/bootstrap/panel-heading}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
