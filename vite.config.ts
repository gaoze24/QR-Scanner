import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
const isUserOrOrgPagesRepo = repoName.endsWith('.github.io')

function getBasePath() {
  const configuredBasePath = process.env.VITE_BASE_PATH
  if (configuredBasePath) {
    return configuredBasePath
  }

  if (!isGitHubActions) {
    return '/'
  }

  if (!repoName || isUserOrOrgPagesRepo) {
    return '/'
  }

  return `/${repoName}/`
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: getBasePath(),
})
