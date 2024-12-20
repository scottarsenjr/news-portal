import os

from .misc import yaml_coerce


def get_settings_from_env(prefix: str):
    prefix_len = len(prefix)
    return {key[prefix_len:]: yaml_coerce(value) for key, value in os.environ.items() if key.startswith(prefix)}