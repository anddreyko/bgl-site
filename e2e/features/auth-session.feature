@authenticated
Feature: Auth session persistence

  Tests that authentication cookies work correctly and user stays
  authenticated across navigations and page reloads. Reproduces the
  bug where secure cookies over HTTP cause auth to silently fail on
  production builds served via HTTP.

  Scenario: Authenticated user does not see sign-in link
    Given I am on "/"
    Then the element ".user-avatar" should be visible
    And the element "a[href='/auth/sign-in']" should not exist

  Scenario: Auth persists after page reload
    Given I am on "/"
    Then the element ".user-avatar" should be visible
    When I reload the page
    Then the element ".user-avatar" should be visible
    And the element "a[href='/auth/sign-in']" should not exist

  Scenario: Authenticated user can access protected route
    Given I am on "/plays"
    Then the URL should contain "/plays"
    And the element ".user-avatar" should be visible
