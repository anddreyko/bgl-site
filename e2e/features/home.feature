Feature: Home page

  Scenario: User visits the home page
    Given I am on the home page
    Then I should see the main content
    And the page title should contain "4Record"
