@authenticated
Feature: Mates page

  Scenario: Authenticated user sees mates page
    Given I am on "/mates"
    Then I should see heading "My Mates"
    And I should see button "Add Mate"

  Scenario: Add Mate dialog opens
    Given I am on "/mates"
    When I click on "Add Mate"
    And I wait for dialog to open
    Then the element "#mate-name" should be visible
    And the element "#mate-notes" should be visible
    And I should see button "Cancel"
