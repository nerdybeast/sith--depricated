import { moduleForModel, test } from 'ember-qunit';

moduleForModel('async-apex-job', 'Unit | Model | async apex job', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
