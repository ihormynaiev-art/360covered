import os
from dotenv import load_dotenv
from src.python.automation_bot.github_workflow_controller import GitHubWorkflowController
from src.python.automation_bot.telegram_bot_dispatcher import TelegramBotDispatcher


class AutomationBotApplication:
    """
    Coordinator class for launching the Telegram bot and its associated GitHub controller.
    """
    def __init__(self):
        load_dotenv()
        self.telegram_bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        self.github_personal_access_token = os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN")
        self.repository_owner = os.getenv("GITHUB_REPO_OWNER", "ihormynaiev-art")
        self.repository_name = os.getenv("GITHUB_REPO_NAME", "360covered")
        self.report_url_base = os.getenv("ALLURE_REPORT_URL", f"https://{self.repository_owner}.github.io/{self.repository_name}/")
        
        self._ensure_environment_is_configured()
        
        self.github_workflow_controller = GitHubWorkflowController(
            repository_owner=self.repository_owner,
            repository_name=self.repository_name,
            github_access_token=self.github_personal_access_token
        )
        
        self.telegram_bot_dispatcher = TelegramBotDispatcher(
            telegram_token=self.telegram_bot_token,
            github_controller=self.github_workflow_controller,
            report_url_base=self.report_url_base
        )

    def _ensure_environment_is_configured(self) -> None:
        """
        Verify presence of mandatory environment variables.
        """
        missing_vars = []
        if not self.telegram_bot_token:
            missing_vars.append("TELEGRAM_BOT_TOKEN")
        if not self.github_personal_access_token:
            missing_vars.append("GITHUB_PERSONAL_ACCESS_TOKEN")
            
        if missing_vars:
            raise KeyError(f"Configuration Critical Error: Missing {', '.join(missing_vars)} in .env file.")

    def launch_automation_flow(self) -> None:
        """
        Starts the polling handler for the bot.
        """
        print("Initializing Automation Runner...")
        self.telegram_bot_dispatcher.execute_bot_polling()


if __name__ == "__main__":
    automation_runner = AutomationBotApplication()
    automation_runner.launch_automation_flow()
