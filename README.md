# Mapbox Three
Mapbox plugin for rendering 3d worlds on top of a map.

### Features

- Handle projection of the camera
- Handle geo coords of object.
- Rendering of the world.

### Install from NPM

```
npm install mapbox-three
```

### Example code

```
import { ThreeMapboxLayer } from 'mapbox-three';

const map = ....; // Mapbox map.
const layer = new ThreeMapboxLayer('3d-world');
map.addLayer(layer);

const object3d = ...; // Threejs creation of obj.
const wrapped = layer.add(object3d);
wrapped.setCoords([1.0, 1.0]);

```

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

* [Node.js 10.x LTS](https://nodejs.org/en/) - a JavaScript runtime built on Chrome's V8 JavaScript engine.

### Installation

Install NodeJS dependencies:
```bash
$ npm i
```

### Running the app


```bash
# watch mode (recommended for development)
$ npm run serve
```

## Contributing

Please read [CONTRIBUTING.md](#) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](#). 

## Authors

* **Wichard Riezebos** - *Initial and major work* - [WichardRiezebos](https://github.com/WichardRiezebos)

See also the list of [contributors](h#) who participated in this project.

## License

  
Nest is [MIT licensed](LICENSE).