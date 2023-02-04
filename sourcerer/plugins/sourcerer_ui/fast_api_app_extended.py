import os.path
import pathlib

from sourcerer.frameworks.fastapi.app import app

from fastapi import Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

print()

app.mount("/static", StaticFiles(directory=os.path.join(pathlib.Path(__file__).parent.resolve(),"build/static" )), name="static")

templates = Jinja2Templates(directory=os.path.join(pathlib.Path(__file__).parent.resolve(),"build" ))


@app.get('/')
@app.get('/authenticate')
@app.get('/signin')
@app.get('/storages')
@app.get('/settings')
async def index_loader(request: Request):
    return templates.TemplateResponse('index.html', {"request": request})
