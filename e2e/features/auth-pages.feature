@guest
Feature: Auth pages

  Scenario: Sign In form renders correctly
    Given I am on "/auth/sign-in"
    Then I should see heading "Sign In"
    And the element "#sign-in-email" should be visible
    And the element "#sign-in-password" should be visible
    And I should see button "Sign In"
    And I should see button "Sign in with Passkey"
    And I should see a link "Sign Up"

  Scenario: Sign Up form renders correctly
    Given I am on "/auth/sign-up"
    Then I should see heading "Sign Up"
    And the element "#sign-up-name" should be visible
    And the element "#sign-up-email" should be visible
    And the element "#sign-up-password" should be visible
    And the element "#sign-up-confirm-password" should be visible
    And I should see button "Sign Up"
    And I should see a link "Sign In"

  Scenario: Sign In shows validation errors on empty submit
    Given I am on "/auth/sign-in"
    When I submit the form
    Then the element "[role='alert']" should be visible

  Scenario: Sign Up shows password mismatch error
    Given I am on "/auth/sign-up"
    When I fill in field "#sign-up-email" with "test@example.com"
    And I fill in field "#sign-up-password" with "password123"
    And I fill in field "#sign-up-confirm-password" with "different123"
    And I submit the form
    Then I should see text "Passwords do not match"
