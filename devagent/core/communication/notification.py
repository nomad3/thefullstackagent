import logging

import requests


class NotificationService:
    def __init__(self, slack_webhook_url: str = None, teams_webhook_url: str = None):
        self.slack_webhook_url = slack_webhook_url
        self.teams_webhook_url = teams_webhook_url
        logging.basicConfig(level=logging.INFO)

    def send_to_slack(self, message: str) -> str:
        if not self.slack_webhook_url:
            logging.warning("Slack webhook URL not configured.")
            return f"Hey, I couldn't send a Slack notification because the webhook URL is missing. Here's the message: {message}"
        try:
            response = requests.post(self.slack_webhook_url, json={"text": message})
            if response.status_code == 200:
                logging.info("Slack notification sent successfully.")
                return f"Slack notification sent successfully. Message: {message}"
            else:
                logging.error(f"Failed to send Slack notification: {response.text}")
                return f"Oops, Slack notification failed: {response.text}. Message: {message}"
        except Exception as e:
            logging.error(f"Exception sending Slack notification: {str(e)}")
            return f"Slack notification error: {str(e)}. Message: {message}"

    def send_to_teams(self, message: str) -> str:
        if not self.teams_webhook_url:
            logging.warning("Teams webhook URL not configured.")
            return f"Hey, I couldn't send a Teams notification because the webhook URL is missing. Here's the message: {message}"
        try:
            response = requests.post(self.teams_webhook_url, json={"text": message})
            if response.status_code == 200:
                logging.info("Teams notification sent successfully.")
                return f"Teams notification sent successfully. Message: {message}"
            else:
                logging.error(f"Failed to send Teams notification: {response.text}")
                return f"Oops, Teams notification failed: {response.text}. Message: {message}"
        except Exception as e:
            logging.error(f"Exception sending Teams notification: {str(e)}")
            return f"Teams notification error: {str(e)}. Message: {message}"

    def mock_send_to_slack(self, message: str) -> str:
        logging.info(f"Mock Slack notification: {message}")
        return f"Mock Slack notification sent successfully. Message: {message}"

    def mock_send_to_teams(self, message: str) -> str:
        logging.info(f"Mock Teams notification: {message}")
        return f"Mock Teams notification sent successfully. Message: {message}"
