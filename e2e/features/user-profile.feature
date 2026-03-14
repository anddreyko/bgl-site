@authenticated
Feature: User profile

  Scenario: Authenticated user sees profile page
    Given I am on "/profile"
    Then I should see heading "Edit Profile"
    And the element "#profile-name" should be visible
    And I should see button "Sign Out"
    And I should see heading "Security"

  Scenario: Register Passkey shows user-friendly error
    Given I am on "/profile"
    When I wait for hydration
    And I click on "Register Passkey"
    Then the error message should not contain raw JS errors
