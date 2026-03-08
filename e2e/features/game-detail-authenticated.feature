@authenticated
Feature: Game detail for authenticated user

  Scenario: Plays API is called with correct game_id filter
    Given I am on "/game/1"
    Then the plays API request should contain game_id filter "1"

  Scenario: Play history table shows only plays for this game
    Given I am on a game page with plays
    Then every play in the history table should belong to this game
