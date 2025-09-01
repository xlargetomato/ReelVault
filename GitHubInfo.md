# Git Commands for ReelVault 🚀

## 1. Clone the repository (only the first time)

```bash
git clone https://github.com/xlargetomato/ReelVault.git
cd ReelVault

2. Check status of changes
git status

3. Add changes
git add .
(Use git add filename to add a specific file instead of all.)

4. Commit changes
bash
Copy code
git commit -m "your commit message here"

5. Push changes to GitHub
bash
Copy code
git push origin main
(If your branch is named something else, replace main with the branch name.)

6. Pull latest changes (before starting new work)
bash
Copy code
git pull origin main

7. Create and switch to a new branch (optional, for features)
bash
Copy code
git checkout -b feature-branch-name

8. Switch back to main branch
bash
Copy code
git checkout main
Typical Workflow
Make changes to your project.

Run:

bash
Copy code
git status
git add .
git commit -m "describe what you changed"
git push origin main
Refresh your GitHub repo to see the changes.

Helpful Extras
See commit history:

bash
Copy code
git log --oneline
Undo last add:

bash
Copy code
git reset
Undo last commit (keep changes staged):

bash
Copy code
git reset --soft HEAD~1
pgsql
Copy code

---
```
