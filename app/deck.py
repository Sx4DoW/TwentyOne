import random

class Card:
    values = {'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10}

    def __init__(self, rank, suit):
        self.rank = rank
        self.suit = suit
        self.value = Card.values[rank]
        if self.suit == "Clubs":
            self.value += 10

    def __repr__(self):
        return f"{self.rank} of {self.suit}"

class Hand:
    def __init__(self):
        self.cards = []
        self.value = 0

    def add_card(self, card):
        self.cards.append(card)
        self.value += card.value

    def __repr__(self):
        return f"Hand({self.value}):\n{', '.join([str(card) for card in self.cards])}"

class Deck:

    def __init__(self, suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'], ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']):
        self.suits = suits;
        self.ranks = ranks;
        self.reset()

    def shuffle(self):
        random.shuffle(self.cards)

    def draw(self, num=1):
        drawn = []
        for _ in range(num):
            if self.cards:
                drawn.append(self.cards.pop())
            else:
                break
        return drawn if num > 1 else (drawn[0] if drawn else None)

    def reset(self):
        self.cards = [Card(rank, suit) for suit in self.suits for rank in self.ranks]
        self.shuffle()

    def add(self, card: Card):
        self.cards.insert(random.randint(0, len(self.cards)), card)

    def remove(self, card):
        self.cards.remove(card)

    def __len__(self):
        return len(self.cards)

    def __repr__(self):
        return f"Deck({len(self.cards)}):\n{self.cards}"
