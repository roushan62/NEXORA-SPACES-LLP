/**
 * ============================================================================
 *  GALLERY — full home package sets
 * ============================================================================
 *  Each entry is ONE complete residential project, shown in the gallery as a
 *  cover card that opens a lightbox running through every room in the set.
 *
 *  Every package carries the same eight room types so the story of a whole
 *  home is always complete:
 *      hall · kitchen · bedroom · puja · bath · closet · passage · overview
 *
 *  ⚠️ PLACEHOLDER IMAGERY
 *  The renders behind these entries are stand-ins. Real project photography
 *  drops in by replacing the matching files in `src/assets-src/gallery/`
 *  and re-running `npm run images` — no code change needed here.
 *
 *  NOTE: never add cost, rate, package price or budget fields to this file.
 *  The site does not display pricing anywhere.
 */

/** The room sequence every package walks through, in tour order. */
export const roomOrder = [
  { id: 'overview', label: 'Full home overview' },
  { id: 'hall', label: 'Living / hall' },
  { id: 'kitchen', label: 'Modular kitchen' },
  { id: 'bedroom', label: 'Master bedroom' },
  { id: 'puja', label: 'Puja room' },
  { id: 'bath', label: 'Washroom' },
  { id: 'closet', label: 'Walk-in wardrobe' },
  { id: 'passage', label: 'Passage / corridor' },
];

/** Filter tags offered above the grid. */
export const galleryFilters = [
  { id: 'all', label: 'All homes' },
  { id: '1bhk', label: '1 BHK' },
  { id: '2bhk', label: '2 BHK' },
  { id: '3bhk', label: '3 BHK' },
  { id: '4bhk', label: '4 BHK' },
  { id: 'villa', label: 'Villas & floors' },
];

/**
 * Ten complete home packages.
 *  id       → asset prefix: assets/img/gallery/<id>-<room>-<width>.<fmt>
 *  tags     → drive the filter pills above
 *  rooms    → per-room caption + alt text (image paths are derived from id)
 */
