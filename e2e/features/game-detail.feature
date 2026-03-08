@guest
Feature: Game detail

  Scenario: Game detail page has back link
    Given I am on "/game/1"
    Then I should see a link "Back to game catalog"
