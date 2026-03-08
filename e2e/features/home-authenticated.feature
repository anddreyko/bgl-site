@authenticated
Feature: Home page for authenticated user

  Scenario: Authenticated user sees welcome greeting
    Given I am on "/"
    Then the element ".home-page__greeting" should be visible
    And I should see button "Record a Play"
    And I should see button "Browse Games"
