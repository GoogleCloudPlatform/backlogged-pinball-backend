# Pinball Game Event Generators

This directory has several programs that generate events for fictitious pinball games.

Each program is a Python file. To run them:

1. Set your authenticated user and project using `gcloud init`
1. Change to the appropriate directory
1. (Optional) Create and instantiate a virtual Python environment: `python3 -mvenv env; source env/bin/activate`
1. Install dependencies: `pip install -r requirements.txt`
1. Run the program: `python3 <program-name>.py`

The `basic` directory plays the smallest possible game, just with start and end events.

The `advanced` directory plays a game with every kind of event, but more important,
includes the module `game` that defined the `Game` class, which has methods to
easily generate and push every kind of event.
