import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('org-limit-watch', 'Integration | Component | org limit watch', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{org-limit-watch}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#org-limit-watch}}
      template block text
    {{/org-limit-watch}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
