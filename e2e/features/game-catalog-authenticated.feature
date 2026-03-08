@authenticated
Feature: Game catalog for authenticated user

  Scenario: Recently played games shown when search is empty
    Given I am on "/game"
    Then I should see heading "Game Catalog"
    And the element ".game-catalog__recent" should be visible
    And I should see text "Recently played"
