# tsmc-quick-parking

## Contribution

### Pull Request
For more details, please refer to [Notion page about our git flow](https://www.notion.so/jackywithawhitedog/Git-workflow-9dca27847b614860a48d2ec18b80b826)
1. Create new branch from `main` to add features or fix bugs (e.g., `feat-frontend-parking_login`)
2. After finish your code, create pull request to `main` (e.g., `fix(backend): login failed`)
3. Assign member to review code if needed
4. Only merge if all the build test is passed.

#### Branch Name Format
```text
<type>-<optional scope>-<description>
```

### Commit Message Format
This specification is inspired by [Conventional Commits](https://www.conventionalcommits.org/)

Commit message should be structured as

```text
<type>(<optional scope>): <description>
```

#### Type
- `feat`: A new feature
- `fix`: A bug fix
- `perf`: A code change that improves performance
- `refact`: A code change that neither fixes a bug nor adds a feature
- `test` A code change on testing
- `doc`: Documentation changes

#### Scope
- `frontend` (e.g., `frontend.api`, `frontend.map`)
- `backend` (e.g., `beckend.optimize`)
- `devops`

#### Examples:
- `feat(frontend): add login button`
- `fix(frontend.api): wrong HTTP request type`
- `refact(backend): remove legacy code`
- `test(backend.parking_management): add test case for add new car`
