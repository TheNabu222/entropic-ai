def detect_intent_from_memory(self, memory_entry):
    checks = [
        ("comfort", ["sadness", "despair"]),
        ("thank_you", ["joy", "gratitude"]),
        # ...
    ]
    for intent, emotions in checks:
        if any(memory_entry.get(e, 0) > 5 for e in emotions):
            return intent
    return "default"
