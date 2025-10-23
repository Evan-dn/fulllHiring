## login_test.feature

Feature: Login to the platform

As a legitimate user
I want to be able to log in to the platform
So that I can access secure features

Scenario: Successful login with valid credentials
        Given the user is on the login page
        When they enter the username "admin@example.com"
        And they enter the password "MotDePasse123"
        And they click the login button
        Then they are redirected to the home page
        And the message "Welcome admin@example.com" is displayed

Scenario: Failed login with incorrect password
        Given the user is on the login page
        When they enter the username "admin@example.com"
        And they enter the password "mauvaismotdepasse"
        And they click the login button
        Then an error message "Invalid credentials" is displayed
