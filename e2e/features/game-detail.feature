@guest
Feature: Game detail

  Scenario: Game detail page has back link
    Given I am on "/game"
    And I click the first game link
    Then I should see a link "Back to game catalog"
