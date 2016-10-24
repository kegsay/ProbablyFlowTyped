# Probably Flow Typed
*Converts Typescript "declaration files" into Flow "library definitions".*

**This doesn't actually working yet.**

## What this is
This is an automatic converter which takes in Typescript definitions and spits out Flowtype definitions. It's a pragmatic answer to the fact that [this library has over 1000 module definitions](https://github.com/DefinitelyTyped/DefinitelyTyped) and yet [this library has an order of magnitude less](https://github.com/flowtype/flow-typed).

This is an **automatic** process: the definition formats vary and the process is lossy. However, by clearly calling out these points and allowing developers to manually touch up the output if they so wish, this converter can grant developers who use Flow a huge library of definition files they would need to hand-craft otherwise.

## Install

```
$ npm install -g probably-flow-typed
```


## Usage

Use no arguments or use `--help` or `-h` to get the complete CLI API.

To read in a Typescript definition file `some-typescript.d.ts` and dump the output to `some-flowtype.js`:
```
$ probably-flow-typed --typescript some-typescript.d.ts --output some-flowtype.js
```
If you don't specify an output it will default to stdout.
