casper.test.begin('App is setup correctly', 2, function suite(test) {
  casper.start('http://localhost:3000/', function() {
    test.assertExists('.table-list', 'List should exist');
  });

  casper.run(function() {
    test.done();
  });
});

