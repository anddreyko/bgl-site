@guest
Feature: Game catalog

  Scenario: Guest views the game catalog
    Given I am on "/game"
    Then I should see heading "Game Catalog"

  Scenario: Search field is displayed
    Given I am on "/game"
    Then the element "#game-search" should be visible

  Scenario: Short search query shows hint
    Given I am on "/game"
    When I type "ab" into "#game-search"
    Then I should see text "Enter at least 3 characters to search."
