import asyncio
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    ContextTypes,
)
from src.python.automation_bot.github_workflow_controller import GitHubWorkflowController


class TelegramBotDispatcher:
    """
    User interaction handler for Telegram bot. Interacts with GitHub API to run tests.
    """
    def __init__(self, telegram_token: str, github_controller: GitHubWorkflowController, report_url_base: str):
        self.telegram_token = telegram_token
        self.github_controller = github_controller
        self.report_url_base = report_url_base
        self.application = Application.builder().token(self.telegram_token).build()
        self._initialize_handlers()

    def _initialize_handlers(self) -> None:
        """
        Registers all commands and button callback listeners.
        """
        self.application.add_handler(CommandHandler("start", self._handle_command_start))
        self.application.add_handler(CommandHandler("run_smoke", self._handle_command_run_smoke))
        self.application.add_handler(CommandHandler("run_regression", self._handle_command_run_regression))
        self.application.add_handler(CommandHandler("status", self._handle_command_status))
        self.application.add_handler(CallbackQueryHandler(self._handle_button_interaction))

    async def _handle_command_start(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """
        Sends starting message with interactive buttons.
        """
        starting_body = (
            f"🚀 <b>Automation Control Bot</b>\n\n"
            f"Hello {update.effective_user.first_name}!\n"
            "Use the buttons below to run tests remotely on GitHub Actions."
        )
        
        control_keyboard = [
            [
                InlineKeyboardButton("🔥 Smoke Tests", callback_data="exec:@smoke"),
                InlineKeyboardButton("🛠 Regression", callback_data="exec:@regression"),
            ],
            [
                InlineKeyboardButton("🏷 Latest Status", callback_data="status:get"),
                InlineKeyboardButton("📊 Open Allure", url=self.report_url_base),
            ],
        ]
        
        await update.message.reply_html(
            text=starting_body,
            reply_markup=InlineKeyboardMarkup(control_keyboard)
        )

    async def _handle_command_run_smoke(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        await self._initiate_test_task(update, context, "@smoke")

    async def _handle_command_run_regression(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        await self._initiate_test_task(update, context, "@regression")

    async def _handle_command_status(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        await self._display_latest_workflow_state(update, context)

    async def _handle_button_interaction(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        callback_interaction = update.callback_query
        await callback_interaction.answer()
        
        encoded_data = callback_interaction.data
        
        if encoded_data.startswith("exec:"):
            suite_name = encoded_data.split(":")[1]
            await self._initiate_test_task(update, context, suite_name)
        elif encoded_data == "status:get":
            await self._display_latest_workflow_state(update, context)

    async def _initiate_test_task(self, update: Update, context: ContextTypes.DEFAULT_TYPE, test_suite: str) -> None:
        target_reply = update.message if update.message else update.callback_query.message
        
        try:
            self.github_controller.trigger_test_workflow(test_suite=test_suite)
            success_ack = (
                f"✅ <b> {test_suite} tests started!</b>\n\n"
                "You can monitor progress in Allure Report."
            )
            report_button = [[InlineKeyboardButton("📋 View Allure Report", url=self.report_url_base)]]
            await target_reply.reply_html(
                text=success_ack,
                reply_markup=InlineKeyboardMarkup(report_button)
            )
        except Exception as invocation_error:
            error_ack = f"❌ <b>API Error:</b> <code>{str(invocation_error)}</code>"
            await target_reply.reply_html(text=error_ack)

    async def _display_latest_workflow_state(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        target_reply = update.message if update.message else update.callback_query.message
        
        try:
            workflow_status_data = self.github_controller.get_latest_workflow_run_status()
            
            if not workflow_status_data:
                await target_reply.reply_html(text="No active runs found.")
                return
                
            report_message = (
                "<b>Current Pipeline State:</b>\n"
                f"🔹 Run ID: <code>{workflow_status_data['run_id']}</code>\n"
                f"🔹 Status: <b>{workflow_status_data['status']}</b>\n"
                f"🔹 Outcome: <b>{workflow_status_data['conclusion'] or 'IN PROGRESS'}</b>\n\n"
                f"🔗 <a href='{workflow_status_data['html_url']}'>GitHub Actions Link</a>"
            )
            await target_reply.reply_html(text=report_message, disable_web_page_preview=True)
        except Exception as query_error:
            error_ack = f"❌ <b>Error:</b> <code>{str(query_error)}</code>"
            await target_reply.reply_html(text=error_ack)

    def execute_bot_polling(self) -> None:
        """
        Starts the event polling loop.
        """
        print("Bot is listening for events...")
        self.application.run_polling()