export const galleryPackages = [
  {
    id: 'aurelia',
    name: '2 BHK Warm Minimal Package',
    config: '2 BHK', style: 'Warm Minimal', tags: ['2bhk'],
    summary: 'Light oak, lime plaster and brushed brass through a compact family flat — warmth without clutter.',
    highlights: ['Fluted oak feature panelling', 'Handleless modular kitchen', 'Concealed storage in every room'],
    rooms: {
      overview: { caption: 'Open-plan living, dining and kitchen read as one calm volume.', alt: 'Open-plan warm minimal apartment overview with light oak joinery and ivory walls' },
      hall: { caption: 'Fluted oak panelling anchors the sofa wall, with cove light washing the ceiling.', alt: 'Warm minimal living room with fluted oak panelling and ivory linen sofa' },
      kitchen: { caption: 'Handleless shutters and a quartz counter, with a full-height tall unit stack.', alt: 'Handleless light oak modular kitchen with quartz countertop' },
      bedroom: { caption: 'Headboard panelling in oak, pendant reading lights and a full-height wardrobe.', alt: 'Warm minimal master bedroom with oak headboard panelling and full height wardrobe' },
      puja: { caption: 'A brass jaali mandir set into the wall, lit softly from above.', alt: 'Modern puja room with carved wood mandir and brass jaali screen' },
      bath: { caption: 'Wall-hung oak vanity, backlit mirror and brushed brass fittings.', alt: 'Premium compact bathroom with oak vanity and backlit mirror' },
      closet: { caption: 'Open shelving with LED strips and a glass-front drawer bank.', alt: 'Walk-in wardrobe with open oak shelving and LED strip lighting' },
      passage: { caption: 'A slatted wall and recessed spots turn the corridor into a gallery.', alt: 'Apartment corridor with oak slat feature wall and recessed spotlights' },
    },
  },
  {
    id: 'meridian',
    name: '3 BHK Modern Classic Package',
    config: '3 BHK', style: 'Modern Classic', tags: ['3bhk'],
    summary: 'Panelled walls, champagne trims and marble underfoot — traditional proportion, contemporary restraint.',
    highlights: ['Ivory wall panelling with gold trim', 'Marble-topped island kitchen', 'Layered chandelier lighting'],
    rooms: {
      overview: { caption: 'A formal living and dining enfilade finished in ivory and champagne.', alt: 'Modern classic apartment overview with panelled ivory walls and marble flooring' },
      hall: { caption: 'Panelled walls with gold trim frame a deep charcoal velvet seating group.', alt: 'Modern classic living room with ivory panelling, gold trim and velvet sofa' },
      kitchen: { caption: 'Shaker cabinetry, veined marble counters and a pendant-lit island.', alt: 'Luxury modern classic kitchen with ivory shaker cabinets and marble island' },
      bedroom: { caption: 'A tufted headboard against panelled walls, softened with layered drapery.', alt: 'Luxury classic master bedroom with tufted headboard and panelled walls' },
      puja: { caption: 'A carved marble mandir with gold inlay and a backlit jaali surround.', alt: 'Marble puja mandir room with gold inlay and backlit jaali screen' },
      bath: { caption: 'Marble-clad walls, a wall-hung vanity and warm perimeter lighting.', alt: 'Classic marble bathroom with wall hung vanity and warm lighting' },
      closet: { caption: 'A dressing room with mirrored fronts and an upholstered bench.', alt: 'Classic walk-in dressing room with mirrored wardrobe fronts and bench' },
      passage: { caption: 'Arched niches and picture lights carry you between rooms.', alt: 'Classic residential passage with arched niches and picture lighting' },
    },
  },
  {
    id: 'sereno',
    name: '2 BHK Japandi Package',
    config: '2 BHK', style: 'Japandi', tags: ['2bhk'],
    summary: 'Japanese discipline meets Scandinavian warmth — low furniture, pale woods, and absolutely no clutter.',
    highlights: ['Pale ash and paper-textured finishes', 'Low-line furniture', 'Strict no-clutter storage plan'],
    rooms: {
      overview: { caption: 'A pared-back plan where light does most of the decorating.', alt: 'Japandi style apartment overview with pale ash joinery and low furniture' },
      hall: { caption: 'A low platform sofa, rice-paper glow and one considered artwork.', alt: 'Japandi living room with low platform sofa and rice paper pendant light' },
      kitchen: { caption: 'Matt ash fronts, a stone counter and everything behind a shutter line.', alt: 'Japandi modular kitchen with matt ash fronts and stone countertop' },
      bedroom: { caption: 'A low bed, linen bedding and a wardrobe that disappears into the wall.', alt: 'Japandi bedroom with low platform bed and flush wardrobe' },
      puja: { caption: 'A quiet timber mandir niche, lit with a single warm wash.', alt: 'Minimal timber puja niche with warm accent lighting' },
      bath: { caption: 'Micro-cement surfaces with timber accents and a frameless screen.', alt: 'Japandi bathroom with micro cement surfaces and timber vanity' },
      closet: { caption: 'Open ash rails with woven baskets in place of drawers.', alt: 'Japandi walk-in wardrobe with open ash rails and woven storage baskets' },
      passage: { caption: 'A slatted screen filters light along the length of the corridor.', alt: 'Japandi passage with timber slatted screen filtering daylight' },
    },
  },
  {
    id: 'aravalli',
    name: 'Villa Premium Package',
    config: 'Villa', style: 'Quiet Luxury', tags: ['villa'],
    summary: 'Travertine, walnut and bronze across a multi-level home, detailed for the way a large family actually lives.',
    highlights: ['Double-height living volume', 'Bespoke walnut joinery', 'Scene-controlled lighting design'],
    rooms: {
      overview: { caption: 'A double-height volume ties the ground floor together.', alt: 'Luxury villa overview with double height living volume and travertine walls' },
      hall: { caption: 'Travertine walls, a bronze-framed media wall and deep seating.', alt: 'Luxury villa living room with travertine walls and bronze detailing' },
      kitchen: { caption: 'A working kitchen plus a show kitchen, both in walnut and stone.', alt: 'Luxury villa kitchen in walnut with natural stone countertops' },
      bedroom: { caption: 'A master suite with a panelled bedback and a private lounge corner.', alt: 'Luxury villa master bedroom suite with panelled bedback and lounge corner' },
      puja: { caption: 'A dedicated prayer room in marble with a carved timber door.', alt: 'Villa puja room in marble with carved timber door' },
      bath: { caption: 'A stone-clad wet room with twin vanities and a freestanding tub.', alt: 'Luxury villa bathroom with stone cladding, twin vanities and freestanding bathtub' },
      closet: { caption: 'A full dressing room with island drawers and sensor-lit rails.', alt: 'Villa walk-in closet with island drawer unit and sensor lit rails' },
      passage: { caption: 'A gallery corridor lined with art lighting and stone flooring.', alt: 'Villa gallery corridor with art lighting and stone flooring' },
    },
  },
  {
    id: 'kalina',
    name: '1 BHK Compact Smart Package',
    config: '1 BHK', style: 'Compact Smart', tags: ['1bhk'],
    summary: 'Every wall does two jobs. Built for first homes where storage decides whether the space works.',
    highlights: ['Fold-down study nook', 'Bed with hydraulic storage', 'Loft storage over every wardrobe'],
    rooms: {
      overview: { caption: 'A single-bedroom plan opened up by keeping joinery flush.', alt: 'Compact 1 BHK apartment overview with flush joinery and light finishes' },
      hall: { caption: 'A slim TV console, wall storage and a two-seater that suits the scale.', alt: 'Compact living room with slim TV console and wall storage' },
      kitchen: { caption: 'A tight L-shape planned around real appliance sizes.', alt: 'Compact L shaped modular kitchen with laminate shutters' },
      bedroom: { caption: 'Hydraulic bed storage under, loft storage over, wardrobe alongside.', alt: 'Compact bedroom with hydraulic storage bed and loft storage wardrobe' },
      puja: { caption: 'A wall-mounted mandir unit that folds shut when not in use.', alt: 'Compact wall mounted puja unit with folding shutters' },
      bath: { caption: 'A small bathroom made to feel bigger with a floating vanity.', alt: 'Compact bathroom with floating vanity and large format tiles' },
      closet: { caption: 'A sliding wardrobe with a mirrored panel and internal drawers.', alt: 'Sliding wardrobe with mirrored panel and internal drawer system' },
      passage: { caption: 'The entry run doubles as shoe storage and a drop zone.', alt: 'Compact apartment entry passage with shoe storage and drop zone' },
    },
  },
  {
    id: 'vasant',
    name: '3 BHK Contemporary Indian Package',
    config: '3 BHK', style: 'Contemporary Indian', tags: ['3bhk'],
    summary: 'Jaali screens, brass inlay and handloom textiles set against a clean, modern shell.',
    highlights: ['Brass inlay detailing', 'Jaali screen partitions', 'Handloom textile palette'],
    rooms: {
      overview: { caption: 'A modern shell warmed by craft detail in every sightline.', alt: 'Contemporary Indian apartment overview with jaali screens and brass inlay' },
      hall: { caption: 'A jaali partition separates the foyer without closing it off.', alt: 'Contemporary Indian living room with jaali partition and handloom upholstery' },
      kitchen: { caption: 'Deep-toned shutters with brass pulls and a stone backsplash.', alt: 'Contemporary Indian kitchen with deep toned shutters and brass hardware' },
      bedroom: { caption: 'A block-printed headboard wall against restrained joinery.', alt: 'Contemporary Indian bedroom with block printed headboard wall' },
      puja: { caption: 'A brass-clad mandir with a carved backdrop and warm spots.', alt: 'Contemporary Indian puja room with brass clad mandir and carved backdrop' },
      bath: { caption: 'Terrazzo surfaces with antique brass fittings.', alt: 'Bathroom with terrazzo surfaces and antique brass fittings' },
      closet: { caption: 'A wardrobe run with cane-fronted shutters and internal lighting.', alt: 'Wardrobe with cane fronted shutters and internal lighting' },
      passage: { caption: 'A corridor gallery of framed textiles above a brass-inlaid console.', alt: 'Corridor with framed textile art and brass inlaid console table' },
    },
  },
  {
    id: 'oakwood',
    name: '4 BHK Family Home Package',
    config: '4 BHK', style: 'Warm Contemporary', tags: ['4bhk'],
    summary: 'A four-bedroom plan resolved around three generations sharing one home comfortably.',
    highlights: ['Separate kids and guest zones', 'Family lounge in addition to formal living', 'Grab-rail-ready senior bathroom'],
    rooms: {
      overview: { caption: 'Formal living, family lounge and dining, zoned but connected.', alt: 'Four bedroom family apartment overview with zoned living and dining areas' },
      hall: { caption: 'A generous seating layout built for a full room of people.', alt: 'Large family living room with generous seating layout' },
      kitchen: { caption: 'A two-cook kitchen with a breakfast counter and a utility annexe.', alt: 'Large family modular kitchen with breakfast counter and utility annexe' },
      bedroom: { caption: 'The master suite, with quieter joinery than the children\'s rooms.', alt: 'Master bedroom in a family home with restrained joinery and soft lighting' },
      puja: { caption: 'A walk-in prayer room sized for the whole family at festivals.', alt: 'Walk in puja room sized for a family with marble platform' },
      bath: { caption: 'A senior-friendly bathroom with anti-skid flooring and grab rails.', alt: 'Senior friendly bathroom with anti skid flooring and grab rails' },
      closet: { caption: 'His-and-hers wardrobe runs with a shared dressing island.', alt: 'His and hers wardrobe runs with shared dressing island' },
      passage: { caption: 'A wide central passage that keeps four bedrooms private.', alt: 'Wide central residential passage connecting four bedrooms' },
    },
  },
  {
    id: 'lumen',
    name: '2 BHK Luxe Contemporary Package',
    config: '2 BHK', style: 'Luxe Contemporary', tags: ['2bhk'],
    summary: 'Book-matched stone, fluted glass and layered light — a small home treated with penthouse detailing.',
    highlights: ['Book-matched stone feature wall', 'Fluted glass partitions', 'Profile-lit ceiling design'],
    rooms: {
      overview: { caption: 'A dark, warm palette that makes a compact plan feel considered.', alt: 'Luxe contemporary apartment overview with book matched stone and fluted glass' },
      hall: { caption: 'A book-matched stone media wall lit from behind.', alt: 'Luxe living room with book matched stone media wall and concealed lighting' },
      kitchen: { caption: 'Glossy lacquer shutters with a waterfall stone edge.', alt: 'Luxe kitchen with lacquer shutters and waterfall stone counter edge' },
      bedroom: { caption: 'A leather-panelled bedback with recessed bedside niches.', alt: 'Luxe bedroom with leather panelled bedback and recessed bedside niches' },
      puja: { caption: 'A fluted glass mandir enclosure with a soft internal glow.', alt: 'Puja enclosure in fluted glass with soft internal lighting' },
      bath: { caption: 'Full stone cladding with a mirror that floats off the wall.', alt: 'Luxe bathroom with full stone cladding and floating backlit mirror' },
      closet: { caption: 'Glass-fronted wardrobe modules with integrated sensor lighting.', alt: 'Glass fronted wardrobe modules with integrated sensor lighting' },
      passage: { caption: 'A dark corridor punctuated by a run of profile lighting.', alt: 'Dark residential corridor with linear profile lighting' },
    },
  },
  {
    id: 'palash',
    name: 'Builder Floor Renovation Package',
    config: 'Independent floor', style: 'Modern Heritage', tags: ['villa'],
    summary: 'A full gut renovation of an older independent floor — new services, new light, original proportions kept.',
    highlights: ['Complete re-servicing behind the walls', 'Restored proportions and mouldings', 'Executed with the family in residence'],
    rooms: {
      overview: { caption: 'Old bones, new services, and daylight brought back into the plan.', alt: 'Renovated independent floor overview with restored proportions and new lighting' },
      hall: { caption: 'Original moulding heights retained, everything behind them replaced.', alt: 'Renovated living room retaining original mouldings with modern finishes' },
      kitchen: { caption: 'A closed kitchen opened into the dining without losing storage.', alt: 'Renovated kitchen opened into dining area with generous storage' },
      bedroom: { caption: 'A bedroom re-planned around a new, larger window opening.', alt: 'Renovated bedroom planned around an enlarged window opening' },
      puja: { caption: 'A traditional mandir rebuilt in the same corner the family always used.', alt: 'Traditional puja mandir rebuilt in a renovated home' },
      bath: { caption: 'Bathrooms taken back to slab and rebuilt with new plumbing.', alt: 'Fully rebuilt bathroom with new plumbing and contemporary tiling' },
      closet: { caption: 'A former box room converted into a walk-in wardrobe.', alt: 'Box room converted into a walk in wardrobe with full height storage' },
      passage: { caption: 'The corridor widened visually with mirror and light.', alt: 'Renovated corridor visually widened with mirror panels and lighting' },
    },
  },
  {
    id: 'nirvaan',
    name: '3 BHK Signature Turnkey Package',
    config: '3 BHK', style: 'Signature Turnkey', tags: ['3bhk'],
    summary: 'Our most-delivered specification — the finish level most families land on once they have seen everything.',
    highlights: ['Designer ceiling and lighting scheme', 'Premium hardware throughout', 'Styled and photographed at handover'],
    rooms: {
      overview: { caption: 'The complete home, styled on handover day.', alt: 'Signature turnkey apartment overview styled at handover' },
      hall: { caption: 'A veneer feature wall, cove lighting and a styled console run.', alt: 'Signature living room with veneer feature wall and cove lighting' },
      kitchen: { caption: 'Acrylic-finish shutters, quartz counters and premium soft-close hardware.', alt: 'Signature modular kitchen with acrylic shutters and quartz countertop' },
      bedroom: { caption: 'Panelled bedback, side niches and a wardrobe with dressing mirror.', alt: 'Signature bedroom with panelled bedback and wardrobe dressing mirror' },
      puja: { caption: 'A compact mandir unit in veneer with a brass backdrop.', alt: 'Compact veneer puja unit with brass backdrop' },
      bath: { caption: 'Large-format tiling with a wall-hung vanity and backlit mirror.', alt: 'Signature bathroom with large format tiles and wall hung vanity' },
      closet: { caption: 'Wardrobe internals fitted out with drawers, pull-outs and mirror units.', alt: 'Wardrobe internals with drawers pull outs and mirror unit' },
      passage: { caption: 'Feature lighting and a full-height storage run along the corridor.', alt: 'Corridor with feature lighting and full height storage run' },
    },
  },
];

/** Every room image, flattened — handy for schema and for the image pipeline. */
export const galleryImages = galleryPackages.flatMap((p) =>
  roomOrder.map((r) => ({
    pkg: p.id,
    room: r.id,
    roomLabel: r.label,
    name: `gallery/${p.id}-${r.id}`,
    ...p.rooms[r.id],
  }))
);

export default galleryPackages;
