
from fastapi import FastAPI, Request, HTTPException, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.room import RoomManager
from app.player import Player

app = FastAPI()
room_manager = RoomManager()

# Mount static folder (e.g., CSS, JS)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Set template folder
templates = Jinja2Templates(directory="app/templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/create-room", response_class=HTMLResponse)
async def get_create_room(request: Request):
    return templates.TemplateResponse("create-room.html", {"request": request})

@app.post("/create-room")
async def post_create_room():
    room = await room_manager.create_room()
    return {"message": f"Room {room.room_id} created"}

@app.post("/join-room")
async def join_room(room_id: str = Form(...), name: str = Form(...)):
    room = room_manager.get_room(room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    player = Player(name)
    try:
        room.add_player(player.player_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": f"Player {player_id} joined room {room_id}"}
