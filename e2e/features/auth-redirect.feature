@guest
Feature: Auth redirect

  Scenario: Guest is redirected from mates page
    Given I am on "/mates"
    Then I should be redirected to "/auth/sign-in"

  Scenario: Guest is redirected from plays page
    Given I am on "/plays"
    Then I should be redirected to "/auth/sign-in"

  Scenario: Guest is redirected from profile page
    Given I am on "/user/me"
    Then I should be redirected to "/auth/sign-in"
