import json
import os


BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")


def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "r") as f:
        return json.load(f)


def load_full_dataset():
    dataset = []
    dataset += load_json("dsa_mcq.json")
    dataset += load_json("dsa_msq.json")
    dataset += load_json("dsa_code_trace.json")
    dataset += load_json("dsa_short_answer.json")
    dataset += load_json("dsa_reasoning.json")
    return dataset