import vertexai
from vertexai import agent_engines


PROJECT_ID = "shibeai"
LOCATION = "us-central1"
STAGING_BUCKET = "gs://trellisai-veo-demo-699805652725"


def main() -> None:
    vertexai.init(project=PROJECT_ID, location=LOCATION, staging_bucket=STAGING_BUCKET)
    agent = agent_engines.ModuleAgent(
        module_name="agent",
        agent_name="root_agent",
        register_operations={
            "": ["ask", "save_log", "log_history", "approve_recommendation"]
        },
        sys_paths=["apps/agent"],
    )
    remote_agent = agent_engines.create(
        agent,
        display_name="TrellisAI Farm Operations Agent",
        description=(
            "Agent Platform Runtime wrapper for TrellisAI. It exposes farm-log memory, "
            "daily planning, MongoDB vector-memory retrieval, and task approval tools."
        ),
        requirements=["google-cloud-aiplatform[agent_engines]==1.153.1"],
        extra_packages=["apps/agent"],
        env_vars={
            "TRELLISAI_API_URL": "https://trellisai-api-699805652725.us-central1.run.app"
        },
    )
    print(getattr(remote_agent, "resource_name", None) or getattr(remote_agent, "name", None))
    print(remote_agent.operation_schemas())


if __name__ == "__main__":
    main()
