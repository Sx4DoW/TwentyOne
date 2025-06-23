import uuid
from app.deck import Hand

class Player:
    def __init__(self, name):
        self.name = name
        self. player_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, name))
        self.hand = Hand()

    def add_card(self, card):
        self.hand.add_card(card)

    def get_hand_value(self):
        return self.hand.value
