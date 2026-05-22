export interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "image" | "video" | "select" | "boolean";
  options?: string[];
  required?: boolean;
}

export const SCHEMAS: Record<string, { title: string; fields: Field[] }> = {
  projects: {
    title: "Gallery Collections",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "category", label: "Category", type: "select", options: ["Bridal Outfits", "Ready-to-Wear", "Modest Wears", "Luxury Gowns"], required: true },
      { name: "image", label: "Image", type: "image", required: true },
      { name: "video", label: "Showcase Video (Optional)", type: "video" },
      { name: "description", label: "Description", type: "textarea" },
    ]
  },
  trainings: {
    title: "Trainings",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "price", label: "Fee", type: "text" },
      { name: "duration", label: "Duration", type: "text" },
      { name: "structure", label: "Class Structure", type: "text" },
    ]
  },
  services: {
    title: "Services",
    fields: [
      { name: "title", label: "Service Name", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "icon", label: "Icon/Image", type: "image" },
    ]
  },
  settings: {
    title: "Site Settings",
    fields: [
      { name: "heroTitle", label: "Hero Title", type: "text" },
      { name: "heroSubtitle", label: "Hero Subtitle", type: "text" },
      { name: "aboutTagline", label: "About Tagline", type: "text" },
      { name: "aboutTaglineGold", label: "About Tagline Gold Part", type: "text" },
      { name: "aboutText", label: "About Description", type: "textarea" },
      { name: "aboutImage", label: "Philosophy Image", type: "image" },
      { name: "ctaTitle", label: "CTA Title", type: "text" },
      { name: "ctaSubtitle", label: "CTA Subtitle", type: "text" },
      { name: "aboutHeroImage", label: "About Page Banner", type: "image" },
      { name: "collectionsHeroImage", label: "Collections Page Banner", type: "image" },
      { name: "trainingsHeroImage", label: "Trainings Page Banner", type: "image" },
      { name: "contactHeroImage", label: "Contact Page Banner", type: "image" },
      { name: "aboutSideImage", label: "About Side Image", type: "image" },
      { name: "aboutStoryTitle", label: "About Story Title", type: "text" },
      { name: "aboutStorySubtitle", label: "About Story Subtitle", type: "text" },
      { name: "aboutStoryText1", label: "About Vision Text", type: "textarea" },
      { name: "aboutStoryText2", label: "About Mission Text", type: "textarea" },
      { name: "aboutQuote", label: "About Quote", type: "textarea" },
      { name: "footerCopyright", label: "Footer Copyright", type: "text" },
      { name: "addressLandmark", label: "Address Landmark", type: "text" },
      { name: "workingHoursWeekday", label: "Working Hours Weekday", type: "text" },
      { name: "workingHoursWeekend", label: "Working Hours Weekend", type: "text" },
      { name: "instagramHandle", label: "Instagram @handle", type: "text" },
    ]
  }
};
