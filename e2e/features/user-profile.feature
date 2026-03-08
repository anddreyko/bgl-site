@authenticated
Feature: User profile

  Scenario: Authenticated user sees profile page
    Given I am on "/user/me"
    Then I should see heading "Edit Profile"
    And the element "#profile-name" should be visible
    And I should see button "Sign Out"
    And I should see heading "Security"
