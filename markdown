The authentication process in `src/convex/auth.ts` was updated to ensure that all email addresses are converted to lowercase when creating or updating user accounts, which helps in case-insensitive matching. Additionally, the admin account seeding command was re-run, confirming the admin user already exists in the database.

### Analysis and Next Steps:

The persistent "Invalid credentials or account not found." error indicates that despite the backend handling lowercase emails during user creation, the login attempt itself might not be normalizing the email input. This discrepancy likely causes the authentication failure.

1.  **Normalize login email:** Modify `src/pages/Auth.tsx` to convert the entered email to lowercase before attempting authentication.
2.  **Verify login success:** Confirm that the admin login now works as expected.
3.  **Review `users:seedAdmin`:** Ensure the seed admin mutation doesn't run on every `Auth` page load.
