# Smart Plantation Monitoring Dashboard (Reconstructed Export)

This folder was reconstructed from a single combined source export.

## What is included
- OpenAPI spec in `lib/api-spec/openapi.yaml`
- Backend route files under `artifacts/api-server/src/routes/`
- Frontend dashboard files under `artifacts/plantation-dashboard/src/`

## Important note
The original combined export did **not** include every project file needed to run the app directly.
Missing or externally referenced pieces include at least:
- `artifacts/api-server/src/routes/health.ts`
- various UI components under `@/components/ui/*`
- `@/hooks/use-toast`
- `@/lib/utils`
- `@/pages/not-found`
- workspace packages such as `@workspace/api-zod` and `@workspace/api-client-react`
- package manifests / lockfiles / build config files

So this repo is a **clean reconstructed source snapshot**, but not guaranteed to run without the rest of the original project.

## Upload to GitHub without terminal
1. Create a new empty repository on GitHub.
2. Download and unzip this folder.
3. Open the GitHub repo page.
4. Click **Add file** → **Upload files**.
5. Drag all files from this folder into the browser.
6. Commit the upload.

## Upload with git
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```
