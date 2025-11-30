from abc import ABC, abstractmethod


# Interface (Abstract Observer)
class Observer(ABC):
    @abstractmethod
    def update(self, price: float, change_percent: float, change_count: int):
        """Called when the stock price changes significantly."""
        pass


# Subject (Being Observed) 
class StockPriceTracker:
    def __init__(self):
        self.price = 0.0
        self.observers: list[Observer] = []
        self.significant_changes = 0

    def add_observer(self, observer: Observer):
        """Attach a new observer."""
        self.observers.append(observer)

    def remove_observer(self, observer: Observer):
        """Detach an observer."""
        self.observers.remove(observer)

    def set_price(self, new_price: float):
        """Update price only if change ≥ 0.5%."""
        if self.price == 0.0:
            self.price = new_price
            print(f"Initial price set to ${new_price:.2f}")
            return

        change_percent = abs((new_price - self.price) / self.price) * 100
        if change_percent >= 0.5:
            self.price = new_price
            self.significant_changes += 1
            self.notify_observers(change_percent)
        else:
            print(f"Change of {change_percent:.2f}% ignored (below threshold).")

    def notify_observers(self, change_percent: float):
        """Notify all observers about a price update."""
        for observer in self.observers:
            observer.update(self.price, change_percent, self.significant_changes)


# Concrete Observers
class UserAlert(Observer):
    def update(self, price: float, change_percent: float, change_count: int):
        print(f"[ALERT] Price changed by {change_percent:.2f}% → ${price:.2f}")


class VolatilityNotification(Observer):
    def update(self, price: float, change_percent: float, change_count: int):
        if change_count >= 2:
            print(f"[NOTIFICATION] Stock is volatile today "
                  f"({change_count} major changes, latest: ${price:.2f})")


# Mock Demo
if __name__ == "__main__":
    tracker = StockPriceTracker()
    alert = UserAlert()
    notification = VolatilityNotification()

    tracker.add_observer(alert)
    tracker.add_observer(notification)

    tracker.set_price(100.0)   # Initial
    tracker.set_price(100.3)   # +0.3% ignored
    tracker.set_price(100.6)   # +0.6% triggers alert
    tracker.set_price(99.9)    # -0.7% triggers alert + volatile
    tracker.set_price(101.1)   # +1.2% triggers both