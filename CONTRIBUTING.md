# Contributing guide

## Writing a new Widget

A **Widget** can be anything, a TextField, TextArea, a Map, an Audio component.

Widgets extend the **AskWidget** class, which extends preact's Component.

All widgets are wrappend within an **AskFieldWrapper** element, which is just a handy solution to display a title, a complete checkmark, a field number, and a validation message.

![ComposerDiagram](docs/composer-widgets.png?raw=true "ComposerDiagram")

This wrapper can be overriden with a simple option for maximum layout flexibility.

AskWidgets have at least these properties:

- isValid: boolean
- completed: boolean
- value: JSON? 

Which are used specially when saving. 

They must return a single value, since **value** can be of any kind and hold multiple entries (e.g.: selection from a multiple choice field), should be serialized in some way, probably JSON.

## Enabling widgets on Cay's Ask Builder

As a Widget can be anything it needs to export some spec (TBD) of the properties that can be configured on the Ask Builder. 

The builder should save an **Ask Spec** which will be read by the Composer to generate the form.

We are currently simulating such a spec in: ![SampleAskSpec](server/sample-form.json "SampleAskSpec")

## Guidelines

* Tabindex is your friend
* Must self-validate
* Don't rely on preact-compat (we are trying to keep the build size to a minimum)
