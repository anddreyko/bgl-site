@guest
Feature: Home page

  Scenario: Guest sees the home page
    Given I am on "/"
    Then I should see heading "For the Record"
    And I should see button "Sign In"
    And I should see button "Sign Up"
    And the page title should contain "4Record"
