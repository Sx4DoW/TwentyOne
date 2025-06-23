import asyncio
import uuid
from typing import Optional

class Room:
    def __init__(self, room_id):
        self.room_id = room_id
        self.players = []  # store player info
        self.game_state = "waiting"  # or "playing", etc.
        self.task: Optional[asyncio.Task] = None
        self._stop = False

    def add_player(self, player_id: str):
        if len(self.players) >= 2:
            raise ValueError("Room full")
        if player_id in self.players:
            raise ValueError("Player already in room")
        self.players.append(player_id)

    def has_player(self, player_id: str) -> bool:
        return player_id in self.players

    async def run(self):
        # Game loop example
        while not self._stop:
            print(f"Room {self.room_id} running game loop")
            # Here you could handle timers, game progression, AI dealer, etc.
            await asyncio.sleep(5)

    def stop(self):
        self._stop = True
        if self.task:
            self.task.cancel()

class RoomManager:
    def __init__(self):
        self.rooms = {}

    async def create_room(self, room_id = "0"):
        if room_id == "0":
            room_id = str(uuid.uuid4())[:8]

        if  room_id in self.rooms:
            raise ValueError("Room exists")
        room = Room(room_id)
        room.task = asyncio.create_task(room.run())
        self.rooms[room_id] = room
        return room

    def get_room(self, room_id):
        return self.rooms.get(room_id)

    async def remove_room(self, room_id):
        room = self.rooms.pop(room_id, None)
        if room:
            room.stop()
