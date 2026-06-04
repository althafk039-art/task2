Git setup for `frontend`

To initialize this folder as a standalone Git repository and push to a remote, run the provided PowerShell script from this folder:

```powershell
cd frontend
./setup-git.ps1
```

The script will prompt for a remote URL. If you prefer to run commands manually, these are the steps:

```powershell
# initialize repo
cd frontend
git init
# stage and commit
git add .
git commit -m "Initial commit"
# add remote (replace URL)
git remote add origin https://github.com/your/repo.git
git branch -M main
# push and set upstream
git push -u origin main
```

Notes:
- If this folder is inside a parent repository (it currently is inside the workspace root), Git commands run here will still reference the parent repo unless you initialize a separate repo in this folder.
- Pushing will require appropriate authentication (GitHub token or username/password if using HTTPS, or SSH key if using SSH remote).