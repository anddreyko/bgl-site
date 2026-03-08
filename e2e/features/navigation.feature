@guest
Feature: Navigation

  Scenario: Guest navigates to Games
    Given I am on "/"
    When I click on "Games"
    Then I should be redirected to "/game"

  Scenario: Guest sees Sign In link
    Given I am on "/"
    Then I should see a link "Sign In"
