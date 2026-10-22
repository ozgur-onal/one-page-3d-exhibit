# One-Page 3D Exhibit

A small, dependency-light prototype for publishing a sourced 3D object as a single scrolling page. Each step of the story is tied to a registered camera view of the model, and every step carries an evidence label and a source line, so a reader can see what is documented, what is inferred and what is speculative.

Live demo: https://promptbricks.ai/prototypes/one-page-3d-exhibit/demo.html

## What it does

- **Scroll-driven narrative over a glTF/GLB model.** Scrolling, the Previous/Next buttons or the left/right arrow keys move between steps. Each step moves the camera to a stored view (`orbit`, `target`, `fov`).
- **Evidence labels and sources per step.** `documented`, `inferred` or `speculative`, plus a free-text source. This is a lightweight form of paradata: the reasoning behind a statement stays attached to the statement.
- **Authoring editor (`editor.html`).** Add a step, write the text, set the evidence label and source, press "Register 3D view" to store the current camera view, then save the exhibit as JSON or publish a draft to the viewer.
- **Plain data model.** An exhibit is one JSON object (`title`, `model`, `credit`, `steps[]`). See `demo-exhibit.js`.
- **Accessibility basics.** Keyboard navigation, focus styles, `aria-current` on the active step, reduced-motion support, responsive layout.
- **No build step.** Vanilla JavaScript. Open the files from any static host.

## Files

| File | Purpose |
|---|---|
| `demo.html` | Published demo exhibit (Cleveland Museum of Art, object 1970.16) |
| `index.html` | General viewer: `?draft=1` shows the draft from the editor, `?data=<url>` loads an exhibit JSON |
| `editor.html` | Step-based editor with camera registration and JSON export |
| `exhibit.js` | Shared viewer: `renderExhibit(root, data, opts)` |
| `demo-exhibit.js` | Demo data |
| `models/` | Web-optimised GLB (Draco geometry, WebP textures, 1.2 MB) |

## Run locally

```
python3 -m http.server 8765
```

Then open http://localhost:8765/editor.html. Opening the files with `file://` will not work, because browsers block the model and data requests.

## My contribution

I defined the concept and the data model (steps, evidence labels, sources, registered camera views), chose the stack, directed the implementation and tested it. The code was written with AI coding assistance under my direction, and I reviewed and adjusted it. The stack choice followed a review of alternatives I read at the API level, namely Smithsonian Voyager, Twine and `<model-viewer>`. I chose `<model-viewer>` because camera state can be read and set through a small, documented API, which keeps the template small enough to teach and to adapt.

## Status and scope

This is a prototype, not a platform. It has no accounts, no storage back end, no DOI handling and no versioning. A separate teaching starter template is planned and will be released under CC BY-SA 4.0; this repository is licensed under Apache-2.0.

## Third-party material

- `<model-viewer>` 4.4.0 (Apache-2.0), loaded from a CDN
- Scrollama 3.2.0 (MIT), loaded from a CDN
- 3D model and object texts: Cleveland Museum of Art, Black-Figure Neck-Amphora, attributed to the Painter of Berlin 1899, 1970.16, CC0. The web copy was compressed from the 33.5 MB original to 1.2 MB with gltf-transform (Draco geometry, WebP textures at 2048 px); geometry was not simplified.

## License

Apache-2.0, see `LICENSE` and `NOTICE`.
