@authenticated
Feature: Game catalog for authenticated user

  Scenario: Game catalog loads for authenticated user
    Given I am on "/game"
    Then I should see heading "Game Catalog"
    And the element "#game-search" should be visible
