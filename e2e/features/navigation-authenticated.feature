@authenticated
Feature: Navigation for authenticated user

  Scenario: Authenticated user sees full navigation
    Given I am on "/"
    Then I should see a link "Games"
    And I should see a link "Mates"
    And I should see a link "Plays"
    And the element ".user-avatar" should be visible

  Scenario: User avatar links to profile
    Given I am on "/"
    When I click on the user avatar
    Then I should be redirected to "/user/me"
