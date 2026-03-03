/** sessionStorage key for scroll position (save in ImageBankCell, restore in ScrollRestoration). */
export const INDEX_SCROLL_KEY = 'indexScrollY';

/** Number of grid items loaded initially and per batch. */
export const GRID_BATCH_SIZE = 24;

/** IntersectionObserver rootMargin for triggering grid batch loads. */
export const GRID_LOAD_MARGIN = '400px';

/** Minimum px drag distance to trigger prev/next in gallery. */
export const SWIPE_THRESHOLD = 30;

/** Minimum px/s velocity to trigger prev/next in gallery. */
export const SWIPE_VELOCITY = 200;

/** Gallery image dimension (width/height) for Sanity image builder. */
export const GALLERY_IMAGE_SIZE = 1200;

/** Modal open animation duration (seconds). */
export const MODAL_OPEN_DURATION = 0.5;

/** Modal close animation duration (seconds). */
export const MODAL_CLOSE_DURATION = 0.4;

/** Carousel slide animation duration (seconds). */
export const CAROUSEL_SLIDE_DURATION = 0.35;

/** Premium exponential ease-out curve: fast start, smooth deceleration. */
export const EASE_OUT_EXPO: number[] = [0.16, 1, 0.3, 1];
