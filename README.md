# leaonline core lib

This library includes the most common reusable components, 
which are involved across (nearly) all applications.

The package is splitted into server and client exports, so they won't interfere with one another.
However, there are also common (shared) contents, that are part of both exports.

The following overview tries to summarize this relationship:

![package overview](./docs/overview.svg)


## Common

Common code is shared among server and client exports.

### Errors

We use for common / generic errors some custom classes that extend `Meteor.Error` to increase DRY

### i18n

Translation wrapper (currently using `ostrio:i18n`) including default translations for labels that
are used in this core library. Use `Meteor.settings` to define a "system language" that defaults on the server.

### utils

Some utilities are shared accross architectures to ensure a good fullstack experience.
The mostly include accounts and architectural utils or check-matchers.


## Client

The client part of this package consists of the common / shared   

### TTSCLient

* Wrapper library for the browser's SpeechSynth API, provides a fallback, where a certain tts
  is synthesized on the server and sent to the client as audio stream.

### Components (Templates)

- Soundbutton - A button with an associated tts-id, resolved by the TTSClient to play the associated sound
- Text - Renders a basic Text plus the associated sound button
- Image - lazy loads an image by given source
- Video - lazy loads / streams a video by given source
- Icon - wrapper for icon frameworks (currently using font-awesome 5)
- ActionButton - A button with a certain action and an integrated SoundButton

### Renderers (Templates)

All lea.online applications resolve around certain interactions, mostly them being part of several units.
In order to dynamically display (and edit) these interactions, we use a set of dynamic renderers: 

- Factory - A factory to initialize a renderer by given name with given data
- Text - renders plain text
- Image - renders a lazy-loaded image
- Item - render specific item types
- Markdown - renders markdown
- Page - renders a page with mixed and variable content

