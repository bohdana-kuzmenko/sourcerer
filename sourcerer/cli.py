import os
import pathlib
import subprocess
from argparse import ArgumentParser

import uvicorn


def run_ui_build():
    npm_commands = [
        'npm install',
        'npm run build'
    ]
    for command in npm_commands:
        subprocess.run(
            command,
            shell=True,
            cwd=os.path.join(pathlib.Path(__file__).parent.resolve(), "plugins/sourcerer_ui")
        )


def run_with_ui():
    from sourcerer.plugins.sourcerer_ui.fast_api_app_extended import app
    uvicorn.run(app, host="0.0.0.0", port=8000)


def run_server():
    from sourcerer.frameworks.fastapi.app import app
    url_list = [{"path": route.path, "name": route.name} for route in app.routes]
    for i in url_list:
        print(i)
    uvicorn.run(app, host="0.0.0.0", port=8000)


def main():
    parser = ArgumentParser(description='Sourcerer cli')
    parser.add_argument('--action', choices=['run', 'run-with-ui', 'build-ui'], default='run')
    args = vars(parser.parse_args())
    print(args)
    if args.get('action') == 'run':
        run_server()
    if args.get('action') == 'build-ui':
        print(run_ui_build())
    if args.get('action') == 'run-with-ui':
        print(run_with_ui())


if __name__ == "__main__":
    main()
