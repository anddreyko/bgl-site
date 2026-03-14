@authenticated
Feature: Home page for authenticated user

  Scenario: Authenticated user sees home page with stats and feed
    Given I am on "/"
    Then the element ".home-page__stats" should be visible
    And the element ".home-page__recent" should be visible
