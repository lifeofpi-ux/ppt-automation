# Phosphor SVG Editorial Template

Use this template when the deck must be built without generated images or raster backgrounds. The design language comes from Phosphor-style line icons, native PowerPoint shapes, crisp typography, and structured diagrams.

## Principles

- Build slides from editable text, native shapes, connectors, and Phosphor SVG icons.
- Do not use SAM2, screenshots, photos, bitmap backgrounds, or full-slide raster visual masters.
- IMAGE-2 is allowed only when a slide genuinely needs a text-free diagrammatic support layer that would be inefficient to author with native shapes: system topology, abstract data flow, route map, wireframe-like structure, or line-based 도식. It must never carry final slide text and must never be used as decorative filler.
- Icons are semantic, not decorative filler.
- Use vector rhythm: thin lines, node circles, rails, grids, badges, and system layers.
- Every slide gets a content-specific diagram grammar.
- Never show internal production/tooling language in visible slide text.
- Never add empty right-side sections, generic hero icon panels, or decorative diagrams just to fill space.
- Use multiple meaningful icons on content slides: one icon per key card, process node, layer, row, or concept.

## Visible Language Ban

Visible slide text must be written for the audience, not for the deck-production process. Unless the user explicitly asks for a production/tooling deck, do not place these words on slides:

- `PHOSPHOR`
- `SVG`
- `IMAGE-2`
- `SAM2`
- `PPTXGenJS`
- `workflow`
- `automation`
- `Codex`

Metadata inside files may mention implementation details, but exported slide surfaces must not.

## Meaningful Visual Area Test

Before adding any visual region, define its content function:

- Process: steps, sequence, pipeline, lifecycle.
- Comparison: alternatives, tradeoffs, before/after.
- System: layers, boundaries, data/protocol flows.
- Loop: feedback, state, reinforcement, recurrence.
- Anatomy: parts of one concept or object.
- Synthesis: final principle, takeaway, map recap.

If a region has no content function, remove it and let the text/diagram breathe.

## Visual System

Palette:
- Ink: `#081532`
- Paper: `#F7F9FC`
- White: `#FFFFFF`
- Line: `#DDE5F2`
- Muted: `#5C667A`
- Blue: `#2F80ED`
- Cyan: `#26BDEB`
- Violet: `#5A35D6`
- Green: `#1E7C58`
- Amber: `#F59E0B`
- Red: `#E15B64`
- Navy: `#06122B`

Typography:
- Korean: `Malgun Gothic`, `Noto Sans KR`, `Pretendard`
- Cover title: 40-58pt, 800-900
- Content title: 20-28pt, 800
- Lead: 10.5-13.5pt, 600-700
- Diagram labels: 8-11pt, 600-800
- Body: 7.5-10pt, 400-600

Shape style:
- Cards: white fill, 1pt line, 6-8pt radius, minimal shadow.
- Nodes: white or pale fill, 1.2pt accent stroke, centered Phosphor SVG.
- Connectors: 1.5-2.5pt lines; arrows for causality, dotted lines for feedback.
- Insight bars: compact, high-contrast, used only for genuine synthesis.

## Slide Grammar

Cover:
- Large title on left.
- Optional vector map, orbit, or grid system only when it represents the topic's conceptual map.
- Bottom metadata strip with audience-facing scope, level, duration, or outcome. No production labels.

Process:
- 3-5 icon nodes.
- Arrows between nodes.
- One outcome badge or bottom insight.

Timeline:
- Date/stage rail.
- Each stage uses `problem -> solution -> new problem` micro-copy.

Architecture:
- Stacked horizontal layers or zone map.
- Use boundary boxes and labeled connectors.

Comparison:
- 2-3 columns or matrix.
- Highlight the decision or tradeoff.

Loop:
- Circular arrows around a central icon.
- Use dotted connector for feedback.

Summary:
- Principle cards plus compact final map.

## Implementation Notes

With `pptxgenjs`, prefer:
- `slide.addText` for all text.
- `slide.addShape` for cards, rails, panels, bands, nodes.
- `slide.addText` or `slide.addShape` line options for connectors where practical.
- `slide.addImage({ data: svgDataUri, ... })` for Phosphor SVG icons.

Avoid:
- Full-slide PNG backgrounds.
- Image-model visual masters.
- Rasterizing entire diagrams.
- Text embedded inside SVG.
- Visible process/tool labels such as "Phosphor SVG edition".
- Repeating the same icon on every card when the card concepts differ.
