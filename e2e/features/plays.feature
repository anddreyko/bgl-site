@authenticated
Feature: Plays page

  Scenario: Authenticated user sees plays page
    Given I am on "/plays"
    Then I should see heading "Plays"
    And I should see button "New Play"
