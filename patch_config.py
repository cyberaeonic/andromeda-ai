import yaml

with open("config.yaml", "r") as f:
    config = yaml.safe_load(f)

# Add deepseek back so it doesn't crash existing threads
deepseek_model = {
    "name": "deepseek-v4-flash-free",
    "display_name": "Other OpenAI-compatible / deepseek-v4-flash-free",
    "use": "langchain_openai:ChatOpenAI",
    "model": "deepseek-v4-flash-free",
    "api_key": "$OPENAI_API_KEY",
    "base_url": "https://opencode.ai/zen/v1",
}
config["models"].append(deepseek_model)

with open("config.yaml", "w") as f:
    yaml.dump(config, f, sort_keys=False)
