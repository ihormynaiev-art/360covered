import requests


class GitHubWorkflowController:
    """
    Manages communication with GitHub Actions API for triggering flows.
    """
    def __init__(self, repository_owner: str, repository_name: str, github_access_token: str):
        self.repository_owner = repository_owner
        self.repository_name = repository_name
        self.github_access_token = github_access_token
        self.base_url = f"https://api.github.com/repos/{self.repository_owner}/{self.repository_name}"

    def trigger_test_workflow(self, test_suite: str, environment: str = "dev", browser: str = "chromium") -> bool:
        """
        Triggers a workflow dispatch event for Playwright tests.
        """
        workflow_api_route = f"{self.base_url}/actions/workflows/playwright.yml/dispatches"
        
        request_headers = {
            "Authorization": f"Bearer {self.github_access_token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }
        
        request_data = {
            "ref": "master",
            "inputs": {
                "test_suite": test_suite,
                "environment": environment,
                "browser": browser
            }
        }
        
        response = requests.post(
            url=workflow_api_route,
            headers=request_headers,
            json=request_data,
            timeout=10
        )
        
        if response.status_code != 204:
            raise Exception(f"GitHub Error ({response.status_code}): {response.text}")
            
        return True

    def get_latest_workflow_run_status(self) -> dict:
        """
        Retrieves the status of the current or last completed job.
        """
        workflow_runs_route = f"{self.base_url}/actions/workflows/playwright.yml/runs?per_page=1"
        
        request_headers = {
            "Authorization": f"Bearer {self.github_access_token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }
        
        response = requests.get(
            url=workflow_runs_route,
            headers=request_headers,
            timeout=10
        )
        
        if response.status_code != 200:
            raise Exception(f"GitHub Error ({response.status_code}): {response.text}")
            
        json_output = response.json()
        
        if not json_output["workflow_runs"]:
            return {}
            
        last_run = json_output["workflow_runs"][0]
        
        return {
            "status": last_run["status"],
            "conclusion": last_run["conclusion"],
            "html_url": last_run["html_url"],
            "run_id": last_run["id"]
        }
