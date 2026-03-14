@authenticated
Feature: Game detail for authenticated user

  Scenario: Game detail page shows game info from catalog
    Given I am on "/game"
    And I type "catan" into "#game-search"
    And I click the first game link
    Then the element ".game-hero__title" should be visible
    And the element ".game-hero__stat-label" should be visible

  Scenario: Play History section visibility matches play count
    Given I am on "/game"
    And I type "catan" into "#game-search"
    And I click the first game link
    Then Play History section visibility matches play count
