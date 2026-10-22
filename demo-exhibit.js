/* demo-exhibit.js: demo exhibit data, shared by editor.html (default content, Load Demo) and demo.html.
   Object and 3D model: Cleveland Museum of Art, 1970.16 (CC0). Texts adapted from the museum's catalogue entry. */
window.DEMO_EXHIBIT = {
  title: "Two faces of an Attic amphora (demo exhibit)",
  model: {
    src: "models/1970.16_neck_amphora_web.glb",
    alt: "Black-figure neck-amphora, attributed to the Painter of Berlin 1899, Attic, 515-510 BCE, Cleveland Museum of Art 1970.16"
  },
  credit: "Object: Black-Figure Neck-Amphora, attributed to the Painter of Berlin 1899, Greek, Attic, 515-510 BCE, Cleveland Museum of Art, Andrew R. and Martha Holden Jennings Fund, 1970.16 (clevelandart.org/art/1970.16). 3D model: Cleveland Museum of Art via Sketchfab, CC0; web-optimised copy with compressed geometry and textures. Texts: demo of the exhibit template, adapted from the museum's catalogue entry.",
  steps: [
    {
      text: "Side A: Herakles wrestles the Nemean lion, the most famous of his deeds. His patron goddess Athena and his nephew Iolaos, who holds the hero's club, stand by. After strangling the lion, Herakles wore its pelt as a protective trophy.",
      evidence: "documented",
      source: "Cleveland Museum of Art 1970.16, catalogue description and 'Did you know'",
      camera: { orbit: "180deg 80deg 105%", target: "auto", fov: "30deg" }
    },
    {
      text: "Side B: the wine god Dionysos with dancing maenads and satyrs. The museum calls it an unrelated scene, so the two faces do not tell one story. The museum's description does not say why these two scenes share one vessel; any link we draw between them would be our own reading.",
      evidence: "documented",
      source: "Cleveland Museum of Art 1970.16, catalogue description",
      camera: { orbit: "0deg 80deg 105%", target: "auto", fov: "30deg" }
    },
    {
      text: "The shape is a neck-amphora, one of the most popular vase shapes in Archaic Athens, with ample space for figures and ornament. Lotus and palmette chains circle the neck, linked palmettes and lotuses sit beneath each handle, and a key pattern, lotus buds and rays run along the lower body. Our inference: because the two scenes sit on opposite faces, the vessel has to be turned to be read, which is what this exhibit's camera does.",
      evidence: "inferred",
      source: "Cleveland Museum of Art 1970.16, catalogue description; the last sentence is this exhibit's own inference",
      camera: { orbit: "135deg 68deg 0.55m", target: "0m 0.1m 0m", fov: "30deg" }
    }
  ]
};
