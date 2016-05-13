# AskField interface

Make sure your custom fields extend the `AskField` class and expose `validate` and `getValue` methods. This will make them discoverable and serializable by the `AskComposer` object.

The `validate` method should return a `boolean` state.

See ![the contributing page](CONTRIBUTING.md) for more info on creating fields.
