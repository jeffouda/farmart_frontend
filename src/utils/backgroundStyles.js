/**
 * Farmart Dashboard Background Styles
 * 
 * Theme: Agriculture, Livestock, E-commerce
 * Brand Colors: Green (#10B981), Earth tones
 */

// CSS Gradient backgrounds (no images required)
export const gradientBackgrounds = {
  farmFresh: {
    name: 'Farm Fresh',
    css: `
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%);
    `,
    description: 'Fresh green gradient - perfect for agriculture'
  },
  sunriseFarm: {
    name: 'Sunrise Farm',
    css: `
      background: linear-gradient(180deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%);
    `,
    description: 'Warm sunrise - good for morning dashboards'
  },
  pastureGreen: {
    name: 'Pasture Green',
    css: `
      background: linear-gradient(180deg, #86efac 0%, #4ade80 50%, #22c55e 100%);
    `,
    description: 'Deep green pasture'
  },
  earthTones: {
    name: 'Earth Tones',
    css: `
      background: linear-gradient(135deg, #fef9c3 0%, #fef08a 50%, #fde047 100%);
    `,
    description: 'Wheat/earth tones'
  },
  twilightFarm: {
    name: 'Twilight Farm',
    css: `
      background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
    `,
    description: 'Evening sky - for night mode'
  },
};

// SVG Pattern backgrounds (inline - no external files)
export const patternBackgrounds = {
  cattle: {
    name: 'Cattle Silhouette',
    css: `
      background-color: #ecfdf5;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M30 60 Q25 50 30 40 Q35 30 45 35 Q55 40 50 55 Q45 70 35 65 Q30 60 30 60 M55 45 Q60 40 65 45 Q70 50 65 55 Q60 60 55 55 Q50 50 55 45' fill='%2310B981' opacity='0.1'/%3E%3C/svg%3E");
    `,
    description: 'Subtle cattle silhouettes'
  },
  leaves: {
    name: 'Leaf Pattern',
    css: `
      background-color: #f0fdf4;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310B981' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    `,
    description: 'Subtle geometric leaf pattern'
  },
  farmGrid: {
    name: 'Farm Grid',
    css: `
      background-color: #f0fdf4;
      background-image: linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
      background-size: 20px 20px;
    `,
    description: 'Grid pattern - clean and modern'
  },
  circles: {
    name: 'Organic Circles',
    css: `
      background-color: #ecfdf5;
      background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' fill='%2310B981' fill-opacity='0.05'/%3E%3Ccircle cx='20' cy='20' r='15' fill='%2310B981' fill-opacity='0.03'/%3E%3Ccircle cx='80' cy='80' r='20' fill='%2310B981' fill-opacity='0.04'/%3E%3C/svg%3E");
    `,
    description: 'Organic circles - soft and modern'
  },
  waves: {
    name: 'Farm Hills',
    css: `
      background-color: #f0fdf4;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%2310B981' fill-opacity='0.1' d='M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
      background-size: cover;
      background-position: bottom;
      background-repeat: no-repeat;
    `,
    description: 'Rolling hills silhouette'
  },
};

// Image URLs for high-quality backgrounds (free to use)
// These can be downloaded and placed in /public folder

export const recommendedImages = [
  {
    name: 'Cattle Ranch',
    url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1920&q=80',
    credit: 'Unsplash - Cattle Ranch',
    tags: ['livestock', 'cattle', 'ranch'],
    preview: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80'
  },
  {
    name: 'Green Pasture',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80',
    credit: 'Unsplash - Green Pasture',
    tags: ['pasture', 'green', 'farm'],
    preview: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80'
  },
  {
    name: 'Farm Landscape',
    url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=80',
    credit: 'Unsplash - Farm Landscape',
    tags: ['farm', 'landscape', 'agriculture'],
    preview: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80'
  },
  {
    name: 'Chicken Farm',
    url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1920&q=80',
    credit: 'Unsplash - Chicken Farm',
    tags: ['poultry', 'farm', 'agriculture'],
    preview: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=80'
  },
  {
    name: 'Barn Interior',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80',
    credit: 'Unsplash - Barn',
    tags: ['barn', 'rural', 'storage'],
    preview: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80'
  },
  {
    name: 'Tractor Field',
    url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80',
    credit: 'Unsplash - Tractor',
    tags: ['tractor', 'field', 'farming'],
    preview: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80'
  },
];

// Default background configuration
export const defaultBackground = {
  type: 'gradient',
  variant: 'farmFresh',
};

// Apply background to element
export function applyBackground(element, backgroundConfig) {
  if (backgroundConfig.type === 'gradient') {
    const gradient = gradientBackgrounds[backgroundConfig.variant];
    if (gradient) {
      element.style.cssText += gradient.css;
    }
  } else if (backgroundConfig.type === 'pattern') {
    const pattern = patternBackgrounds[backgroundConfig.variant];
    if (pattern) {
      element.style.cssText += pattern.css;
    }
  } else if (backgroundConfig.type === 'image') {
    element.style.backgroundImage = `url(${backgroundConfig.url})`;
    element.style.backgroundSize = 'cover';
    element.style.backgroundPosition = 'center';
    element.style.backgroundRepeat = 'no-repeat';
  }
}

// Export all backgrounds as a single object
export const allBackgrounds = {
  gradients: gradientBackgrounds,
  patterns: patternBackgrounds,
  images: recommendedImages,
};
