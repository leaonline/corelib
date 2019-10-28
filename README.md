# leaonline core lib

This library includes the most common reusable components, 
which are involved accross all applications.

## Overview

The following components are included:

#### LeaCoreLib

* Configuration singleton, which is used to inject dependencies etc.

#### TTSClient

* Client front-end to the Text-To-Speech Backend with fallback to browser-builtin tts

#### UIComponents

* Soundbutton - A button with an associated tts-id, resolved by the TTSClient to play the associated sound
* Text - Renders a basic Text plus the associated sound button
* Image - lazy loads an image by given source
* Video - lazy loads / streams a video by given source

#### Renderers

Used for tasks to render structured content.

* Factory - A factory to initialize a renderer by given name
* Text - Render plain text
* Image - Render an image
* h5p - Render a h5p interaction by given id

## Configuration

The components sometimes require depency injection in order to run with the application:


