# Detailed Prompt for Teams Logos Infinite Auto-Scrolling Carousel

## Project Context
This is a Next.js 14+ project using the App Router. The teams logos carousel section needs to have infinite auto-scrolling functionality, using the exact same implementation pattern as the professionals-grid carousel.

## File Structure

### Main File: `app/page.tsx`
- Location: Root of the `app` directory
- Component: Default export `Home()` function
- This is a client component (uses "use client" directive)

### CSS File: `app/globals.css`
- Contains all global styles including carousel styles

## Current Implementation Details

### 1. React Component Structure (`app/page.tsx`)

**State and Refs:**
```typescript
const teamsImages = [
  "/images/teamlogos/teams.webp",
  "/images/teamlogos/teams2.webp",
  "/images/teamlogos/teams3.webp",
  "/images/teamlogos/teams4.webp",
  "/images/teamlogos/teams5.webp",
  "/images/teamlogos/teams6.webp",
];
const teamsCarouselRef = useRef<HTMLDivElement | null>(null);
```

**JSX Structure:**
```jsx
<section className="teams-carousel-section">
  <div className="teams-carousel-wrapper">
    <div className="teams-carousel" ref={teamsCarouselRef}>
      {/* Duplicate images for seamless infinite scroll */}
      {[...teamsImages, ...teamsImages].map((src, index) => (
        <div key={`${src}-${index}`} className="teams-carousel__item">
          <Image
            src={src}
            alt={`Team logo ${index + 1}`}
            width={150}
            height={150}
            className="teams-carousel__image"
          />
        </div>
      ))}
    </div>
  </div>
</section>
```

**Current useEffect Hook (lines 111-167 in app/page.tsx):**
```typescript
useEffect(() => {
  const carousel = teamsCarouselRef.current;
  if (!carousel) return;

  let isHovering = false;
  let animationFrame: number;
  let lastTime = performance.now();

  const handleMouseEnter = () => {
    isHovering = true;
  };

  const handleMouseLeave = () => {
    isHovering = false;
    lastTime = performance.now();
  };

  carousel.addEventListener("mouseenter", handleMouseEnter);
  carousel.addEventListener("mouseleave", handleMouseLeave);

  const scrollSpeed = 1; // pixels per frame

  const animate = (currentTime: number) => {
    if (!carousel) {
      animationFrame = requestAnimationFrame(animate);
      return;
    }

    if (!isHovering) {
      const deltaTime = currentTime - lastTime;
      const normalizedSpeed = scrollSpeed * (deltaTime / 16.67);
      
      carousel.scrollLeft += normalizedSpeed;

      const halfWidth = carousel.scrollWidth / 2;
      if (carousel.scrollLeft >= halfWidth - 1) {
        carousel.scrollLeft = carousel.scrollLeft - halfWidth;
      }
    }

    lastTime = currentTime;
    animationFrame = requestAnimationFrame(animate);
  };

  animationFrame = requestAnimationFrame(animate);

  return () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    carousel.removeEventListener("mouseenter", handleMouseEnter);
    carousel.removeEventListener("mouseleave", handleMouseLeave);
  };
}, [teamsImages.length]);
```

### 2. CSS Classes (`app/globals.css`)

**`.teams-carousel-section`** (lines 815-822):
```css
.teams-carousel-section {
  width: 100%;
  max-width: 100%;
  padding: 3rem 0;
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
}
```

**`.teams-carousel-wrapper`** (lines 824-827):
```css
.teams-carousel-wrapper {
  width: 100%;
  overflow: hidden;
}
```

**`.teams-carousel`** (lines 829-840):
```css
.teams-carousel {
  display: flex;
  gap: 3rem;
  width: max-content;
  overflow-x: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
  scroll-behavior: auto;
  will-change: scroll-position;
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

**`.teams-carousel::-webkit-scrollbar`** (lines 842-844):
```css
.teams-carousel::-webkit-scrollbar {
  display: none;
}
```

**`.teams-carousel__item`** (lines 846-857):
```css
.teams-carousel__item {
  flex: 0 0 auto;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.3s ease;
  transform: translateZ(0);
  will-change: transform;
}
```

**`.teams-carousel__item:hover`** (lines 859-861):
```css
.teams-carousel__item:hover {
  opacity: 1;
}
```

**`.teams-carousel__image`** (lines 863-867):
```css
.teams-carousel__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
```

**Responsive Styles** (lines 869-882):
```css
@media (max-width: 768px) {
  .teams-carousel-section {
    padding: 2rem 0;
  }

  .teams-carousel {
    gap: 2rem;
  }

  .teams-carousel__item {
    width: 100px;
    height: 100px;
  }
}
```

## Reference Implementation (Professionals Grid)

The professionals-grid carousel uses the EXACT same pattern. Here's the reference:

**Class Name:** `.professionals-grid`
**Ref Name:** `carouselRef`
**Location:** Same file (`app/page.tsx`), lines 53-109

**Key Implementation Details:**
- Uses `requestAnimationFrame` for 60fps animation
- Time-normalized speed: `scrollSpeed * (deltaTime / 16.67)`
- Reset threshold: `halfWidth - 1`
- Hover pause/resume functionality
- Seamless infinite loop with duplicated content

## Requirements

1. **Infinite Auto-Scrolling**: The teams logos should scroll continuously from right to left
2. **Seamless Loop**: When reaching the end (halfway point of duplicated content), reset instantly with no visible jump
3. **No Lag or Stops**: Animation frame must run continuously, never stopping
4. **Hover Interaction**: Pause scrolling on hover, resume when mouse leaves
5. **Hidden Scrollbar**: No visible scrollbar should appear
6. **Smooth Performance**: Use GPU acceleration and 60fps animation

## Expected Behavior

- Logos scroll horizontally from right to left
- Continuous, smooth movement with no interruptions
- When a logo leaves the left side, it immediately reappears on the right
- Pauses when user hovers over the carousel
- Resumes automatically when mouse leaves
- No visible scrollbar
- Works on all screen sizes (responsive)

## Technical Specifications

- **Scroll Speed**: 1 pixel per frame (normalized to 60fps)
- **Reset Threshold**: `halfWidth - 1` (where `halfWidth = scrollWidth / 2`)
- **Animation Method**: `requestAnimationFrame` with time normalization
- **Content Duplication**: Images array is duplicated: `[...teamsImages, ...teamsImages]`
- **Ref Target**: The `.teams-carousel` div element
- **Dependencies**: `[teamsImages.length]` in useEffect dependency array

## Files to Modify

1. **`app/page.tsx`**: Update the `useEffect` hook for `teamsCarouselRef` (currently lines 111-167)
2. **`app/globals.css`**: Ensure CSS classes match the requirements (already mostly correct)

## Important Notes

- The implementation should match the professionals-grid carousel EXACTLY
- Do NOT change the CSS structure unless necessary
- Do NOT change the JSX structure
- Keep the same class names
- Maintain responsive design
- Ensure images are in `/public/images/teamlogos/` folder

