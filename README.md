# Automation Practice

To run the tests use the command:

`npm test`

Requirements:

- npm
- Firefox
- Gecko webdriver

## Files

*scenario.js* - is a test framework illustrating the generation of tests against pages. This was intended to be designed
to provide pluggable backends, and would have been extended to provide state transitions between pages. This is 
incomplete.

*linear.js* - is a series of basic tests, running against the automationpractice.com website using Selenium, to provide 
a happy-path example of the website. 

## TODO

- [ ] Assert dress colour
- [ ] Change authentication to generate user as part of checkout
- [ ] After test close Firefox
- [ ] Extend scenario model to include page actions/state transitions
- [ ] Add backend in scenario to support webdriver 
