import { defineCollection, z } from 'astro:content';

const news = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.date(),
        category: z.enum(["공지사항", "학교소식", "가정통신문"]).optional(),
        thumbnail: z.string().optional(),
        image: z.string().optional(), // In case they use 'image' instead of 'thumbnail'
    }),
});

const gallery = defineCollection({
    type: 'content', // or 'data' if it's just json? Decap creates .md with frontmatter usually.
    // config.yml says: folder: "src/content/gallery", create: true, fields: ...
    // So it creates .md files.
    schema: z.object({
        title: z.string(),
        date: z.date(),
        images: z.array(z.object({
            image: z.string()
        })).optional(),
    }),
});

export const collections = {
    news,
    gallery,
};
