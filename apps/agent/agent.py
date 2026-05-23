import json
import os
import urllib.error
import urllib.request


class TrellisAgent:
    """Custom Agent Platform Runtime wrapper for the TrellisAI farm agent."""

    def __init__(self) -> None:
        self.turn_count = 0
        self.api_url = os.environ.get(
            "TRELLISAI_API_URL",
            "https://trellisai-api-699805652725.us-central1.run.app",
        ).rstrip("/")

    def ask(self, question: str, farm_id: str = "farm_demo") -> dict:
        """Run a multi-turn planning request through the TrellisAI tool API."""
        self.turn_count += 1
        result = self._post("/agent/ask", {"farm_id": farm_id, "question": question})
        return {
            "runtime": "Google Cloud Agent Platform Runtime",
            "agent": "TrellisAI farm operations agent",
            "turn": self.turn_count,
            "user_message": question,
            "tool_bridge": "Cloud Run API with MongoDB MCP-style tools",
            "result": result,
        }

    def save_log(self, field_name: str, raw_text: str, farm_id: str = "farm_demo") -> dict:
        """Save an unstructured farm log and return extracted memory signals."""
        self.turn_count += 1
        result = self._post("/logs", {
            "farm_id": farm_id,
            "field_name": field_name,
            "raw_text": raw_text,
        })
        return {
            "runtime": "Google Cloud Agent Platform Runtime",
            "turn": self.turn_count,
            "tool_call": "create_farm_log",
            "result": result,
        }

    def log_history(self, farm_id: str = "farm_demo") -> dict:
        """Fetch recent unstructured logs from MongoDB memory."""
        self.turn_count += 1
        result = self._get(f"/logs?farm_id={farm_id}")
        return {
            "runtime": "Google Cloud Agent Platform Runtime",
            "turn": self.turn_count,
            "tool_call": "get_log_history",
            "result": result,
        }

    def approve_recommendation(self, recommendation_id: str, due_date: str = "") -> dict:
        """Approve a recommendation and write it back as an open task."""
        self.turn_count += 1
        body = {"due_date": due_date} if due_date else {}
        result = self._post(f"/recommendations/{recommendation_id}/approve", body)
        return {
            "runtime": "Google Cloud Agent Platform Runtime",
            "turn": self.turn_count,
            "tool_call": "create_task",
            "result": result,
        }

    def _get(self, path: str) -> dict:
        request = urllib.request.Request(self.api_url + path, headers={"accept": "application/json"})
        return self._send(request)

    def _post(self, path: str, payload: dict) -> dict:
        data = json.dumps(payload).encode("utf-8")
        request = urllib.request.Request(
            self.api_url + path,
            data=data,
            method="POST",
            headers={
                "accept": "application/json",
                "content-type": "application/json",
            },
        )
        return self._send(request)

    def _send(self, request: urllib.request.Request) -> dict:
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"TrellisAI API returned {error.code}: {detail}") from error


root_agent = TrellisAgent()
